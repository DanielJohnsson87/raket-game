// 'use strict';
// var Raket = Raket || {};
// Raket.Controls = (function() {
//
// 	var ControlClass = function() {
// 		this.keyMap = [];
//
// 		this.addEventListener();
// 	};
//
//
// 	ControlClass.prototype.addEventListener = function() {
//
// 		var that = this;
//
// 		document.onkeydown = document.onkeyup = function(e){
// 		    e = e || event; // to deal with IE
//
//
// 			//On keyup and keydown
// 		    if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 32) {
// 		    	e.preventDefault();
// 		    	that.keyMap[e.keyCode] = (e.type == 'keydown');
// 		    }
// 		}
// 	};
//
//
// 	return new ControlClass();
//
// })();

'use strict'
var Raket = Raket || {}
Raket.Controls = (function () {

  var ControlClass = function () {
    this.keyMap = []

    var controllerLoop = () => {
      var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [])
      if (!gamepads) {
        return
      }

      var gp = gamepads[0],
        axes = gp.axes

      this.keyMap[32] = buttonPressed(gp.buttons[0])

      this.keyMap[37] = axes[0] < -0.1 || buttonPressed(gp.buttons[14]); // LEFT
      this.keyMap[39] = axes[0] > 0.1 || buttonPressed(gp.buttons[15]); // LEFT
      this.keyMap[40] = axes[1] > 0.1 || buttonPressed(gp.buttons[13]) // DOWN
      this.keyMap[38] = axes[1] < -0.1 || buttonPressed(gp.buttons[12]) // UP

      requestAnimationFrame(controllerLoop)
    }

    function buttonPressed (b) {
      if (typeof(b) == 'object') {
        return b.pressed
      }
      return b == 1.0
    }

    function pollGamepads (interval) {
      var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [])
      for (var i = 0; i < gamepads.length; i++) {
        var gp = gamepads[i]
        if (gp) {
          console.log('Gamepad connected at index ' + gp.index + ': ' + gp.id +
            '. It has ' + gp.buttons.length + ' buttons and ' + gp.axes.length + ' axes.')
          controllerLoop()
          clearInterval(interval)
        }
      }
    }

    // this.addEventListener();
    pollGamepads(100)
    // controllerLoop()

  }

  return new ControlClass()

})()
