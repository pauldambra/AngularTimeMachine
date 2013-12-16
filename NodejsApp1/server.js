var express = require('express');
var app = express();
var projectsRoutes = require('./api/projectsRoutes');
var daysRoutes = require('./api/daysRoutes');

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
});

projectsRoutes.setup(app);
daysRoutes.setup(app);

app.listen(1337);
console.log('server listening');

exports.application = app;
