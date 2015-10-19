'use strict';
if(typeof Raket === 'undefined') {
	var Raket = {};
}
Raket.Spaceship = (function() {

	var SpaceshipClass = function(settings) {

		if(typeof settings === 'undefined') {
			var settings = {};
		};


		this.canvas = Raket.Canvas.canvas;
		this.ctx = Raket.Canvas.ctx;
		this.position = {
			x: (typeof settings.x !== 'undefined') ? settings.x : 0,
			y: (typeof settings.y !== 'undefined') ? settings.y : 0
		};
		this.width = (typeof settings.width !== 'undefined') ? settings.width : 30;
		this.height = (typeof settings.height !== 'undefined') ? settings.height : 15;
		this.speed = (typeof settings.speed !== 'undefined') ? settings.speed : 5;
		this.isComputer = (typeof settings.isComputer === 'undefined' || settings.isComputer === false) ? false : true;
		this.lastShot = Date.now();
		this.dead = false;
	};

	SpaceshipClass.prototype.update = function() {

		//Check if we're dead or if we just died in this iteration
		if(this.dead || this.collisionCheck()) {
			this.die();
			return;
		}

		//Move the spaceship
		this.move();

	}


	/**
	 * Move the spaceship depending on what keys are pressed
	 * @param  {[type]} x [description]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	SpaceshipClass.prototype.move = function() {


		if(this.isComputer) {
			this.setPosition(-this.speed,0);
		} else {
			//Left
			if(Raket.Controls.keyMap[37] === true && this.position.x > 0) {
				this.setPosition(-this.speed,0);
			} 

			//Up
			if(Raket.Controls.keyMap[38] === true && this.position.y > 0) {
				this.setPosition(0,-this.speed);
			}
			//Right
			if(Raket.Controls.keyMap[39] === true && (this.position.x + this.width) < Raket.Canvas.width) {
				this.setPosition(this.speed,0);
			}

			//Down
			if(Raket.Controls.keyMap[40] === true && (this.position.y + this.height) < Raket.Canvas.height) {
				this.setPosition(0,this.speed);
			}

			//Spacebar
			if(Raket.Controls.keyMap[32] === true) {
				this.shoot();
			}

		}

	
		this.ctx.rect(this.position.x, this.position.y, this.width, this.height);
		this.ctx.fill();

	};


	SpaceshipClass.prototype.collisionCheck = function() {
		var terrainOffset = (Raket.Terrain.offset === 0) ? 0 : -Raket.Terrain.offset,
			canvasWidth = Raket.Canvas.width,

			//Spaceship bounds
			sPosX = Raket.Spaceship.position.x,
			sPosY = Raket.Spaceship.position.y,
			sTop = sPosX,
			sBottom = sPosY + Raket.Spaceship.height,
			sRight = sPosX + Raket.Spaceship.width,
			sLeft = sPosX,


			collision = false;


			var terrain = false;
			// If our x position + the current terrain offset is 
			// bigger then or eaqual to our canvas width our 
			// spaceship is still in the first terrain array
			if(sPosX + terrainOffset <= canvasWidth) {
				// The X coordinate + the current terrainOffset gives us the first array key 
				// to start checking agains.
				var key = sPosX + terrainOffset;
				//Get all terrain points from the spaceships X start pos and the entire width of the spaceship
				terrain = Raket.Terrain.terPoints.slice(key, key + Raket.Spaceship.width);
			} 

			// Else we should be in the second terrain array
			else {
				// The (X coordinate + the current terrainOffset) - our canvas with
				//  gives us the first array key to start checking agains.
				var key = (sPosX + terrainOffset) - canvasWidth;
				//Get terrain points
				terrain = Raket.Terrain.terPoints2.slice(key, key + Raket.Spaceship.width);
			}
				

			//Check all terrainpoints agains our current position.
			for(var i = 0; i < terrain.length; i++) {
				//If we touch a edge. Die! 
				if(sBottom >= terrain[i]) {
					console.log('dead', sBottom, terrain[i]);

					collision = true;
					break;
				}
			}


			return collision;

	}
 

	/**
	 * Set new coordinates for the spaceship Without moving it.
	 * @param {[type]} x [number to move the x coordinate by]
	 * @param {[type]} y [number to move the y coordinate by]
	 */
	SpaceshipClass.prototype.setPosition = function(x,y) {

		this.position = {
			x: this.position.x + x,
			y: this.position.y + y
		};

	};


	SpaceshipClass.prototype.shoot = function() {

		var newShot = Date.now(),
			timeSinceLastShot = newShot - this.lastShot;
		
		 
		if(timeSinceLastShot > 700) {
			var args = {
				x: this.position.x,
				y: this.position.y,
				speed: 5,
				width: 10,
				height: 5,
				direction: 'right'
			};
			Raket.Projectiles.createNew(args);
			this.lastShot = newShot;
		}
	};


	SpaceshipClass.prototype.die = function() {
		this.dead = true;
	};



	var spaceship = new SpaceshipClass();
	return spaceship;

})();