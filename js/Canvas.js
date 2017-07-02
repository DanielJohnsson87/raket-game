'use strict';
var Raket = Raket || {};
Raket.Canvas = (function() {
	var CanvasClass = function() {
		this.height = 512;
		this.width = 1024;  //Must be compliant with the power of two. 8, 16, 32 ... 256, 512, 1024 etc.
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");


		this.canvas.height = this.height;
		this.canvas.width = this.width;

		this.canvas.style.background = '#000';
	};


	return new CanvasClass();

})();
