angular.module('DayUtilities', ['TimeDifference'])
    .service('dayUtilities', function(timeDifference) {
        var calculateDifference = function(part) {
            return timeDifference.calculate(part.start, part.finish);
        };

        var calculateDayTotal = function(day) {
            var total = 0;
            for(var i = 0, len = day.parts.length; i<len; i++) {
                var part = day.parts[i];
                var diff = calculateDifference(part);
                if (diff > -1) {
                    total += diff;
                }
            }
            return total;
        }

        return {
            dayPartLength: function(dayPart) {
                var timeDifference = calculateDifference(dayPart);
                return timeDifference + ' hours';
            },
            dayTotal: function(day) {
                var total = calculateDayTotal(day);
                return total + ' hours';
            },
            weekTotal: function(days) {
                var total = 0;
                for(var i = 0, len = days.length; i < len; i++) {
                    total += calculateDayTotal(days[i]);
                }
                return total;
            }
        };
    });