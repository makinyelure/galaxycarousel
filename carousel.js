/**
 * AUTHOR: Michael Akinyelure
 * version: 1.0
 * Library came out because i couldnt find a carousel that works for me. The ones I found had too many dependencies
 * and other libraries
 */

 const MODES = {
     carousel: 'carousel',
     horizontalThumbnail: 'horizontal_thumbnail'
 };

 function GalaxyCarousel(parentDom) {
     this._parentNode = parentDom;
     this._carouselOptions = {
         mode: MODES.carousel,
         height: '40vh',
         width: '100%',
         showTitle: true,
         leftNavigator: "",
         rightNavigator: "",
         // expects source to be an array of object with properties src, title and description. These are the images to be displayed in the carousel
         source: [],
         timer: 5000
     };
     //check if dom node is valid
     this._parentNode = document.getElementById(this._parentNode);
     if(!this._parentNode) {
         throw new ReferenceError("Invalid node reference");
     }
 }

 /**
  * Instead of having to use the prototype function when creating a new method,
  * we could achieve the same thing by imitating the modular pattern. We create objects to 
  * hold the children of the GalaxyCarousel prototype
  */
 GalaxyCarousel.prototype.initialize = function(options = {}) {
    // reassign values that was modified by user.
    Object.keys(this._carouselOptions).forEach(key => {
        if(options[key]) {
            this._carouselOptions[key] = options[key];
        }
    });

    // apply carousel style to body of DOM
    var styleSheet = document.createElement("style");
    styleSheet.innerHTML = ".current-carousel-thumbnail {border: 1px solid black; padding: 2px;} .carousel_thumbnail:hover {border: 1px solid black; padding: 2px;} ";
    document.body.appendChild(styleSheet);

    let displayNode = this.make();
    this._parentNode.appendChild(displayNode);

    switch(this._carouselOptions.mode) {
        case MODES.carousel:
            this.animateCarousel(displayNode);
            break;
        case MODES.horizontalThumbnail:
            this.animateThumbnail(displayNode);
            break;
    }
 }

 /**
  * Returns object for creating several slides. 
  */
 GalaxyCarousel.prototype.make = function() {
    let parentContainer = document.createElement("div");
    parentContainer.setAttribute("id",`${this._parentNode.id}_CAROU_MAIN_CONTAINER`);
    parentContainer.setAttribute("class","carou-container full-width");
    return parentContainer;
 }

 /**
  * 
  */
 GalaxyCarousel.prototype.animateCarousel = function(node) {
    let displayId = node.getAttribute("id");
    let displayNode = document.getElementById(displayId);
    let carouselObjects = this._carouselOptions.source.length;
    let currentSlideIndex = 0;
    let _self = this;

    if(carouselObjects > 0) {
        // set initial slide content to the first element of the source
        displayNode.innerHTML = `<img src="${this._carouselOptions.source[0].src}" id="${this._carouselOptions.source[0].src}" height="300px" width="100%" />`;

        // create carousel thumbnails and also animate. Thumbnail needs a different parent
        // appended to the carousel node.
        let thumbnailParentNode = document.createElement("div");
        thumbnailParentNode.setAttribute("style","display: flex; justify-content: center; padding-top: 15px;");
        
        // append thumbnails to thumbnail parent. We are using a flex display here with inline styling
        this._carouselOptions.source.forEach(slide => {
            let thumbnailSlide = document.createElement("img");
            let currentIndex = this._carouselOptions.source.indexOf(slide);
            thumbnailSlide.setAttribute("id",`CAROUSEL_THUMBNAIL_${currentIndex}`);
            thumbnailSlide.setAttribute("src",slide.src);
            thumbnailSlide.setAttribute("class","carousel_thumbnail")
            thumbnailSlide.setAttribute("style","width: 15px; height: 10px; margin-right: 5px; cursor: pointer");
            thumbnailSlide.addEventListener("click",function() {
                _self.disableActiveThumbnail();
                
                // get current thumbnail
                let thumbNailToActivate = document.getElementById(`CAROUSEL_THUMBNAIL_${currentIndex}`);
                thumbNailToActivate.classList.add("current-carousel-thumbnail");
                currentSlideIndex = currentIndex;
                displayNode.innerHTML = `<img src="${_self._carouselOptions.source[currentIndex].src}" id="${_self._carouselOptions.source[currentIndex].src}" height="300px" width="100%" />`;
                clearInterval();
            },false);
            thumbnailParentNode.appendChild(thumbnailSlide);

        });
        this._parentNode.appendChild(thumbnailParentNode);

        setInterval(function() {
            if(currentSlideIndex == carouselObjects){
                currentSlideIndex = 0;
            }
            displayNode.innerHTML = `<img src="${_self._carouselOptions.source[currentSlideIndex].src}" id="${_self._carouselOptions.source[currentSlideIndex].src}" />`;
            let currentImage = document.getElementById(_self._carouselOptions.source[currentSlideIndex].src);
            currentImage.setAttribute("height","300px");
            currentImage.setAttribute("width","100%");

            //set thumbnail to active
            let currentSlideThumbnail = document.getElementById(`CAROUSEL_THUMBNAIL_${currentSlideIndex}`);
            _self.disableActiveThumbnail();
            currentSlideThumbnail.classList.add("current-carousel-thumbnail");

            currentSlideIndex++;
        },this._carouselOptions.timer);
    }
}

 GalaxyCarousel.prototype.disableActiveThumbnail = function() {
    let currentThumbnails = document.getElementsByClassName("current-carousel-thumbnail");
    for(var i = 0; i < currentThumbnails.length; i++) {
        currentThumbnails[i].classList.remove("current-carousel-thumbnail");
    }
 }

 GalaxyCarousel.prototype.animateThumbnail = function(node) {
    console.log(node);
 }



 module.exports = GalaxyCarousel;