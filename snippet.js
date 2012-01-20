var pygments = require('./pygments');

pygments.colorize('snippet.js', null, 'html', function(data) {
    console.log(data);
});
