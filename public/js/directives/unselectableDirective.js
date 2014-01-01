angular.module('timeMachine.directives', [])
  .directive('makeUnselectable', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.css({'user-select': 'none', 'outline':0});
        element.on('selectstart', false);
        element.on('dragstart', false);
        element.attr('unselectable', 'on');
      }
    }
  });
