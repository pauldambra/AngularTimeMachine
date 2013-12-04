window.timeMachine = angular.module('timeMachine', ['ui.bootstrap', 'DayStorage']);

function DaysCtrl($scope,  $modal, dayStorage) {

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

    $scope.dayPartText = function (dayPart) {
        var timeDifference = timeMachine.calculateTimeDifference(dayPart.start, dayPart.finish);
        return timeDifference + ' hours';
    };

    function calculateDayTotal(day) {
        var total = 0;
        for(var i = 0, len = day.parts.length; i<len; i++) {
            var part = day.parts[i];
            var diff = timeMachine.calculateTimeDifference(part.start, part.finish);
            if (diff > -1) {
                total += diff;
            }
        }
        return total;
    }

    $scope.dayTotal = function(day) {
        var total = calculateDayTotal(day);
        return total + ' hours';
    };

    $scope.weekTotal = function() {
        var total = 0;
        for(var i = 0, len = $scope.days.length; i < len; i++) {
            total += calculateDayTotal($scope.days[i]);
        }
        return total;
    };

    $scope.addDayPart = function (targetDay) {
        $modal.open({
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

//    modalInstance.result.then(function (selectedItem) {
//      $scope.selected = selectedItem;
//    });
    };

    $scope.editDayPart = function (targetDay, targetDayPart) {
        $modal.open({
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

//    modalInstance.result.then(function (selectedItem) {
//      $scope.selected = selectedItem;
//    });
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

var TimepickerCtrl = function ($scope, $log, dayStorage) {
//    var modalDay = $scope.modalDay;
//    var modalDayPart = $scope.modalDayPart;

    if ($scope.modalDayPart === null) {
        $scope.modalDayPart = new Part($scope.modalDay.date, $scope.modalDay.date);
//        var modalDayPart = $scope.modalDayPart;
        $scope.modalDay.parts.push($scope.modalDayPart);
    }
//
//    $scope.start = $scope.modalDayPart.start;
//    $scope.finish = $scope.modalDayPart.finish;
//    $scope.projectName = $scope.modalDayPart.projectName;

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.timeDifference =  timeMachine.calculateTimeDifference($scope.modalDayPart.start, $scope.modalDayPart.finish);

    $scope.changed = function () {
        if ($scope.finish < $scope.start) {
            alert("are you a time traveller?! finish should be after start!");
            $scope.difference = '?!!?!';
        } else {
//            $scope.modalDayPart.start = moment($scope.start);
//            $scope.modalDayPart.finish = moment($scope.finish);
//            $scope.modalDayPart.projectName = $scope.projectName;
            $scope.timeDifference = timeMachine.calculateTimeDifference($scope.modalDayPart.start, $scope.modalDayPart.finish);
            dayStorage.saveDay($scope.modalDay)
        }
    };
};

timeMachine.calculateTimeDifference = function(start, finish) {
    return (new Date(finish) - new Date(start)) / 36e5 || -1;
};
 