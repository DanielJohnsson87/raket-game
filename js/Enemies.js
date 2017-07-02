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
			width:40,
			height:40,
			direction:'left',
			type: 'enemy'
		};

		//Create a new projectile instance and add it to the enemystore
		var newEnemy = new Raket.Projectiles.getInstance(args);
		EnemyStore.push(newEnemy);

	};


	/**
	 * Move all enemies by their speed.
	 * Remove them when they are out of bounds
	 */
	EnemyControllClass.prototype.update = function() {
		var nrOfEnemies = Raket.GameControll.level;
		for(var i = 0; i < EnemyStore.length; i++) {
			var enemy = EnemyStore[i],
				canvasWidth = Raket.Canvas.width,
				flightData = Raket.CollisionControl.reportPosition(enemy); //Report each enemies position with every update

			//If the enemy is out of bounds, remove it and tell GameControll that a enemy survided. 
			if(enemy.position.x <  -enemy.width) {
				Raket.GameControll.enemyMissed();
				EnemyStore.splice(i,1);
			} 
			//If the enemy is dead, it has been killed. Tell GameControll and remove it
			else if(enemy.dead) {
				Raket.GameControll.enemyKilled();
				EnemyStore.splice(i,1);
			} 
			//Else it's alive. Move the enemy forward and try tro fire
			else {
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