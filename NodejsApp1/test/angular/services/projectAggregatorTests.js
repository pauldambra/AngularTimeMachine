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
});
