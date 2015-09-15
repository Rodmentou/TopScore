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


	$scope.attackPlayer = function () {
		alert("sUCH a Violent peRSON!");
	};


	socket.on('player:logged', function (player){
		$scope.me = player;
		console.log("Entrou");
	});

	socket.on('player:join', function (player) {
		$scope.players.push(player);
	});

	socket.on('players', function (players){
		console.log($scope.players);
		$scope.players = players;
			
	});




});

app.config( function ($routeProvider){
	$routeProvider
		.when('/play',
		{
			controller: 'PlayerController',
			templateUrl: '/partials/player.html'
		})
		.otherwise( { redirectTo: '/'});
});

