function GetCapitalRembourse(mensualite, dureeMois, taux, Emprunt) {
    var capitalRestant = Emprunt;
    var capitalRembourseTotal = 0;
    var interetsTotal = 0;
    for (var i = 0; i < dureeMois; i++) {
        var interets = ToDecimal((capitalRestant * taux / 12) / 100);
        var capital = ToDecimal(mensualite - interets);
        capitalRembourseTotal = ToDecimal(capitalRembourseTotal + capital);
        capitalRestant = ToDecimal(capitalRestant - capital);
        interetsTotal = ToDecimal(interetsTotal + interets);
    }

    return capitalRembourseTotal;
}

function ComputeMensualite(dureeMois, taux, emprunt) {

    var left = emprunt / dureeMois;
    var right = left * 2;

    while (right - left > 1) {
        var mensualite = (right + left) / 2;
        var capitalRembourseTotal = GetCapitalRembourse(mensualite, dureeMois, taux, emprunt);
        if (capitalRembourseTotal > emprunt)
            right = mensualite;
        else
            left = mensualite;
    }

    return Math.round((left + right) / 2);
};

function ComputeMensualiteDecimal(dureeMois, taux, emprunt) {

    var left = emprunt / dureeMois;
    var right = left * 2;

    while (right - left > 0.01) {
        var mensualite = (right + left) / 2;
        var capitalRembourseTotal = GetCapitalRembourse(mensualite, dureeMois, taux, emprunt);
        if (capitalRembourseTotal > emprunt)
            right = mensualite;
        else
            left = mensualite;
    }

    return ToDecimal((left + right) / 2);
};


function ComputeDuree(mensualite, taux, emprunt) {

    var left = parseInt(emprunt / (mensualite * 12));
    var right = left * 2;

    while (right - left > 1) {
        var duree = parseInt((right + left) / 2);
        var capitalRembourseTotal = GetCapitalRembourse(mensualite, duree * 12, taux, emprunt);
        if (capitalRembourseTotal > emprunt)
            right = duree;
        else
            left = duree;
    }

    return right;
};


function ComputeTaux(mensualite, dureeMois, emprunt) {
    var left = minValues[TAUX];
    var right = maxValues[TAUX];
    while (right - left > 0.01) {
        var taux = (left + right) / 2;
        var capitalRembourseTotal = GetCapitalRembourse(mensualite, dureeMois, taux, emprunt);
        if (capitalRembourseTotal < emprunt)
            right = taux;
        else
            left = taux;
    }

    return ToDecimal(right);
};

function GetMontantBienFromTotal(total) {
    if (IsAncien())
        return ToInt((total - 1493.5) / 1.0688);
    else
        return ToInt(total / 1.03);
}

function GetTotalFromMontantBien(montantBien) {

    var res = 0;
    if (IsAncien())
        res = montantBien * 1.0688 + 1493.5;
    else
        res = montantBien * 1.03;

    return ToInt(res);
}

//Convert
function ToInt(value) {
    return Math.round(value);
}


function ToDecimal(value) {
    return (Math.round(value * 100) / 100);
}

//Format
function FormatInt(value) {
    return value.toLocaleString();
}

