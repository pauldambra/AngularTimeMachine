angular.module('timeMachine.services.time', [])
    .service('timeDifference', function() {
        return {
            calculate: function(start, finish) {
                return (!start || ! finish)
                    ? -1
                    : (new Date(finish) - new Date(start)) / 36e5 || -1;
            }
        };
    });
