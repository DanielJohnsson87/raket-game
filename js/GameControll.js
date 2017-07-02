'use strict';
var Raket = Raket || {};
Raket.GameControll = (function() {

	var scoreElement = document.getElementById('score');
	scoreElement.innerHTML = 0;

	var GameControll = function() {
		this.level = 1;
		this.lastLevelChange = Date.now();
		this.enemiesKilled = 0;
		this.enemiesMissed = 0;
		this.score = 0; 
	};


	/**
	 * nextLevel
	 * Sets the next level
	 */
	GameControll.prototype.nextLevel = function() {
		this.level += 1;
		this.lastLevelChange = Date.now();
	};

	/**
	 * Functions to run every update cycle
	 */
	GameControll.prototype.update = function() {
		//If more than 20 seconds have passed, set next level
		if(Date.now() - this.lastLevelChange > 20000) {
			this.nextLevel();
		}
	};
	/**
	 * Increment enemies killed
	 */
	GameControll.prototype.enemyKilled = function() {
		this.enemiesKilled++;
		this.calcScore(10);
	};

	/**
	 * Increment enemies missed
	 */
	GameControll.prototype.enemyMissed = function() {
		this.enemiesMissed++;
		// this.calcScore(-10);
	};

	GameControll.prototype.calcScore = function(value) {
		// console.log('calc', value, this.score, this.level);
		this.score = this.score + (this.level * value);
		scoreElement.innerHTML = this.score;
	};




	return new GameControll();

})();
