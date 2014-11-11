var game = angular.module('game', []);

game.factory('sceneService', function($http, $q){
	return {
		getScenes: function(){
			var deferred = $q.defer();
			$http({method: 'GET', url: 'scenes.json', responseType: "json"})
				.success(function(data){
					deferred.resolve(data);
			});

			return deferred.promise;
		}
	};

});

game.controller('mainController', function($scope, sceneService){

	$scope.getScenes = function(){
		sceneService.getScenes().then(function(scenes){
			var gameFunctions = new GameFunctions(scenes);
			gameFunctions.start();
			$scope.scenes = gameFunctions.scenes;
			$scope.game = gameFunctions.game;
			$scope.scene = gameFunctions.scene;	
			$scope.letters = gameFunctions.letters;
			$("#gameboard").show();
			$("#intro").hide();

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
	};

});