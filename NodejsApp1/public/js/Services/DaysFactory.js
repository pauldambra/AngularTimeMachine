var dayStorage = angular.module('DayStorage', ['LocalStorageModule']);
dayStorage.factory('dayStorage', function($log, localStorageService) {

    var getWeek = function(focusMonday) {
        $log.info('loading days for ' + moment());

        var thisWeek = [];

        for (var i = 0, upper = 4; i <= upper; i++) {
            var thisDayDate = moment(focusMonday).add('d', i);
            $log.info('testing for '+thisDayDate.unix());
            var storedDay = localStorageService.get(thisDayDate.unix());
            thisWeek[i] = storedDay || new Day(thisDayDate);
        }

        return {
            days : thisWeek
        };
    };

    var saveDay = function(day) {

        var dayDate = moment(day.date);
        $log.info('saving '+ dayDate.unix());
        localStorageService.add(dayDate.unix(),day);
    };

    return {getWeek: getWeek, saveDay : saveDay};
});

Day = function(dayDate) {
    return   {
        date: dayDate.hours(0).minutes(0).seconds(0).milliseconds(0).toDate(),
        parts: [],
        morning: {
            start:moment(dayDate.hours(0).minutes(0).seconds(0).milliseconds(0)),
            finish:moment(dayDate.hours(0).minutes(0).seconds(0).milliseconds(0))
        },
        afternoon: {
            start:moment(dayDate.hours(0).minutes(0).seconds(0).milliseconds(0)),
            finish:moment(dayDate.hours(0).minutes(0).seconds(0).milliseconds(0))
        }
    }
};

Part = function(start, finish) {
    this.start = moment(start).hours(0).minutes(0).seconds(0).milliseconds(0);
    this.finish = moment(finish).hours(0).minutes(0).seconds(0).milliseconds(0);
    this.projectName = "";
}