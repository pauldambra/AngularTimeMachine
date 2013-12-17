var should = chai.should();

describe("The time difference service", function() {

  beforeEach(function() {
    module('timeMachine.services');
  });

  it('should be able to inject the service', inject(function(timeDifference) {
    timeDifference.should.not.eql(null);
    timeDifference.should.have.property('calculate');
  }));

  it('should return -1 when input is incorrect',
    inject(function(timeDifference) {
      var result = timeDifference.calculate(1, null);
      should.exist(result);
      result.should.equal(-1);
   }));

  it('should accept strings as parameters',
    inject(function(timeDifference) {
      var result = timeDifference.calculate('2013-05-12T00:00:00.000Z', '2013-05-12T01:00:00.000Z');
      should.exist(result);
      result.should.equal(1);
    }));

  it ('should accept moments as parameters', function() {
    inject(function(timeDifference) {
      var start = moment('2013-05-12T00:00:00.000Z');
      var end = moment('2013-05-12T02:00:00.000Z');
      var result = timeDifference.calculate(start, end);
      should.exist(result);
      result.should.equal(2);
    })
  });

  it ('should accept dates as parameters', function() {
    inject(function(timeDifference) {
      var start = new Date('2013-05-11T23:00:00.000Z');
      var end = new Date('2013-05-12T02:00:00.000Z');
      var result = timeDifference.calculate(start, end);
      should.exist(result);
      result.should.equal(3);
    })
  });

  it ('should accept mixed parameters', function() {
    inject(function(timeDifference) {
      var start = moment('2013-05-12T00:30:00.000Z');
      var end = new Date('2013-05-12T03:00:00.000Z');
      var result = timeDifference.calculate(start, end);
      should.exist(result);
      result.should.equal(2.5);
    })
  });
});
