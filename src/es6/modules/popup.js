
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
    setTimeout(function(){
        document.getElementsByClassName("popup__content")[0].innerHTML = "";
    }, 500);
}

export function closeAllPopups(){
    document.getElementsByClassName("popup")[0].classList.remove("active");
}

export function openPopup(popupToOpen){
    closeAllPopups();
    document.getElementsByClassName(popupToOpen)[0].classList.add("active");
}
