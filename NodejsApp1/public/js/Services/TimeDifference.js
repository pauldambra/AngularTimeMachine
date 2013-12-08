angular.module('TimeDifference', [])
    .service('timeDifference', function() {
        return {
            calculate: function(start, finish) {
                return (new Date(finish) - new Date(start)) / 36e5 || -1;
            }
        };
    });