var Q = require("q");
module.exports = {
	wrap: wrap
};
function wrap(impl) {

	var exports = {};
	exports.express = {};
	for (var method in impl) {
		exports[method] = getWrappedMethod(impl[method]);
		exports.express[method] = getExpressMethod(impl[method]);
	}
	return exports;

	function getExpressMethod(method) {

		// this is the shortcut function that main.js will call
		// usage: shortcut("paramName1", "paramName2", ...)
		// params will be looked up in req.params, body then query
		return function shortcut() {
			var paramNames = arguments;

			// this is the function that express itself will call
			return function(req, res) {
				var paramValues = [];
				for (var i in paramNames) {
					var n = paramNames[i];
					if (req.params[n] !== undefined) {
						paramValues[i] = req.params[n];
					} else if (req.body[n] !== undefined) {
						paramValues[i] = req.body[n];
					} else if (req.query[n] !== undefined) {
						paramValues[i] = req.query[n];
					}
				}

				// I expect all API calls to return a promise
				method.apply(null, paramValues).then(function(result) {

					// all successes should be returned as straightforward JSON
					res.json({
						success: true,
						result: result
					});
				}, function(err) {

					// log error to console
					console.log(err);

					// Stringifying errors doesn't work very well, so first convert to a
					// normal object, then return it as JSON (with the success field false)
					if (err instanceof Error) {			
						err = flattenError(err);
					}
					res.status(500).json({
						success: false,
						error: err
					});
				});
			};
		};
	}

	function flattenError(err) {
		var plainObject = {};
		var extractedKeys = [
			'message'
			// 'stack'
		];
		extractedKeys.forEach(function(key) {
			plainObject[key] = err[key];
		});
		return plainObject;
	}


	function getWrappedMethod(method) {
		return function() {
			try {
				// wrap a possibly-static value into something which is definitely a Q promise
				return Q(method.apply(method, arguments));
				
			} catch(err) {
				// calling the API threw an error - wrap this in a rejected promise
				return Q.reject(err);
			}
		};
	}
}