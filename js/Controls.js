'use strict';
if(typeof Raket === 'undefined') {
	var Raket = {};
}

Raket.Controls = (function() {

	var ControlClass = function() {
		this.keyMap = [];

		this.addEventListener();
	};


	ControlClass.prototype.addEventListener = function() {

		var that = this;

		document.onkeydown = document.onkeyup = function(e){
		    e = e || event; // to deal with IE


			//On keyup and keydown
		    if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 32) {
		    	e.preventDefault();
		    	that.keyMap[e.keyCode] = (e.type == 'keydown');
		    }
		}
	};


	return new ControlClass();

})();
