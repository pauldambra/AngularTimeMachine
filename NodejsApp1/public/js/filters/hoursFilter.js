angular.module('timeMachine.filters',[])
  .filter('hours', function() {
  return function(input) {
    return input == 1
      ? '1 hour'
      : input + ' hours';
  }
});
