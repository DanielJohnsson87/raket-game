'use strict';
var Raket = Raket || {};
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
			y: Math.floor(Math.random() * 300) + 1, //Set semi random y position
			speed:5,
			width:20,
			height:20,
			direction:'left'
		};

		//Create a new projectile instance and add it to the enemystore
		var newEnemy = new Raket.Projectiles.getInstance(args);
		EnemyStore.push(newEnemy);
	}

	/**
	 * Move all enemies by their speed.
	 * Remove them when they are out of bounds
	 * @return {[type]} [description]
	 */
	EnemyControllClass.prototype.update = function() {
		var nrOfEnemies = Raket.GameControll.level;
		for(var i = 0; i < EnemyStore.length; i++) {
			var enemy = EnemyStore[i],
				canvasWidth = Raket.Canvas.width,
				flightData = Raket.CollisionControl.reportPosition(enemy); //Report each enemies position with every update

			//If the enemy is out of bounds, remove it. 
			//Else move it 1 step forward
			if(enemy.position.x <  -enemy.width || enemy.dead) {
				EnemyStore.splice(i,1);
			} else {

				var moveY = flightData.pxToGround < 30 ? -enemy.speed : 0;

				enemy.move(0,moveY);
				enemy.shoot();
			}
		}


		if(EnemyStore.length < nrOfEnemies) {
			console.log('new');
			this.createNew();
		}

	}



	EnemyControllClass.prototype.getAll = function() {
		console.log('enemy store', EnemyStore);
	}





	//Return a function for creating new enemys
	return new EnemyControllClass();

})();