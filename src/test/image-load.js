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
		},
		function failToLoadMultiple_Array(t){
		},
		function loadMultiple_Object(t){
		},
		function failToLoadMultiple_Object(t){
		}
	]);
});
