var request = require('supertest');
var app = require('../server').application;
var db = require('../api/mongo').database;

describe('the server', function() {
  beforeEach(function() {
    db.projects.remove();
    ['test','values','for','testing'].forEach(function(element) {
      db.projects.save({name:element});
    });
  });

  it('should be able to get projects', function(done) {
    request(app)
      .get('/projects')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        JSON.parse(res.body.projects).map(function(project) {
          return project.name;
        }).should.eql(['test','values','for','testing']);
        done();
      });
  });

  it('should be able to search projects', function(done) {
    request(app)
      .get('/projects?search=est')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        JSON.parse(res.body.projects).should.eql(['test','testing']);
        done();
      });
  });

  describe('when posting to /projects', function() {
    it('should return 400 if body is empty', function(done) {
      request(app)
        .post('/projects')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res) {
          res.status.should.equal(400);
          done();
        });
    });

    it('should save a new project if one is included', function(done) {
      request(app)
        .post('/projects')
        .send({name:'floppity'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          res.status.should.equal(201);
          res.body.name.should.eql('floppity');
          db.projects.find({name:'floppity'}).limit(1, function(err,docs) {
            docs.length.should.equal(1);
            docs[0].name.should.equal('floppity');
          });
          done();
        });
    });
  });

  describe('delete to /projects', function() {
    it('should return 400 if body is empty', function(done) {
      request(app)
        .del('/projects')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res) {
          res.status.should.equal(400);
          done();
        });
    });

    it('should return 200 if the project does not exist', function(done) {
      request(app)
        .del('/projects')
        .send({name:'not in test values'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.deleted.should.equal(0);
          res.status.should.equal(200);
          db.projects.find(function(err, docs) {
            docs.length.should.equal(4);
          });
          done();
        });
    });

    it('should return 200 and remove a matching project', function(done) {
      request(app)
        .del('/projects')
        .send({name:'for'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.deleted.should.equal(1);
          res.status.should.equal(200);
          db.projects.find(function(err, docs) {
            docs.length.should.equal(3);
          });
          done();
        });
    });
  });
});

