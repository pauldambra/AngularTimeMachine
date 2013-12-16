var should = chai.should();

describe("The hours filter", function() {

    beforeEach(function() {
      angular.module('timeMachine',
        [
          'ui.bootstrap',
          'DayStorage',
          'DayUtilities',
          'TimeDifference',
          'ProjectAggregator',
          'ProjectNameStorage',
          'timeMachine.filters'
        ]);
    });

    it('should be able to test', function(){
      true.should.equal(true);
    });

    it('should be able to inject an hours filter', inject(function($filter) {
      var hours = $filter('hours');
      expect(hours).not.to.equal(null);
    }));
});

//    it('should return "1 hour" when the input is 1',
//      inject(function($filter) {
//        expect($filter('hours')(1)).to.equal('1 hour');
//      }));
//
//    it('should return "x hours" when input is not 1',
//      inject(function($filter) {
//        expect($filter('hours')(0)).to.equal('0 hours');
//        expect($filter('hours')(2)).to.equal('2 hours');
//      }));
//  });
