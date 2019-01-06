/**
 * Created by gleicher on 10/17/15.
 */
var grobjects = grobjects || [];

// make the two constructors global variables so they can be used later
var Copter = undefined,
    Helipad = undefined,
    topBodyVertex = [], topBodyNormal = [], topBodyIndex = [],
    bottomBodyVertex = [], bottomBodyNormal = [], bottomBodyIndex = [],
    noseVertex = [], noseNormal = [], noseIndex = [],
    tailVertex = [], tailNormal = [], tailIndex = [],
    latitude = 10, longitude = 10;

(function () { "use strict";

    // I will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined,
        copterTopBodyBuffers = undefined, copterBottomBodyBuffers = undefined,
        copterTailBuffers = undefined, tailCircleBuffers = undefined,
        topRotorBuffers = undefined, backRotorBuffers = undefined, padBuffers = undefined,
        topPoleBuffers = undefined, backPoleBuffers = undefined, copterNoseBuffers = undefined,
        copterNumdber = 0, padNumber = 0;

    // constructor for Helicopter
    Copter = function Copter() {
        this.name = "copter"+copterNumber++;
        this.position = [0,0,0];    // will be set in init
        this.color = [1,1,0];
        this.noseColor = [1,1,1];
        this.bottomColor = [1,1,1];
        // about the Y axis - it's the facing direction
        this.orientation = 0;
    };
    Copter.prototype.init = function(drawingState) {
        var gl = drawingState.gl;

        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["streetlight-vs", "streetlight-fs"]);
        }
        if (!copterTopBodyBuffers) {
            initTopBody();
            var topBodyArrays = {
                vpos : { numComponents: 3, data: topBodyVertex },
                vnormal : { numComponents: 3, data: topBodyNormal },
                indices : { numComponents: 6, data : topBodyIndex }};
            copterTopBodyBuffers = twgl.createBufferInfoFromArrays(drawingState.gl, topBodyArrays);
            initBottomBody();
            var bottomBodyArrays = {
                vpos : { numComponents: 3, data: bottomBodyVertex },
                vnormal : { numComponents: 3, data: bottomBodyNormal },
                indices : { numComponents: 6, data : bottomBodyIndex }};
            copterBottomBodyBuffers = twgl.createBufferInfoFromArrays(drawingState.gl, bottomBodyArrays);
            initNose();
            var noseArrays = {
                vpos : { numComponents: 3, data: noseVertex },
                vnormal : { numComponents: 3, data: noseNormal },
                indices : { numComponents: 6, data : noseIndex }};
            copterNoseBuffers = twgl.createBufferInfoFromArrays(drawingState.gl, noseArrays);
            var tailArrays = {
                vpos : { numComponents: 3, data: [
                    .25,.15,0,  0,.4,0,  -.25,.15,0,  0,-.1,0,  0,.15,-2
                ]},
                vnormal : { numComponents: 3, data: [
                    1,0,0,  0,1,0,  -1,0,0,  0,-1,0,  0,0,-1
                ]},
                indices : [ 0,1,4, 1,2,4, 2,3,4, 3,0,4 ]
            };
            copterTailBuffers = twgl.createBufferInfoFromArrays(drawingState.gl, tailArrays);
            var topPoleArrays = {
                vpos: { numComponents: 3, data: [
                        -.2,0,-.2, .2,0,-.2, .2,.4,-.2,        -.2,0,-.2, .2,.4,-.2, 0,.4,-.2,    // z = 0
                        -.2,0,.2, .2,0,.2, .2,.4,.2,           -.2,0,.2, .2,.4,.2, -.2,.4,.2,       // z = 1
                        -.2,0,-.2, .2,0,-.2, .2,0,.2,           -.2,0,-.2, .2,0,.2, -.2,0,.2,    // y = 0
                        -.2,.4,-.2, .2,.4,-.2, .2,.4,.2,     -.2,.4,-.2, .2,.4,.2, -.2,.4,.2,       // y = 1
                        -.2,0,-.2, -.2,.4,-.2, -.2,.4,.2,     -.2,0,-.2, -.2,.4,.2, -.2,0,.2,    // x = 0
                        .2,0,-.2, .2,.4,-.2, .2,.4,.2,        .2,0,-.2, .2,.4,.2, .2,0,.2        // x = 1
                    ]},
                vnormal: { numComponents: 3, data: [
                        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
                        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
                        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
                        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0
                    ]}
            };
            topPoleBuffers = twgl.createBufferInfoFromArrays(drawingState.gl, topPoleArrays);
            initTail();
            var tailCircleArrays = {
                vpos : { numComponents: 3, data: tailVertex },
                vnormal : { numComponents: 3, data: tailNormal },
                indices : { numComponents: 6, data : tailIndex }};
            tailCircleBuffers = twgl.createBufferInfoFromArrays(drawingState.gl, tailCircleArrays);
            var topRoterArrays = {
                vpos : { numcomponents: 3, data: [0,.5,0, 1,.5,.1, 1,.5, -.1,
                        0,.5,0, -1,.5,.1, -1,.5, -.1]},
                vnormal : { numcomponents: 3, data: [0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0]},
                indices : [0,1,2, 3,4,5]
            };
            topRotorBuffers = twgl.createBufferInfoFromArrays(drawingState.gl, topRoterArrays);
            var backRotorArrays = {
                vpos : { numcomponents: 3, data: [0,.15,-2, .5,0.12,-2, .5,0.17,-2,
                        0,.15,-2, -0.5,0.12,-2, -.5,0.17,-2,]},
                vnormal : { numcomponents: 3, data: [0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0]},
                indices : [0,1,2, 3,4,5]
            };
            backRotorBuffers = twgl.createBufferInfoFromArrays(drawingState.gl, backRotorArrays);
        }
        // put the helicopter on a random helipad
        // see the stuff on helicopter behavior to understand the thing
        this.lastPad = randomHelipad();
        this.position = twgl.v3.add(this.lastPad.center(),[0,.5+this.lastPad.helipadAltitude,0]);
        this.state = 0; // landed
        this.wait = getRandomInt(250,750);
        this.lastTime = 0;

    };
    Copter.prototype.draw = function(drawingState) {
        // make the helicopter fly around
        // this will change position and orientation
        advance(this,drawingState);
        var theta = Number(drawingState.realtime)/50.0;

        if(this.state == 0 || this.state == 4 ) {

            var modelM = twgl.m4.rotationY(this.orientation);
            twgl.m4.setTranslation(modelM, this.position, modelM);
            var gl = drawingState.gl;
            gl.useProgram(shaderProgram.program);
            twgl.setUniforms(shaderProgram, {
                view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
                lightcolor: this.color, model: modelM
            });

            //Copter Body
            twgl.setBuffersAndAttributes(gl, shaderProgram, copterTopBodyBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, copterTopBodyBuffers);

            //Copter Tail
            twgl.setBuffersAndAttributes(gl, shaderProgram, copterTailBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, copterTailBuffers);

            //Copter Top Pole
            twgl.setBuffersAndAttributes(gl, shaderProgram, topPoleBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, topPoleBuffers);

            //Copter Top Rotor
            twgl.setBuffersAndAttributes(gl, shaderProgram, topRotorBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, topRotorBuffers);

            //Copter Back Rotor
            twgl.setBuffersAndAttributes(gl, shaderProgram, backRotorBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, backRotorBuffers);

            //Copter Circle in rear
            twgl.setBuffersAndAttributes(gl, shaderProgram, tailCircleBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, tailCircleBuffers);

            //Bottom of Copter
            twgl.setUniforms(shaderProgram, { lightcolor: this.bottomColor });
            twgl.setBuffersAndAttributes(gl, shaderProgram, copterBottomBodyBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, copterBottomBodyBuffers);

            //Front of Copter
            twgl.m4.setTranslation(modelM, [this.position[0], this.position[1]+0.29, this.position[2]+0.05], modelM);
            twgl.setUniforms(shaderProgram, { lightcolor: this.noseColor, model: modelM });
            twgl.setBuffersAndAttributes(gl, shaderProgram, copterNoseBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, copterNoseBuffers);



        } else {

            var modelMD = twgl.m4.rotationY(this.orientation);
            twgl.m4.setTranslation(modelMD, [this.position[0], this.position[1]+0.3, this.position[2]], modelMD);
            // the drawing coce is straightforward - since twgl deals with the GL stuff for us
            var gl = drawingState.gl;
            gl.useProgram(shaderProgram.program);
            twgl.setUniforms(shaderProgram, {
                view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
                lightcolor: this.noseColor, model: modelMD
            });
            twgl.setBuffersAndAttributes(gl, shaderProgram, copterNoseBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, copterNoseBuffers);

            var modelMF = twgl.m4.rotationY(this.orientation);
            twgl.m4.setTranslation(modelMF, this.position, modelMF);
            // the drawing coce is straightforward - since twgl deals with the GL stuff for us
            var gl = drawingState.gl;
            gl.useProgram(shaderProgram.program);
            twgl.setUniforms(shaderProgram, {
                view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
                lightcolor: this.color, model: modelMF
            });
            twgl.setBuffersAndAttributes(gl, shaderProgram, tailCircleBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, tailCircleBuffers);

            // we make a model matrix to place the cube in the world
            var modelMA = twgl.m4.rotationY(this.orientation);
            twgl.m4.setTranslation(modelMA, this.position, modelMA);
            // the drawing coce is straightforward - since twgl deals with the GL stuff for us
            var gl = drawingState.gl;
            gl.useProgram(shaderProgram.program);
            twgl.setUniforms(shaderProgram, {
                view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
                lightcolor: this.color, model: modelMA
            });
            twgl.setBuffersAndAttributes(gl, shaderProgram, copterTopBodyBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, copterTopBodyBuffers);
            twgl.setBuffersAndAttributes(gl, shaderProgram, copterTailBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, copterTailBuffers);
            twgl.setBuffersAndAttributes(gl, shaderProgram, topPoleBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, topPoleBuffers);

            var modelME = twgl.m4.rotationY(this.orientation);
            twgl.m4.setTranslation(modelME, this.position, modelME);
            // the drawing coce is straightforward - since twgl deals with the GL stuff for us
            var gl = drawingState.gl;
            gl.useProgram(shaderProgram.program);
            twgl.setUniforms(shaderProgram, {
                view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
                lightcolor: this.bottomColor, model: modelME
            });
            twgl.setBuffersAndAttributes(gl, shaderProgram, copterBottomBodyBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, copterBottomBodyBuffers);

            // we make a model matrix to place the cube in the world
            var modelMB = twgl.m4.rotationY(-theta);
            twgl.m4.setTranslation(modelMB, this.position, modelMB);
            // the drawing coce is straightforward - since twgl deals with the GL stuff for us
            var gl = drawingState.gl;
            gl.useProgram(shaderProgram.program);
            twgl.setUniforms(shaderProgram, {
                view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
                lightcolor: this.color, model: modelMB
            });
            twgl.setBuffersAndAttributes(gl, shaderProgram, topRotorBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, topRotorBuffers);

            //BACK ROTOR
            var modelMC = twgl.m4.multiply(twgl.m4.rotationZ(-theta), twgl.m4.rotationY(this.orientation));
            twgl.m4.setTranslation(modelMC, this.position, modelMC);
            // the drawing coce is straightforward - since twgl deals with the GL stuff for us
            var gl = drawingState.gl;
            gl.useProgram(shaderProgram.program);
            twgl.setUniforms(shaderProgram, {
                view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
                lightcolor: this.color, model: modelMC
            });
            twgl.setBuffersAndAttributes(gl, shaderProgram, backRotorBuffers);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, backRotorBuffers);
        }
    };
    Copter.prototype.center = function(drawingState) {
        return this.position;
    };

    // constructor for Helipad
    // note that anything that has a helipad and helipadAltitude key can be used
    Helipad = function Helipad(position) {
        this.name = "helipad"+padNumber++;
        this.position = position || [2,0.01,2];
        this.size = 0.5;
        // yes, there is probably a better way
        this.helipad = true;
        // what altitude should the helicopter be?
        // this get added to the helicopter size
        this.helipadAltitude = 0;
    };
    Helipad.prototype.init = function(drawingState) {
        var gl=drawingState.gl;

        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["streetlight-vs", "streetlight-fs"]);
        }
        if (!padBuffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -1,0,-1, -1,0,1, -.5,0,1, -.5,0,-1,
                    1,0,-1, 1,0,1, .5,0,1, .5,0,-1,
                    -.5,0,-.2, -.5,0,.25,.5,0,.25,.5,0, -.25
                ] },
                vnormal : { numComponents:3, data: [
                    0,1,0, 0,1,0, 0,1,0, 0,1,0,
                    0,1,0, 0,1,0, 0,1,0, 0,1,0,
                    0,1,0, 0,1,0, 0,1,0, 0,1,0
                ]},
                indices : [ 0,1,2, 0,2,3, 4,5,6, 4,6,7, 8,9,10, 8,10,11 ]
            };
            padBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Helipad.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,{
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            lightcolor:[1,0,0], model: modelM });
        twgl.setBuffersAndAttributes(gl,shaderProgram,padBuffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, padBuffers);
    };
    Helipad.prototype.center = function(drawingState) {
        return this.position;
    };

    ///////////////////////////////////////////////////////////////////
    // Helicopter Behavior
    //
    // the helicopter can be in 1 of 4 states:
    //      landed  (0)
    //      taking off (1)
    //      turning towards dest (2)
    //      flying towards dest (3)
    //      landing (4)
    ////////////////////////
    // constants
    var altitude = 5;
    var verticalSpeed = 3/1000;      // units per milli-second
    var flyingSpeed = 1/10000;//1/50;          // units per milli-second
    var turningSpeed = 5/1000;         // radians per milli-second

    // utility - generate random  integer
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    // find a random helipad - allow for excluding one (so we don't re-use last target)
    function randomHelipad(exclude) {
        var helipads = grobjects.filter(function(obj) {return (obj.helipad && (obj != exclude))});
        if (!helipads.length) {
            throw("No Helipads for the helicopter!");
        }
        var idx = getRandomInt(0,helipads.length);
        //return helipads[idx];
        return helipads[0];
    }

    // this actually does the work
    function advance(heli, drawingState) {
        // on the first call, the copter does nothing
        if (!heli.lastTime) {
            heli.lastTime = drawingState.realtime;
            return;
        }
        var delta = drawingState.realtime - heli.lastTime;
        heli.lastTime = drawingState.realtime;

        // now do the right thing depending on state
        switch (heli.state) {
            case 0: // on the ground, waiting for take off
                if (heli.wait > 0) { heli.wait -= delta; }
                else {  // take off!
                    heli.wait = 0;
                    heli.state = 0;
                    //heli.state = 1;

                }
                break;
            case 1: // taking off
                if (heli.position[1] < altitude) {
                    var up = verticalSpeed * delta;
                    heli.position[1] = Math.min(altitude,heli.position[1]+up);
                } else { // we've reached altitude - pick a destination
                    var dest = randomHelipad(heli.lastPad);
                    heli.lastPad = dest;
                    // the direction to get there...
                    heli.dx = dest.position[0] - heli.position[0];
                    heli.dz = dest.position[2] - heli.position[2];
                    heli.dst = Math.sqrt(heli.dx*heli.dx + heli.dz*heli.dz);
                    if (heli.dst < .01) {
                        // small distance - just go there
                        heli.position[0] = dest.position[0];
                        heli.position[2] = dest.position[2];
                        heli.state = 4;
                     } else {
                        heli.vx = heli.dx / heli.dst;
                        heli.vz = heli.dz / heli.dst;
                    }
                    heli.dir = Math.atan2(heli.dx,heli.dz);
                    heli.state = 0;
                    //heli.state = 2;
                }
                break;
            case 2: // spin towards goal
                var dtheta = heli.dir - heli.orientation;
                // if we're close, pretend we're there
                if (Math.abs(dtheta) < .01) {
                    heli.state = 3;
                    heli.orientation = heli.dir;
                }
                var rotAmt = turningSpeed * delta;
                if (dtheta > 0) {
                    heli.orientation = Math.min(heli.dir,heli.orientation+rotAmt);
                } else {
                    heli.orientation = Math.max(heli.dir,heli.orientation-rotAmt);
                }
                break;
            case 3: // fly towards goal
                if (heli.dst > .01) {
                    var go = delta * flyingSpeed;
                    // don't go farther than goal
                    go = Math.min(heli.dst,go);
                    heli.position[0] += heli.vx * go;
                    heli.position[2] += heli.vz * go;
                    heli.dst -= go;
                } else { // we're effectively there, so go there
                    heli.position[0] = heli.lastPad.position[0];
                    heli.position[2] = heli.lastPad.position[2];
                    heli.state = 0;
                    //heli.state = 4;
                }
                break;
            case 4: // land at goal
                var destAlt = heli.lastPad.position[1] + .5 + heli.lastPad.helipadAltitude;
                if (heli.position[1] > destAlt) {
                    var down = delta * verticalSpeed;
                    heli.position[1] = Math.max(destAlt,heli.position[1]-down);
                } else { // on the ground!
                    heli.state = 0;
                    heli.wait = getRandomInt(1000,2000);
                }
                break;
        }
    }
    function initNose() {
        for (var lat = 0; lat <= latitude; lat++) {
            var theta = lat * .85 * Math.PI / latitude, sinTheta = Math.sin(theta),
                cosTheta = -Math.cos(theta) - Math.sin(theta);
            for (var long = 0; long <= longitude; long++) {
                var phi = long * 1 * Math.PI / longitude,
                    sinPhi = Math.sin(phi) + Math.sin(phi)/1.5,
                    cosPhi = Math.cos(phi) + Math.cos(phi)/1.25;
                var x = cosPhi * sinTheta, y = cosTheta, z = sinPhi * sinTheta;
                noseNormal.push(x); noseNormal.push(y); noseNormal.push(z);
                noseVertex.push(0.19 * x); noseVertex.push(0.225 * y); noseVertex.push(0.55 * z);
            }
        }
        for (lat = 0; lat < latitude; lat++) {
            for (long = 0; long < longitude; long++) {
                var first = (lat * (longitude + 1)) + long, second = first + longitude + 1;
                noseIndex.push(first); noseIndex.push(second); noseIndex.push(first + 1);
                noseIndex.push(second); noseIndex.push(second + 1); noseIndex.push(first + 1);
            }
        }
    }
    function initTopBody() {
        for (var lat = 0; lat <= latitude; lat++) {
            var theta = lat * .5 * Math.PI / latitude, sinTheta = Math.sin(theta), cosTheta = Math.cos(theta);
            for (var long = 0; long <= longitude; long++) {
                var phi = long * 2 * Math.PI / longitude,
                    sinPhi = Math.sin(phi) + Math.sin(phi) / 1.5,
                    cosPhi = Math.cos(phi);
                var x = cosPhi * sinTheta, y = cosTheta, z = sinPhi * sinTheta;
                topBodyNormal.push(x); topBodyNormal.push(y); topBodyNormal.push(z);
                topBodyVertex.push(0.38 * x); topBodyVertex.push(0.55 * y); topBodyVertex.push(0.5 * z);
            }
        }
        for (lat = 0; lat < latitude; lat++) {
            for (long = 0; long < longitude; long++) {
                var first = (lat * (longitude + 1)) + long, second = first + longitude + 1;
                topBodyIndex.push(first); topBodyIndex.push(second); topBodyIndex.push(first + 1);
                topBodyIndex.push(second); topBodyIndex.push(second + 1); topBodyIndex.push(first + 1);
            }
        }
    }
    function initBottomBody() {
        for (var lat = 0; lat <= latitude; lat++) {
            var theta = lat * .5 * Math.PI / latitude, sinTheta = Math.sin(theta), cosTheta = -Math.cos(theta);
            for (var long = 0; long <= longitude; long++) {
                var phi = long * 2 * Math.PI / longitude,
                    sinPhi = Math.sin(phi) + Math.sin(phi) / 1.5,
                    cosPhi = Math.cos(phi);
                var x = cosPhi * sinTheta, y = cosTheta, z = sinPhi * sinTheta;
                bottomBodyNormal.push(x); bottomBodyNormal.push(y); bottomBodyNormal.push(z);
                bottomBodyVertex.push(0.38 * x); bottomBodyVertex.push(0.1 * y); bottomBodyVertex.push(0.5 * z);
            }
        }
        for (lat = 0; lat < latitude; lat++) {
            for (long = 0; long < longitude; long++) {
                var first = (lat * (longitude + 1)) + long, second = first + longitude + 1;
                bottomBodyIndex.push(first); bottomBodyIndex.push(second); bottomBodyIndex.push(first + 1);
                bottomBodyIndex.push(second); bottomBodyIndex.push(second + 1); bottomBodyIndex.push(first + 1);
            }
        }
    }
    function initTail() {
        for (var lat = 0; lat <= latitude; lat++) {
            var theta = lat * Math.PI / latitude, sinTheta = Math.sin(theta), cosTheta = -Math.cos(theta);
            for (var long = 0; long <= longitude; long++) {
                var phi = long * 2 * Math.PI / longitude,
                    sinPhi = Math.sin(phi),
                    cosPhi = Math.cos(phi);
                var x = cosPhi * sinTheta, y = cosTheta, z = sinPhi * sinTheta;
                tailNormal.push(x); tailNormal.push(y); tailNormal.push(z);
                tailVertex.push(0.05 * x); tailVertex.push(0.2 * y); tailVertex.push(0.23 * z);
            }
        }
        for (lat = 0; lat < latitude; lat++) {
            for (long = 0; long < longitude; long++) {
                var first = (lat * (longitude + 1)) + long, second = first + longitude + 1;
                tailIndex.push(first); tailIndex.push(second); tailIndex.push(first + 1);
                tailIndex.push(second); tailIndex.push(second + 1); tailIndex.push(first + 1);
            }
        }
    }
})();

// normally, I would put this into a "scene description" file, but having
// it here means if this file isn't loaded, then there are no dangling
// references to it

// make the objects and put them into the world
// note that the helipads float above the floor to avoid z-fighting
//grobjects.push(new Copter());
grobjects.push(new Helipad([-4.5,3.205,3.5]));
grobjects.push(new Helipad([-100,3.205,-100]));
grobjects.push(new Copter());

