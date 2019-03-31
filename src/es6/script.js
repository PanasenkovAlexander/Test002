
import { openPopup, closePopup, closeAllPopups, getPopupCleanClass, getButtonLink } from './modules/popup';

$(document).ready(function(){
    console.log('Ready!');

    // initialization
    var currentAlbumState = 1;
    var albumsAmount = 0;
    
    fetchImages();
    fetchAlbumName();

    // handling buttons
    $(".btnSidePrev").click(function(){
        deleteAlbumItems();
        currentAlbumState -= 1;
        fetchImages();
        fetchAlbumName();
    });

    $(".btnSideNext").click(function(){
        deleteAlbumItems();
        currentAlbumState += 1;
        fetchImages();
        fetchAlbumName();
    });

    $(".popup__close-button, .popup").click(function(){
        var cleanClass = getPopupCleanClass($(this)); // getting class of popup to close
        closePopup(cleanClass);
        setTimeout(deleteBigImage, 500);
    });

    $(".popup__main").click(function(e){ // no closing on clicking main form content
        e.stopPropagation();
    });

    $(".btn-popup").click(function(){
        var buttoncleanLink = getButtonLink($(this)); // getting class of popup to open
        closeAllPopups();
        openPopup(buttoncleanLink);
    });

    // // opening and closing popups with big images
    $(document).on("click",".albumItem", function(){
        var imageNumber = $(this).index();
        fetchBigImage(imageNumber);
    });

    // interface realisation
    function fetchImages(){
        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(function(json){
                if(currentAlbumState > albumsAmount) {
                    currentAlbumState = 1;
                } else if (currentAlbumState < 1) {
                    currentAlbumState = albumsAmount;
                }
                for(var i=0; i<json.length; i++) {
                    if(json[i]["albumId"] === currentAlbumState) {
                        createAlbumItem(json[i]["title"], json[i]["thumbnailUrl"]);
                    }
                    if(json[i]["albumId"] > albumsAmount) {
                        albumsAmount = json[i]["albumId"];
                    }
                }
                });
    }

    function fetchAlbumName(){
        fetch('http://jsonplaceholder.typicode.com/albums')
        .then(response => response.json())
        .then(function(json){
            for(var i=0; i<json.length; i++) {
                if(json[i]["id"] === currentAlbumState) {
                    document.getElementsByClassName("albumTitleNumber")[0].textContent = json[i]["title"];
                }
            }
        });
    }

    function fetchBigImage(imageNumber){
        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(function(json){
                var bigImageNumber = (currentAlbumState-1)*50+imageNumber;
                createBigPicture(json[bigImageNumber]["url"]);
                });
    }

    function createBigPicture(imageBig){
        var bigImage = document.createElement("img");
        bigImage.src = imageBig;
        document.getElementsByClassName("popup__content")[0].appendChild(bigImage);
        openPopup("popupPic");
    }

    function createAlbumItem(picTitle, thumbnailUrl){

        var albumItemTitle = document.createElement("div");
        albumItemTitle.className = "albumItemTitle";
        albumItemTitle.innerHTML = picTitle;

        var albumItemImage = document.createElement("div");
        albumItemImage.className = "albumItemImage";
        
        var albumImg = document.createElement("img");
        albumImg.src = thumbnailUrl;
        
        var albumItemContent = document.createElement("div");
        albumItemContent.className = "albumItemContent";

        var albumItem = document.createElement("div");
        albumItem.className = "albumItem";

        albumItem.appendChild(albumItemContent);
        albumItemContent.appendChild(albumItemTitle);
        albumItemContent.appendChild(albumItemImage);
        albumItemImage.appendChild(albumImg);

        document.getElementsByClassName("albumItemsWrapper")[0].appendChild(albumItem);
    }

    function deleteAlbumItems(){
        document.getElementsByClassName("albumItemsWrapper")[0].innerHTML = "";
    }
    function deleteBigImage(){
        document.getElementsByClassName("popup__content")[0].innerHTML = "";
    }

});

