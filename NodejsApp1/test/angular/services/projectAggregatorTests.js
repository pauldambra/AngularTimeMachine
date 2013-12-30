var should = chai.should();

describe("The project aggregator service", function() {

  beforeEach(function() {
    module('timeMachine.services.projects');
  });

  it('should be able to inject the service', inject(function(projectsService) {
    projectsService.should.not.eql(null);
    projectsService.should.have.property('aggregate');
  }));

  it('should aggregate day parts by project name', inject(function(projectsService) {
    var dayA = {
      parts: [
        {
          projectName:"one",
          start: new Date('2013-05-12T00:00:00.000Z'),
          finish: new Date('2013-05-12T01:00:00.000Z')
        },
        {
          projectName:"two",
          start: new Date('2013-05-12T00:00:00.000Z'),
          finish: new Date('2013-05-12T01:00:00.000Z')
        },{
          projectName:"two",
          start: null,
          finish: new Date('2013-05-12T01:00:00.000Z')
        }]
      };
    var dayB = {
      parts: [
        {
          projectName:"two",
          start: new Date('2013-05-12T00:00:00.000Z'),
          finish: new Date('2013-05-12T01:00:00.000Z')
        },
        {
          projectName:"three",
          start: new Date('2013-05-12T00:00:00.000Z'),
          finish: new Date('2013-05-12T01:00:00.000Z')
        },
        {
          projectName:"three",
          start: new Date('2013-05-12T00:00:00.000Z'),
          finish: new Date('2013-05-12T01:00:00.000Z')
        },
        {
          projectName:"three",
          start: new Date('2013-05-12T00:00:00.000Z'),
          finish: new Date('2013-05-12T01:00:00.000Z')
        }
      ]
      };
    var results = projectsService.aggregate([dayA, dayB]);
    results.should.have.length(3);
    _.find(results, function(r) {return r.project == "one"}).total.should.eql(1);
    _.find(results, function(r) {return r.project == "two"}).total.should.eql(2);
    _.find(results, function(r) {return r.project == "three"}).total.should.eql(3);
  }));

  describe('filtered aggregation', function() {

    function testHalfDayAggregation(projectsService, dayArray, expectedLength, expectedResult) {
      var results = projectsService.halfDayAggregate(dayArray);
      results.should.have.length(expectedLength);
      results.should.eql(expectedResult);
    }

    it('should ignore values below 1 hour 30', inject(function(projectsService) {
      var dayA = {
        parts: [
          {
            projectName:"one",
            start: new Date('2013-05-12T00:00:00.000Z'),
            finish: new Date('2013-05-12T01:00:00.000Z')
          },
          {
            projectName:"one",
            start: new Date('2013-05-12T00:00:00.000Z'),
            finish: new Date('2013-05-12T00:30:00.000Z')
          }]};
      testHalfDayAggregation(projectsService, [dayA], 0, []);
    }));

    it('should return 3.5 for about a half day', inject(function(projectsService) {
      var dayA = {
        parts: [
          {
            projectName:"one",
            start: new Date('2013-05-12T00:00:00.000Z'),
            finish: new Date('2013-05-12T01:00:00.000Z')
          },
          {
            projectName:"one",
            start: new Date('2013-05-12T00:00:00.000Z'),
            finish: new Date('2013-05-12T00:55:00.000Z')
          }]};
      testHalfDayAggregation(projectsService, [dayA], 1, [{project:'one', total:3.5}]);

      var dayB = {
        parts: [
          {
            projectName:"two",
            start: new Date('2013-05-12T00:00:00.000Z'),
            finish: new Date('2013-05-12T02:00:00.000Z')
          },
          {
            projectName:"two",
            start: new Date('2013-05-12T00:00:00.000Z'),
            finish: new Date('2013-05-12T02:15:00.000Z')
          }]};
      testHalfDayAggregation(projectsService, [dayB], 1, [{project:'two', total:3.5}]);
    }));

    it('should return 7 for about a day', inject(function(projectsService) {
      var dayA = {
        parts: [
          {
            projectName:"one",
            start: new Date('2013-05-12T00:00:00.000Z'),
            finish: new Date('2013-05-12T06:00:00.000Z')
          },
          {
            projectName:"one",
            start: new Date('2013-05-12T00:00:00.000Z'),
            finish: new Date('2013-05-12T00:55:00.000Z')
          }]};
      testHalfDayAggregation(projectsService, [dayA], 1, [{project:'one', total:7}]);

      var dayB = {
        parts: [
          {
            projectName:"two",
            start: new Date('2013-05-12T00:00:00.000Z'),
            finish: new Date('2013-05-12T07:00:00.000Z')
          },
          {
            projectName:"two",
            start: new Date('2013-05-12T00:00:00.000Z'),
            finish: new Date('2013-05-12T01:00:00.000Z')
          }]};
      testHalfDayAggregation(projectsService, [dayB], 1, [{project:'two', total:7}]);
    }));

    it('should return 14 for 16 hours', inject(function(projectsService) {
      testHalfDayAggregation(
        projectsService,
        [{
          parts: [
            {
              projectName:"one",
              start: new Date('2013-05-12T00:00:00.000Z'),
              finish: new Date('2013-05-12T06:00:00.000Z')
            },
            {
              projectName:"one",
              start: new Date('2013-05-12T00:00:00.000Z'),
              finish: new Date('2013-05-12T09:00:00.000Z')
            }]
        }],
        1,
        [{project:'one', total:14}]);
    }));

    it('should return 10.5 for 9.5 hours', inject(function(projectsService) {
      testHalfDayAggregation(
        projectsService,
        [{
          parts: [
            {
              projectName:"one",
              start: new Date('2013-05-12T00:00:00.000Z'),
              finish: new Date('2013-05-12T06:00:00.000Z')
            },
            {
              projectName:"one",
              start: new Date('2013-05-12T00:00:00.000Z'),
              finish: new Date('2013-05-12T04:00:00.000Z')
            }]
        }],
        1,
        [{project:'one', total:10.5}]);
    }));
  })
});
