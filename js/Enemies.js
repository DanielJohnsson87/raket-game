'use strict';
if(typeof Raket === 'undefined') {
	var Raket = {};
}
Raket.Enemies = (function() {

	var EnemyStore = [];

	
	/**
	 * The class responsible for controlling the enemies
	 */
	var EnemyControllClass = function() {

	};

	EnemyControllClass.prototype.createNew = function() {
		
		var args = {
			x:Raket.Canvas.width + 20,
			y: Math.floor(Math.random() * 200) + 1, //Set a number between 1-200
			speed:3,
			width:20,
			height:20,
			direction:'left'
		};

		var newEnemy = new Raket.Projectiles.getInstance(args);

		EnemyStore.push(newEnemy);
	}

	/**
	 * Move all enemies by their speed.
	 * Remove them when they are out of bounds
	 * @return {[type]} [description]
	 */
	EnemyControllClass.prototype.update = function() {
		for(var i = 0; i < EnemyStore.length; i++) {
			var enemy = EnemyStore[i],
				canvasWidth = Raket.Canvas.width;

			//If the enemy is out of bounds, remove it. 
			//Else move it 1 step forward
			if(enemy.position.x > canvasWidth + enemy.width) {
				EnemyStore.splice(i,1);
			} else {
				enemy.move();
			}

		}
	}




	EnemyControllClass.prototype.getAll = function() {
		console.log('enemy store', EnemyStore);
	}




	//Return a function for creating new enemys
	return new EnemyControllClass();

})();