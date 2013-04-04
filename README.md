Dojo Image Loader
=================

A promise-based image loader and AMD loader plugin for Dojo 1.8+

Usage
-----

Add ```image-load``` to your packages definition in your dojoConfig so it can be
identified simply by "image-load".

To use the loader directly:
```javascript
require([ "image-load" ], function(imageLoad){

	// To load an array of images, pass a URL string or attribute hash for each image
	imageLoad([
		"http://absolute.url.to/image.png",
		"relative/path/to/image.jpg",
		{
			src: "whyIsThisA.gif",
			width: 42,
			height: 42
		}
	]).then(function(imageArray){
		// Have fun.
	});

	// To load a hash of images, pass a hash with a named URL string or attribute hash for each image
	imageLoad({
		first: "onePath.png",
		second: {
			src: "twoPath.png",
			alt: "to two too"
		},
		third: "threePath.png"
	}).then(function(imageMap){
		// Have more fun.	
	});

	// To configure the loader, pass an options hash as the first parameter.
	imageLoad({
		// a src root for relative URLs. May itself be relative or absolute.
		srcRoot: "base/path",

		// Attributes applied to each image when not already specified for the image
		defaultAttributes: {
			width: 24,
			height 24
		}
	},[
		"plane.png",
		"train.png",
		"automobile.png"
	]).then(function(imageArray){
		// Enjoy an array of uniformly-sized images.
	});

	// To load a single image, pass a URL string or a hash of image attributes.
	// one() supports a leading options parameter like the main load function.
	imageLoad.one("http://some.domain/images/best.png").then(function(bestImage){
		// Only the best.	
	});
});
```

```image-load``` may also be used as a loader plugin so you can specify image dependencies in your module definition.
```javascript
define([ "image-load!./path/to/sample.png" ], function(sampleImage){
	// Your image dependency is resolved!
});
```

## License

New BSD License © 2013 Brandon Payton http://happycode.net. 
