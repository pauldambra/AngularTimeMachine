window.timeMachine = angular.module('timeMachine', ['ui.bootstrap', 'DayStorage']);

function DaysCtrl($scope,  $modal, dayStorage) {

    var setFocusMonday = function(focus) {
        $scope.focusMonday = focus;
        $scope.days = dayStorage.getWeek(focus).days;
    }

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

var TimepickerCtrl = function ($scope) {
    $scope.start = new Date().setMinutes(0, 0, 0);
    $scope.finish = new Date().setMinutes(0, 0, 0);
    $scope.difference = 0;
    
    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.changed = function () {
        if ($scope.finish < $scope.start) {
            alert("are you a time traveller?! finish should be after start!");
            $scope.difference = '?!!?!';
        } else {
            $scope.difference = ($scope.finish - $scope.start) / 36e5;    
        }
    };
};
 