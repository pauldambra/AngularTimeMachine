var dayStorage = angular.module('DayStorage', ['LocalStorageModule']);
dayStorage.factory('dayStorage', function($log) {

    var getWeek = function(focusMonday) {
        $log.info('loading days for ' + moment());
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

    return {getWeek: getWeek};
});