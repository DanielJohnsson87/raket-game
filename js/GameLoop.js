'use strict';
if(typeof Raket === 'undefined') {
	var Raket = {};
}

Raket.GameLoop = (function() {

	var LoopClass = function() {
		//Game variables
		this.fps = 30;
		this.now = 0;
		this.then = Date.now();
		this.interval = 1000/this.fps;
		this.delta = 0;
		this.stop = false;

	};


	/**
	 * Draws everything to the canvas
	 * @return {[type]} [description]
	 */
	LoopClass.prototype.draw = function() {
			

			// Since this function gets calles by requestAnimationFrame
			// in the window scope, we cant reference this. 
			// We need to bind a that variable to the Raket.GameLoop
			var that = Raket.GameLoop;


			if(that.stop === true) {
				return;
			}

			requestAnimationFrame(Raket.GameLoop.draw);

			that.now = Date.now();
			that.delta = that.now - that.then;


			if (that.delta > that.interval) {
				// update time stuffs

				// Just `then = now` is not enough.
				// Lets say we set fps at 10 which mean
				// each frame must take 100ms
				// Now frame executes in 16ms (60fps) so
				// the loop iterates 7 times (16*7 = 112ms) until
				// delta > interval === true
				// Eventually this lowers down the FPS as
				// 112*10 = 1120ms (NOT 1000ms).
				// So we have to get rid of that extra 12ms
				// by subtracting delta (112) % interval (100).
				// Hope that makes sense.

				that.then = that.now - (that.delta % that.interval);

				//Update the CollisionControl first, to flush all old positions before adding new.
				Raket.CollisionControl.update();

				Raket.Terrain.scrollTerrain();

				Raket.Spaceship.update();
				Raket.Enemies.update();
				Raket.Projectiles.update();
			}
	};


	LoopClass.prototype.halt = function() {
		Raket.GameLoop.stop = true;
	};

	LoopClass.prototype.go = function() {
		Raket.GameLoop.stop = false;
		Raket.GameLoop.draw();
	}


	var loop = new LoopClass();
	return loop;

})();