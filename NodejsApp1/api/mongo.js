var databaseUrl = 'angularTimeMachine'; // "username:password@example.com/angularTimeMachine"
var collections = ['projects','dayParts'];
var db = require('mongojs').connect(databaseUrl, collections);

exports.projectById = function(id) {
    db.projects.find({id: id}, function(err,projects) {
        console.log('searching');
        if( err || !projects) console.log("No matching project found for " + id);
        else projects.forEach( function(project) {
            console.log(project);
        } );
    });
}