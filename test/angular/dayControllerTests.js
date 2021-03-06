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
        'timeMachine.services.time',
        'timeMachine.services.projects',
        'ProjectNameStorage',
        'timeMachine.filters'
      ]);
  });

  mockDayStorage = {
    getWeek: function(){
      return {days:[]};
    }
  };

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
      projectsService: {
        aggregate: function() {
          return ['summary'];
        }
      }
    });
  }));

  it('should start with defaults populated', function() {
    $scope.focusMonday.should.not.equal(undefined);
    $scope.days.should.eql([]);
    $scope.$digest(); //week summary relies on digest cycle
    $scope.weekSummary.should.eql(['summary']);
  });
});
