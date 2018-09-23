'use strict';
var Raket = Raket || {};
Raket.Terrain = (function () {

    var TerrainClass = function () {
        // this.offset = 0;
        // this.height = Raket.Canvas.height;
        // this.width = Raket.Canvas.width;
        // this.terpoints = {};
        // this.terpoints2 = {};
        this.canvas = Raket.Canvas.canvas;
        this.ctx = Raket.Canvas.ctx;
        this.pattern = new Image();
        // this.spread = 4; //Distance between each line

        // this.terPoints = this.getTerrain(this.width, this.height, this.height / 4, 0.6);
        // this.terPoints2 = this.getTerrain(this.width, this.height, this.height / 4, 0.6, {
        //     s: this.terPoints[this.terPoints.length - 1],
        //     e: 0
        // });

        // this.setUpBackground();

    };

    TerrainClass.prototype.setTerrain = function (args) {
        console.log('set', args)
        this.offset = args.terrain.offset
        this.height = args.terrain.height
        this.width = args.terrain.width
        this.terPoints = args.terrain.terPoints
        this.terPoints2 = args.terrain.terPoints2
        this.spread = args.terrain.spread
    }


    TerrainClass.prototype.setUpBackground = function () {

        this.ctx.fillRect(0, 0, this.width, this.height);
        // var that = this;
        // 	that.pattern.src = 'img/090611_moon___texture_by_avmorgan.jpg';
        //
        // that.pattern.onload = function() {
        // 	var pattern = that.ctx.createPattern(this, "repeat");
        // 	that.ctx.fillStyle = pattern;
        // };

    }


    /*
     * width and height are the overall width and height we have to work with, displace is
     * the maximum deviation value. This stops the terrain from going out of bounds if we choose
     *  a seed portion is added so we can seed the start and end section with values for scrolling
     */
    TerrainClass.prototype.getTerrain = function (width, height, displace, roughness, seed) {

        width = width / this.spread;

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


    TerrainClass.prototype.scrollTerrain = function () {
        // Since this function gets called by requestAnimationFrame
        // in the window scope, we cant reference this.
        // We need to bind a that variable to the Raket.GameLoop
        var that = Raket.Terrain,
            ctx = that.ctx,
            spread = that.spread; //How much distance between each line

        ctx.clearRect(0, 0, that.width, that.height);
        that.offset -= 2;

        // draw the first half
        ctx.beginPath();
        ctx.moveTo(that.offset + spread, that.terPoints[0]);

        //Draw first array
        for (var t = 0; t < that.terPoints.length; t++) {
            ctx.lineTo((t * spread) + that.offset, that.terPoints[t]);
        }
        //Draw second array

        for (t = 0; t < that.terPoints2.length; t++) {
            ctx.lineTo(that.width + that.offset + (t * spread), that.terPoints2[t]);
        }

        // finish creating the rect so we can fill it
        ctx.lineTo(that.width + that.offset + (t * spread), that.canvas.height);
        ctx.lineTo(that.offset, that.canvas.height);
        ctx.closePath();
        ctx.fillStyle = 'rgb(156, 156, 156)';
        // ctx.fillStyle = this.pattern;
        ctx.strokeStyle = 'red';
        ctx.fill();


        /*
         * if the number of our points on the 2nd array is less than or equal to our screen width
         * we reset the offset to 0, copy terpoints2 to terpoints,
         * and gen a new set of points for terpoints 2
         */

        if (that.terPoints2.length - 1 + that.width + that.offset <= (that.width / spread)) {

            that.terPoints = that.terPoints2;
            that.terPoints2 = that.getTerrain(that.width, that.height, that.height / 4, 0.6, {
                s: that.terPoints[that.terPoints.length - 1],
                e: 0
            });
            that.offset = 0;
        }


    }


    var terrain = new TerrainClass();
    return terrain;


})();

