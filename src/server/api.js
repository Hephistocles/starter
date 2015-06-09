var helper = require("./helper");

var impl = {
	greet: require("./api/greet")
};

// The API defined above may be inconsistent. It may return
// values instead of promises. We also want a shortcut for
// express router callbacks. To solve both problems, I wrap
// the API functions inside further functions.
module.exports = helper.wrap(impl);