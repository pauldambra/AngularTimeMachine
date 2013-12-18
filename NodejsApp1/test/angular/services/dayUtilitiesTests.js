var should = chai.should();

describe("The project aggregator service", function() {

  beforeEach(function() {
    module('timeMachine.services.days');
  });

  it('should be able to inject the service', inject(function(dayUtilities) {
    dayUtilities.should.not.eql(null);
    dayUtilities.should.have.property('dayPartLength');
    dayUtilities.should.have.property('dayTotal');
    dayUtilities.should.have.property('weekTotal');
  }));

  it('should test this');
});
