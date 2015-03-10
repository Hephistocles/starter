var Q = require("q");

var api = {
	greet: greet
};

function greet(name) {
	var d = Q.defer();

	d.resolve("Hello, " + name);
	if (name === "err") throw new Error("err is not an allowed name!");
	return d.promise;
}


// wrap our API to guarantee it will return promises rather than allow errors or static values to propagate beyond the API
module.exports = {};

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

for (var method in api) {
	module.exports[method] = getWrappedMethod(api[method]);
}