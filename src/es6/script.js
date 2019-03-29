
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

    function fetchAlbumName(){
        fetch('http://jsonplaceholder.typicode.com/albums')
        .then(response => response.json())
        .then(function(json){
            for(var i=0; i<json.length; i++) {
                if(json[i]["id"] === currentAlbumState) {
                    $(".albumTitleNumber").text(json[i]["title"]);
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
                console.log("This is image number: " + bigImageNumber);
                });
    }


    function createBigPicture(imageBig){
        $(".popup__content").append('<img src="' + imageBig +'" alt="Picture">');
        openPopup("popupPic");
    }

    function createAlbumItem(albumTitle, picTitle, thumbnailUrl){
        $(".albumItemsWrapper").append('<div class="albumItem"><div class="albumItemContent"><div class="albumItemTitle">'+ picTitle +'</div><div class="albumItemImage"><img src="' + thumbnailUrl + '" alt=""></div></div></div>');
    }

    function deleteAlbumItems(){
        $(".albumItemsWrapper").empty();
    }
    function deleteBigImage(){
        $(".popup__content").empty();
    }


    // opening and closing popups
    $(document).on("click",".albumItem", function(){
        var imageNumber = $(this).index();
        fetchBigImage(imageNumber);
    });

    $(".popup__close-button, .popup").click(function(){
        closePopup("popupPic");
        setTimeout(deleteBigImage, 600);
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
    }


});

