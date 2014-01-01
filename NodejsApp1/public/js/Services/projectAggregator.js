angular.module('timeMachine.services.projects', ['timeMachine.services.time'])
  .service('projectsService', function(timeDifference) {
    var flattenedDayParts = function(arr) {
      return _.flatten(_.map(arr, function(day) { return day.parts;}))
    }

    var aggregateFlattenedParts = function(days) {
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

    var halfDayAggregate = function(days) {
      var parts = aggregateFlattenedParts(days);
      var results = [];
      for(var i = 0, len = parts.length; i < len; i++) {
        var thisPart = parts[i];
          if(thisPart.total < 2) {
              continue;
          }

        var halfDays = thisPart.total / 3.5;
        var halfDays = Math.round(halfDays) * 3.5;
        if (halfDays != 0) {
          results.push({
            project: thisPart.project,
            total: halfDays
          });
        }
      }
      return results;
    }

    return {
      aggregate:aggregateFlattenedParts,
      halfDayAggregate:halfDayAggregate
    }
  });
