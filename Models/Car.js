var grobjects = grobjects || [],
    Car = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() { "use strict";

    var shaderProgram = undefined,
        noseBuffer = undefined, chasisBuffer =  undefined, backBuffer = undefined,
        leftWindowBuffer = undefined, rightWindowBuffer = undefined,
        leftLightBuffer = undefined, rightLightBuffer = undefined,
        wheelABuffer = undefined, wheelBBuffer = undefined, wheelCBuffer = undefined, wheelDBuffer = undefined,
        frontAxelBuffer = undefined, backAxelBuffer = undefined,
        numCars = 1, speed = 0.05, theta = 0;

    // constructor for Cars
    Car = function Car(position,color,angle,outside,moving) {
        this.name = "Car" + numCars++;
        this.position = position || [0,0,0];
        this.noseColor = [0.137255,0.419608,0.556863];
        this.chasisColor = color || [1,1,0];
        this.angle = angle || 0;
        this.outside = outside || false;
        this.move = moving;
        this.starting = twgl.v3.copy(this.position);
        this.read = false;
        this.wheelA = twgl.v3.add(this.position,[0.2,0.08,-0.1]);
        this.wheelB = twgl.v3.add(this.position,[-0.2,0.08,-0.1]);
        this.wheelC = twgl.v3.add(this.position,[-0.2,0.08,0.3]);
        this.wheelD = twgl.v3.add(this.position,[0.2,0.08,0.3]);
        this.up, this.down, this.left, this.right;
    };
    Car.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["car-vs", "car-fs"]);
        }
        if (!noseBuffer) {
            var noseInfo = twgl.primitives.createCubeVertices();
            noseInfo = twgl.primitives.reorientVertices(noseInfo, twgl.m4.scaling([0.351,0.16,0.625]));
            noseInfo = twgl.primitives.reorientVertices(noseInfo, twgl.m4.translation([0,0.165,0.099]));
            var noseArray = {
                vpos: {numComponents: noseInfo.position.numComponents, data: noseInfo.position},
                vnormal: {numComponents: noseInfo.normal.numComponents, data: noseInfo.normal},
                indices: {numComponents: noseInfo.indices.numComponents, data: noseInfo.indices}
            };
            noseBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, noseArray);

            var chasisInfo = twgl.primitives.createCubeVertices();
            chasisInfo = twgl.primitives.reorientVertices(chasisInfo, twgl.m4.scaling([.35,.325,.425]));
            chasisInfo = twgl.primitives.reorientVertices(chasisInfo, twgl.m4.translation([0,.25,0]));
            var chasisArray = {
                vpos: {numComponents: chasisInfo.position.numComponents, data: chasisInfo.position},
                vnormal: {numComponents: chasisInfo.normal.numComponents, data: chasisInfo.normal},
                indices: {numComponents: chasisInfo.indices.numComponents, data: chasisInfo.indices}
            };
            chasisBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, chasisArray);

            var backInfo = twgl.primitives.createCubeVertices();
            backInfo = twgl.primitives.reorientVertices(backInfo, twgl.m4.scaling([.25,.125,.176]));
            backInfo = twgl.primitives.reorientVertices(backInfo, twgl.m4.translation([0,.33,-0.125]));
            var backArray = {
                vpos: {numComponents: backInfo.position.numComponents, data: backInfo.position},
                vnormal: {numComponents: backInfo.normal.numComponents, data: backInfo.normal},
                indices: {numComponents: backInfo.indices.numComponents, data: backInfo.indices}
            };
            backBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, backArray);

            var rightWindowInfo = twgl.primitives.createCubeVertices();
            rightWindowInfo = twgl.primitives.reorientVertices(rightWindowInfo, twgl.m4.scaling([.1,.075,.41]));
            rightWindowInfo = twgl.primitives.reorientVertices(rightWindowInfo, twgl.m4.translation([0.065,.325,0.01]));
            var rightWindowArray = {
                vpos: {numComponents: rightWindowInfo.position.numComponents, data: rightWindowInfo.position},
                vnormal: {numComponents: rightWindowInfo.normal.numComponents, data: rightWindowInfo.normal},
                indices: {numComponents: rightWindowInfo.indices.numComponents, data: rightWindowInfo.indices}
            };
            rightWindowBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rightWindowArray);

            var leftWindowInfo = twgl.primitives.createCubeVertices();
            leftWindowInfo = twgl.primitives.reorientVertices(leftWindowInfo, twgl.m4.scaling([.1,.075,.41]));
            leftWindowInfo = twgl.primitives.reorientVertices(leftWindowInfo, twgl.m4.translation([-0.065,.325,0.01]));
            var leftWindowArray = {
                vpos: {numComponents: leftWindowInfo.position.numComponents, data: leftWindowInfo.position},
                vnormal: {numComponents: leftWindowInfo.normal.numComponents, data: leftWindowInfo.normal},
                indices: {numComponents: leftWindowInfo.indices.numComponents, data: leftWindowInfo.indices}
            };
            leftWindowBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, leftWindowArray);

            var leftLightInfo = twgl.primitives.createSphereVertices(0.045,12,24);
            leftLightInfo = twgl.primitives.reorientVertices(leftLightInfo, twgl.m4.translation([-0.095,0.175,0.4]));
            var leftLightArray = {
                vpos: {numComponents: leftLightInfo.position.numComponents, data: leftLightInfo.position},
                vnormal: {numComponents: leftLightInfo.normal.numComponents, data: leftLightInfo.normal},
                indices: {numComponents: leftLightInfo.indices.numComponents, data: leftLightInfo.indices}
            };
            leftLightBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, leftLightArray);

            var rightLightInfo = twgl.primitives.createSphereVertices(0.045,12,24);
            rightLightInfo = twgl.primitives.reorientVertices(rightLightInfo, twgl.m4.translation([0.095,0.175,0.4]));
            var rightLightArray = {
                vpos: {numComponents: rightLightInfo.position.numComponents, data: rightLightInfo.position},
                vnormal: {numComponents: rightLightInfo.normal.numComponents, data: rightLightInfo.normal},
                indices: {numComponents: rightLightInfo.indices.numComponents, data: rightLightInfo.indices}
            };
            rightLightBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rightLightArray);

            var rightLightInfo = twgl.primitives.createSphereVertices(0.045,12,24);
            rightLightInfo = twgl.primitives.reorientVertices(rightLightInfo, twgl.m4.translation([0.095,0.175,0.4]));
            var rightLightArray = {
                vpos: {numComponents: rightLightInfo.position.numComponents, data: rightLightInfo.position},
                vnormal: {numComponents: rightLightInfo.normal.numComponents, data: rightLightInfo.normal},
                indices: {numComponents: rightLightInfo.indices.numComponents, data: rightLightInfo.indices}
            };
            rightLightBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rightLightArray);

            var wheelAInfo = twgl.primitives.createTorusVertices(0.055,0.03,12,24);
            wheelAInfo = twgl.primitives.reorientVertices(wheelAInfo, twgl.m4.rotationZ(90*Math.PI/180));
            if(!this.move) {
                wheelAInfo = twgl.primitives.reorientVertices(wheelAInfo, twgl.m4.translation([0.2,0.08,-0.1]));
            }
            var wheelAArray = {
                vpos: {numComponents: wheelAInfo.position.numComponents, data: wheelAInfo.position},
                vnormal: {numComponents: wheelAInfo.normal.numComponents, data: wheelAInfo.normal},
                indices: {numComponents: wheelAInfo.indices.numComponents, data: wheelAInfo.indices}
            };
            wheelABuffer = twgl.createBufferInfoFromArrays(drawingState.gl, wheelAArray);

            var wheelBInfo = twgl.primitives.createTorusVertices(0.055,0.03,12,24);
            wheelBInfo = twgl.primitives.reorientVertices(wheelBInfo, twgl.m4.rotationZ(90*Math.PI/180));
            if(!this.move) {
                wheelBInfo = twgl.primitives.reorientVertices(wheelBInfo, twgl.m4.translation([-0.2,0.08,-0.1]));
            }
            var wheelBArray = {
                vpos: {numComponents: wheelBInfo.position.numComponents, data: wheelBInfo.position},
                vnormal: {numComponents: wheelBInfo.normal.numComponents, data: wheelBInfo.normal},
                indices: {numComponents: wheelBInfo.indices.numComponents, data: wheelBInfo.indices}
            };
            wheelBBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, wheelBArray);

            var wheelCInfo = twgl.primitives.createTorusVertices(0.055,0.03,12,24);
            wheelCInfo = twgl.primitives.reorientVertices(wheelCInfo, twgl.m4.rotationZ(90*Math.PI/180));
            if(!this.move) {
                wheelCInfo = twgl.primitives.reorientVertices(wheelCInfo, twgl.m4.translation([-0.2,0.08,0.3]));
            }
            var wheelCArray = {
                vpos: {numComponents: wheelCInfo.position.numComponents, data: wheelCInfo.position},
                vnormal: {numComponents: wheelCInfo.normal.numComponents, data: wheelCInfo.normal},
                indices: {numComponents: wheelCInfo.indices.numComponents, data: wheelCInfo.indices}
            };
            wheelCBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, wheelCArray);

            var wheelDinfo = twgl.primitives.createTorusVertices(0.055,0.03,12,24);
            wheelDinfo = twgl.primitives.reorientVertices(wheelDinfo, twgl.m4.rotationZ(90*Math.PI/180));
            if(!this.move) {
                wheelDinfo = twgl.primitives.reorientVertices(wheelDinfo, twgl.m4.translation([0.2,0.08,0.3]));
            }
            var wheelDArray = {
                vpos: {numComponents: wheelDinfo.position.numComponents, data: wheelDinfo.position},
                vnormal: {numComponents: wheelDinfo.normal.numComponents, data: wheelDinfo.normal},
                indices: {numComponents: wheelDinfo.indices.numComponents, data: wheelDinfo.indices}
            };
            wheelDBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, wheelDArray);

            var frontAxelInfo = twgl.primitives.createCylinderVertices(0.03,0.4,12,24);
            frontAxelInfo = twgl.primitives.reorientVertices(frontAxelInfo, twgl.m4.rotationZ(90*Math.PI/180));
            frontAxelInfo = twgl.primitives.reorientVertices(frontAxelInfo, twgl.m4.translation([0,0.075,0.3]));
            var frontAxelArray = {
                vpos: {numComponents: frontAxelInfo.position.numComponents, data: frontAxelInfo.position},
                vnormal: {numComponents: frontAxelInfo.normal.numComponents, data: frontAxelInfo.normal},
                indices: {numComponents: frontAxelInfo.indices.numComponents, data: frontAxelInfo.indices}
            };
            frontAxelBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, frontAxelArray);

            var backAxelInfo = twgl.primitives.createCylinderVertices(0.03,0.4,12,24);
            backAxelInfo = twgl.primitives.reorientVertices(backAxelInfo, twgl.m4.rotationZ(90*Math.PI/180));
            backAxelInfo = twgl.primitives.reorientVertices(backAxelInfo, twgl.m4.translation([0,0.075,-0.1]));
            var backAxelArray = {
                vpos: {numComponents: backAxelInfo.position.numComponents, data: backAxelInfo.position},
                vnormal: {numComponents: backAxelInfo.normal.numComponents, data: backAxelInfo.normal},
                indices: {numComponents: backAxelInfo.indices.numComponents, data: backAxelInfo.indices}
            };
            backAxelBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, backAxelArray);

        }
    };
    Car.prototype.draw = function(drawingState) {

        if(this.move) { moveCar(this); }
        theta -= speed * 500;

        var modelM = twgl.m4.rotationY(this.angle);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);

        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            lightcolor: this.noseColor, model: modelM, tod: drawingState.timeOfDay, light: 0.0
        });

        twgl.setBuffersAndAttributes(gl, shaderProgram, noseBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, noseBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: this.chasisColor, model: modelM });
        twgl.setBuffersAndAttributes(gl, shaderProgram, chasisBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, chasisBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: [0.678431,0.917647,0.917647], model: modelM, light: 1.0});
        twgl.setBuffersAndAttributes(gl, shaderProgram, rightWindowBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rightWindowBuffer);
        twgl.setBuffersAndAttributes(gl, shaderProgram, leftWindowBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, leftWindowBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: [0.678431,0.917647,0.917647], model: modelM, light: 0.0});
        twgl.setBuffersAndAttributes(gl, shaderProgram, backBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: [1,1,0], model: modelM, light: 1.0 });
        twgl.setBuffersAndAttributes(gl, shaderProgram, leftLightBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, leftLightBuffer);
        twgl.setBuffersAndAttributes(gl, shaderProgram, rightLightBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rightLightBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: [0.8,0.8,0.8], model: modelM });
        twgl.setBuffersAndAttributes(gl, shaderProgram, frontAxelBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, frontAxelBuffer);
        twgl.setBuffersAndAttributes(gl, shaderProgram, backAxelBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backAxelBuffer);

        if(this.move == 1) { 

            var modelA = twgl.m4.identity();
            twgl.m4.translate(modelA,this.wheelA,modelA);
            twgl.m4.rotateY(modelA,this.angle,modelA);
            twgl.m4.rotateX(modelA,theta*Math.PI/180,modelA);
            twgl.setUniforms(shaderProgram, { lightcolor: [0.329412,0.329412,0.329412], model: modelA, light: 0.0 });
            twgl.setBuffersAndAttributes(gl, shaderProgram, wheelABuffer);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelABuffer);

            var modelB = twgl.m4.identity();
            twgl.m4.translate(modelB,this.wheelB,modelB);
            twgl.m4.rotateY(modelB,this.angle,modelB);
            twgl.m4.rotateX(modelB,theta*Math.PI/180,modelB);
            twgl.setUniforms(shaderProgram, { model: modelB });
            twgl.setBuffersAndAttributes(gl, shaderProgram, wheelBBuffer);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelBBuffer);

            var modelC = twgl.m4.identity();
            twgl.m4.translate(modelC,this.wheelC,modelC);
            twgl.m4.rotateY(modelC,this.angle,modelC);
            twgl.m4.rotateX(modelC,theta*Math.PI/180,modelC);
            twgl.setUniforms(shaderProgram, { model: modelC });
            twgl.setBuffersAndAttributes(gl, shaderProgram, wheelCBuffer);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelCBuffer);

            var modelD = twgl.m4.identity();
            twgl.m4.translate(modelD,this.wheelD,modelD);
            twgl.m4.rotateY(modelD,this.angle,modelD);
            twgl.m4.rotateX(modelD,theta*Math.PI/180,modelD);
            twgl.setUniforms(shaderProgram, { model: modelD });
            twgl.setBuffersAndAttributes(gl, shaderProgram, wheelDBuffer);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelDBuffer);

        } else {

            twgl.setUniforms(shaderProgram, { lightcolor: [0.329412,0.329412,0.329412], model: modelM, light: 0.0 });
            twgl.setBuffersAndAttributes(gl, shaderProgram, wheelABuffer);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelABuffer);
            twgl.setBuffersAndAttributes(gl, shaderProgram, wheelBBuffer);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelBBuffer);
            twgl.setBuffersAndAttributes(gl, shaderProgram, wheelCBuffer);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelCBuffer);
            twgl.setBuffersAndAttributes(gl, shaderProgram, wheelDBuffer);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelDBuffer);
        }
        
    };
    Car.prototype.center = function(drawingState) {
        return this.position;
    };
    function moveCar(car) {

        if(car.outside) { 
            if(!car.read) {
                if(car.position[0] == 6.5 && car.position[2] == -6.5) { car.down = true; }              //Red Cars
                else if(car.position[0] == 6.5 && car.position[2] == -3.25) { car.down = true;}
                else if(car.position[0] == 6.5 && car.position[2] == 0) { car.down = true; }
                else if(car.position[0] == 6.5 && car.position[2] == 3.25) { car.down = true; } 

                else if(car.position[0] == 6.5 && car.position[2] == 6.5) { car.left = true; }          //Yellow Cars
                else if(car.position[0] == 3.25 && car.position[2] == 6.5) { car.left = true; }
                else if(car.position[0] == 0 && car.position[2] == 6.5) { car.left = true; }
                else if(car.position[0] == -3.25 && car.position[2] == 6.5) { car.left = true; }      

                else if(car.position[0] == -6.5 && car.position[2] == -6.5) { car.right = true; }        //Purple Cars
                else if(car.position[0] == -3.25 && car.position[2] == -6.5) { car.right = true; }
                else if(car.position[0] == 0 && car.position[2] == -6.5) { car.right = true; }
                else if(car.position[0] == 3.25 && car.position[2] == -6.5) { car.right = true; }      

                else if(car.position[0] == -6.5 && car.position[2] == 6.5) { car.up = true; }           //Blue Cars
                else if(car.position[0] == -6.5 && car.position[2] == 3.25) { car.up = true; }
                else if(car.position[0] == -6.5 && car.position[2] == 0) { car.up = true; }
                else if(car.position[0] == -6.5 && car.position[2] == -3.25) { car.up = true; }         
            }
            if(car.position[2] < 6.5 && car.down) {
                if(!car.read) { car.read = true; }
                car.angle = 0;
                car.position[2] += speed; 
                car.wheelA[2] += speed; car.wheelB[2] += speed; car.wheelC[2] += speed; car.wheelD[2] += speed;
                if(car.position[2] >= 6.5) { 
                    car.down = false; car.left = true;
                    car.wheelA[0] -= 0.1; car.wheelB[0] -= 0.1; car.wheelC[0] -= 0.1; car.wheelD[0] -= 0.1;
                    car.wheelA[2] -= 0.1; car.wheelB[2] -= 0.1; car.wheelC[2] -= 0.1; car.wheelD[2] -= 0.1;
                }
            } else if(car.position[0] > -6.5 && car.left) {
                if(!car.read) {
                    car.wheelA[0] -= 0.1; car.wheelB[0] -= 0.1; car.wheelC[0] -= 0.1; car.wheelD[0] -= 0.1;
                    car.wheelA[2] -= 0.1; car.wheelB[2] -= 0.1; car.wheelC[2] -= 0.1; car.wheelD[2] -= 0.1;
                    car.read = true;
                }
                car.angle = 270*Math.PI/180;
                car.position[0] -= speed;
                car.wheelA[0] -= speed; car.wheelB[0] -= speed; car.wheelC[0] -= speed; car.wheelD[0] -= speed;
                if(car.position[0] <= -6.5) { 
                    car.left = false; car.up = true;
                    car.wheelA[0] += 0.1; car.wheelB[0] += 0.1; car.wheelC[0] += 0.1; car.wheelD[0] += 0.1;
                    car.wheelA[2] -= 0.1; car.wheelB[2] -= 0.1; car.wheelC[2] -= 0.1; car.wheelD[2] -= 0.1;
                }
            } else if(car.position[2] > -6.5 && car.up) {
                if(!car.read) {
                    car.wheelA[2] -= 0.2; car.wheelB[2] -= 0.2; car.wheelC[2] -= 0.2; car.wheelD[2] -= 0.2;
                    car.read = true;
                }
                car.angle = 180*Math.PI/180;
                car.position[2] -= speed;
                car.wheelA[2] -= speed; car.wheelB[2] -= speed; car.wheelC[2] -= speed; car.wheelD[2] -= speed;
                if(car.position[2] <= -6.5) { 
                    car.up = false; car.right = true; 
                    car.wheelA[0] += 0.1; car.wheelB[0] += 0.1; car.wheelC[0] += 0.1; car.wheelD[0] += 0.1;
                    car.wheelA[2] += 0.1; car.wheelB[2] += 0.1; car.wheelC[2] += 0.1; car.wheelD[2] += 0.1;
                }
            } else if(car.position[0] < 6.5 && car.right) {
                if(!car.read) {
                    car.wheelA[0] += 0.1; car.wheelB[0] += 0.1; car.wheelC[0] += 0.1; car.wheelD[0] += 0.1;
                    car.wheelA[2] -= 0.1; car.wheelB[2] -= 0.1; car.wheelC[2] -= 0.1; car.wheelD[2] -= 0.1;
                    car.read = true;
                }
                car.angle = 90*Math.PI/180;
                car.position[0] += speed;
                car.wheelA[0] += speed; car.wheelB[0] += speed; car.wheelC[0] += speed; car.wheelD[0] += speed;
                if(car.position[0] >= 6.5) { 
                    car.right = false; car.down = true;
                    car.wheelA[0] -= 0.1; car.wheelB[0] -= 0.1; car.wheelC[0] -= 0.1; car.wheelD[0] -= 0.1;
                    car.wheelA[2] += 0.1; car.wheelB[2] += 0.1; car.wheelC[2] += 0.1; car.wheelD[2] += 0.1;
                }
            }
        } else {
            if(!car.read) {
                if(car.position[0] == 5.75 && car.position[2] == 5.75) { car.up = true; }              //Red Cars
                else if(car.position[0] == 5.75 && car.position[2] == 2.875) { car.up = true;}
                else if(car.position[0] == 5.75 && car.position[2] == 0) { car.up = true; }
                else if(car.position[0] == 5.75 && car.position[2] == -2.875) { car.up = true; } 

                else if(car.position[0] == 5.75 && car.position[2] == -5.75) { car.left = true; }          //Yellow Cars
                else if(car.position[0] == 2.875 && car.position[2] == -5.75) { car.left = true; }
                else if(car.position[0] == 0 && car.position[2] == -5.75) { car.left = true; }
                else if(car.position[0] == -2.875 && car.position[2] == -5.75) { car.left = true; }      

                else if(car.position[0] == -5.75 && car.position[2] == -5.75) { car.down = true; }        //Purple Cars
                else if(car.position[0] == -5.75 && car.position[2] == -2.875) { car.down = true; }
                else if(car.position[0] == -5.75 && car.position[2] == 0) { car.down = true; }
                else if(car.position[0] == -5.75 && car.position[2] == 2.875) { car.down = true; }      

                else if(car.position[0] == -5.75 && car.position[2] == 5.75) { car.right = true; }           //Blue Cars
                else if(car.position[0] == -2.875 && car.position[2] == 5.75) { car.right = true; }
                else if(car.position[0] == 0 && car.position[2] == 5.75) { car.right = true; }
                else if(car.position[0] == 2.875 && car.position[2] == 5.75) { car.right = true; }         
            }
            if(car.position[2] < 5.75 && car.down) {
                if(!car.read) { car.read = true; }
                car.angle = 0;
                car.position[2] += speed; 
                car.wheelA[2] += speed; car.wheelB[2] += speed; car.wheelC[2] += speed; car.wheelD[2] += speed;
                if(car.position[2] >= 5.75) { 
                    car.down = false; car.right = true;
                    car.wheelA[0] += 0.1; car.wheelB[0] += 0.1; car.wheelC[0] += 0.1; car.wheelD[0] += 0.1;
                    car.wheelA[2] -= 0.1; car.wheelB[2] -= 0.1; car.wheelC[2] -= 0.1; car.wheelD[2] -= 0.1;
                }
            } else if(car.position[0] > -5.75 && car.left) {
                if(!car.read) {
                    car.wheelA[0] -= 0.1; car.wheelB[0] -= 0.1; car.wheelC[0] -= 0.1; car.wheelD[0] -= 0.1;
                    car.wheelA[2] -= 0.1; car.wheelB[2] -= 0.1; car.wheelC[2] -= 0.1; car.wheelD[2] -= 0.1;
                    car.read = true;
                }
                car.angle = 270*Math.PI/180;
                car.position[0] -= speed;
                car.wheelA[0] -= speed; car.wheelB[0] -= speed; car.wheelC[0] -= speed; car.wheelD[0] -= speed;
                if(car.position[0] <= -5.75) { 
                    car.left = false; car.down = true;
                    car.wheelA[0] += 0.1; car.wheelB[0] += 0.1; car.wheelC[0] += 0.1; car.wheelD[0] += 0.1;
                    car.wheelA[2] += 0.1; car.wheelB[2] += 0.1; car.wheelC[2] += 0.1; car.wheelD[2] += 0.1;
                }
            } else if(car.position[2] > -5.75 && car.up) {
                if(!car.read) {
                    car.wheelA[2] -= 0.2; car.wheelB[2] -= 0.2; car.wheelC[2] -= 0.2; car.wheelD[2] -= 0.2;
                    car.read = true;
                }
                car.angle = 180*Math.PI/180;
                car.position[2] -= speed;
                car.wheelA[2] -= speed; car.wheelB[2] -= speed; car.wheelC[2] -= speed; car.wheelD[2] -= speed;
                if(car.position[2] <= -5.75) { 
                    car.up = false; car.left = true; 
                    car.wheelA[0] -= 0.1; car.wheelB[0] -= 0.1; car.wheelC[0] -= 0.1; car.wheelD[0] -= 0.1;
                    car.wheelA[2] += 0.1; car.wheelB[2] += 0.1; car.wheelC[2] += 0.1; car.wheelD[2] += 0.1;
                }
            } else if(car.position[0] < 5.75 && car.right) {
                if(!car.read) {
                    car.wheelA[0] += 0.1; car.wheelB[0] += 0.1; car.wheelC[0] += 0.1; car.wheelD[0] += 0.1;
                    car.wheelA[2] -= 0.1; car.wheelB[2] -= 0.1; car.wheelC[2] -= 0.1; car.wheelD[2] -= 0.1;
                    car.read = true;
                }
                car.angle = 90*Math.PI/180;
                car.position[0] += speed;
                car.wheelA[0] += speed; car.wheelB[0] += speed; car.wheelC[0] += speed; car.wheelD[0] += speed;
                if(car.position[0] >= 5.75) { 
                    car.right = false; car.up = true;
                    car.wheelA[0] -= 0.1; car.wheelB[0] -= 0.1; car.wheelC[0] -= 0.1; car.wheelD[0] -= 0.1;
                    car.wheelA[2] -= 0.1; car.wheelB[2] -= 0.1; car.wheelC[2] -= 0.1; car.wheelD[2] -= 0.1;
                }
            }
        }
    }
})();

//Positive X Cars - Outside 
grobjects.push(new Car([6.5,0,-6.5],[1,0,0],0,true,true));
grobjects.push(new Car([6.5,0,-3.25],[1,1,0],0,true,true));
grobjects.push(new Car([6.5,0,0],[0,0,1],0,true,true)); 
grobjects.push(new Car([6.5,0,3.25],[1,0,1],0,true,true)); 

//Positive Z Cars - Outside 
grobjects.push(new Car([6.5,0,6.5],[1,0,0],0,true,true));
grobjects.push(new Car([3.25,0,6.5],[1,1,0],0,true,true));
grobjects.push(new Car([0,0,6.5],[0,0,1],0,true,true));
grobjects.push(new Car([-3.25,0,6.5],[1,0,1],0,true,true));

//Negative X Cars - Outside 
grobjects.push(new Car([-6.5,0,6.5],[1,0,0],0,true,true));
grobjects.push(new Car([-6.5,0,3.25],[1,1,0],0,true,true));
grobjects.push(new Car([-6.5,0,0],[0,0,1],0,true,true));
grobjects.push(new Car([-6.5,0,-3.25],[1,0,1],0,true,true));

//Negative Z Cars - Outside 
grobjects.push(new Car([-6.5,0,-6.5],[1,0,0],0,true,true));
grobjects.push(new Car([-3.25,0,-6.5],[1,1,0],0,true,true));
grobjects.push(new Car([0,0,-6.5],[0,0,1],0,true,true));
grobjects.push(new Car([3.25,0,-6.5],[1,0,1],0,true,true));

//Positive X - Inside
grobjects.push(new Car([5.75,0,5.75],[1,0,0],0,false,true));
grobjects.push(new Car([5.75,0,2.875],[1,1,0],0,false,true));
grobjects.push(new Car([5.75,0,0],[0,0,1],0,false,true)); 
grobjects.push(new Car([5.75,0,-2.875],[1,0,1],0,false,true)); 

//Negative Z Cars - Inside
grobjects.push(new Car([5.75,0,-5.75],[1,0,0],0,false,true));
grobjects.push(new Car([2.875,0,-5.75],[1,1,0],0,false,true));
grobjects.push(new Car([0,0,-5.75],[0,0,1],0,false,true));
grobjects.push(new Car([-2.875,0,-5.75],[1,0,1],0,false,true));

//Negative X Cars - Inside
grobjects.push(new Car([-5.75,0,-5.75],[1,0,0],0,false,true));
grobjects.push(new Car([-5.75,0,-2.875],[1,1,0],0,false,true));
grobjects.push(new Car([-5.75,0,0],[0,0,1],0,false,true));
grobjects.push(new Car([-5.75,0,2.875],[1,0,1],0,false,true));

//Postive Z Cars - Inside
grobjects.push(new Car([-5.75,0,5.75],[1,0,0],0,false,true));
grobjects.push(new Car([-2.875,0,5.75],[1,1,0],0,false,true));
grobjects.push(new Car([0,0,5.75],[0,0,1],0,false,true));
grobjects.push(new Car([2.875,0,5.75],[1,0,1],0,false,true));