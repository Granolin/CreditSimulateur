function ChangeValue(code, newValue) {

    if (newValue < minValues[code])
        newValue = minValues[code];

    if (newValue > maxValues[code])
        newValue = maxValues[code];

    if (newValue == _values[code])
        return false;

    var changing = false;
    if (currentChange != code) {
        //On change de contrôle.
        currentChange = code;
        changing = true;
        targetControl = -1;
        Lock(code, 0);
    }

    if (code == MENSUALITE) { ChangeParam(MENSUALITE, newValue); }
    if (code == DUREE) { ChangeParam(DUREE, newValue); }
    if (code == TAUX) { ChangeParam(TAUX, newValue); }
    if (code == EMPRUNT) { ChangeEmprunt(newValue); }
    if (code == APPORT) { ChangeApport(newValue); }
    if (code == TOTAL) { ChangeTotal(newValue); }
    if (code == MONTANTBIEN) { ChangeMontantBien(newValue); }

    if (changing == true) {
        Lock(code, 1);
    }
}

function ChangeParam(code, newValue)
{
    if (code == TAUX)
        newValue = ToDecimal(newValue);
    else
        newValue = ToInt(newValue);

    //On met à jour la valeur
    UpdateValue(code, newValue);

    if (targetControl != -1) {
        UpdateControl(targetControl, code);
    } else //On recalcule la valeur de l'emprunt.
        if (IsLock(EMPRUNT) == false && IsLock(TOTAL) == false) {
            UpdateEmprunt(code);
            targetControl = EMPRUNT;
        } else {
            UpdateParams(code);
        }
}

function UpdateParams(code)
{
    var oldMensualite = _values[MENSUALITE];
    var oldDuree = _values[DUREE];
    var oldTaux = _values[TAUX];

    if (code != MENSUALITE) {
        UpdateMensualite();
        targetControl = MENSUALITE;
    }

    if (code != DUREE && HasChanged(oldMensualite, oldDuree, oldTaux) == false) {
        UpdateDuree();
        targetControl = DUREE;
    }

    if (code != TAUX &&
        HasChanged(oldMensualite, oldDuree, oldTaux) == false &&
        (IsLock(DUREE == true) || _values[DUREE] == minValues[DUREE] || _values[DUREE] == maxValues[DUREE])) {
        UpdateTaux();
        targetControl = TAUX;
    }

    UpdateEcart();
}


function HasChanged(oldMensualite, oldDuree, oldTaux)
{
    if (oldMensualite != _values[MENSUALITE])
        return true;

    if (oldDuree != _values[DUREE])
        return true;

    if (oldTaux != _values[TAUX])
        return true;

    return false;
}

function ChangeEmprunt(newValue) {
    //On convertit en entier.
    newValue = ToInt(newValue);

    //On met à jour la valeur de l'emprunt.
    SetEmprunt(newValue, EMPRUNT);
};

function ChangeApport(newValue) {

    //On convertit en entier.
    newValue = ToInt(newValue);

    //On met à jour la valeur de l'apport.
    UpdateValue(APPORT, newValue);


    if (targetControl != -1) {
        UpdateControl(targetControl, APPORT);
    } else  //On recalcule le total.
        if (IsLock(TOTAL) == false) {
            UpdateTotal(APPORT);
            targetControl = TOTAL;
        } else {
            UpdateEmprunt(APPORT);
            targetControl = EMPRUNT;
        }

};
function ChangeMontantBien(newValue) {
    //On convertit en entier.
    newValue = ToInt(newValue);

    //On met à jour la valeur du montant du bien.
    UpdateValue(MONTANTBIEN, newValue);

    //Mise à jour du total.
    UpdateTotal(MONTANTBIEN);

    //Refresh des frais de notaire.
    UpdateFraisNotaire();
};

function ChangeTotal(newValue) {
    //On convertit en entier.
    newValue = ToInt(newValue);

    //Mise à jour du total
    UpdateValue(TOTAL, newValue);

    //Mise à jour de l'emprunt
    UpdateEmpruntApport();

    //Mise à jour du montant du bien
    UpdateValue(MONTANTBIEN, GetMontantBienFromTotal(_values[TOTAL]));

    //Refresh des frais de notaire.
    UpdateFraisNotaire();
};


function UpdateMensualite() {
    if (targetControl != MENSUALITE && IsLock(MENSUALITE))
        return;

    var mensualite = ComputeMensualite(GetDureeMois(), _values[TAUX], _values[EMPRUNT]);
    if (mensualite > maxValues[MENSUALITE]) {
        UpdateValue(MENSUALITE, maxValues[MENSUALITE]);
    }
    else if (mensualite < minValues[MENSUALITE]) {
        UpdateValue(MENSUALITE, minValues[MENSUALITE]);
    }
    else {
        UpdateValue(MENSUALITE, mensualite);
    }

};

function UpdateDuree() {

    if (targetControl != DUREE && IsLock(DUREE))
        return;

    var duree = ComputeDuree(_values[MENSUALITE], _values[TAUX], _values[EMPRUNT]);
    if (duree > maxValues[DUREE]) {
        UpdateValue(DUREE, maxValues[DUREE]);
    }
    else if (duree < minValues[DUREE]) {
        UpdateValue(DUREE, minValues[DUREE]);
    }
    else {
        UpdateValue(DUREE, duree);
    }

};


//Taux    

function UpdateTaux() {

    if (targetControl != TAUX && IsLock(TAUX))
        return;
    var taux = ComputeTaux(_values[MENSUALITE], GetDureeMois(), _values[EMPRUNT]);
    if (taux > maxValues[TAUX]) {
        UpdateValue(TAUX, maxValues[TAUX]);
    }
    else if (taux < minValues[TAUX]) {
        UpdateValue(TAUX, minValues[TAUX]);
    }
    else {
        UpdateValue(TAUX, taux);
    }
};
function UpdateEcart() {
    var nouvelEmprunt = ComputeEmprunt(GetDureeMois(), _values[MENSUALITE], _values[TAUX]);
    ecart = nouvelEmprunt - _values[EMPRUNT];
    if (ecart != 0) {
        var texteEcart = "";
        if (ecart > 0)
            texteEcart = "+";
        texteEcart += (ecart.toLocaleString() + " €");

        $("#btnEcart").text("Ajustement : " + texteEcart);
        $("#btnEcart").show();
        $("#btnTableauAmortissement").hide();
    }

};

//Emprunt

function ComputeEmprunt(dureeMois, mensualite, taux) {

    if (dureeMois == maxValues[DUREE] && mensualite == maxValues[MENSUALITE] && taux == minValues[TAUX])
        return maxValues[EMPRUNT];

    if (dureeMois == minValues[DUREE] && mensualite == minValues[MENSUALITE] && taux == maxValues[TAUX])
        return minValues[EMPRUNT];

    var right = mensualite * dureeMois;
    var left = right / 3;
    while (right - left > 1) {
        var EmpruntATester = (right + left) / 2;
        var capitalRembourseTotal = GetCapitalRembourse(mensualite, dureeMois, taux, EmpruntATester)
        if (capitalRembourseTotal > EmpruntATester)
            left = EmpruntATester;
        else
            right = EmpruntATester;
    }

    return Math.round(right);
};
function SetEmprunt(emprunt, from) {

    UpdateValue(EMPRUNT, emprunt);

    if (emprunt < minValues[EMPRUNT] || emprunt > maxValues[EMPRUNT])
        $("#lblMontantHorsLimites").show();
    else
        $("#lblMontantHorsLimites").hide();

    if (from != TOTAL) {
        if (IsLock(TOTAL) == false) {
            UpdateTotal(EMPRUNT);
        } else if (_values[TOTAL] - _values[EMPRUNT] >= 0) {
            UpdateApport();
        } else {
            //
            UpdateEcart();
        }


    }

    //Mise à jour des paramètres du calcul
    if (from == TOTAL || from == EMPRUNT || from == APPORT) {
        //Calcul des Mensualités/Durée/Taux

        var mensualite = _values[MENSUALITE];
        if (IsLock(MENSUALITE) == false) {
            var mensualite = ComputeMensualite(GetDureeMois(), _values[TAUX], _values[EMPRUNT]);
            if (mensualite >= maxValues[MENSUALITE]) {
                mensualite = maxValues[MENSUALITE];
            }
            else if (mensualite <= minValues[MENSUALITE]) {
                mensualite = minValues[MENSUALITE];
            }
            else {
                UpdateValue(MENSUALITE, mensualite);
                return;
            }
            UpdateValue(MENSUALITE, mensualite);
        }

        var duree = _values[DUREE];
        if (IsLock(DUREE) == false) {
            var duree = ComputeDuree(mensualite, _values[TAUX], _values[EMPRUNT]);
            if (duree >= maxValues[DUREE]) {
                duree = maxValues[DUREE];
            }
            else if (duree <= minValues[DUREE]) {
                duree = minValues[DUREE];
            }
            else {
                UpdateValue(DUREE, duree);
                return;
            }
            UpdateValue(DUREE, duree);
        }

        if (IsLock(TAUX) == false) {
            var newTaux = ComputeTaux(mensualite, duree * 12, _values[EMPRUNT]);
            UpdateValue(TAUX, newTaux);
        }
    }


};
function UpdateEmprunt(from) {
    if (from == TOTAL || from == APPORT) {
        var emprunt = _values[TOTAL] - _values[APPORT];
    } else {
        var emprunt = ComputeEmprunt(GetDureeMois(), _values[MENSUALITE], _values[TAUX]);
    }
    SetEmprunt(emprunt, from);


};


function UpdateControl(Control, From) {
    if (Control == TOTAL) {
        UpdateTotal(From);
    } else if (Control == EMPRUNT) {
        UpdateEmprunt(From);
    } else if (Control == APPORT) {
        throw "Erreur";
    } else if (Control == MONTANTBIEN) {
        throw "Erreur";
    } else
    {
        UpdateParams(From);
    }

    
}



//Apport

function UpdateApport() {
    var apport = _values[TOTAL] - _values[EMPRUNT];
    UpdateValue(APPORT, apport);
}

//Total

function UpdateTotal(from) {

    //Recalcul du total
    if (from == EMPRUNT || from == APPORT) {
        //recalcul du total
        var total = parseInt(_values[EMPRUNT]) + parseInt(_values[APPORT]);

        //Affichage du résultat
        UpdateValue(TOTAL, total);

        //recalcul du montant du bien
        UpdateValue(MONTANTBIEN, GetMontantBienFromTotal(_values[TOTAL]));

        //recalcul des frais de notaire
        UpdateFraisNotaire();
    } else if (from == MONTANTBIEN) {

        //Recalcul du total
        var total = GetTotalFromMontantBien(_values[MONTANTBIEN]);

        if (total > maxValues[TOTAL] - 1)
            total = maxValues[TOTAL];

        if (total < minValues[TOTAL] + 1)
            total = minValues[TOTAL];

        //Affichage du résultat
        UpdateValue(TOTAL, total);

        UpdateEmpruntApport();
    }

    //Refresh des frais de notaire.
    UpdateFraisNotaire();
};
function UpdateEmpruntApport() {
    //Mise à jour de l'emprunt
    var emprunt = _values[TOTAL] - _values[APPORT];
    if (IsLock(EMPRUNT) == false) {
        if (emprunt < minValues[EMPRUNT])
            SetEmprunt(minValues[EMPRUNT], TOTAL);
        else if (emprunt > maxValues[EMPRUNT])
            SetEmprunt(maxValues[EMPRUNT], TOTAL);
        else {
            SetEmprunt(emprunt, TOTAL);
            return;
        }
    }

    //On joue ensuite sur l'apport si pas possible sur l'emprunt
    UpdateApport();
}

