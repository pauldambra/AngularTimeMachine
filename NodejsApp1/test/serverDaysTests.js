var request = require('supertest');
var app = require('../server').application;
var db = require('../api/mongo').database;
var should = require('should');
var dateArray = [];

function makeDate(s) {
  var date = new Date(s);
  date.setHours(0, 0, 0, 0);
  dateArray.push(date);
  return date;
}

var aprilFirst = makeDate('2013-04-01');
var aprilSecond = makeDate('2013-04-02')
var sixteenthDecember = makeDate('2013-12-16');
var seventeenthDecember = makeDate('2013-12-17');
var eighteenthDecember = makeDate('2013-12-18');
var nineteenthDecember = makeDate('2013-12-19');
var twentiethDecember = makeDate('2013-12-20');
var twentyFirstDecember = makeDate('2013-12-21');
var twentySecondDecember = makeDate('2013-12-22');
var twentyThirdDecember = makeDate('2013-12-23');

describe('the server', function() {
  beforeEach(function() {
    db.days.remove();

    dateArray.forEach(function(element) {
      db.days.save({date: element, parts:[]});
    });
  });

  it('should be able to get days', function(done) {
    request(app)
      .get('/days')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        var result = JSON.parse(res.body.days);
        result.length.should.equal(10);
        done();
      });
  });

  it('should be able to load days by date', function(done) {
    request(app)
      .get('/days?date=2013-04-01')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        var result = JSON.parse(res.body.days);
        result.length.should.equal(1);
        var returnedDates = result.map(function(r) {
          return new Date(r.date).getTime();
        });
        returnedDates.should.eql([new Date(aprilFirst).getTime()]);
        done();
      });
  });

  describe('when loading a week', function() {
    it('should do something descriptive when the date is not a week', function(done) {
      request(app)
        .get('/days?weekCommencing=2013-12-15') //sunday
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res) {
          res.status.should.equal(400);
          res.body.error.should.eql('weekCommencing parameter must be a Monday');
          done();
        });
    });

    it('should be able to load days by week start', function(done) {
      request(app)
        .get('/days?weekCommencing=2013-12-16')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          JSON.parse(res.body.days).length.should.equal(7);
          done();
        });
    });
  });

  describe('when posting to /days', function() {
    it('should return 400 if body is empty', function(done) {
      request(app)
        .post('/days')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res) {
          res.status.should.equal(400);
          done();
        });
    });

    it('should save a new day if one is included', function(done) {
      var targetDate = new Date('2013-05-12T00:00:00.000Z');

      request(app)
        .post('/days')
        .send({date: targetDate.toISOString(), parts:[]})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          res.status.should.equal(201);
          new Date(res.body.date).should.eql(targetDate);
          db.days.find( { date: targetDate.toISOString() } , function(err, docs) {
            docs.length.should.equal(1);
            done();
          });
        });
    });
  });

  describe('delete to /days', function() {
    it('should return 400 if body is empty', function(done) {
      request(app)
        .del('/days')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res) {
          res.status.should.equal(400);
          done();
        });
    });

    it('should return 200 if the day does not exist', function(done) {
      request(app)
        .del('/days')
        .send({date:'1944-05-12T00:00:00.000Z'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.deleted.should.equal(0);
          res.status.should.equal(200);
          db.days.find(function(err, docs) {
            should.exist(docs);
            docs.should.not.be.empty;
          });
          done();
        });
    });

    it('should return 200 and remove a matching day', function(done) {
      request(app)
        .del('/days')
        .send({date:'2013-12-22T00:00:00.000Z'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.deleted.should.equal(1);
          res.status.should.equal(200);
          db.days.find(function(err, docs) {
            docs.length.should.equal(9);
          });
          done();
        });
    });
  });

  describe('put to /days', function() {
    it('should add parts when putting to day', function(done) {
      var targetDate = new Date('2013-12-22T00:00:00.000Z');
      request(app)
        .put('/days')
        .send({date: targetDate.toISOString(), parts:[{a: 'part'}]})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.status.should.equal(200);
          new Date(res.body.date).should.eql(targetDate);
          should.exist(res.body.parts);
          res.body.parts.length.should.equal(1);
          db.days.find( { date: targetDate } , function(err, docs) {
            docs.length.should.equal(1);
            docs[0].parts.length.should.equal(1);
            docs[0].parts[0].a.should.eql('part');
            done();
          });
        });
    });

    it('should delete parts when putting to day', function(done) {
      var targetDate = new Date('2013-12-22T00:00:00.000Z');
      db.days.update({date:targetDate}, {$set:{parts:[{a:'part'}]}}, function(err) {
        should.not.exist(err);
        request(app)
          .put('/days')
          .send({date: targetDate.toISOString(), parts:[]})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            res.status.should.equal(200);
            new Date(res.body.date).should.eql(targetDate);
            should.exist(res.body.parts);
            res.body.parts.length.should.equal(0);
            db.days.find( { date: targetDate } , function(err, docs) {
              docs.length.should.equal(1);
              docs[0].parts.length.should.equal(0);
              done();
            });
          });
      });
    });
  })
});

