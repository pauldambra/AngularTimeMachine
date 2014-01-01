var db = require('./mongo').database;
var moment = require('moment');

exports.setup = function(app) {
  app.get('/days', function(req, res) {
    function allDays() {
      db.days.find(function (err, docs) {
        if (err) {
          res.send(500);
        } else {
          res.send({days: JSON.stringify(docs)});
        }
      });
    }

    function dayByDate() {
      var searchDate = new Date(req.query.date);
      searchDate.setHours(0, 0, 0, 0);

      db.days.find( { date: searchDate } , function(err, docs) {
        if (err) {
          res.send(500);
        } else {
          res.send({days:JSON.stringify(docs)});
        }
      });
    }

    function dayByWeek() {
      var searchDate = new Date(req.query.weekCommencing);
      searchDate.setHours(0, 0, 0, 0);

      if (searchDate.getDay()!= 1) {
        res.send(400, {error:'weekCommencing parameter must be a Monday'});
        return;
      }

      var end = moment(searchDate);
      end.add('days', 7);

      db.days.find( { date: {$gte: searchDate, $lt: end.toDate()} } , function(err, docs) {
        if (err) {
          res.send(500);
        } else {
          res.send({days:JSON.stringify(docs)});
        }
      });
    }

    if (req.query.date) {
      dayByDate();
    } else if (req.query.weekCommencing) {
      dayByWeek();
    } else {
      allDays();
    }
  });

  app.post('/days', function(req, res) {
    function fourHundredResponse() {
      res.send(400, {error: 'no day was included in the request'});
    }

    if (req.body) {
      if (req.body.hasOwnProperty('date') && req.body.hasOwnProperty('parts')) {
        var day = {
          date: req.body.date,
          parts: req.body.parts
        };
        db.days.save(day);
        res.send(201, day);
      } else {
        fourHundredResponse();
      }
    }
    else {
      fourHundredResponse();
    }
  });

  app.delete('/days', function(req, res) {
    function fourHundredResponse() {
      res.send(400, {error: 'no day was included in the request'});
    }

    if (req.body) {
      if (req.body.hasOwnProperty('date')) {
        var dayToRemove = {date: new Date(req.body.date)};
        db.days.remove(dayToRemove, function(err, affected) {
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

  app.put('/days', function(req, res) {
    if(!req.body.hasOwnProperty('date')) {
      res.send(400, 'a date must be included in the request');
      return;
    }

    if(!req.body.hasOwnProperty('parts')) {
      res.send(400, 'day parts must be included in the request');
      return;
    }

    db.days.find({date:new Date(req.body.date)}, function(err, docs) {
      if (err) {
        res.send(500);
        return;
      }
      if (!docs || docs.length == 0) {
        res.send(404);
        return;
      }

      if (docs.length!=1) {
        res.send(500);
        return;
      }

      db.days.update({date:new Date(req.body.date)}, {$set:{parts:req.body.parts}}, function(err) {
        if (err) {
          res.send(500);
        } else {
          db.days.find({date:new Date(req.body.date)},function(err, docs) {
            if (err) {
              res.send(500);
            }
            res.send(200, docs[0]);
          })
        }
      });
    });
  });
};
