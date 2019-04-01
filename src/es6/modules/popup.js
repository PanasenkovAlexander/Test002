
// function getButtonLink(buttonElement) {
//     var buttonClassNames = buttonElement.attr("class").split(" ");
//     var buttonLinkToPopup;
//     for (var i = buttonClassNames.length-1; i >= 0; i--) {
//         if(buttonClassNames[i].lastIndexOf('openPopup') !== 0){
//             buttonClassNames.splice(i, 1);
//         } else {
//             buttonLinkToPopup = buttonClassNames[i].substring(4, buttonClassNames[i].length);
//         }
//     }
//     return buttonLinkToPopup.charAt(0).toLowerCase() + buttonLinkToPopup.slice(1); // returning lowercased name of popup to open
// }

export function getPopupCleanClass(popupElement){
    var classNames = popupElement.closest(".popup.active").getAttribute("class").split(" ");
    for (var i = classNames.length; i >= 0; i--) {
        if (classNames[i] === "popup" || classNames[i] === "active") {
            classNames.splice(i, 1);
        }
    }
    var classOfPopup = classNames.join(".");
    return classOfPopup; // returning popup class to close
}

export function closePopup(className){
    document.getElementsByClassName(className)[0].classList.remove("active");
    // console.log("Closed popup with class: '" + className + "'");
}

export function closeAllPopups(){
    document.getElementsByClassName("popup")[0].classList.remove("active");
    // console.log("closed all popups");
}

export function openPopup(popupToOpen){
    closeAllPopups();
    document.getElementsByClassName(popupToOpen)[0].classList.add("active");
    // console.log("Opened popup with class: '" + popupToOpen + "'");
}

