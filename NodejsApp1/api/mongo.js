var databaseUrl = 'angularTimeMachine';
var collections = ['projects','days'];
exports.database = require('mongojs')
  .connect(databaseUrl, collections);
