var http = require('http');
var pygments = require('./pygments');
var cache = require('./cache');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
	
	var data = cache.get('snippet.js');
	if (data) {
		data = data.replace('<div class="highlight">', '<div class="highlight"><h3>Test</h3>');
		res.end(data);
	} else {
    	pygments.colorize('snippet.js', null, 'html', function(data) {
			cache.put('snippet.js', data);
			data = data.replace('<div class="highlight">', '<div class="highlight"><h3>Test</h3>');
        	res.end(data);
    	});
	}
}).listen(1337, "10.221.0.184");
