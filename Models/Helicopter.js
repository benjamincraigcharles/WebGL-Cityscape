var grobjects = grobjects || [];

var Copter = undefined, Helipad = undefined;

(function () { "use strict";

    var shaderProgram = undefined, elipseBuffer = undefined, coneBuffer, backRotorBuffer, leftRailBuffer,
        rightRailBuffer, leftCylBuffer, rightCylBuffer, leftPoleBuffer, rightPoleBuffer, backTopRotorBuffer,
        backBottomRotorBuffer, backSphereBuffer, rotorBodyBuffer, rotorElipseBuffer, frontCylBuffer, backCylBuffer,
        topLeftCylBuffer, topRightCylBuffer, frontLeftSphereBuffer, frontRightSphereBuffer, backLeftSphereBuffer,
        backRightSphereBuffer, rotorPoleBuffer, topLeftRotorBuffer, topRightRotorBuffer, 
        rotorZBuffer, rotorXBuffer, padBuffers, padNumber = 1;

    Copter = function Copter() {
        this.name = "Helicopter";
        this.position = [0,0,0];
        this.orientation = 0;
    };
    Copter.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["streetlight-vs", "streetlight-fs"]);
        }
        if (!elipseBuffer) {
            var elipseInfo = twgl.primitives.createSphereVertices(.3,12,24);
            elipseInfo = twgl.primitives.reorientVertices(elipseInfo, twgl.m4.scaling([1.5,1.25,2.25]));
            elipseInfo = twgl.primitives.reorientVertices(elipseInfo, twgl.m4.translation([0,0,.25]));
            var elipseArray = {
                vpos : { numComponents: elipseInfo.position.numComponents , data: elipseInfo.position },
                vnormal : { numComponents: elipseInfo.normal.numComponents, data: elipseInfo.normal },
                indices : { numComponents: elipseInfo.indices.numComponents, data: elipseInfo.indices }
            };
            elipseBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, elipseArray);

            var coneInfo = twgl.primitives.createTruncatedConeVertices(.15,.035,1.25,12,24);
            coneInfo = twgl.primitives.reorientVertices(coneInfo, twgl.m4.rotationX(270*Math.PI/180));
            coneInfo = twgl.primitives.reorientVertices(coneInfo, twgl.m4.translation([0,0,-.75]));
            var coneArray = {
                vpos : { numComponents: coneInfo.position.numComponents , data: coneInfo.position },
                vnormal : { numComponents: coneInfo.normal.numComponents, data: coneInfo.normal },
                indices : { numComponents: coneInfo.indices.numComponents, data: coneInfo.indices }
            };
            coneBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, coneArray);

            var backRotorInfo = twgl.primitives.createTorusVertices(.25,.04,12,24);
            backRotorInfo = twgl.primitives.reorientVertices(backRotorInfo, twgl.m4.rotationX(90*Math.PI/180));
            backRotorInfo = twgl.primitives.reorientVertices(backRotorInfo, twgl.m4.rotationY(90*Math.PI/180));
            backRotorInfo = twgl.primitives.reorientVertices(backRotorInfo, twgl.m4.translation([0,0,-1.6]));
            var backRotorArray = {
                vpos : { numComponents: backRotorInfo.position.numComponents , data: backRotorInfo.position },
                vnormal : { numComponents: backRotorInfo.normal.numComponents, data: backRotorInfo.normal },
                indices : { numComponents: backRotorInfo.indices.numComponents, data: backRotorInfo.indices }
            };
            backRotorBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, backRotorArray);

            var leftRailInfo = twgl.primitives.createTorusVertices(.225,.035,12,24,270*Math.PI/180,2*Math.PI);
            leftRailInfo = twgl.primitives.reorientVertices(leftRailInfo, twgl.m4.rotationX(90*Math.PI/180));
            leftRailInfo = twgl.primitives.reorientVertices(leftRailInfo, twgl.m4.rotationY(90*Math.PI/180));
            leftRailInfo = twgl.primitives.reorientVertices(leftRailInfo, twgl.m4.translation([-0.25,-0.2,0.4]));
            var leftRailArray = {
                vpos : { numComponents: leftRailInfo.position.numComponents , data: leftRailInfo.position },
                vnormal : { numComponents: leftRailInfo.normal.numComponents, data: leftRailInfo.normal },
                indices : { numComponents: leftRailInfo.indices.numComponents, data: leftRailInfo.indices }
            };
            leftRailBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, leftRailArray);

            var rightRailInfo = twgl.primitives.createTorusVertices(.225,.035,12,24,270*Math.PI/180,2*Math.PI);
            rightRailInfo = twgl.primitives.reorientVertices(rightRailInfo, twgl.m4.rotationX(90*Math.PI/180));
            rightRailInfo = twgl.primitives.reorientVertices(rightRailInfo, twgl.m4.rotationY(90*Math.PI/180));
            rightRailInfo = twgl.primitives.reorientVertices(rightRailInfo, twgl.m4.translation([0.25,-0.2,0.4]));
            var rightRailArray = {
                vpos : { numComponents: rightRailInfo.position.numComponents , data: rightRailInfo.position },
                vnormal : { numComponents: rightRailInfo.normal.numComponents, data: rightRailInfo.normal },
                indices : { numComponents: rightRailInfo.indices.numComponents, data: rightRailInfo.indices }
            };
            rightRailBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rightRailArray);

            var leftCylInfo = twgl.primitives.createCylinderVertices(.035,0.6,12,24);
            leftCylInfo = twgl.primitives.reorientVertices(leftCylInfo, twgl.m4.rotationX(90*Math.PI/180));
            leftCylInfo = twgl.primitives.reorientVertices(leftCylInfo, twgl.m4.translation([-0.25,-0.425,0.10]));
            var leftCylArray = {
                vpos : { numComponents: leftCylInfo.position.numComponents , data: leftCylInfo.position },
                vnormal : { numComponents: leftCylInfo.normal.numComponents, data: leftCylInfo.normal },
                indices : { numComponents: leftCylInfo.indices.numComponents, data: leftCylInfo.indices }
            };
            leftCylBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, leftCylArray);

            var rightCylInfo = twgl.primitives.createCylinderVertices(.035,0.6,12,24);
            rightCylInfo = twgl.primitives.reorientVertices(rightCylInfo, twgl.m4.rotationX(90*Math.PI/180));
            rightCylInfo = twgl.primitives.reorientVertices(rightCylInfo, twgl.m4.translation([0.25,-0.425,0.10]));
            var rightCylArray = {
                vpos : { numComponents: rightCylInfo.position.numComponents , data: rightCylInfo.position },
                vnormal : { numComponents: rightCylInfo.normal.numComponents, data: rightCylInfo.normal },
                indices : { numComponents: rightCylInfo.indices.numComponents, data: rightCylInfo.indices }
            };
            rightCylBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rightCylArray);

            var leftPoleInfo = twgl.primitives.createCylinderVertices(.035,0.25,12,24);
            leftPoleInfo = twgl.primitives.reorientVertices(leftPoleInfo, twgl.m4.translation([-0.25,-0.3,0.10]));
            var leftPoleArray = {
                vpos : { numComponents: leftPoleInfo.position.numComponents , data: leftPoleInfo.position },
                vnormal : { numComponents: leftPoleInfo.normal.numComponents, data: leftPoleInfo.normal },
                indices : { numComponents: leftPoleInfo.indices.numComponents, data: leftPoleInfo.indices }
            };
            leftPoleBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, leftPoleArray);

            var rightPoleInfo = twgl.primitives.createCylinderVertices(.035,0.25,12,24);
            rightPoleInfo = twgl.primitives.reorientVertices(rightPoleInfo, twgl.m4.translation([0.25,-0.3,0.10]));
            var rightPoleArray = {
                vpos : { numComponents: rightPoleInfo.position.numComponents , data: rightPoleInfo.position },
                vnormal : { numComponents: rightPoleInfo.normal.numComponents, data: rightPoleInfo.normal },
                indices : { numComponents: rightPoleInfo.indices.numComponents, data: rightPoleInfo.indices }
            };
            rightPoleBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rightPoleArray);
            var backTopRotorInfo = twgl.primitives.createTruncatedConeVertices(.035,.0001,0.25,12,24);
            backTopRotorInfo = twgl.primitives.reorientVertices(backTopRotorInfo, twgl.m4.rotationX(180*Math.PI/180));
            backTopRotorInfo = twgl.primitives.reorientVertices(backTopRotorInfo, twgl.m4.translation([0,.125,-1.6]));
            var backTopRotorArray = {
                vpos : { numComponents: backTopRotorInfo.position.numComponents , data: backTopRotorInfo.position },
                vnormal : { numComponents: backTopRotorInfo.normal.numComponents, data: backTopRotorInfo.normal },
                indices : { numComponents: backTopRotorInfo.indices.numComponents, data: backTopRotorInfo.indices }
            };
            backTopRotorBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, backTopRotorArray);

            var backBottomRotorInfo = twgl.primitives.createTruncatedConeVertices(.035,.0001,0.25,12,24);
            backBottomRotorInfo = twgl.primitives.reorientVertices(backBottomRotorInfo, twgl.m4.translation([0,-.125,-1.6]));
            var backBottomRotorArray = {
                vpos : { numComponents: backBottomRotorInfo.position.numComponents , data: backBottomRotorInfo.position},
                vnormal : { numComponents: backBottomRotorInfo.normal.numComponents, data: backBottomRotorInfo.normal},
                indices : { numComponents: backBottomRotorInfo.indices.numComponents, data: backBottomRotorInfo.indices}
            };
            backBottomRotorBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, backBottomRotorArray);

            var backSphereInfo = twgl.primitives.createSphereVertices(.065,12,24);
            backSphereInfo = twgl.primitives.reorientVertices(backSphereInfo, twgl.m4.translation([0,0,-1.6]));
            var backSphereArray = {
                vpos : { numComponents: backSphereInfo.position.numComponents , data: backSphereInfo.position },
                vnormal : { numComponents: backSphereInfo.normal.numComponents, data: backSphereInfo.normal },
                indices : { numComponents: backSphereInfo.indices.numComponents, data: backSphereInfo.indices }
            };
            backSphereBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, backSphereArray);

            var rotorBodyInfo = twgl.primitives.createCubeVertices(0.25);
            rotorBodyInfo = twgl.primitives.reorientVertices(rotorBodyInfo, twgl.m4.scaling([2,1.25,3]));
            rotorBodyInfo = twgl.primitives.reorientVertices(rotorBodyInfo, twgl.m4.translation([0,0.25,0.025]));
            var rotorBodyArray = {
                vpos : { numComponents: rotorBodyInfo.position.numComponents , data: rotorBodyInfo.position },
                vnormal : { numComponents: rotorBodyInfo.normal.numComponents, data: rotorBodyInfo.normal },
                indices : { numComponents: rotorBodyInfo.indices.numComponents, data: rotorBodyInfo.indices }
            };
            rotorBodyBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rotorBodyArray);

            var rotorElipseInfo = twgl.primitives.createSphereVertices(.3,12,24);
            rotorElipseInfo = twgl.primitives.reorientVertices(rotorElipseInfo, twgl.m4.translation([0,.45,0.075]));
            rotorElipseInfo = twgl.primitives.reorientVertices(rotorElipseInfo, twgl.m4.scaling([.95,0.7,1.25]));
            var rotorElipseArray = {
                vpos : { numComponents: rotorElipseInfo.position.numComponents , data: rotorElipseInfo.position },
                vnormal : { numComponents: rotorElipseInfo.normal.numComponents, data: rotorElipseInfo.normal },
                indices : { numComponents: rotorElipseInfo.indices.numComponents, data: rotorElipseInfo.indices }
            };
            rotorElipseBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rotorElipseArray);

            var frontCylInfo = twgl.primitives.createCylinderVertices(.1,0.49,12,24);
            frontCylInfo = twgl.primitives.reorientVertices(frontCylInfo, twgl.m4.rotationZ(270*Math.PI/180));
            frontCylInfo = twgl.primitives.reorientVertices(frontCylInfo, twgl.m4.translation([0,0.35,0.32]));
            var frontCylArray = {
                vpos : { numComponents: frontCylInfo.position.numComponents , data: frontCylInfo.position },
                vnormal : { numComponents: frontCylInfo.normal.numComponents, data: frontCylInfo.normal },
                indices : { numComponents: frontCylInfo.indices.numComponents, data: frontCylInfo.indices }
            };
            frontCylBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, frontCylArray);

            var backCylInfo = twgl.primitives.createCylinderVertices(.1,0.55,12,24);
            backCylInfo = twgl.primitives.reorientVertices(backCylInfo, twgl.m4.rotationZ(270*Math.PI/180));
            backCylInfo = twgl.primitives.reorientVertices(backCylInfo, twgl.m4.translation([0,0.35,-0.25]));
            var backCylArray = {
                vpos : { numComponents: backCylInfo.position.numComponents , data: backCylInfo.position },
                vnormal : { numComponents: backCylInfo.normal.numComponents, data: backCylInfo.normal },
                indices : { numComponents: backCylInfo.indices.numComponents, data: backCylInfo.indices }
            };
            backCylBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, backCylArray);

            var topLeftCylInfo = twgl.primitives.createCylinderVertices(.1,0.65,12,24);
            topLeftCylInfo = twgl.primitives.reorientVertices(topLeftCylInfo, twgl.m4.rotationX(270*Math.PI/180));
            topLeftCylInfo = twgl.primitives.reorientVertices(topLeftCylInfo, twgl.m4.translation([-0.2,0.35,0.025]));
            var topLeftCylArray = {
                vpos : { numComponents: topLeftCylInfo.position.numComponents , data: topLeftCylInfo.position },
                vnormal : { numComponents: topLeftCylInfo.normal.numComponents, data: topLeftCylInfo.normal },
                indices : { numComponents: topLeftCylInfo.indices.numComponents, data: topLeftCylInfo.indices }
            };
            topLeftCylBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, topLeftCylArray);

            var topRightCylInfo = twgl.primitives.createCylinderVertices(.1,0.65,12,24);
            topRightCylInfo = twgl.primitives.reorientVertices(topRightCylInfo, twgl.m4.rotationX(270*Math.PI/180));
            topRightCylInfo = twgl.primitives.reorientVertices(topRightCylInfo, twgl.m4.translation([0.2,0.35,0.025]));
            var topRightCylArray = {
                vpos : { numComponents: topRightCylInfo.position.numComponents , data: topRightCylInfo.position },
                vnormal : { numComponents: topRightCylInfo.normal.numComponents, data: topRightCylInfo.normal },
                indices : { numComponents: topRightCylInfo.indices.numComponents, data: topRightCylInfo.indices }
            };
            topRightCylBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, topRightCylArray);

            var frontLeftSphereInfo = twgl.primitives.createSphereVertices(.12,12,24);
            frontLeftSphereInfo = twgl.primitives.reorientVertices(frontLeftSphereInfo, twgl.m4.translation([-0.2,0.35,0.325]));
            var frontLeftSphereArray = {
                vpos : { numComponents: frontLeftSphereInfo.position.numComponents , data: frontLeftSphereInfo.position },
                vnormal : { numComponents: frontLeftSphereInfo.normal.numComponents, data: frontLeftSphereInfo.normal },
                indices : { numComponents: frontLeftSphereInfo.indices.numComponents, data: frontLeftSphereInfo.indices }
            };
            frontLeftSphereBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, frontLeftSphereArray);

            var frontRightSphereInfo = twgl.primitives.createSphereVertices(.12,12,24);
            frontRightSphereInfo = twgl.primitives.reorientVertices(frontRightSphereInfo, twgl.m4.translation([0.2,0.35,0.325]));
            var frontRightSphereArray = {
                vpos : { numComponents: frontRightSphereInfo.position.numComponents , data: frontRightSphereInfo.position },
                vnormal : { numComponents: frontRightSphereInfo.normal.numComponents, data: frontRightSphereInfo.normal },
                indices : { numComponents: frontRightSphereInfo.indices.numComponents, data: frontRightSphereInfo.indices }
            };
            frontRightSphereBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, frontRightSphereArray);

            var backLeftSphereInfo = twgl.primitives.createSphereVertices(.12,12,24);
            backLeftSphereInfo = twgl.primitives.reorientVertices(backLeftSphereInfo, twgl.m4.translation([-0.23,0.36,-0.25]));
            var backLeftSphereArray = {
                vpos : { numComponents: backLeftSphereInfo.position.numComponents , data: backLeftSphereInfo.position },
                vnormal : { numComponents: backLeftSphereInfo.normal.numComponents, data: backLeftSphereInfo.normal },
                indices : { numComponents: backLeftSphereInfo.indices.numComponents, data: backLeftSphereInfo.indices }
            };
            backLeftSphereBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, backLeftSphereArray);

            var backRightSphereInfo = twgl.primitives.createSphereVertices(.12,12,24);
            backRightSphereInfo = twgl.primitives.reorientVertices(backRightSphereInfo, twgl.m4.translation([0.23,0.36,-0.25]));
            var backRightSphereArray = {
                vpos : { numComponents: backRightSphereInfo.position.numComponents , data: backRightSphereInfo.position },
                vnormal : { numComponents: backRightSphereInfo.normal.numComponents, data: backRightSphereInfo.normal },
                indices : { numComponents: backRightSphereInfo.indices.numComponents, data: backRightSphereInfo.indices }
            };
            backRightSphereBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, backRightSphereArray);

            var rotorPoleInfo = twgl.primitives.createTruncatedConeVertices(.075,.025,0.55,12,24,true,false);
            rotorPoleInfo = twgl.primitives.reorientVertices(rotorPoleInfo, twgl.m4.translation([0,0.475,0]));
            var rotorPoleArray = {
                vpos : { numComponents: rotorPoleInfo.position.numComponents , data: rotorPoleInfo.position},
                vnormal : { numComponents: rotorPoleInfo.normal.numComponents, data: rotorPoleInfo.normal},
                indices : { numComponents: rotorPoleInfo.indices.numComponents, data: rotorPoleInfo.indices}
            };
            rotorPoleBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rotorPoleArray);

            var topRightRotorInfo = twgl.primitives.createTruncatedConeVertices(.025,.1,1.2,12,24);
            topRightRotorInfo = twgl.primitives.reorientVertices(topRightRotorInfo, twgl.m4.scaling([0.25,1,0.5]));
            topRightRotorInfo = twgl.primitives.reorientVertices(topRightRotorInfo, twgl.m4.rotationZ(270*Math.PI/180));
            topRightRotorInfo = twgl.primitives.reorientVertices(topRightRotorInfo, twgl.m4.translation([0.6,0.625,0]));
            var topRightRotorArray = {
                vpos : { numComponents: topRightRotorInfo.position.numComponents , data: topRightRotorInfo.position},
                vnormal : { numComponents: topRightRotorInfo.normal.numComponents, data: topRightRotorInfo.normal},
                indices : { numComponents: topRightRotorInfo.indices.numComponents, data: topRightRotorInfo.indices}
            };
            topRightRotorBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, topRightRotorArray);

            var topLeftRotorInfo = twgl.primitives.createTruncatedConeVertices(.025,.1,1.2,12,24);
            topLeftRotorInfo = twgl.primitives.reorientVertices(topLeftRotorInfo, twgl.m4.scaling([0.25,1,0.5]));
            topLeftRotorInfo = twgl.primitives.reorientVertices(topLeftRotorInfo, twgl.m4.rotationZ(90*Math.PI/180));
            topLeftRotorInfo = twgl.primitives.reorientVertices(topLeftRotorInfo, twgl.m4.translation([-0.6,0.625,0]));
            var topLeftRotorArray = {
                vpos : { numComponents: topLeftRotorInfo.position.numComponents , data: topLeftRotorInfo.position},
                vnormal : { numComponents: topLeftRotorInfo.normal.numComponents, data: topLeftRotorInfo.normal},
                indices : { numComponents: topLeftRotorInfo.indices.numComponents, data: topLeftRotorInfo.indices}
            };
            topLeftRotorBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, topLeftRotorArray);

            var rotorXInfo = twgl.primitives.createTruncatedConeVertices(.025,.1,1.2,12,24);
            rotorXInfo = twgl.primitives.reorientVertices(rotorXInfo, twgl.m4.scaling([0.25,1,0.5]));
            rotorXInfo = twgl.primitives.reorientVertices(rotorXInfo, twgl.m4.rotationZ(270*Math.PI/180));
            rotorXInfo = twgl.primitives.reorientVertices(rotorXInfo, twgl.m4.translation([0.6,0.625,0]));
            rotorXInfo = twgl.primitives.reorientVertices(rotorXInfo, twgl.m4.rotationY(90*Math.PI/180));
            var rotorXArray = {
                vpos : { numComponents: rotorXInfo.position.numComponents , data: rotorXInfo.position},
                vnormal : { numComponents: rotorXInfo.normal.numComponents, data: rotorXInfo.normal},
                indices : { numComponents: rotorXInfo.indices.numComponents, data: rotorXInfo.indices}
            };
            rotorXBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rotorXArray);

            var rotorZInfo = twgl.primitives.createTruncatedConeVertices(.025,.1,1.2,12,24);
            rotorZInfo = twgl.primitives.reorientVertices(rotorZInfo, twgl.m4.scaling([0.25,1,0.5]));
            rotorZInfo = twgl.primitives.reorientVertices(rotorZInfo, twgl.m4.rotationZ(90*Math.PI/180));
            rotorZInfo = twgl.primitives.reorientVertices(rotorZInfo, twgl.m4.translation([-0.6,0.625,0]));
            rotorZInfo = twgl.primitives.reorientVertices(rotorZInfo, twgl.m4.rotationY(90*Math.PI/180));
            var rotorZArray = {
                vpos : { numComponents: rotorZInfo.position.numComponents , data: rotorZInfo.position},
                vnormal : { numComponents: rotorZInfo.normal.numComponents, data: rotorZInfo.normal},
                indices : { numComponents: rotorZInfo.indices.numComponents, data: rotorZInfo.indices}
            };
            rotorZBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rotorZArray);

        }
        this.lastPad = randomHelipad();
        this.position = twgl.v3.add(this.lastPad.center(),[0,.465+this.lastPad.helipadAltitude,0]);
        this.state = 0; // landed
        this.wait = getRandomInt(250,750);
        this.lastTime = 0;
    };
    Copter.prototype.draw = function(drawingState) {
        advance(this,drawingState);
        var gl = drawingState.gl;
        var theta = Number(drawingState.realtime)/150.0;
        var modelM = twgl.m4.rotationY(this.orientation);
        twgl.m4.setTranslation(modelM, this.position, modelM);
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            lightcolor: [1,0,0], model: modelM, tod: drawingState.timeOfDay, light: 0.0
        });
        //Copter Body Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, elipseBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, elipseBuffer);

        //Back Sphere Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, backSphereBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backSphereBuffer);

        //Rotor Pole Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, rotorPoleBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, frontRightSphereBuffer);

        //Copter Back Rotor Gaurd Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, backRotorBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backRotorBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: [0.8,0.8,0.8] });
        //Left Rail Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, leftRailBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, leftRailBuffer);

        //Right Rail Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, rightRailBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rightRailBuffer);

        //Left Cyl Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, leftCylBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, leftCylBuffer);

        //Right Cyl Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, rightCylBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rightCylBuffer);

        //Left Pole Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, leftPoleBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, leftPoleBuffer);

        //Right Pole Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, rightPoleBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rightPoleBuffer);

        //Front Left Sphere Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, frontLeftSphereBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, frontLeftSphereBuffer);

        //Front Right Sphere Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, frontRightSphereBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, frontRightSphereBuffer);

        //Back Left Sphere Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, backLeftSphereBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backLeftSphereBuffer);

        //Back Right Sphere Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, backRightSphereBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backRightSphereBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: [1,1,1] });
        twgl.setBuffersAndAttributes(gl, shaderProgram, coneBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, coneBuffer);

        //Top Rotor Blade Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, backTopRotorBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backTopRotorBuffer);

        //Bottom Rotor Blade Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, backBottomRotorBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backBottomRotorBuffer);

        //Top Rotor Body Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, rotorBodyBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rotorBodyBuffer);

        //Rotor Elipse Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, rotorElipseBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rotorElipseBuffer);

        //Front Cylinder Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, frontCylBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, frontCylBuffer);

        //Back Cylinder Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, backCylBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backCylBuffer);

        //Top Left Cylinder Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, topLeftCylBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, topLeftCylBuffer);

        //Top Right Cylinder Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, topRightCylBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, topRightCylBuffer);

        //Copter Back Rotor Gaurd Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, backRotorBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backRotorBuffer);

        
        if(this.state != 0) {
            twgl.m4.rotateY(modelM, -theta, modelM);
            twgl.setUniforms(shaderProgram, { model: modelM });
        }

        //Left Rotor Blade Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, topLeftRotorBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backLeftSphereBuffer);

        //Left Rotor Blade Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, topRightRotorBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, topRightRotorBuffer);

        //Left Rotor Blade Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, rotorXBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rotorXBuffer);

        //Left Rotor Blade Buffer
        twgl.setBuffersAndAttributes(gl, shaderProgram, rotorZBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rotorZBuffer);

    };
    Copter.prototype.center = function(drawingState) {
        return this.position;
    };
    Helipad = function Helipad(position) {
        this.name = "helipad"+padNumber++;
        this.position = position || [2,0.01,2];
        this.size = 0.5;
        this.helipad = true;
        this.helipadAltitude = 0;
    };
    Helipad.prototype.init = function(drawingState) {
        var gl=drawingState.gl;

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["streetlight-vs", "streetlight-fs"]);
        }
        if (!padBuffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                        -1,0,-1, -1,0,1, -.5,0,1, -.5,0,-1,
                        1,0,-1, 1,0,1, .5,0,1, .5,0,-1,
                        -.5,0,-.25, -.5,0,.25,.5,0,.25,.5,0, -.25
                    ] },
                vnormal : {numComponents:3, data: [
                        0,1,0, 0,1,0, 0,1,0, 0,1,0,
                        0,1,0, 0,1,0, 0,1,0, 0,1,0,
                        0,1,0, 0,1,0, 0,1,0, 0,1,0
                    ]},
                indices : [0,1,2, 0,2,3, 4,5,6, 4,6,7, 8,9,10, 8,10,11
                ]
            };
            padBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    };
    Helipad.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,{
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            lightcolor:[1,0,0], model: modelM, tod: drawingState.timeOfDay, light: 1.0
        });
        twgl.setBuffersAndAttributes(gl,shaderProgram,padBuffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, padBuffers);
    };
    Helipad.prototype.center = function(drawingState) {
        return this.position;
    };
    var altitude = 12;
    var verticalSpeed = 3/500;      // units per milli-second
    var flyingSpeed = 3/300;          // units per milli-second
    var turningSpeed = 2/500;         // radians per milli-second

    // utility - generate random  integer
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    // find a random helipad - allow for excluding one (so we don't re-use last target)
    function randomHelipad(exclude) {
        var helipads = grobjects.filter(function(obj) {return (obj.helipad && (obj!=exclude))});
        if (!helipads.length) {
            throw("No Helipads for the helicopter!");
        }
        var idx = getRandomInt(0,helipads.length);
        return helipads[idx];
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
                    heli.state = 1;
                    heli.wait = 0;
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
                    heli.state = 2;
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
                    heli.state = 4;
                }
                break;
            case 4: // land at goal
                var destAlt = heli.lastPad.position[1] + .475 + heli.lastPad.helipadAltitude;
                if (heli.position[1] > destAlt) {
                    var down = delta * verticalSpeed;
                    heli.position[1] = Math.max(destAlt,heli.position[1]-down);
                } else { // on the ground!
                    heli.state = 0;
                    heli.wait = getRandomInt(500,1000);
                }
                break;
        }
    }
})();
grobjects.push(new Helipad([0,8.51,-3.75]));
grobjects.push(new Helipad([-100,3.21,-100]));
grobjects.push(new Helipad([100,3.21,100]));
grobjects.push(new Copter());

