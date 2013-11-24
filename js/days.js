angular.module('timeMachine', ['ui.bootstrap']);
function DaysCtrl($scope) {
  $scope.days = [
    {
    	dayName: 'Monday',
    	dayDate: moment()
    },
    {
    	dayName: 'Tuesday',
    	dayDate: moment()
    },
    {
    	dayName: 'Wednesday',
    	dayDate: moment()
    },
    {
    	dayName: 'Thursday',
    	dayDate: moment()
    },
    {
    	dayName: 'Friday',
    	dayDate: moment()
    },
    ];
 }
 