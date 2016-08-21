/// <reference path="SimuAccess.js" />
/// <reference path="SimuCalc.js" />
/// <reference path="SimuChange.js" />

var MENSUALITE = 0;
var DUREE = 1;
var TAUX = 2;
var EMPRUNT = 3;
var APPORT = 4;
var TOTAL = 5;
var MONTANTBIEN = 6;

var minValues = [0, 0, 0, 0, 0, 0];
var maxValues = [0, 0, 0, 0, 0, 0];

var ecart = 0;

var currentChange = -1;
var targetControl = -1;

var groupes = [[MENSUALITE, DUREE, TAUX, EMPRUNT], [EMPRUNT, APPORT, TOTAL], [TOTAL, MONTANTBIEN]];

var _values = [0, 0, 0, 0, 0, 0];

$('.draggable').each(function () {
    $(this).draggable({
        axis: "x",
        containment: ("#box" + $(this).parents("div[class=row]").data("id")),
        scroll: false,
        drag: function (event, ui) {
            var code = $(this).parents("div[class=row]").data("id");
            var cursor = $("#drag" + code);
            var cursorPos = cursor.offset().left;
            var newValue = GetNewValue(code, cursorPos);

            //Et on change la valeur
            ChangeValue(code, newValue);
        }
    });
});

$(".texteSimu").change(function () {
    var code = $(this).parents("div[class=row]").data("id");
    var newValue = $("#txt" + code).val();
    ChangeValue(code, newValue.replace(',', '.'));
});

$(".ScaleNormal").click(function (e) {
    var cursorPos = e.pageX;
    var code = $(this).parents("div[class=row]").data("id");
    var newValue = GetNewValue(code, cursorPos);
    ChangeValue(code, newValue);
});

$(".ancienNeuf").change(function () {

    var newValue = GetMontantBienFromTotal(_values[TOTAL]);
    ChangeValue(MONTANTBIEN, newValue);
});

$("#btnEcart").click(function () {

    SetEmprunt(_values[EMPRUNT] + ecart, -1)
    $("#lbl" + EMPRUNT).text(_values[EMPRUNT].toLocaleString());
    $(this).hide();
    $("#btnTableauAmortissement").show();
});

function UpdateFraisNotaire() {
    _fraisNotaire = _values[TOTAL] - _values[MONTANTBIEN];
    $("#lblFraisNotaire").text(_fraisNotaire.toLocaleString() + ' €');
};

$("#btnTableauAmortissement").click(function () {
    var amoTab = GetAmortissementTab();
    $("#TabAmo").html(amoTab);
});

$(window).resize(function () {

    for (var i = 0; i <= 6; i++)
    {
        SetCursor(i);
    }
});


function Debug(s) {
    $("#debug").html(s);
}


function GetNewValue(code, cursorPos) {

    var box = $("#box" + code);
    var cursor = $("#drag" + code);

    var cursorWidth = cursor.width();

    var min = minValues[code];
    var max = maxValues[code];

    var leftBox = box.offset().left;
    var boxWidth = box.width();
    var rightBox = leftBox + boxWidth - cursorWidth - 2;

    var res = min + (cursorPos - leftBox) * ((max - min) / (rightBox - leftBox));
    return res;
}

function GetDureeMois()
{
    return _values[DUREE] * 12;
}


//Fonctions communes
function SetCursor(code) {

    var box = $("#box" + code);
    var drag = $("#drag" + code);
    var leftBox = box.offset().left;
    var boxWidth = box.width();
    var cursorWidth = drag.width();
    var rightBox = leftBox + boxWidth - cursorWidth - 2;
    var min = minValues[code];
    var max = maxValues[code];
    var value = _values[code];

    if (value >= max) {
        res = rightBox;
    } else if (value <= min) {
        res = leftBox;
    } else {
        res = leftBox + (rightBox - leftBox) * ((value - min) / (max - min));
    }
    var newOffset = { top: drag.offset().top, left: res };

    drag.offset(newOffset);
}

function UpdateValue(code, value) {

    //Si c'est la même valeur qui est mise à jour, on ne fait rien
    if (_values[code] == value)
        return;

    //On met à jour la nouvelle valeur
    _values[code] = value;

    //Et la position du curseur
    SetCursor(code);

    //Et la textbox.
    DisplayTextBox(code);

    //Et on fait la vérif (toujours d'actu ???);
    Validate(code);
}


function DisplayTextBox(code) {
    $("#txt" + code).val(_values[code]);
}

function Validate(code) {
    $("#txt" + code).valid();
}

function GetAmortissementTab()
{
    var mensualite = ComputeMensualiteDecimal(GetDureeMois(), _values[TAUX], _values[EMPRUNT]);
    var res = '';
    res += "<table><tr><th>Mensualité : </th><td>" + mensualite.toLocaleString() + " €</td></tr>";
    res += "<tr><th>Durée : </th><td>" + _values[DUREE].toLocaleString() + " ans</td></tr>";
    res += "<tr><th>Taux : </th><td>" + _values[TAUX].toLocaleString() + " %</td></tr>";
    res += "<tr><th>Emprunt : </th><td>" + _values[EMPRUNT].toLocaleString() + " €</td></tr></table>";
    res += "<div class=\"table-responsive\">"
    res += "<table class=\"table table-bordered table-striped\" style=\"text-align:right\"><thead><tr id='AmoHeader'><th>Année</th><th>Annuité</th><th>Capital restant dû</th><th>Capital remboursé</th><th>Intérêts</th><th>Intérêts cumulés</th></tr></thead>";
    var capitalRestant = _values[EMPRUNT];
    var capitalRembourseTotal = 0;
    var interetsTotal = 0;
    var interetsAnnee = 0;
    
    for (var i = 1; i <= GetDureeMois(); i++) {
        var interets = ToDecimal((capitalRestant * _values[TAUX] / 12) / 100);
        interetsAnnee = ToDecimal(interetsAnnee + interets);
        var capital = ToDecimal(mensualite - interets);
        capitalRembourseTotal = ToDecimal(capitalRembourseTotal + capital);
        capitalRestant = ToDecimal(capitalRestant - capital);
        interetsTotal = ToDecimal(interetsTotal + interets);


        if (i == GetDureeMois())
        {
            //Si on est à la dernière mensualité on met le CRD dans le Capital remboursé.
            capitalRembourseTotal += capitalRestant;
            capitalRestant = 0;
        }

        if (i % 12 == 0) {
            res += "<tr><td>" + (i / 12) + "</td>";
            res += "<td>" + (12 * mensualite).toFixed(2).toLocaleString() + "</td>";
            res += "<td>" + capitalRestant.toFixed(2).toLocaleString() + "</td>";
            res += "<td>" + capitalRembourseTotal.toFixed(2).toLocaleString() + "</td>";
            res += "<td>" + interetsAnnee.toFixed(2).toLocaleString() + "</td>";
            res += "<td>" + interetsTotal.toFixed(2).toLocaleString() + "</td></tr>";
            interetsAnnee = 0;
        }
            
    }

    res += "</table>"
    res += "</div>";
    res += "<button id=\"btnImprimer\" type=\"button\" class=\"btn btn-lg btn-primary\" onclick=\"window.print();\">Imprimer</button>";


    return res;
}



//Lock
$(".lock").click(function () {

    var code = $(this).parent().parent().data("id");

    var val = GetLockValue(code);
    Lock(code, (val + 1) % 2);
    currentChange = -1;
    targetControl = -1;
});



function Lock(code, val) {

    if (GetLockValue(code) == val)
        return;

    SetLockValue(code, val);
    var button = GetLockButton(code);
    if (val == 1)
    {
        if (code == TOTAL)
            $(".ancienNeuf").attr("disabled", true);

        button.addClass("btn-success");
        button.removeClass("btn-default");
    }
    else
    {
        if (code == TOTAL)
            $(".ancienNeuf").removeAttr("disabled");

        button.addClass("btn-default");
        button.removeClass("btn-success");
    }
    LockDependyGroups(val);
}

function LockDependyGroups(val)
{
    //Pour chaque groupe
    for (var i = 0; i < groupes.length; i++) {
        if (val == 1)
            LockDependencyGroup(groupes[i]);
        else
            UnLockDependencyGroup(groupes[i]);
    }
}

function LockDependencyGroup(group)
{
    var n = group.length;
    var nbLocked = 0;
    var code = null;
    for (var j = 0; j < n; j++) {
        if (IsLock(group[j]))
            nbLocked++;
        else
            code = group[j];
    }

    //si un seul n'est pas locké on le lock
    if (nbLocked == n - 1)
    {
        Lock(code, 1);
    }
}

function UnLockDependencyGroup(group) {
    var n = group.length;
    var nbUnlocked = 0;
    var code = null;
    for (var j = 0; j < n; j++) {
        if (IsLock(group[j]) == false)
            nbUnlocked++;
    }

    //si un seul n'est pas locké on le lock
    if (nbUnlocked == 1) {
        for (var j = 0; j < n; j++) {
            Lock(group[j], 0);
        }
    }
}

function Debug(s)
{
    $("footer").html($("footer").html() + "<br/>" + s);
}