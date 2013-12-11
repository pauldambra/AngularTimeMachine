angular.module('ProjectNameStorage', ['LocalStorageModule'])
    .factory('projectNameStorage', function($log, localStorageService) {
        var key = 'projectNames';

    var getFilteredNames = function(term) {
        var names = localStorageService.get(key);
        var filteredNames = _.filter(names, function(name) {
            var index = name.toLowerCase().indexOf(term.toLowerCase());
            return index >= 0;
        })
        return filteredNames;
    };

    var addOrIgnoreNames = function(newNames) {
        var names = localStorageService.get(key);
        if (names == null) {
            localStorageService.add(key, newNames);
            return;
        }

        for(var i = 0, len = newNames.length; i<len; i++) {
            var newName = newNames[i];
            if (names.indexOf(newName) < 0) {
                names.push(newName);
            }
        }
        localStorageService.add(key, names);
    }

    return {getFilteredNames: getFilteredNames, addOrIgnoreNames: addOrIgnoreNames};
});