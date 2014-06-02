'use strict';

var dbname = process.env.DBNAME; // pulls from the command line
var port = process.env.PORT || 4000;

var traceur        = require('traceur');
var express        = require('express');
var less           = require('express-less');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cookieSession  = require('cookie-session');
var initMongo      = traceur.require(__dirname + '/lib/init-mongo.js');
var initRoutes     = traceur.require(__dirname + '/lib/init-routes.js');

/* --- configuration    */
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/* --- pipeline         */
app.use(initMongo.connect);
app.use(initRoutes);
app.use(morgan({format: 'dev'})); // logging
app.use(express.static(__dirname + '/static'));
app.use('/less', less(__dirname + '/less'));
app.use(bodyParser()); // pulls stuff out of req.body and turns it into an object
app.use(methodOverride()); // overrides a method (can turn POST into DELETE)
app.use(cookieSession({keys:['SEC123', '321CES']})); // cookie config

/* --- http server      */
var server = require('http').createServer(app);
server.listen(port, function(){
  console.log('Node server listening. Port: ' + port + ', Database: ' + dbname);
});

/* --- socket.io        */
var sockets = traceur.require(__dirname + '/lib/sockets.js');
var io = require('socket.io').listen(server, {log:true, 'log level':2});
io.of('/app').on('connection', sockets.connection);

module.exports = app;
