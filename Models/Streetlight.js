var grobjects = grobjects || [],
    Streetlight = undefined;

(function() { "use strict";

    var shaderProgramPole = undefined, shaderProgramLight = undefined,
        poleBuffer = undefined, zPoleBuffer = undefined, xPoleBuffer = undefined,
        backZBuffer = undefined, frontZBuffer = undefined, leftXBuffer  = undefined,
        rightXBuffer  = undefined, rightLBuffer  = undefined, leftLBuffer  = undefined,
        frontLBuffer  = undefined, backLBuffer  = undefined, streetlightNumber = 1;

    // constructor for Streetlights
    Streetlight = function Streetlight(position) {
        this.name = "streetlight" + streetlightNumber++;
        this.position = position || [0,0,0];
        this.poleColor = [0.329412,0.329412,0.329412];
        this.lightColor = [1,1,0];
    };
    Streetlight.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgramPole) {
            shaderProgramPole = twgl.createProgramInfo(gl, ["streetlight-vs", "streetlight-fs"]);
        }
        if(!shaderProgramLight) {
            shaderProgramPole = twgl.createProgramInfo(gl, ["light-vs", "light-fs"]);
        }
        if (!poleBuffer) {
            var poleInfo = twgl.primitives.createCubeVertices();
            poleInfo = twgl.primitives.reorientVertices(poleInfo, twgl.m4.scaling([0.03,0.75,0.03]));
            poleInfo = twgl.primitives.reorientVertices(poleInfo, twgl.m4.translation([0,0.375,0]));
            var poleArray = {
                vpos: { numComponents: poleInfo.position.numComponents, data: poleInfo.position },
                vnormal: { numComponents: poleInfo.normal.numComponents, data: poleInfo.normal },
                indices: { numComponents: poleInfo.indices.numComponents, data: poleInfo.indices }
            };
            poleBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, poleArray);

            var zPoleInfo = twgl.primitives.createCubeVertices();
            zPoleInfo = twgl.primitives.reorientVertices(zPoleInfo, twgl.m4.scaling([0.03,0.03,0.5]));
            zPoleInfo = twgl.primitives.reorientVertices(zPoleInfo, twgl.m4.translation([0,0.75,0]));
            var zPoleArray = {
                vpos: { numComponents: zPoleInfo.position.numComponents, data: zPoleInfo.position },
                vnormal: { numComponents: zPoleInfo.normal.numComponents, data: zPoleInfo.normal },
                indices: { numComponents: zPoleInfo.indices.numComponents, data: zPoleInfo.indices }
            };
            zPoleBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,zPoleArray);

            var xPoleInfo = twgl.primitives.createCubeVertices();
            xPoleInfo = twgl.primitives.reorientVertices(xPoleInfo, twgl.m4.scaling([0.03,0.03,0.5]));
            xPoleInfo = twgl.primitives.reorientVertices(xPoleInfo, twgl.m4.rotationY(90*Math.PI/180));
            xPoleInfo = twgl.primitives.reorientVertices(xPoleInfo, twgl.m4.translation([0,0.75,0]));
            var xPoleArray = {
                vpos: { numComponents: xPoleInfo.position.numComponents, data: xPoleInfo.position },
                vnormal: { numComponents: xPoleInfo.normal.numComponents, data: xPoleInfo.normal },
                indices: { numComponents: xPoleInfo.indices.numComponents, data: xPoleInfo.indices }
            };
            xPoleBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,xPoleArray);

            var backZInfo = twgl.primitives.createCubeVertices();
            backZInfo = twgl.primitives.reorientVertices(backZInfo, twgl.m4.scaling([0.03,0.125,0.03]));
            backZInfo = twgl.primitives.reorientVertices(backZInfo, twgl.m4.translation([0,0.7,-0.24]));
            var backZArray = {
                vpos: { numComponents: backZInfo.position.numComponents, data: backZInfo.position },
                vnormal: { numComponents: backZInfo.normal.numComponents, data: backZInfo.normal },
                indices: { numComponents: backZInfo.indices.numComponents, data: backZInfo.indices }
            };
            backZBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,backZArray);

            var frontZInfo = twgl.primitives.createCubeVertices();
            frontZInfo = twgl.primitives.reorientVertices(frontZInfo, twgl.m4.scaling([0.03,0.125,0.03]));
            frontZInfo = twgl.primitives.reorientVertices(frontZInfo, twgl.m4.translation([0,0.7,0.24]));
            var frontZArray = {
                vpos: { numComponents: frontZInfo.position.numComponents, data: frontZInfo.position },
                vnormal: { numComponents: frontZInfo.normal.numComponents, data: frontZInfo.normal },
                indices: { numComponents: frontZInfo.indices.numComponents, data: frontZInfo.indices }
            };
            frontZBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,frontZArray);

            var leftXInfo = twgl.primitives.createCubeVertices();
            leftXInfo = twgl.primitives.reorientVertices(leftXInfo, twgl.m4.scaling([0.03,0.125,0.03]));
            leftXInfo = twgl.primitives.reorientVertices(leftXInfo, twgl.m4.translation([-0.24,0.7,0]));
            var leftXArray = {
                vpos: { numComponents: leftXInfo.position.numComponents, data: leftXInfo.position },
                vnormal: { numComponents: leftXInfo.normal.numComponents, data: leftXInfo.normal },
                indices: { numComponents: leftXInfo.indices.numComponents, data: leftXInfo.indices }
            };
            leftXBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,leftXArray);

            var rightXInfo = twgl.primitives.createCubeVertices();
            rightXInfo = twgl.primitives.reorientVertices(rightXInfo, twgl.m4.scaling([0.03,0.125,0.03]));
            rightXInfo = twgl.primitives.reorientVertices(rightXInfo, twgl.m4.translation([0.24,0.7,0]));
            var rightXArray = {
                vpos: { numComponents: rightXInfo.position.numComponents, data: rightXInfo.position },
                vnormal: { numComponents: rightXInfo.normal.numComponents, data: rightXInfo.normal },
                indices: { numComponents: rightXInfo.indices.numComponents, data: rightXInfo.indices }
            };
            rightXBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,rightXArray);

            var rightLInfo = twgl.primitives.createSphereVertices(0.075,12,24);
            rightLInfo = twgl.primitives.reorientVertices(rightLInfo, twgl.m4.translation([0.24,0.6,0]));
            var rightLArray = {
                vpos: { numComponents: rightLInfo.position.numComponents, data: rightLInfo.position },
                vnormal: { numComponents: rightLInfo.normal.numComponents, data: rightLInfo.normal },
                indices: { numComponents: rightLInfo.indices.numComponents, data: rightLInfo.indices }
            };
            rightLBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,rightLArray);
        }

        var leftLInfo = twgl.primitives.createSphereVertices(0.075,12,24);
        leftLInfo = twgl.primitives.reorientVertices(leftLInfo, twgl.m4.translation([-0.24,0.6,0]));
        var leftLArray = {
            vpos: { numComponents: leftLInfo.position.numComponents, data: leftLInfo.position },
            vnormal: { numComponents: leftLInfo.normal.numComponents, data: leftLInfo.normal },
            indices: { numComponents: leftLInfo.indices.numComponents, data: leftLInfo.indices }
        };
        leftLBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,leftLArray);

        var backLInfo = twgl.primitives.createSphereVertices(0.075,12,24);
        backLInfo = twgl.primitives.reorientVertices(backLInfo, twgl.m4.translation([0,0.6,-0.24]));
        var backLArray = {
            vpos: { numComponents: backLInfo.position.numComponents, data: backLInfo.position },
            vnormal: { numComponents: backLInfo.normal.numComponents, data: backLInfo.normal },
            indices: { numComponents: backLInfo.indices.numComponents, data: backLInfo.indices }
        };
        backLBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,backLArray);

        var frontLInfo = twgl.primitives.createSphereVertices(0.075,12,24);
        frontLInfo = twgl.primitives.reorientVertices(frontLInfo, twgl.m4.translation([0,0.6,0.24]));
        var frontLArray = {
            vpos: { numComponents: frontLInfo.position.numComponents, data: frontLInfo.position },
            vnormal: { numComponents: frontLInfo.normal.numComponents, data: frontLInfo.normal },
            indices: { numComponents: frontLInfo.indices.numComponents, data: frontLInfo.indices }
        };
        frontLBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,frontLArray);

    };
    Streetlight.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.identity();
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgramPole.program);
        twgl.setUniforms(shaderProgramPole,{
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            model: modelM, lightcolor: this.poleColor, light: 0.0
        });

        //Pole Construction
        twgl.setBuffersAndAttributes(gl,shaderProgramPole,poleBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,poleBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgramPole,zPoleBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,zPoleBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgramPole,xPoleBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,xPoleBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgramPole,backZBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,backZBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgramPole,frontZBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,frontZBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgramPole,leftXBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,leftXBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgramPole,rightXBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,rightXBuffer);

        //Light Spheres
        gl.useProgram(shaderProgramPole.program);
        twgl.setUniforms(shaderProgramPole,{
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            model: modelM, lightcolor: this.lightColor, tod: drawingState.timeOfDay, light: 1.0
        });
        twgl.setBuffersAndAttributes(gl,shaderProgramPole,rightLBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,rightLBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgramPole,leftLBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,leftLBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgramPole,backLBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,backLBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgramPole,frontLBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,frontLBuffer);
    };
    Streetlight.prototype.center = function(drawingState) {
        return this.position;
    };

})();
//Corners
grobjects.push(new Streetlight([-6.9,0,-6.9]));
grobjects.push(new Streetlight([6.9,0,-6.9]));
grobjects.push(new Streetlight([6.9,0,6.9]));
grobjects.push(new Streetlight([-6.9,0,6.9]));

//Fountain
grobjects.push(new Streetlight([-1.25,0,0]));
grobjects.push(new Streetlight([1.25,0,0]));

//House
grobjects.push(new Streetlight([5.25,0,5.25]));

//Path
grobjects.push(new Streetlight([0.75,0,1.5]));
grobjects.push(new Streetlight([-0.75,0,1.5]));
grobjects.push(new Streetlight([0.75,0,3]));
grobjects.push(new Streetlight([-0.75,0,3]));
grobjects.push(new Streetlight([0.75,0,4.5]));
grobjects.push(new Streetlight([-0.75,0,4.5]));