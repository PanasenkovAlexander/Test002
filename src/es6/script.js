
$(document).ready(function(){
    console.log('Ready!');

    var currentAlbumState = 1;
    var albumsAmount = 0;
    
    fetchImages();

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
                        createAlbumItem(json[i]["albumId"], json[i]["title"], json[i]["thumbnailUrl"]);
                    }
                    if(json[i]["albumId"] > albumsAmount) {
                        albumsAmount = json[i]["albumId"];
                    }
                }
                });
    }

    function fetchBigImage(imageNumber){
        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(function(json){
                createBigPicture(json[(currentAlbumState-1)*10+imageNumber]["url"]);
                console.log((currentAlbumState-1)*50+imageNumber);
                });
    }
    function createBigPicture(imageBig){
        $(".popup__content").append('<img src="' + imageBig +'" alt="Picture">');
    }

    $(".btnSidePrev").click(function(){
        deleteAlbumItems();
        currentAlbumState -= 1;
        fetchImages();
    });

    $(".btnSideNext").click(function(){
        deleteAlbumItems();
        currentAlbumState += 1;
        fetchImages();
    });

    function createAlbumItem(albumTitle, picTitle, thumbnailUrl){
        $(".albumItemsWrapper").append('<div class="albumItem"><div class="albumItemContent"><div class="albumItemTitle">'+ picTitle +'</div><div class="albumItemImage"><img src="' + thumbnailUrl + '" alt=""></div></div></div>');
        $(".albumTitleNumber").text(albumTitle)
    }
    function deleteAlbumItems(){
        $(".albumItemsWrapper").empty();
    }
    function deleteBigImages(){
        $(".popup__content").empty();
    }

    $(document).on("click",".albumItem", function(){
        var imageNumber = $(this).index();
        console.log(imageNumber);
        openPopup("popupPic");
        fetchBigImage(imageNumber);
    });

    $(".popup__close-button, .popup").click(function(){
        closePopup("popupPic");
        deleteBigImages();
    });

    function closePopup(className){
        $("." + className).removeClass("active");
    }

    function closeAllPopups(){
        $(".popup").removeClass("active");
    }

    function openPopup(popupToOpen){
        closeAllPopups();
        $("." + popupToOpen).addClass("active");
        fetchBigImage();
    }
});

