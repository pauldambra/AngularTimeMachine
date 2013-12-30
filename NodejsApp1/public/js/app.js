window.timeMachine = angular.module('timeMachine',
    [
      'ui.bootstrap',
      'DayStorage',
      'timeMachine.services.days',
      'timeMachine.services.time',
      'timeMachine.services.projects',
       'ProjectNameStorage',
      'timeMachine.filters',
      'timeMachine.directives'
    ]);

function DaysCtrl($scope,  $modal, dayStorage, dayUtilities, projectsService) {
  $scope.useHalfDayAggregate = false;

  function generateWeekSummary() {
    $scope.weekSummary = $scope.useHalfDayAggregate
                          ? projectsService.halfDayAggregate($scope.days)
                          : projectsService.aggregate($scope.days);
  }

  $scope.$watch('days', function() {
    generateWeekSummary();
  });

  $scope.$watch('useHalfDayAggregate', function() {
    generateWeekSummary();
  });

  var setFocusMonday = function(focus) {
        $scope.focusMonday = focus.hours(0).minutes(0).seconds(0).milliseconds(0);
        $scope.days = dayStorage.getWeek(focus).days;
    };

    setFocusMonday($scope.focusMonday || moment().day('monday'));

    $scope.forwardAWeek = function() {
        setFocusMonday($scope.focusMonday.add('day', 7));
    };

    $scope.backAWeek = function() {
        setFocusMonday($scope.focusMonday.add('day', -7));
    };

    $scope.openModal = function() {
        $scope.dayModal = true;
    };
    $scope.closeModal = function() {
        $scope.dayModal = false;
    };

    $scope.dayPartText = function(part) {
        return dayUtilities.dayPartLength(part);
    }

    $scope.dayTotal = function(day) {
        return dayUtilities.dayTotal(day);
    }

    $scope.weekTotal = function() {
      if ($scope.weekSummary.length == 0) {
        return 0;
      }
      console.log($scope.weekSummary);
      return _.reduce($scope.weekSummary, function(memo, part){
        return memo + part.total;
      }, 0);
    }

    $scope.deleteDayPart = function(day, part) {
        var dayIndex = $scope.days.indexOf(day);
        var partIndex = $scope.days[dayIndex].parts.indexOf(part);
        $scope.days[dayIndex].parts.splice(partIndex,1);
        dayStorage.saveDay($scope.days[dayIndex]);
    };

    $scope.addDayPart = function (targetDay) {
        var modalInstance = $modal.open({
            templateUrl: 'dayModalTemplate.html',
            controller: ModalInstanceCtrl,
            resolve: {
                modalDayPart: function() {
                    return null;
                },
                modalDay: function() {
                    return targetDay;
                }
            }
        });

//        modalInstance.result.then(
//          function() {
//            generateWeekSummary();
//          }
//        );
    };

    $scope.editDayPart = function (targetDay, targetDayPart) {
        var modalInstance = $modal.open({
            templateUrl: 'dayModalTemplate.html',
            controller: ModalInstanceCtrl,
            resolve: {
                modalDayPart: function() {
                    return targetDayPart ;
                },
                modalDay: function() {
                    return targetDay;
                }
            }
        });

//      modalInstance.result.then(
//          generateWeekSummary()
//      );
    };
}

var ModalInstanceCtrl = function ($scope, $modalInstance, dayStorage, modalDay, modalDayPart, projectNameStorage) {
    $scope.modalDay = modalDay;
    $scope.modalDayPart = modalDayPart;
    $scope.ok = function () {
        dayStorage.saveDay($scope.modalDay);
        projectNameStorage.addOrIgnoreNames(_.pluck($scope.modalDay.parts, 'projectName'));
        $modalInstance.close();
    };

    $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  $scope.searchProjectNames = function(term) {
        return projectNameStorage.getFilteredNames(term);
    }
};

var TimepickerCtrl = function ($scope, $log, dayUtilities) {
    if ($scope.modalDayPart === null) {
        $scope.modalDayPart = new Part($scope.modalDay.date, $scope.modalDay.date);
        $scope.modalDay.parts.push($scope.modalDayPart);
    }

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.timeDifference =  function() {
        return dayUtilities.dayPartLength($scope.modalDayPart);
    }();

    $scope.changed = function () {
        if ($scope.finish < $scope.start) {
            alert("are you a time traveller?! finish should be after start!");
            $scope.difference = '?!!?!';
        } else {
            $scope.timeDifference = function() {
                return dayUtilities.dayPartLength($scope.modalDayPart);
            }();
        }
    };
};
