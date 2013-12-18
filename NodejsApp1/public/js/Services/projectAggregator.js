angular.module('timeMachine.services.projects', ['timeMachine.services.time'])
  .service('projectsService', function(timeDifference) {
    var flattenedDayParts = function(arr) {
      return _.flatten(_.map(arr, function(day) { return day.parts;}))
    }

    return {
      aggregate:function(days) {
        var projects = _.groupBy(flattenedDayParts(days), 'projectName');
        var projectSums = _.map(projects, function(value, key) {
          var partsTotal = _.reduce(value, function(memo, part){
            var calc = timeDifference.calculate(part.start, part.finish);
            return calc == -1 ? memo : memo + calc;
          }, 0);
          return {project:key, total:partsTotal};
        });
        return _.sortBy(projectSums, function(item) {
          return item.project;
        });
      }
    }
  });
