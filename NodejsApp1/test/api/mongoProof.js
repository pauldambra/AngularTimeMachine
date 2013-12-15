var should = require('should');
var db = require('../../api/mongo').database;

describe('this software', function() {
  beforeEach(function() {
    db.projects.remove();
    ['test','values','for','testing'].forEach(function(element) {
      db.projects.save({name:element});
    });
  });

  it('should be able to access projects', function(done) {
    db.projects.find(function(err, docs) {
      docs.length.should.equal(4);
      docs.map(function(doc) {
        return doc.name;
      }).should.eql(['test','values','for','testing']);
      done();
    });
  });

  it('should be able to search text', function(done) {
      db.projects.find( { name: /est/i } , function(err, res) {
        res.length.should.equal(2);
        res.map(function(doc) {
          return doc.name;
        }).should.eql(['test','testing']);
        done();
      });
  });
});





