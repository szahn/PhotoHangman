var game = angular.module('game', []);

var GameFunctions = function(){

}

GameFunctions.prototype.start = function(){
	this.scenes = this.buildScenes();	
	this.game = this.buildNewGame();
	this.scene = this.scenes[this.game.scene];	
	this.letters = this.getLetters();
}

GameFunctions.prototype.buildScenes = function(){
	var scenes = [{city: "philadelphia", photo: "philadelphia-liberty-hall.png", 
			hints: ["A historic city on the east coast"]},
		{city:"pasadena", photo:"pasadena.png", 
			hints: ["Its located in Greater Los Angeles", "In the San Gabriel Valley"]},
		{city:"seattle", photo:"seattle.png", 
			hints: ["Home of the space needle"]},
		{city:"santa barbara", photo:"santa-barbara.png", 
			hints: ["It's considered a major college party town", "By the pacific ocean"]}];	

	return scenes;
}

GameFunctions.prototype.buildNewGame = function(){
	var startscene = Math.round(Math.random() * (this.scenes.length - 1));
	var game = {
		scene: startscene,
		score: 0
	};

	return game;
}

GameFunctions.prototype.areAllLettersCorrect =  function(){
	for (i = 0; i < this.letters.length; i++){
		var letter = this.letters[i];
		if (!letter.isCorrect()){
			return false;
		}
	}

	return true;
}

GameFunctions.prototype.nextscene =  function(){
	this.game.scene = (this.game.scene == this.scenes.length - 1) 
		? 0 : 1 + this.game.scene;
	this.scene = this.scenes[this.game.scene];	
	this.letters = this.getLetters();	
}

GameFunctions.prototype.getLetters = function(){
	var cityName = this.scene.city;
	var letters = new Array();
	var cityNameLength = cityName.length;
	var maxModifier = Math.round(cityNameLength  * 0.5);
	var minModifier =Math.round(cityNameLength * 0.3);
	var modifier = Math.round((Math.random() * (maxModifier - minModifier)) + minModifier);

	var offset = Math.round(Math.random() * (2 - 0) + 0);
	for (index = 0; index < cityNameLength; index++){
		var letter =cityName.charAt(index);
		var character;
		if (letter == ' '){
			character = '';
			letter = '';
		}
		else{
			character = ((offset + index) % modifier == 0)  ? letter : '';
		}

		letters.push({position: index,
			character: character,
			correctCharacter: letter,
			changed: false,
			isCorrect: function(){
				return this.character == this.correctCharacter;
			}});
	}	

	return letters;
}

game.controller('mainController', function($scope){

	var gameFunctions = new GameFunctions();
	gameFunctions.start();
	$scope.scenes = gameFunctions.scenes;
	$scope.game = gameFunctions.game;
	$scope.scene = gameFunctions.scene;	
	$scope.letters = gameFunctions.letters;

	function nextScene(){
		$("#hint").hide();
		gameFunctions.nextscene();
		$scope.game = gameFunctions.game;
		$scope.scene = gameFunctions.scene;	
		$scope.letters = gameFunctions.letters;
	}

	$scope.letterChanged = function(letter){
		letter.changed = true;
		var score = letter.isCorrect() ? 1 : -2;
		$scope.game.score += score;
		if (gameFunctions.areAllLettersCorrect()){
			nextScene();
		}
		else{
			if (letter.isCorrect()){
				var nextClass = ".letter" + (parseInt(letter.position) + 1);
				$(nextClass).focus();
			}
		}
	};

	$scope.getLetterClass = function(letter){
		if (letter.changed) {
			return letter.isCorrect() ? 'correct' : 'incorrect'
		}
		else{
			return 'indeterminate';
		}
	};

	$scope.hint = function(){
		var hint = gameFunctions.scene.hints.pop();
		if (typeof hint == "undefined"){
			$("#hint").show();
			$("#hint-text").html("Sorry, no more hints available.");
			$("#hint").addClass("alert-warning");
			$("#hint").removeClass("alert-info");
			return;
		}

		$scope.game.score -= 1;

		$("#hint").show();
		$("#hint").removeClass("alert-warning");
		$("#hint").addClass("alert-info");
		$("#hint-text").html(hint);
	};

	$scope.skipScene = function(){
		nextScene();
	};

});