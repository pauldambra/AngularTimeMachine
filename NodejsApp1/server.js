var express = require('express');
var app = express();
var projectsRoutes = require('./api/projectsRoutes');
var daysRoutes = require('./api/daysRoutes');
var cacheManifest = require('connect-cache-manifest');

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(cacheManifest({
        manifestPath: '/offline.appcache',
        files: [
            {
                dir: __dirname + '/public/js',
                prefix: '/js/'
            },
            {
                dir: __dirname + '/public/css',
                prefix: '/css/',
                ignore: function(x) { return /\.scss$/.test(x); }
            },
            {
                dir: __dirname + '/public/fonts',
                prefix: '/fonts/'
            },
            {
                dir: __dirname + '/public/img',
                prefix: '/img/'
            },
            {
                file: __dirname + '/public/dayModalTemplate.html',
                path: '/dayModalTemplate.html'
            }
        ],
        networks: ['*'],
        fallbacks: ['/ /offline.html']
    }));
    app.use(express.static(__dirname + '/public'));

});



projectsRoutes.setup(app);
daysRoutes.setup(app);

app.listen(1337);
console.log('server listening');

exports.application = app;
