var databaseUrl = 'angularTimeMachine';
var collections = ['projects','dayParts'];
exports.database = require('mongojs')
  .connect(databaseUrl, collections);
