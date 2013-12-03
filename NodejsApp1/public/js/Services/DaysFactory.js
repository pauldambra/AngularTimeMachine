var dayStorage = angular.module('DayStorage', ['LocalStorageModule']);
dayStorage.factory('dayStorage', function($log) {

    var dayLoader = function(focusMonday) {
        $log.info(focusMonday);
        var monday = moment(focusMonday);
        var tuesday = moment(focusMonday).add('d', 1);
        $log.info(monday);
        $log.info(tuesday);

        return {
            days : [
                {
                    name: 'Monday',
                    date: moment(focusMonday).toDate()
                },
                {
                    name: 'Tuesday',
                    date: moment(focusMonday).add('d', 1).toDate()
                },
                {
                    name: 'Wednesday',
                    date: moment(focusMonday).add('d', 2).toDate()
                },
                {
                    name: 'Thursday',
                    date: moment(focusMonday).add('d', 3).toDate()
                },
                {
                    name: 'Friday',
                    date: moment(focusMonday).add('d', 4).toDate()
                }
            ]};
    };

    return {dayLoader: dayLoader};
});