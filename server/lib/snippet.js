var fs = require('fs');
var redis = require('redis');
var pygments = require('../pygments');

var snippet = module.exports = {
	
	// create a new snippet
    add: function (req, res) {
		var file = "/tmp/snippet";
		var r = redis.createClient();
		var obj = { };
		
		// prepare snippet object
		obj.id = null;
		obj.title = 'Example Snippet';
		obj.filename = 'example.html';
		obj.type = 'php';
		obj.author = 'rogerdudler';
		obj.created = Date.now();
		obj.content = '<div class="test">Hallo</div>';
		
		// read snippet content from body
		/*
		var getPostParams = function(req, callback){
		    var body = '';
		    req.on('data', function(chunk){
		        body += chunk;
		    }).on('end', function() {
		        var obj = qs.parse(  body.replace( /\+/g, ' ' ) ) ;
		        callback(obj);
		    });
		}
		*/
		
		// writing the snippet content to a file for conversion
		fs.writeFile(file, obj.content, function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        pygments.colorize(file, null, 'html', function(data) {
					obj.highlighted = data;
					r.incr('nextid', function(err, id) {
						if (err) {
							console.log(err);
						} else {
							obj.id = id;
							var data = JSON.stringify(obj);
					        r.set('snippet:' + id, data, function() {
								res.end(data);
					        });
						}
					});
		    	});
		    }
		});
    },
	
	get: function(req, res) {
		var id = req.params.id;
		var r = redis.createClient();
		r.get('snippet:' + id, function(err, data) {
		    if(!data) {
		        res.writeHead(404);
		        res.write("No such snippet");
		        res.end();
		        return;
		    }
			data = JSON.parse(data);
			data.likes = 15;
			data.forks = 2;
			res.end(JSON.stringify(data));
		});
	}

};