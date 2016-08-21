function GetLockButton(code) {
    return $("#btnLock" + code);
}


function GetLockValue(code) {
    var button = GetLockButton(code);
    return parseInt(button.attr("data-lock"));
}

function SetLockValue(code, value) {
    var button = GetLockButton(code);
    button.attr("data-lock", value);
}

function IsLock(code) {

    var val = GetLockValue(code);
    return val == 1;
}

function IsAncien() {
    return $("#chkAncien").is(':checked');
}



    