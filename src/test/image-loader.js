define([
	"teststack!tdd",
	"../image-loader",
	"dojo/_base/lang",
	"dojo/Deferred",
	"require"
], function(test, imageLoader, lang, Deferred, require){

	function promiseToFail(promise) {
		var dfd = new Deferred();
		promise.then(function() {
			dfd.reject(new Error("Promise resolved when rejection was expected."));
		}, function(error) {
			dfd.resolve(error);
		});
		return dfd.promise;
	}

	test.suite("image-loader", function(){
		test.test('load single image', function(){
			return imageLoader(require.toUrl("./sample.png"));
		});
		test.test('fail to load single image', function(){
			return promiseToFail(imageLoader(require.toUrl("./nonexistent.png")));
		});
	});
});
