var app = angular.module('topScore', ['ngRoute']);




app.controller('MainController', function ($scope){

	

});

app.controller('PlayerController', function ($scope) {
	$scope.name = 'Nameless';

	
});

app.config( function ($routeProvider){
	$routeProvider
		.when('/',
		{
			controller: 'PlayerController',
			templateUrl: '/partials/player.html'
		})
		.otherwise( { redirectTo: '/'});
});

var socket = io();