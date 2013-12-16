var should = chai.should();

describe("The day controller", function() {
  var $scope;
  var mockDayStorage;

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

  mockDayStorage = {
    getWeek: function(i){
      return {days:[]};
    }
  }
  beforeEach(inject(function($rootScope, $controller) {
    //create a scope object for us to use.
    $scope = $rootScope.$new();

    //now run that scope through the controller function,
    //injecting any services or other injectables we need.
    ctrl = $controller('DaysCtrl', {
      $scope: $scope,
      $modal: {},
      dayStorage: mockDayStorage,
      dayUtilities: {},
      projectAggregator: {
        aggregate: function() {
          return ['summary'];
        }
      }
    });
  }));

  it('should start with defaults populated', function() {
    $scope.focusMonday.should.not.equal(undefined);
    $scope.days.should.eql([]);
    $scope.weekSummary.should.eql(['summary']);
  });
});
