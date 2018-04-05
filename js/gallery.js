// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/


animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate()
{
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/
function getQueryParams(qs) 
{
	 qs = qs.split("+").join(" ");
	 var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;
		
	while (tokens = re.exec(qs)) 
	{
		params[decodeURIComponent(tokens[1])]
			= decodeURIComponent(tokens[2]);
	}
	return params;
}
var $_GET = getQueryParams(document.location.search); 


// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = 'images.json';


if($_GET["json"] != undefined)
{
	mUrl = $_GET["json"];
}


var mCurrentIndex = 0;
var mImages = []

function GalleryImage (imgLocation, description, date, imgPath) {
	this.imgLocation = imgLocation;
	this.description = description;
	this.date = date;
	this.imgPath = imgPath;
}

var mRequest = new XMLHttpRequest();
mRequest.onreadystatechange = function() {
	if (mRequest.readyState == 4 && mRequest.status == 200) {
		try {
			var mJson = JSON.parse(mRequest.responseText);
			console.log(mJson.images);
			
			for (var i = 0; i <  mJson.images.length; i++) {
				var newImage = new GalleryImage(mJson.images[i].imgLocation, mJson.images[i].description, mJson.images[i].date, mJson.images[i].imgPath);
				mImages.push(newImage);
			}
		
		}catch(err) {
			console.log(err.message)
		}
	}
};

mRequest.open("GET",mUrl, true);
mRequest.send();

function swapPhoto() {
	//var element = document.getElementsByClassName("location")[0];
	document.getElementsByClassName("thumbnail")[0].src = mImages[mCurrentIndex].imgPath;
	console.log(mImages[mCurrentIndex].imgPath);
	//console.log(element);
	
	//update div.details information
	$('.location').text('Location: ' + mImages[mCurrentIndex].imgLocation);
	$('.description').text('Description: ' + mImages[mCurrentIndex].description);
	$('.date').text('Date: ' + mImages[mCurrentIndex].date); 

	
	if (mCurrentIndex >= mImages.length)
	{
		mCurrentIndex = 0;
	}
	
	console.log('swap photo');
}


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();
	
	$('#nextPhoto').click(function(){ 
		if(mCurrentIndex != mImages.length - 1) {
			mCurrentIndex++;
		}
		else {
			mCurrentIndex = 0;
		}
		swapPhoto();
	});			
			
	$('#prevPhoto').click(function(){ 
		if(mCurrentIndex != 0) {
			mCurrentIndex--;
		}
		else {
			mCurrentIndex = mImages.length - 1;
		}
		swapPhoto();
	});
			
	$('.moreIndicator').click(function(){
		$("img.rot90").toggleClass("rot270", 3000);
		$('.details').slideToggle(1000);
	});
});	

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);