var grobjects = grobjects || [],
    Ambulance = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() { "use strict";

    var shaderProgram = undefined,
        noseBuffer = undefined, chasisBuffer =  undefined, backBuffer = undefined, 
        sirenBuffer = undefined, redBuffer = undefined, blueBuffer = undefined,
        leftWindowBuffer = undefined, rightWindowBuffer = undefined,
        ySymbolBuffer = undefined, zSymbolBuffer = undefined, 
        leftLightBuffer = undefined, rightLightBuffer = undefined,
        wheelABuffer = undefined, wheelBBuffer = undefined, wheelCBuffer = undefined, wheelDBuffer = undefined,
        frontAxelBuffer = undefined, backAxelBuffer = undefined;

    // constructor for Ambulances
    Ambulance = function Ambulance(position, angle) {
        this.name = "Ambulance";
        this.position = position || [0,0,0];
        this.noseColor = [1,0,0];
        this.chasisColor = [1,1,1];
        this.angle = angle || 0;
    };
    Ambulance.prototype.init = function(drawingState) {
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
            backInfo = twgl.primitives.reorientVertices(backInfo, twgl.m4.scaling([.315,.275,.2]));
            backInfo = twgl.primitives.reorientVertices(backInfo, twgl.m4.translation([0,.25,-0.125]));
            var backArray = {
                vpos: {numComponents: backInfo.position.numComponents, data: backInfo.position},
                vnormal: {numComponents: backInfo.normal.numComponents, data: backInfo.normal},
                indices: {numComponents: backInfo.indices.numComponents, data: backInfo.indices}
            };
            backBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, backArray);

            var sirenInfo = twgl.primitives.createCubeVertices();
            sirenInfo = twgl.primitives.reorientVertices(sirenInfo, twgl.m4.scaling([.275,.12,.1]));
            sirenInfo = twgl.primitives.reorientVertices(sirenInfo, twgl.m4.translation([0,.4,0.12]));
            var sirenArray = {
                vpos: {numComponents: sirenInfo.position.numComponents, data: sirenInfo.position},
                vnormal: {numComponents: sirenInfo.normal.numComponents, data: sirenInfo.normal},
                indices: {numComponents: sirenInfo.indices.numComponents, data: sirenInfo.indices}
            };
            sirenBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, sirenArray);

            var redInfo = twgl.primitives.createCubeVertices();
            redInfo = twgl.primitives.reorientVertices(redInfo, twgl.m4.scaling([.085,.121,.11]));
            redInfo = twgl.primitives.reorientVertices(redInfo, twgl.m4.translation([-0.1,.4,0.12]));
            var redArray = {
                vpos: {numComponents: redInfo.position.numComponents, data: redInfo.position},
                vnormal: {numComponents: redInfo.normal.numComponents, data: redInfo.normal},
                indices: {numComponents: redInfo.indices.numComponents, data: redInfo.indices}
            };
            redBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, redArray);

            var blueInfo = twgl.primitives.createCubeVertices();
            blueInfo = twgl.primitives.reorientVertices(blueInfo, twgl.m4.scaling([.085,.121,.11]));
            blueInfo = twgl.primitives.reorientVertices(blueInfo, twgl.m4.translation([0.1,.4,0.12]));
            var blueArray = {
                vpos: {numComponents: blueInfo.position.numComponents, data: blueInfo.position},
                vnormal: {numComponents: blueInfo.normal.numComponents, data: blueInfo.normal},
                indices: {numComponents: blueInfo.indices.numComponents, data: blueInfo.indices}
            };
            blueBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, blueArray);

            var rightWindowInfo = twgl.primitives.createCubeVertices();
            rightWindowInfo = twgl.primitives.reorientVertices(rightWindowInfo, twgl.m4.scaling([.1,.075,.451]));
            rightWindowInfo = twgl.primitives.reorientVertices(rightWindowInfo, twgl.m4.translation([0.065,.325,0]));
            var rightWindowArray = {
                vpos: {numComponents: rightWindowInfo.position.numComponents, data: rightWindowInfo.position},
                vnormal: {numComponents: rightWindowInfo.normal.numComponents, data: rightWindowInfo.normal},
                indices: {numComponents: rightWindowInfo.indices.numComponents, data: rightWindowInfo.indices}
            };
            rightWindowBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rightWindowArray);

            var leftWindowInfo = twgl.primitives.createCubeVertices();
            leftWindowInfo = twgl.primitives.reorientVertices(leftWindowInfo, twgl.m4.scaling([.1,.075,.451]));
            leftWindowInfo = twgl.primitives.reorientVertices(leftWindowInfo, twgl.m4.translation([-0.065,.325,0]));
            var leftWindowArray = {
                vpos: {numComponents: leftWindowInfo.position.numComponents, data: leftWindowInfo.position},
                vnormal: {numComponents: leftWindowInfo.normal.numComponents, data: leftWindowInfo.normal},
                indices: {numComponents: leftWindowInfo.indices.numComponents, data: leftWindowInfo.indices}
            };
            leftWindowBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, leftWindowArray);

            var ySymbolInfo = twgl.primitives.createCubeVertices();
            ySymbolInfo = twgl.primitives.reorientVertices(ySymbolInfo, twgl.m4.scaling([.355,.025,.15]));
            ySymbolInfo = twgl.primitives.reorientVertices(ySymbolInfo, twgl.m4.rotationX([90*Math.PI/180]));
            ySymbolInfo = twgl.primitives.reorientVertices(ySymbolInfo, twgl.m4.translation([0,.323,0]));
            var ySymbolArray = {
                vpos: {numComponents: ySymbolInfo.position.numComponents, data: ySymbolInfo.position},
                vnormal: {numComponents: ySymbolInfo.normal.numComponents, data: ySymbolInfo.normal},
                indices: {numComponents: ySymbolInfo.indices.numComponents, data: ySymbolInfo.indices}
            };
            ySymbolBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, ySymbolArray);

            var zSymbolInfo = twgl.primitives.createCubeVertices();
            zSymbolInfo = twgl.primitives.reorientVertices(zSymbolInfo, twgl.m4.scaling([.355,.025,.15]));
            zSymbolInfo = twgl.primitives.reorientVertices(zSymbolInfo, twgl.m4.translation([0,.323,0]));
            var zSymbolArray = {
                vpos: {numComponents: zSymbolInfo.position.numComponents, data: zSymbolInfo.position},
                vnormal: {numComponents: zSymbolInfo.normal.numComponents, data: zSymbolInfo.normal},
                indices: {numComponents: zSymbolInfo.indices.numComponents, data: zSymbolInfo.indices}
            };
            zSymbolBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, zSymbolArray);

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
            wheelAInfo = twgl.primitives.reorientVertices(wheelAInfo, twgl.m4.translation([0.2,0.08,-0.1]));
            var wheelAArray = {
                vpos: {numComponents: wheelAInfo.position.numComponents, data: wheelAInfo.position},
                vnormal: {numComponents: wheelAInfo.normal.numComponents, data: wheelAInfo.normal},
                indices: {numComponents: wheelAInfo.indices.numComponents, data: wheelAInfo.indices}
            };
            wheelABuffer = twgl.createBufferInfoFromArrays(drawingState.gl, wheelAArray);

            var wheelBInfo = twgl.primitives.createTorusVertices(0.055,0.03,12,24);
            wheelBInfo = twgl.primitives.reorientVertices(wheelBInfo, twgl.m4.rotationZ(90*Math.PI/180));
            wheelBInfo = twgl.primitives.reorientVertices(wheelBInfo, twgl.m4.translation([-0.2,0.08,-0.1]));
            var wheelBArray = {
                vpos: {numComponents: wheelBInfo.position.numComponents, data: wheelBInfo.position},
                vnormal: {numComponents: wheelBInfo.normal.numComponents, data: wheelBInfo.normal},
                indices: {numComponents: wheelBInfo.indices.numComponents, data: wheelBInfo.indices}
            };
            wheelBBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, wheelBArray);

            var wheelCInfo = twgl.primitives.createTorusVertices(0.055,0.03,12,24);
            wheelCInfo = twgl.primitives.reorientVertices(wheelCInfo, twgl.m4.rotationZ(90*Math.PI/180));
            wheelCInfo = twgl.primitives.reorientVertices(wheelCInfo, twgl.m4.translation([-0.2,0.08,0.3]));
            var wheelCArray = {
                vpos: {numComponents: wheelCInfo.position.numComponents, data: wheelCInfo.position},
                vnormal: {numComponents: wheelCInfo.normal.numComponents, data: wheelCInfo.normal},
                indices: {numComponents: wheelCInfo.indices.numComponents, data: wheelCInfo.indices}
            };
            wheelCBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, wheelCArray);

            var wheelDinfo = twgl.primitives.createTorusVertices(0.055,0.03,12,24);
            wheelDinfo = twgl.primitives.reorientVertices(wheelDinfo, twgl.m4.rotationZ(90*Math.PI/180));
            wheelDinfo = twgl.primitives.reorientVertices(wheelDinfo, twgl.m4.translation([0.2,0.08,0.3]));
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
    Ambulance.prototype.draw = function(drawingState) {

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

        twgl.setUniforms(shaderProgram, { light: 1.0 });
        twgl.setBuffersAndAttributes(gl, shaderProgram, zSymbolBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, zSymbolBuffer);

        twgl.setBuffersAndAttributes(gl, shaderProgram, ySymbolBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, ySymbolBuffer);

        twgl.setBuffersAndAttributes(gl, shaderProgram, redBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, redBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: this.chasisColor, model: modelM, light: 0.0 });
        twgl.setBuffersAndAttributes(gl, shaderProgram, chasisBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, chasisBuffer);

        twgl.setBuffersAndAttributes(gl, shaderProgram, backBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backBuffer);

        twgl.setUniforms(shaderProgram, { light: 1.0 });
        twgl.setBuffersAndAttributes(gl, shaderProgram, sirenBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, sirenBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: [0,0,1], model: modelM });
        twgl.setBuffersAndAttributes(gl, shaderProgram, blueBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, blueBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: [0,0,1], model: modelM });
        twgl.setBuffersAndAttributes(gl, shaderProgram, rightWindowBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rightWindowBuffer);

        twgl.setBuffersAndAttributes(gl, shaderProgram, leftWindowBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, leftWindowBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: [1,1,0], model: modelM });
        twgl.setBuffersAndAttributes(gl, shaderProgram, leftLightBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, leftLightBuffer);

        twgl.setBuffersAndAttributes(gl, shaderProgram, rightLightBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rightLightBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: [0.329412,0.329412,0.329412], model: modelM, light: 0.0 });
        twgl.setBuffersAndAttributes(gl, shaderProgram, wheelABuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelABuffer);

        twgl.setBuffersAndAttributes(gl, shaderProgram, wheelBBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelBBuffer);

        twgl.setBuffersAndAttributes(gl, shaderProgram, wheelCBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelCBuffer);

        twgl.setBuffersAndAttributes(gl, shaderProgram, wheelDBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, wheelDBuffer);

        twgl.setUniforms(shaderProgram, { lightcolor: [0.8,0.8,0.8], model: modelM });
        twgl.setBuffersAndAttributes(gl, shaderProgram, frontAxelBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, frontAxelBuffer);

        twgl.setBuffersAndAttributes(gl, shaderProgram, backAxelBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backAxelBuffer);

    };
    Ambulance.prototype.center = function(drawingState) {
        return this.position;
    };
})();
grobjects.push(new Ambulance([-1.75,0,5]));