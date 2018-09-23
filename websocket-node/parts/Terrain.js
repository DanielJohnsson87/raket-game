const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 512

const getTerrain = function (width, height, displace, roughness, seed) {
    var spread = 4
    width = width / spread;

    var points = [],
        // Gives us a power of 2 based on our width
        power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2)))),
        seed = seed || {
                s: height / 2 + (Math.random() * displace * 2) - displace,
                e: height / 2 + (Math.random() * displace * 2) - displace
            };

    // Set the initial left point
    if (seed.s === 0) {
        seed.s = height / 2 + (Math.random() * displace * 2) - displace;
    }
    points[0] = seed.s;

    // set the initial right point
    if (seed.e === 0) {
        seed.e = height / 2 + (Math.random() * displace * 2) - displace
    }
    points[power] = seed.e;

    displace *= roughness;

    // Increase the number of segments
    for (var i = 1; i < power; i *= 2) {
        // Iterate through each segment calculating the center point
        for (var j = (power / i) / 2; j < power; j += power / i) {
            points[j] = ((points[j - (power / i) / 2] + points[j + (power / i) / 2]) / 2);
            points[j] += (Math.random() * displace * 2) - displace
        }
        // reduce our random range
        displace *= roughness;
    }

    //console.log(points);
    return points;
}


const firstTerPoints = getTerrain(CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_HEIGHT / 4, 0.6)
const secondTerPoints = getTerrain(CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_HEIGHT / 4, 0.6, {
    s: firstTerPoints[firstTerPoints.length - 1],
    e: 0
});

console.log('first', firstTerPoints)

const terrain = {
    offset: 0,
    height: CANVAS_HEIGHT,
    width: CANVAS_WIDTH,
    terpoints: {},
    terpoints2: {},
    // canvas: Raket.Canvas.canvas,
    // ctx: Raket.Canvas.ctx,
    // pattern: new Image(),
    spread: 4, //Distance between each line
    terPoints: firstTerPoints,
    terPoints2: secondTerPoints,
}



module.exports = {
    terrain,
    // getTerrain
}


//
// 'use strict';
// var Raket = Raket || {};
// Raket.Terrain = (function () {
//
//     TerrainClass.prototype.scrollTerrain = function () {
//         // Since this function gets called by requestAnimationFrame
//         // in the window scope, we cant reference this.
//         // We need to bind a that variable to the Raket.GameLoop
//         var that = Raket.Terrain,
//             ctx = that.ctx,
//             spread = that.spread; //How much distance between each line
//
//         ctx.clearRect(0, 0, that.width, that.height);
//         that.offset -= 2;
//
//         // draw the first half
//         ctx.beginPath();
//         ctx.moveTo(that.offset + spread, that.terPoints[0]);
//
//         //Draw first array
//         for (var t = 0; t < that.terPoints.length; t++) {
//             ctx.lineTo((t * spread) + that.offset, that.terPoints[t]);
//         }
//         //Draw second array
//
//         for (t = 0; t < that.terPoints2.length; t++) {
//             ctx.lineTo(that.width + that.offset + (t * spread), that.terPoints2[t]);
//         }
//
//         // finish creating the rect so we can fill it
//         ctx.lineTo(that.width + that.offset + (t * spread), that.canvas.height);
//         ctx.lineTo(that.offset, that.canvas.height);
//         ctx.closePath();
//         ctx.fillStyle = 'rgb(156, 156, 156)';
//         // ctx.fillStyle = this.pattern;
//         ctx.strokeStyle = 'red';
//         ctx.fill();
//
//
//         /*
//          * if the number of our points on the 2nd array is less than or equal to our screen width
//          * we reset the offset to 0, copy terpoints2 to terpoints,
//          * and gen a new set of points for terpoints 2
//          */
//
//         if (that.terPoints2.length - 1 + that.width + that.offset <= (that.width / spread)) {
//
//             that.terPoints = that.terPoints2;
//             that.terPoints2 = that.getTerrain(that.width, that.height, that.height / 4, 0.6, {
//                 s: that.terPoints[that.terPoints.length - 1],
//                 e: 0
//             });
//             that.offset = 0;
//         }
//
//
//     }
//
//
//     var terrain = new TerrainClass();
//     return terrain;
//
//
// })();

