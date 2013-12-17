var should = chai.should();

describe("The project aggregator service", function() {

  beforeEach(function() {
    module('timeMachine.services');
  });

  it('should be able to inject the service', inject(function(projectAggregator) {
    projectAggregator.should.not.eql(null);
    projectAggregator.should.have.property('aggregate');
  }));
});
