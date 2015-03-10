var express = require('express');
var app = express();
var api = require("./api");

app.get('/api/:name', function(req, res) {
	servePromise(res, api.greet(req.params.name));
});

app.use('/', express.static(__dirname + '/../../build'));

var server = app.listen(3000, function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Starter app listening at http://%s:%s', host, port);

});


function flattenError(err) {
	var plainObject = {};
	var extractedKeys = [
		'message',
		// potentially shouldn't give the stack to users of the API:
		'stack'
	];
	extractedKeys.forEach(function(key) {
		plainObject[key] = err[key];
	});
	return plainObject;
}

function servePromise(res, p) {
	p.then(function(result) {
		res.json({
			success: true,
			result: result
		});
	}, function(err) {
		console.log(err);

		// Stringifying errors doesn't work very well, so convert to a normal object
		if (err instanceof Error) {			
			err = flattenError(err);
		}
		res.status(501).json({
			success: false,
			error: err
		});
	});
}