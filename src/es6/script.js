
window.onload = function(){

    console.log('Ready!');

    // album module declaration
    var Album = function(){
        const REST_API_URL = "https://jsonplaceholder.typicode.com/";

        function initialiseAlbum(initialAlbumState = 1){ // set initial album state
            getImages(initialAlbumState);
            getAlbumName(initialAlbumState);
        }

        document.getElementsByClassName("btnSidePrev")[0].addEventListener("click", function(){ // previous button click 
            nextAlbum(-1);
        });

        document.getElementsByClassName("btnSideNext")[0].addEventListener("click", function(){ // next button click
            nextAlbum(1);
        });

        // handling buttons for popup
        document.getElementsByClassName("popup__close-button")[0].addEventListener("click", function(){ // closing popup with close button
            var cleanClass = getPopupCleanClass(this); 
            closePopup(cleanClass);
        });  
    
        document.getElementsByClassName("popup")[0].addEventListener("click", function(){ // closing popup with click outside
            var cleanClass = getPopupCleanClass(this);
            closePopup(cleanClass);
        });
    
        document.getElementsByClassName("popup__main")[0].addEventListener("click", function(e){ // preventing closing on clicking main form content
            e.stopPropagation();
        });

        function openPopup(popupToOpen){
            closeAllPopups();
            document.getElementsByClassName(popupToOpen)[0].classList.add("active");
        }

        function closePopup(className){
            document.getElementsByClassName(className)[0].classList.remove("active");
            setTimeout(function(){
                document.getElementsByClassName("popup__content")[0].innerHTML = "";
            }, 500);
        }

        function closeAllPopups(){
            document.getElementsByClassName("popup")[0].classList.remove("active");
        }
        
        function getPopupCleanClass(popupElement){
            var classNames = popupElement.closest(".popup.active").getAttribute("class").split(" ");
            for (var i = classNames.length; i >= 0; i--) {
                if (classNames[i] === "popup" || classNames[i] === "active") {
                    classNames.splice(i, 1);
                }
            }
            var classOfPopup = classNames.join(".");
            return classOfPopup; // returning popup class to close
        }

        function getImages(albumNumber){ // getting album images by album number
            fetch(REST_API_URL + 'photos?albumId=' + albumNumber)
                .then(response => response.json())
                .then(function(json){
                    json.forEach(function(item){
                        createAlbumItem(item["title"], item["thumbnailUrl"], item["url"]);
                    });
                });
        }

        function getAlbumName(albumNumber){ // getting album name by album number
            fetch(REST_API_URL + 'albums?id=' + albumNumber)
                .then(response => response.json())
                .then(function(json){
                    document.getElementsByClassName("albumTitleNumber")[0].textContent = json[0]["title"];
                    document.getElementsByClassName("albumTitleNumber")[0].setAttribute("data-albumnumber", json[0]["id"]);
                    var scrollButtons = document.getElementsByClassName("btnScrollAlbum");
                    Array.prototype.forEach.call(scrollButtons, function(button) {
                        button.disabled = false;
                    });
                });
        }

        function nextAlbum(direction){ // showing next or previous album (direction 1: forward; -1: backward)
            var scrollButtons = document.getElementsByClassName("btnScrollAlbum");
            var albumId = 0;
            var albumsAmount = 0;
            deleteAlbumItems();
            Array.prototype.forEach.call(scrollButtons, function(button) {
                button.disabled = true;
            });
            albumId = +document.getElementsByClassName("albumTitleNumber")[0].getAttribute("data-albumnumber");
            fetch(REST_API_URL + 'albums')
                .then(response => response.json())
                .then(function(json){
                    json.forEach(function(item){
                        if(item["id"]>albumsAmount){
                            albumsAmount = item["id"];
                        }
                    });
                    console.log("Total albums amount: " + albumsAmount);
                    albumId += direction;
                    if(albumId<1){
                        albumId = albumsAmount;
                    } else if(albumId>albumsAmount) {
                        albumId = 1;
                    }
                    getImages(albumId);
                    getAlbumName(albumId);
                    console.log("Current album id: " + albumId);
                })
        }

        function createBigPicturePopup(bigImageURL){ // creating and inserting big picture in picture popup
            var bigImage = document.createElement("img");
            bigImage.src = bigImageURL;
            document.getElementsByClassName("popup__content")[0].appendChild(bigImage);
            openPopup("popupPic");
        }

        function createAlbumItem(picTitle, thumbnailURL, imageURL){ // creating album items with onclick events 

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
            albumItem.addEventListener("click", function(e){
                var bigURL = e.target.closest(".albumItem").querySelector('.albumItemImage img').getAttribute("data-url");
                createBigPicturePopup(bigURL);
            });

            albumItem.appendChild(albumItemContent);
            albumItemContent.appendChild(albumItemTitle);
            albumItemContent.appendChild(albumItemImage);
            albumItemImage.appendChild(albumImg);

            document.getElementsByClassName("albumItemsWrapper")[0].appendChild(albumItem);
        }

        function deleteAlbumItems(){ // clear album items wrapper
            document.getElementsByClassName("albumItemsWrapper")[0].innerHTML = "";
        }

        // API
        return {
            initAlbum: initialiseAlbum
        }

    }

    // album module initialization
    var album = new Album();
    album.initAlbum();
    
}

