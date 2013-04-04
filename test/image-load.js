define([
	"../image-load",
    "doh/main",
	"require",
	"dojo/_base/lang"
], function(imageLoad, doh, require, lang){

	function deferredFailure(t, promise){
		var dfd = new doh.Deferred();
		promise.then(
			dfd.getTestCallback(function(image){
				throw new Error("Promise resolved when rejection was expected.");
			}),
			dfd.getTestCallback(function(error){
				t.assertTrue(error !== undefined);
			})
		);
		return dfd;
	}

	doh.register("image-loader", [
		function loadOne_UrlString(t){
			var dfd = new doh.Deferred();
			var url = require.toUrl("./sample.png");
			imageLoad.one(url).then(
				function(image){ dfd.callback(image !== undefined); },
				lang.hitch(dfd, "errback")
			);
			return dfd;
		},
		function failToLoadOne_UrlString(t){
			var url = require.toUrl("./sample-nonexistent.png");
			return deferredFailure(t, imageLoad.one(url));
		},
		function loadOne_ImageAttributes(t){
			var dfd = new doh.Deferred();
			var imageAttributes = {
				src: require.toUrl("./sample.png"),
				alt: "sample",
				width: 24,
				height: 42
			};
			imageLoad.one(imageAttributes).then(
				dfd.getTestCallback(function(image){
					t.assertEqual(imageAttributes.alt, image.alt);
					t.assertEqual(imageAttributes.width, image.width);
					t.assertEqual(imageAttributes.height, image.height);
				}),
				lang.hitch(dfd, "errback")
			);
			return dfd;
		},
		function failToLoadOne_ImageAttributes(t){
			var imageAttributes = {
				src: require.toUrl("./sample-nonexistent.png"),
				alt: "sample-nonexistent"
			};
			return deferredFailure(t, imageLoad.one(imageAttributes));
		},
		function loadMultiple_Array(t){
			var dfd = new doh.Deferred();
			var firstImageAttributes = {
				src: require.toUrl("./sample.png"),
				alt: "first"
			};
			var secondImageAttributes = {
				src: require.toUrl("./sample2.png"),
				alt: "second"
			};
			var thirdImageUrl = require.toUrl("./sample3.png");
			imageLoad([
				firstImageAttributes,
				secondImageAttributes,
				thirdImageUrl
			]).then(
				dfd.getTestCallback(function(images){
					t.assertEqual(firstImageAttributes.alt, images[0].alt);
					t.assertEqual(secondImageAttributes.alt, images[1].alt);
					t.assertTrue(/sample3\.png$/.test(images[2].src));
				}),
				lang.hitch(dfd, "errback")
			);
			return dfd;
		},
		function failToLoadMultiple_Array(t){
			return deferredFailure(t, imageLoad([
				require.toUrl("./sample-nonexistent.png"), require.toUrl("./sample.png")
			]));
		},
		function loadMultiple_Object(t){
			var dfd = new doh.Deferred();
			var firstImageAttributes = {
				src: require.toUrl("./sample.png"),
				alt: "first"
			};
			var secondImageAttributes = {
				src: require.toUrl("./sample2.png"),
				alt: "second"
			};
			var thirdImageUrl = require.toUrl("./sample3.png");
			imageLoad({
				first: firstImageAttributes,
				second: secondImageAttributes,
				third: thirdImageUrl
			}).then(
				dfd.getTestCallback(function(images){
					t.assertEqual(firstImageAttributes.alt, images.first.alt);
					t.assertEqual(secondImageAttributes.alt, images.second.alt);
					t.assertTrue(/sample3\.png$/.test(images.third.src));
				}),
				lang.hitch(dfd, "errback")
			);
			return dfd;
		},
		function failToLoadMultiple_Object(t){
			return deferredFailure(t, imageLoad({
				existing: require.toUrl("./sample.png"),
				nonExistent: require.toUrl("./sample-nonexistent.png")
			}));
		},
		function testOption_srcRoot(t){
			var dfd = new doh.Deferred();
			imageLoad({
				srcRoot: require.toUrl(".")
			},{
				first: "sample.png",
				second: "sample2.png"
			}).then(
				dfd.getTestCallback(function(images){
					t.assertTrue(/sample\.png$/.test(images.first.src));
					t.assertTrue(/sample2\.png$/.test(images.second.src));
				}),
				lang.hitch(dfd, "errback")
			);
			return dfd;
		},
		function testOption_defaultAttributes(t){
			var dfd = new doh.Deferred();
			var defaultAttributes = {
				src: require.toUrl("./sample.png"),
				alt: "deef alt",
				width: 24,
				height: 12
			};
			var imagesToLoad = {
				first: require.toUrl("./sample.png"),
				second: {
					width: 42	
				},
				third: {
					alt: "third image",
					height: 321
				}
			};
			imageLoad({ defaultAttributes: defaultAttributes }, imagesToLoad).then(
				dfd.getTestCallback(function(images){
					t.assertEqual(defaultAttributes.alt, images.first.alt);
					t.assertEqual(defaultAttributes.width, images.first.width);
					t.assertEqual(defaultAttributes.height, images.first.height);

					t.assertEqual(defaultAttributes.alt, images.second.alt);
					t.assertEqual(imagesToLoad.second.width, images.second.width);
					t.assertEqual(defaultAttributes.height, images.second.height);

					t.assertEqual(imagesToLoad.third.alt, images.third.alt);
					t.assertEqual(defaultAttributes.width, images.third.width);
					t.assertEqual(imagesToLoad.third.height, images.third.height);
				}),
				lang.hitch(dfd, "errback")
			);

			return dfd;
		}
	]);
});
