baguetteBox.run('.tz-gallery');
AOS.init();

$(document).ready(function() {
    if (sessionStorage.getItem('#myModal') !== 'true') {
        $('#myModal').modal('show');
        sessionStorage.setItem('#myModal', 'true');
    }
});

function closmode() {
    $('#myModal').modal('hide');
}


function googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: "mar" }, 'google_translate_element');
}

function changeLanguageByButtonClick() {
    var language = document.getElementById("google_translate_element").value;
    var selectField = document.querySelector("#google_translate_element select");
    for (var i = 0; i < selectField.children.length; i++) {
        var option = selectField.children[i];
        if (option.value == language) {
            selectField.selectedIndex = i;
            selectField.dispatchEvent(new Event('change'));
            break;
        }
    }
}