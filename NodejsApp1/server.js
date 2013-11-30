var connect = require('connect');
var http = require('http');
var port = process.env.port || 1337;

connect()
   .use(connect.static(__dirname + '/public'))
   .listen(port);