var express = require('express');
var projects = require('./api/projects');
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
});

app.get('/projects', projects.all);
app.get('/projects/:id', projects.findById);
app.post('/wines', projects.addProject);
app.put('/wines/:id', projects.updateProject);
app.delete('/wines/:id', projects.deleteProject);

app.listen(1337);
console.log('server listening');