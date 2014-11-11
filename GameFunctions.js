var GameFunctions = function(scenes){
	this.scenes = scenes;
}

GameFunctions.prototype.start = function(){
	this.game = this.buildNewGame();
	this.scene = this.scenes[this.game.scene];	
	this.letters = this.getLetters();		
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
	var correctCount = 0;
	_.each(this.letters, function(letter){
		if (letter.isCorrect()){
			correctCount +=1;
		}
	});

	return correctCount == this.letters.length;
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