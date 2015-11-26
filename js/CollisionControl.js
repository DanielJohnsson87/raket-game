'use strict';
var Raket = Raket || {};
Raket.CollisionControl = (function() {

	var objectStore = {};

	var CollisionClass = function() {
	};


	/**
	 * reportPosition
	 * Adds the object to the objectStore and checks for collisions.
	 * Every pixle of the canvas a object occupies get's stored in the objectStore.
	 * If a key is already occupied, there is a collision and this function
	 * calls the object destroy function.
	 */
	CollisionClass.prototype.reportPosition = function(obj) {
		if(typeof obj.position === 'undefined') {
			return false;
		}

		var groundProximity = this.getGroundProx(obj);

		if(groundProximity.collision) {
			obj.destroy();
			return groundProximity;
		}

		//Loop the width of the object to get all X coordinates of the object
		for(var i = 0; i < obj.width; i++) {

			// Get the X Coordinate for this iteration
			// Then Loop the height of the object to get all Y coordinates of the object
			var xCoords = (obj.position.x + i) + '.' + obj.position.y; 
			for(var y = 0; y < obj.height; y++) {

				//Create the x.y coordinate
				var coords = (obj.position.x + i) + '.' + (obj.position.y + y);

				// If the coordinate mapping already exists, it's a collision
				// Destroy both co
				if(objectStore[coords]) {
					obj.destroy();
					objectStore[coords].destroy();
				} else {
					objectStore[coords] = obj;
				} 
			}

		}


		//Return the groundProximity object to enable the object to change their trajectory
		return groundProximity;

	};



	CollisionClass.prototype.getGroundProx = function(obj) {
		var terrainOffset = (Raket.Terrain.offset === 0) ? 0 : -Raket.Terrain.offset,
			canvasWidth = Raket.Canvas.width,

			//Spaceship bounds
			sPosX = obj.position.x,
			sPosY = obj.position.y,
			sTop = sPosX,
			sBottom = sPosY + obj.height,
			sRight = sPosX + obj.width,
			sLeft = sPosX,

			spread = Raket.Terrain.spread,

			res = {
				collision: false,
				pxToGround: false
			};

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
				terrain = Raket.Terrain.terPoints.slice(key, key + (obj.width/spread));
			} 

			// Else we should be in the second terrain array
			else {
				// The (X coordinate + the current terrainOffset) - our canvas with / bye the spread
				//  gives us the first array key to start checking agains.
				var key = Math.round((sPosX+ terrainOffset - canvasWidth) / spread),
					nrToGet = key + Math.round(obj.width/spread);
					
				//Get terrain points
				terrain = Raket.Terrain.terPoints2.slice(key,nrToGet);

			}
				

			//Check all terrainpoints agains our current position.
			for(var i = 0; i < terrain.length; i++) {
				
				//Set nr of PX left to the ground
				if(res.pxToGround > (terrain[i] - sBottom) || res.pxToGround === false) {
					res.pxToGround = terrain[i] - sBottom;
				} 
			

				//If we touch a edge. Die! 
				if(sBottom >= terrain[i]) {
					console.log('dead', sBottom, terrain[i]);
					res.collision = true;
					break;
				}
			}

			if(res.pxToGround === false) {
				console.log('false',res);
			}

			return res;

	}


	/**
	 * update
	 * things to do every animation frame
	 */
	CollisionClass.prototype.update = function(obj) {
		//Clear the store
		objectStore = {};
	}




	var collision = new CollisionClass();
	return collision;


})();

