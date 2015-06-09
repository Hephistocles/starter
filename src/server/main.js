var express = require('express');
var app = express();
var api = require("./api");

// serve the api
app.get('/api/:name', api.express.greet("name"));

// serve the main application
app.use('/', express.static(__dirname + '/../../build'));

// startup the server on port 3000
var server = app.listen(3000, function() {

	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening at http://%s:%s', host, port);

});