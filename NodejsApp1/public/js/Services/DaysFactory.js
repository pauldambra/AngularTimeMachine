var dayStorage = angular.module('DayStorage', ['LocalStorageModule']);
dayStorage.factory('dayStorage', function($log) {

    var dayLoader = function(focusMonday) {
        $log.info(focusMonday);
        return {
            days : [
                {
                    name: 'Monday',
                    dayDate: moment()
                },
                {
                    name: 'Tuesday',
                    dayDate: moment()
                },
                {
                    name: 'Wednesday',
                    dayDate: moment()
                },
                {
                    name: 'Thursday',
                    dayDate: moment()
                },
                {
                    name: 'Friday',
                    dayDate: moment()
                }
            ]};
    }

    return {dayLoader: dayLoader};
});