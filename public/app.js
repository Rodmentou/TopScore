var app = angular.module('topScore', ['ngRoute']);




app.controller('MainController', function ($scope){

	

});

app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.controller('PlayerController', function ($scope, socket) {
	$scope.connected = false;
	$scope.players = [];


	$scope.login = function (playerName) {
		if (!$scope.connected) {
					delete $scope.playerName;
			if (playerName) {
				socket.emit('add player', playerName);
				$scope.connected = true;
			};
		};

	};

	$scope.changeMap = function (mapID){

	};

	$scope.attackMonster = function (monsterID) {

	};


	$scope.attackPlayer = function (player) {
		if ($scope.lastAttackTime){
			var attackCoolDown = Date.now() - $scope.lastAttackTime;
		} else {
			var attackCoolDown = 5000;
		};


		if(player.playerName == $scope.me.name) {
			alert("You cant attack yourself!");
		} else if (attackCoolDown < 5000){
			alert("You need to wait " + (5 - attackCoolDown/1000) + " seconds.");
		} else {
			$scope.lastAttackTime = Date.now();
			var players = {};
			players.atk = $scope.me;
			players.def = player;
			socket.emit('attack player', players);
			alert("Atacked");
		};
	};


	socket.on('player:logged', function (player){
		$scope.me = player;
		console.log("Entrou");
	});

	socket.on('player:join', function (player) {
		$scope.players.push(player);
	});

	socket.on('players', function (players){
		$scope.players = players;
		for(var i=0; i < players.length; i++){
  			if (players[i].name == $scope.me.name){
  				console.log(players[i]);
  				$scope.me = players[i];
  			};
  		};
	});




});

app.config( function ($routeProvider){
	$routeProvider
		.when('/play',
		{
			controller: 'PlayerController',
			templateUrl: '/partials/player.html'
		})
		.otherwise( { redirectTo: '/play'});
});

