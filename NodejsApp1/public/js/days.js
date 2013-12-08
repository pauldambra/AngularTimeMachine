window.timeMachine = angular.module('timeMachine',
    ['ui.bootstrap', 'DayStorage', 'DayUtilities', 'TimeDifference']);

function DaysCtrl($scope,  $modal, dayStorage, dayUtilities, timeDifference) {

    $scope.weekSummary = [];

    var updateProjectSummaries = function() {
        var projects = _.groupBy(
            _.flatten(_.map($scope.days, function(day) { return day.parts;})),
            'projectName');
        var projectSums = _.map(projects, function(value, key) {
            var partsTotal = _.reduce(value, function(memo, part){
                return memo + timeDifference.calculate(part.start, part.finish);
            }, 0);
            return {project:key, total:partsTotal};
        });
        console.log(projectSums);
        $scope.weekSummary.length = 0;
        $scope.weekSummary.concat(_.sortBy(projectSums, function(item) {
            return item.project;
        }));
    };

    var setFocusMonday = function(focus) {
        $scope.focusMonday = focus.hours(0).minutes(0).seconds(0).milliseconds(0);
        $scope.days = dayStorage.getWeek(focus).days;
        updateProjectSummaries();
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
        return dayUtilities.weekTotal($scope.days);
    }

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

        modalInstance.result.then(updateProjectSummaries());
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

    modalInstance.result.then(updateProjectSummaries());
    };
}

var ModalInstanceCtrl = function ($scope, $modalInstance, modalDay, modalDayPart) {
    $scope.modalDay = modalDay;
    $scope.modalDayPart = modalDayPart;
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

var TimepickerCtrl = function ($scope, $log, dayStorage, dayUtilities) {
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
            dayStorage.saveDay($scope.modalDay)
        }
    };
};