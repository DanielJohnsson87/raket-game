'use strict';
var Raket = Raket || {};
Raket.GameControll = (function() {

	var GameControll = function() {
		this.level = 1;
		this.lastLevelChange = Date.now();
	};


	/**
	 * nextLevel
	 * Sets the next level
	 */
	GameControll.prototype.nextLevel = function() {
		this.level += 1;
		this.lastLevelChange = Date.now();
	};

	GameControll.prototype.update = function() {
		if(Date.now() - this.lastLevelChange > 20000) {
			this.nextLevel();
		}
	}





	return new GameControll();

})();
