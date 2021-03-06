var http = require('http');
var pygments = require('./pygments');
var cache = require('./cache');
var app = require('express').createServer();

app.get('/s/:id?', function(req, res) {
	var id = req.params.id;
	res.writeHead(200, {'Content-Type': 'text/html'});
	var file = 'snippet.js';
	var title = file;
	var data = cache.get(file);
	if (data) {
		data = data.replace('<div class="highlight">', '<div class="highlight"><h3>' + title + '</h3>');
		res.end(data);
	} else {
    	pygments.colorize(file, null, 'html', function(data) {
			cache.put(file, data);
			data = data.replace('<div class="highlight">', '<div class="highlight"><h3>' + title + '</h3>');
        	res.end(data);
    	});
	}
	
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

NotFound.prototype.__proto__ = Error.prototype;

app.get('/404', function(req, res){
    throw new NotFound;
});

app.get('/500', function(req, res){
    throw new Error('keyboard cat!');
});

app.listen(1337);