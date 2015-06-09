var Q = require("q");

module.exports = greet;

function greet(name) {
	var d = Q.defer();

	d.resolve("Hello, " + name + "!");  
	if (name === "err") throw new Error("err is not an allowed name!");
	return d.promise;
}