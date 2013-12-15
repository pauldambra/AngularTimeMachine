var express = require('express');
var app = express();
var db = require('./api/mongo').database;

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
});

app.get('/projects', function(req, res) {
  function allProjects() {
    db.projects.find(function (err, docs) {
      if (err) {
        res.send(500);
      } else {
        res.send({projects: JSON.stringify(docs)});
      }
    });
  }

  function filteredProjects() {
    db.projects.find( { name: { $regex: req.query.search, $options: 'i' } } , function(err, docs) {
      if (err) {
        res.send(500);
      } else {
        var results = docs.map(function(doc) {
          return doc.name;
        });
        res.send({projects:JSON.stringify(results)});
      }
    });
  }

  if (req.query.search) {
    filteredProjects();
  } else {
    allProjects();
  }
});

app.post('/projects', function(req, res) {
  function fourHundredResponse() {
    res.send(400, {error: 'no project was included in the request'});
  }

  if (req.body) {
    if (req.body.hasOwnProperty('name')) {
      var newProject = {name: req.body.name};
      db.projects.save(newProject);
      res.send(201, newProject);
    } else {
      fourHundredResponse();
    }
  }
  else {
    fourHundredResponse();
  }
});

app.delete('/projects', function(req, res) {
  function fourHundredResponse() {
    res.send(400, {error: 'no project was included in the request'});
  }

  if (req.body) {
    if (req.body.hasOwnProperty('name')) {
      var newProject = {name: req.body.name};
      console.log(newProject);
      db.projects.remove(newProject, function(err, affected) {
        res.send(200, {deleted:affected});
      });
    } else {
      fourHundredResponse();
    }
  }
  else {
    fourHundredResponse();
  }
});

app.listen(1337);
console.log('server listening');

exports.application = app;
