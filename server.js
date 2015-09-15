var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io')(server);


var port = process.env.PORT || 8080;
var env = process.env.NODE_ENV || 'dev';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan(env));
app.use(express.static(__dirname + '/public'));

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

var players = [];



io.on('connection', function(socket){

 	socket.on('add player', function (playerName) {
	    socket.player = {};
	    var player = {
	    	name: playerName,
	    	hp: 100,
	    	exp: 0,
	    	gold: 20,
	    	level: 1,
	    	atk: 10
	    };
	    players.push(player);

	    socket.emit('player:logged', player);
	    console.log(players);
		if (players.length > 0){
			io.emit('players', players);
		};
  	});

});





server.listen(port, function () {
	console.log('Server running in ' + env + ' at ' + port + '.');
})