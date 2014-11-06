var game = angular.module('game', []);
game.controller('mainController', function($scope){
	var locations = [{city: "philadelphia", photo: "philadelphia-liberty-hall.png"},
		{city:"pasadena", photo:"pasadena.png"},
		{city:"seattle", photo:"seattle.png"},
		{city:"santa barbara", photo:"santa-barbara.png"}];
	$scope.locations = locations;
	
	var game = {
		location: 0,
		score: 0
	};

	$scope.game = game;

	var location = locations[game.location];
	$scope.location = location;	
	
	var letters = new Array();
	var cityNameLength = location.city.length;
	var maxModifier = Math.round(cityNameLength  * .75); //50
	var minModifier =Math.round(cityNameLength * .25);
	var modifier = Math.round((Math.random() * (maxModifier - minModifier)) + minModifier);

	var offset = Math.round(Math.random() * (2 - 0) + 0);
	for (index = 0; index < cityNameLength; index++){
		var character = ((offset + index) % modifier == 0)  ? location.city.charAt(index) : '';
		letters.push({position: index,
			character: character});
	}

	$scope.letters = letters;

});