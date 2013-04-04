define([
	/*====="dojo/_base/declare",=====*/
	"dojo/_base/lang",
	"dojo/Deferred",
	"dojo/promise/all",
	"dojo/_base/array",
	"dojo/dom-prop"
], function(/*=====declare, =====*/lang, Deferred, all, array, domProp){
	/*=====
	var ImageLoaderOptions = declare(null, {
		// srcRoot: String
		//		A root URL to prepend to relative URLs.
		srcRoot: null,

		// defaultAttributes: Object
		//		A hash of default attribute values for the loaded image(s).
		defaultAttributes: null
	});
	=====*/

	var trailingSlashPattern = /\/$/;
	function prepareSrcRoot(srcRoot){
		return trailingSlashPattern.test(srcRoot) ? srcRoot : (srcRoot + "/");
	}

	var leadingProtocolPattern = /^\w+:\/\//;
	function resolveUrl(srcRoot, url){
		return leadingProtocolPattern.test(url) ? url : (srcRoot + url);
	}

	function compileImageAttributes(srcRoot, defaultAttributes, urlOrAttributes){
		var imageAttributes = lang.mixin(
			{},
			defaultAttributes,
			typeof urlOrAttributes === 'string' ? { src: urlOrAttributes } : urlOrAttributes
		);

		if(!imageAttributes.src){
			throw new Error("No 'src' provided for image.");
		}

		if(srcRoot){
			imageAttributes.src = resolveUrl(srcRoot, imageAttributes.src);
		}

		return imageAttributes;
	}

	function load(srcRoot, defaultAttributes, urlOrAttributes){
		var dfd = new Deferred(),
			attributes = compileImageAttributes(srcRoot, defaultAttributes, urlOrAttributes),
			image = new Image();

		// Set up event handlers before setting image attributes because the load event
		// can fire immediately for cached images in some browsers.
		image.onload = function(){
			image.onload = image.onerror = null;
			dfd.resolve(image);
		};
		image.onerror = function(){
			image.onload = image.onerror = null;
			dfd.reject(new Error("Image failed to load: " + attributes.src));
		};

		domProp.set(image, attributes);

		return dfd.promise;
	}

	function imageLoad(options, arrayOrObject){
		// summary:
		//		Loads a collection of images using the specified options.
		// description:
		//		Takes a collection of image URLs and/or attribute hashes and
		//		returns a promise that is fulfilled when all images have been loaded.
		//		If one of the images fails to load, the returned promise is rejected.
		// options: ImageLoaderOptions?
		//		The load options.
		// arrayOrObject: Array|Object
		//		An array or object hash of URLs and/or image attribute hashes to load.
		// returns: dojo/promise/Promise
		//		The promise will be fulfilled with an array of results if invoked with
		//		an array, or an object of results when passed an object
		//		(using the same keys). 

		arrayOrObject || ((arrayOrObject = options) && (options = {}));
		
		var srcRoot = options.srcRoot && prepareSrcRoot(options.srcRoot),
			defaultAttributes = options.defaultAttributes || {},
			promises;

		if(arrayOrObject instanceof Array){
			promises = array.map(arrayOrObject, function(imageSpec){
				return load(srcRoot, defaultAttributes, imageSpec);
			});
		}else if(arrayOrObject instanceof Object){
			promises = {};
			for(var key in arrayOrObject){
				promises[key] = load(srcRoot, defaultAttributes, arrayOrObject[key]);
			}
		}else{
			throw new Error("Argument must be an Array or Object.");
		}
		return all(promises);
	}

	imageLoad.one = function one(options, stringOrObject){
		// summary:
		//		Loads a single image.
		// options: ImageLoaderOptions?
		//		The load options.
		// stringOrObject: String|Object
		//		A URL or an image attributes hash containing at least a 'src' attribute.
		// returns: dojo/promise/Promise
		//		Returns a promise for an image.

		stringOrObject || ((stringOrObject = options) && (options = {}));

		var imageSpec = typeof stringOrObject === "string" ? { src: stringOrObject } : stringOrObject;
		return imageLoad(options, [ imageSpec ]).then(function(images){
			return images[0];
		});
	};
	
	// AMD loader plugin
	imageLoad.load = function(id, require, load){
		imageLoad.one(require.toUrl(id)).then(load);
	};

	return imageLoad;
});
