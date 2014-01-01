var should = chai.should();

describe("The hours filter", function() {

    beforeEach(function() {
      module('timeMachine.filters');
    });

    it('should be able to inject an hours filter', inject(function($filter) {
      var hours = $filter('hours');
      hours.should.not.eql(null);
    }));

    it('should return "1 hour" when the input is 1',
      inject(function($filter) {
        $filter('hours')(1).should.equal('1 hour');
      }));

    it('should return "x hours" when input is not 1',
      inject(function($filter) {
        $filter('hours')(0).should.equal('0 hours');
        $filter('hours')(2).should.equal('2 hours');
      }));
  });
