'use strict';
if(typeof Raket === 'undefined') {
	var Raket = {};
}
Raket.Projectiles = (function() {

	//Store all projectiles here
	var ProjectileStore = [];

	/**
	 * The class that handles every single projectile.
	 * Args = {
	 * 		x = int
	 *   	y = int
	 *    	speed = int
	 *     	width = int 
	 *      height = int
	 *      direction = string | 'left', 'rigth', 'up', 'down'
	 * }
	 * 
	 */
	var ProjectileClass = function(args) {

		this.canvas = Raket.Canvas.canvas;
		this.ctx = Raket.Canvas.ctx;
		this.position = {
			x:args.x,
			y:args.y
		};
		this.speed = (typeof args.speed !== 'undefined') ? args.speed : 5;
		this.direction = (!typeof args.direction !== 'undefined') ? args.direction : 'right';
		this.width = (!typeof args.width !== 'undefined') ? args.width : 10;
		this.height = (!typeof args.height !== 'undefined') ? args.height : 10;

		/*
		console.log('dir?', x,y,speed,width,height,direction);
		this.canvas = Raket.Canvas.canvas;
		this.ctx = Raket.Canvas.ctx;
		this.position = {
			x:x,
			y:y
		};
		this.speed = (!typeof speed === 'undefined') ? speed : 5;
		this.direction = (!typeof direction === 'undefined') ? direction : 'right';
		this.width = (!typeof width === 'undefined') ? width : 10;
		this.height = (!typeof height === 'undefined') ? height : 10;
		*/

	};


	/**
	 * Move the spaceship depending on what keys are pressed
	 */
	ProjectileClass.prototype.move = function() {


		switch(this.direction) {
			case 'left':
				this.position.x = this.position.x - this.speed;
				break;

			case 'right':
				this.position.x = this.position.x + this.speed;
				break;

			case 'up':
				this.position.y = this.position.y - this.speed;
				break;

			case 'down':
				this.position.y = this.position.y + this.speed;
				break;
		}

		this.ctx.rect(this.position.x, this.position.y, this.width, this.height);
		this.ctx.fill();

	};


	/**
	 * The class responsible for controlling the projectiles
	 */
	var ProjectileControllClass = function() {

	};

	ProjectileControllClass.prototype.createNew = function(args) {
	
		var newProjectile = new ProjectileClass(args);
		ProjectileStore.push(newProjectile);
	}


		//Return a new instance of the SpaceshipClass
	ProjectileControllClass.prototype.getInstance = function(args) {
		return new ProjectileClass(args);
	}


	/**
	 * Move all projectiles by their speed.
	 * Remove them when they are out of bounds
	 * @return {[type]} [description]
	 */
	ProjectileControllClass.prototype.update = function() {
		for(var i = 0; i < ProjectileStore.length; i++) {
			var projectile = ProjectileStore[i],
				canvasWidth = Raket.Canvas.width;

			//If the projectile is out of bounds, remove it. 
			//Else move it 1 step forward
			if(projectile.position.x > canvasWidth + projectile.width) {
				ProjectileStore.splice(i,1);
			} else {
				projectile.move();
			}

		}
	}




	ProjectileControllClass.prototype.getAll = function() {
		console.log('projectile store', ProjectileStore);
	}




	//Return a function for creating new projectiles
	return new ProjectileControllClass();

})();