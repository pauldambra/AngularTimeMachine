angular.module('DayStorage', ['LocalStorageModule'])
    .factory('dayStorage', function($log, localStorageService) {

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
        localStorageService.add(dayDate.unix(),day);
    };

    return {getWeek: getWeek, saveDay : saveDay};
});

Day = function(dayDate) {
    return   {
        date: moment(dayDate).hours(0).minutes(0).seconds(0).milliseconds(0).toDate(),
        parts: []
    }
};

Part = function(start, finish) {
    this.start = moment(start).hours(0).minutes(0).seconds(0).milliseconds(0);
    this.finish = moment(finish).hours(0).minutes(0).seconds(0).milliseconds(0);
    this.projectName = "";
}
