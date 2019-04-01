(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPopupCleanClass = getPopupCleanClass;
exports.closePopup = closePopup;
exports.closeAllPopups = closeAllPopups;
exports.openPopup = openPopup;

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

function getPopupCleanClass(popupElement) {
    var classNames = popupElement.closest(".popup.active").getAttribute("class").split(" ");
    for (var i = classNames.length; i >= 0; i--) {
        if (classNames[i] === "popup" || classNames[i] === "active") {
            classNames.splice(i, 1);
        }
    }
    var classOfPopup = classNames.join(".");
    return classOfPopup; // returning popup class to close
}

function closePopup(className) {
    document.getElementsByClassName(className)[0].classList.remove("active");
    // console.log("Closed popup with class: '" + className + "'");
}

function closeAllPopups() {
    document.getElementsByClassName("popup")[0].classList.remove("active");
    // console.log("closed all popups");
}

function openPopup(popupToOpen) {
    closeAllPopups();
    document.getElementsByClassName(popupToOpen)[0].classList.add("active");
    // console.log("Opened popup with class: '" + popupToOpen + "'");
}

},{}],2:[function(require,module,exports){
'use strict';

var _popup = require('./modules/popup');

window.onload = function () {

    console.log('Ready!');

    var REST_API_URL = "https://jsonplaceholder.typicode.com/";

    // initialization
    initialiseAlbum();

    // handling buttons
    document.getElementsByClassName("btnSidePrev")[0].onclick = function () {
        // previous button click 
        nextAlbum(-1);
    };

    document.getElementsByClassName("btnSideNext")[0].onclick = function () {
        // next button click
        nextAlbum(1);
    };

    document.getElementsByClassName("popup__close-button")[0].onclick = function () {
        // closing popup with close button
        var cleanClass = (0, _popup.getPopupCleanClass)(this);
        (0, _popup.closePopup)(cleanClass);
        setTimeout(deleteBigImage, 500);
    };

    document.getElementsByClassName("popup")[0].onclick = function () {
        // closing popup with click outside
        var cleanClass = (0, _popup.getPopupCleanClass)(this);
        (0, _popup.closePopup)(cleanClass);
        setTimeout(deleteBigImage, 500);
    };

    document.getElementsByClassName("popup__main")[0].onclick = function (e) {
        // preventing closing on clicking main form content
        e.stopPropagation();
    };

    // interface realisation
    function initialiseAlbum() {
        // set initial album state
        fetchImages(1);
        fetchAlbumName(1);
    }

    function fetchImages(albumNumber) {
        // getting album images by album number
        fetch(REST_API_URL + 'photos?albumId=' + albumNumber).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.forEach(function (item) {
                createAlbumItem(item["title"], item["thumbnailUrl"], item["url"]);
            });
        });
    }

    function fetchAlbumName(albumNumber) {
        // getting album name by album number
        fetch(REST_API_URL + 'albums?id=' + albumNumber).then(function (response) {
            return response.json();
        }).then(function (json) {
            document.getElementsByClassName("albumTitleNumber")[0].textContent = json[0]["title"];
            var scrollButtons = document.getElementsByClassName("btnScrollAlbum");
            Array.prototype.forEach.call(scrollButtons, function (button) {
                button.disabled = false;
            });
        });
    }

    function nextAlbum(direction) {
        // showing next or previous album (direction 1: forward; -1: backward)
        var albumTitle = document.getElementsByClassName("albumTitleNumber")[0].innerHTML;
        var scrollButtons = document.getElementsByClassName("btnScrollAlbum");
        var albumId = 0;
        var albumsAmount = 0;
        deleteAlbumItems();
        Array.prototype.forEach.call(scrollButtons, function (button) {
            button.disabled = true;
        });
        fetch(REST_API_URL + 'albums').then(function (response) {
            return response.json();
        }).then(function (json) {
            json.forEach(function (item) {
                if (item["id"] > albumsAmount) {
                    albumsAmount = item["id"];
                }
                if (item["title"] === albumTitle) {
                    albumId = item["id"];
                }
            });
            console.log("Total albums amount: " + albumsAmount);
            albumId += direction;
            if (albumId < 1) {
                albumId = albumsAmount;
            } else if (albumId > albumsAmount) {
                albumId = 1;
            }
            fetchImages(albumId);
            fetchAlbumName(albumId);
            console.log("Current album id: " + albumId);
        });
    }

    function createBigPicturePopup(bigImageURL) {
        // creating and inserting big picture in picture popup
        var bigImage = document.createElement("img");
        bigImage.src = bigImageURL;
        document.getElementsByClassName("popup__content")[0].appendChild(bigImage);
        (0, _popup.openPopup)("popupPic");
    }

    function createAlbumItem(picTitle, thumbnailURL, imageURL) {
        // creating album items with onclick events 

        var albumItemTitle = document.createElement("div");
        albumItemTitle.className = "albumItemTitle";
        albumItemTitle.innerHTML = picTitle;

        var albumItemImage = document.createElement("div");
        albumItemImage.className = "albumItemImage";

        var albumImg = document.createElement("img");
        albumImg.src = thumbnailURL;
        albumImg.setAttribute("data-url", imageURL);

        var albumItemContent = document.createElement("div");
        albumItemContent.className = "albumItemContent";

        var albumItem = document.createElement("div");
        albumItem.className = "albumItem";
        albumItem.onclick = function (e) {
            var bigURL = e.target.closest(".albumItem").querySelector('.albumItemImage img').getAttribute("data-url");
            createBigPicturePopup(bigURL);
        };

        albumItem.appendChild(albumItemContent);
        albumItemContent.appendChild(albumItemTitle);
        albumItemContent.appendChild(albumItemImage);
        albumItemImage.appendChild(albumImg);

        document.getElementsByClassName("albumItemsWrapper")[0].appendChild(albumItem);
    }

    function deleteAlbumItems() {
        // clear album items wrapper
        document.getElementsByClassName("albumItemsWrapper")[0].innerHTML = "";
    }
    function deleteBigImage() {
        // clear big image popup
        document.getElementsByClassName("popup__content")[0].innerHTML = "";
    }
};

},{"./modules/popup":1}]},{},[2]);

//# sourceMappingURL=script.js.map