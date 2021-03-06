'use strict';
var Raket = Raket || {};
Raket.Spaceship = (function() {

	var SpaceshipClass = function(settings) {

		if(typeof settings === 'undefined') {
			var settings = {};
		};


		this.canvas = Raket.Canvas.canvas;
		this.ctx = Raket.Canvas.ctx;
		this.backgroundImage = null;
		this.position = {
			x: (typeof settings.x !== 'undefined') ? settings.x : 0,
			y: (typeof settings.y !== 'undefined') ? settings.y : 0
		};
		this.width = (typeof settings.width !== 'undefined') ? settings.width : 30;
		this.height = (typeof settings.height !== 'undefined') ? settings.height : 30;
		this.speed = (typeof settings.speed !== 'undefined') ? settings.speed : 7;
		this.lastShot = Date.now();
		this.dead = false;

		this.setBackground();

	};

	/**
	 * update
	 * functions to run every animation frame
	 * @return {[type]} [description]
	 */
	SpaceshipClass.prototype.update = function() {

		//Report the spaceships position with every update
		Raket.CollisionControl.reportPosition(this);

		//Check if we're dead or if we just died in this iteration
		if(this.dead || this.collisionCheck()) {
			console.log('dead');
			this.destroy();
			Raket.GameLoop.halt();
			return;
		}

        if(null !== this.backgroundImage) {
            this.ctx.drawImage(this.backgroundImage, this.position.x, this.position.y, this.width, this.height);
        } else {
            this.setBackground();
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


	};

	SpaceshipClass.prototype.setBackground = function () {
        var blueprint_background = new Image(),
			that = this;
        blueprint_background.src = 'img/spaceship.png';

        console.log(that.position.x,that.position.y);
        blueprint_background.onload = function(){
        	that.backgroundImage = this;
        };
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

			spread = Raket.Terrain.spread,


			collision = false;

			//console.log((sPosX + terrainOffset));
			var terrain = false;
			// If our right position + the current terrain offset is 
			// bigger then or eaqual to our canvas width our 
			// spaceship is still in the first terrain array
			// This isn't ideal. Since we the sLeft part of the spaceship
			// could still be in the first array when sRight is in the second.
			if((sRight + terrainOffset) <= canvasWidth) {

				// The X coordinate + the current terrainOffset gives divided by the spread (distance between lines) 
				// gives us the first array key to start checking agains.
				var key = Math.round((sPosX+ terrainOffset) / spread);

				//Get all terrain points from the spaceships X start pos and the entire width of the spaceship
				//The width of the spaceship must be divided by the spread to make shure we get the right amount of points
				terrain = Raket.Terrain.terPoints.slice(key, key + (Raket.Spaceship.width/spread));
			} 

			// Else we should be in the second terrain array
			else {
				// The (X coordinate + the current terrainOffset) - our canvas with / bye the spread
				//  gives us the first array key to start checking agains.
				var key = Math.round((sPosX+ terrainOffset - canvasWidth) / spread),
					nrToGet = key + Math.round(Raket.Spaceship.width/spread);
					
				//Get terrain points
				terrain = Raket.Terrain.terPoints2.slice(key,nrToGet);

			}
				

			//Check all terrainpoints agains our current position.
			for(var i = 0; i < terrain.length; i++) {
				//If we touch an edge. Die!
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
		
		 
		if(timeSinceLastShot > 500) {
			var args = {
				x: this.position.x + this.width + this.speed+2,
				y: this.position.y,
				speed: this.speed+2,
				width: 10,
				height: 5,
				direction: 'right'
			};
			Raket.Projectiles.createNew(args);
			this.lastShot = newShot;
		}
	};


	SpaceshipClass.prototype.destroy = function() {
		this.dead = true;
	};



	var spaceship = new SpaceshipClass();
	return spaceship;

})();