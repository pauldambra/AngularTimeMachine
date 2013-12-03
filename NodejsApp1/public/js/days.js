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

    $scope.dayPartText = function (day, dayPart) {
        var calculateTimeDifference = timeMachine.calculateTimeDifference(day[dayPart].start, day[dayPart].finish);
        return calculateTimeDifference === -1
            ? dayPart
            : calculateTimeDifference + ' hours';
    };

    function calculateDayTotal(day) {
        var morning = timeMachine.calculateTimeDifference(day.morning.start, day.morning.finish);
        var afternoon = timeMachine.calculateTimeDifference(day.afternoon.start, day.afternoon.finish);
        var total = 0;
        if (morning !== -1) {
            total += morning;
        }
        if (afternoon !== -1) {
            total += afternoon;
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

    $scope.open = function (targetDay, targetDayPart) {
        $modal.open({
            templateUrl: 'dayModalTemplate.html',
            controller: ModalInstanceCtrl,
            resolve: {
                modalDayPart: function() {
                    return targetDayPart;
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
    var modalDay = $scope.modalDay;
    var modalDayPart = $scope.modalDayPart;

    if (!modalDay.hasOwnProperty(modalDayPart)) {
        $log.warn('the day does not have a ' + modalDayPart + ' property');
        return;
    }

    $scope.start = modalDay[modalDayPart].start;
    $scope.finish = modalDay[modalDayPart].finish;

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.timeDifference =  timeMachine.calculateTimeDifference($scope.start, $scope.finish);

    $scope.changed = function () {
        if ($scope.finish < $scope.start) {
            alert("are you a time traveller?! finish should be after start!");
            $scope.difference = '?!!?!';
        } else {
            $scope.modalDay[$scope.modalDayPart].start = moment($scope.start);
            $scope.modalDay[$scope.modalDayPart].finish = moment($scope.finish);
            dayStorage.saveDay($scope.modalDay)
        }
    };
};

timeMachine.calculateTimeDifference = function(start, finish) {
    return (new Date(finish) - new Date(start)) / 36e5 || -1;
};
 