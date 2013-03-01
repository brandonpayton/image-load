define([
	"dojo/array",
	"dojo/Deferred",
	"dojo/promise/all"
], function(array, Deferred, all){
	function loadImage(imageUrl){
		var dfd = new Deferred();

		var image = new Image();
		image.onload = function(){
			dfd.resolve(image);
		};
		image.onerror = function(){
			dfd.reject(new Error("Image failed to load: " + imageUrl));
		};
		image.src = imageUrl;

		return dfd.promise;
	}

	function image(urls){
		// summary:
		//		Takes one or more image URLs and returns a new promise that is fulfilled
		//		when all images have been loaded.
		// description:
		//		Takes one or more image URLs and returns a new promise that is fulfilled
		//		when all images have been loaded. If one of the images fails to load,
		//		the returned promise is rejected. 
		// urls: String|Array|Object
		//		A single URL, an array of URLs, or an object comprised of key/URL pairs.
		// returns: dojo/promise/Promise
		//		The promise will be fulfilled with a single image if invoked with a string,
		//		a list of results if invoked with an array, or an object of results when passed
		//		an object (using the same keys). 

		if(urls instanceof String){
			return loadImage(urls);
		} else {
			var promises;
			if(urls instanceof Array){
				promises = array.map(urls, function(imageUrl){
					return loadImage(imageUrl);
				});
			} else if(urls instanceof Object){
				promises = {};
				for(var key in urls){
					if(urls.hasOwnProperty(key)){
						promises[key] = urls[key];
					}
				}
			} else {
				throw new Error("Argument must be a String, Array, or Object.");
			}
			return all(promises);
		}
	};

	return image;
});
