var grobjects = grobjects || [];

var Hospital = undefined;
(function() { "use strict";
    var shaderProgram = undefined, towerBuffer = undefined, middleBuffer = undefined, garageBuffer = undefined,
        padBuffer = undefined, supportABuffer = undefined, supportBBuffer = undefined, supportCBuffer = undefined,
        supportDBuffer = undefined, drivewayBuffer = undefined, overhangBuffer = undefined,
        lCylBuffer = undefined,  rCylBuffer = undefined, topCrossBuffer = undefined, sideCrossBuffer = undefined,
        padBufferSmall = undefined, garageDoorBuffer = undefined;

    Hospital = function Hospital() {
        this.name = "Hospital";
        this.position =  [0.75,0,-0.5];
        this.wColor = [0.55,0.09,0.09];
        this.bColor = [1,1,1];
    };

    Hospital.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["hospital-vs", "hospital-fs"]);
        }
        if (!towerBuffer) {
            var towerInfo = twgl.primitives.createCubeVertices();
            towerInfo = twgl.primitives.reorientVertices(towerInfo, twgl.m4.scaling([1.75,3,2.5]));
            towerInfo = twgl.primitives.reorientVertices(towerInfo, twgl.m4.translation([-5,1.5,4]));
            var towerArray = {
                v_position: {numComponents: towerInfo.position.numComponents, data: towerInfo.position},
                v_normal: {numComponents: towerInfo.normal.numComponents, data: towerInfo.normal},
                indices: {numComponents: towerInfo.indices.numComponents, data: towerInfo.indices}
            };
            towerBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, towerArray);

            var middleInfo = twgl.primitives.createCubeVertices();
            middleInfo = twgl.primitives.reorientVertices(middleInfo, twgl.m4.scaling([2.5,1,1.5]));
            middleInfo = twgl.primitives.reorientVertices(middleInfo, twgl.m4.translation([-3.5,0.5,3.5]));
            var middleArray = {
                v_position: {numComponents: middleInfo.position.numComponents, data: middleInfo.position},
                v_normal: {numComponents: middleInfo.normal.numComponents, data: middleInfo.normal},
                indices: {numComponents: middleInfo.indices.numComponents, data: middleInfo.indices}
            };
            middleBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, middleArray);

            var garageInfo = twgl.primitives.createCubeVertices();
            garageInfo = twgl.primitives.reorientVertices(garageInfo, twgl.m4.scaling([1,1,2.25]));
            garageInfo = twgl.primitives.reorientVertices(garageInfo, twgl.m4.translation([-2.5,0.5,3.875]));
            var garageArray = {
                v_position: {numComponents: garageInfo.position.numComponents, data: garageInfo.position},
                v_normal: {numComponents: garageInfo.normal.numComponents, data: garageInfo.normal},
                indices: {numComponents: garageInfo.indices.numComponents, data: garageInfo.indices}
            };
            garageBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, garageArray);

            var padInfo = twgl.primitives.createCubeVertices();
            padInfo = twgl.primitives.reorientVertices(padInfo, twgl.m4.scaling([1.5,0.1,1.5]));
            padInfo = twgl.primitives.reorientVertices(padInfo, twgl.m4.translation([-5,3.15,4.1]));
            var padArray = {
                v_position: {numComponents: padInfo.position.numComponents, data: padInfo.position},
                v_normal: {numComponents: padInfo.normal.numComponents, data: padInfo.normal},
                indices: {numComponents: padInfo.indices.numComponents, data: padInfo.indices}
            };
            padBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, padArray);

            var padSmallInfo = twgl.primitives.createCubeVertices();
            padSmallInfo = twgl.primitives.reorientVertices(padSmallInfo, twgl.m4.scaling([1.35,0.11,1.35]));
            padSmallInfo = twgl.primitives.reorientVertices(padSmallInfo, twgl.m4.translation([-5,3.15,4.1]));
            var padSmallArray = {
                v_position: {numComponents: padSmallInfo.position.numComponents, data: padSmallInfo.position},
                v_normal: {numComponents: padSmallInfo.normal.numComponents, data: padSmallInfo.normal},
                indices: {numComponents: padSmallInfo.indices.numComponents, data: padSmallInfo.indices}
            };
            padBufferSmall = twgl.createBufferInfoFromArrays(drawingState.gl, padSmallArray);

            var padInfo = twgl.primitives.createCubeVertices();
            padInfo = twgl.primitives.reorientVertices(padInfo, twgl.m4.scaling([1.505,0.1,1.505]));
            padInfo = twgl.primitives.reorientVertices(padInfo, twgl.m4.translation([-5,3.15,4.1]));
            var padArray = {
                v_position: {numComponents: padInfo.position.numComponents, data: padInfo.position},
                v_normal: {numComponents: padInfo.normal.numComponents, data: padInfo.normal},
                indices: {numComponents: padInfo.indices.numComponents, data: padInfo.indices}
            };
            padBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, padArray);

            var supportAInfo = twgl.primitives.createCubeVertices();
            supportAInfo = twgl.primitives.reorientVertices(supportAInfo, twgl.m4.scaling([0.1,0.25,0.1]));
            supportAInfo = twgl.primitives.reorientVertices(supportAInfo, twgl.m4.translation([-5.7,3,4.8]));
            var supportAArray = {
                v_position: {numComponents: supportAInfo.position.numComponents, data: supportAInfo.position},
                v_normal: {numComponents: supportAInfo.normal.numComponents, data: supportAInfo.normal},
                indices: {numComponents: supportAInfo.indices.numComponents, data: supportAInfo.indices}
            };
            supportABuffer = twgl.createBufferInfoFromArrays(drawingState.gl, supportAArray);

            var supportBInfo = twgl.primitives.createCubeVertices();
            supportBInfo = twgl.primitives.reorientVertices(supportBInfo, twgl.m4.scaling([0.1,0.25,0.1]));
            supportBInfo = twgl.primitives.reorientVertices(supportBInfo, twgl.m4.translation([-4.3,3,4.8]));
            var supportBArray = {
                v_position: {numComponents: supportBInfo.position.numComponents, data: supportBInfo.position},
                v_normal: {numComponents: supportBInfo.normal.numComponents, data: supportBInfo.normal},
                indices: {numComponents: supportBInfo.indices.numComponents, data: supportBInfo.indices}
            };
            supportBBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, supportBArray);

            var supportCInfo = twgl.primitives.createCubeVertices();
            supportCInfo = twgl.primitives.reorientVertices(supportCInfo, twgl.m4.scaling([0.1,0.25,0.1]));
            supportCInfo = twgl.primitives.reorientVertices(supportCInfo, twgl.m4.translation([-4.3,3,3.4]));
            var supportCArray = {
                v_position: {numComponents: supportCInfo.position.numComponents, data: supportCInfo.position},
                v_normal: {numComponents: supportCInfo.normal.numComponents, data: supportCInfo.normal},
                indices: {numComponents: supportCInfo.indices.numComponents, data: supportCInfo.indices}
            };
            supportCBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, supportCArray);

            var supportDInfo = twgl.primitives.createCubeVertices();
            supportDInfo = twgl.primitives.reorientVertices(supportDInfo, twgl.m4.scaling([0.1,0.25,0.1]));
            supportDInfo = twgl.primitives.reorientVertices(supportDInfo, twgl.m4.translation([-5.7,3,3.4]));
            var supportDArray = {
                v_position: {numComponents: supportDInfo.position.numComponents, data: supportDInfo.position},
                v_normal: {numComponents: supportDInfo.normal.numComponents, data: supportDInfo.normal},
                indices: {numComponents: supportDInfo.indices.numComponents, data: supportDInfo.indices}
            };
            supportDBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, supportDArray);

            var supportDInfo = twgl.primitives.createCubeVertices();
            supportDInfo = twgl.primitives.reorientVertices(supportDInfo, twgl.m4.scaling([0.1,0.25,0.1]));
            supportDInfo = twgl.primitives.reorientVertices(supportDInfo, twgl.m4.translation([-5.7,3,3.4]));
            var supportDArray = {
                v_position: {numComponents: supportDInfo.position.numComponents, data: supportDInfo.position},
                v_normal: {numComponents: supportDInfo.normal.numComponents, data: supportDInfo.normal},
                indices: {numComponents: supportDInfo.indices.numComponents, data: supportDInfo.indices}
            };
            supportDBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, supportDArray);

            var drivewayInfo = twgl.primitives.createCubeVertices();
            drivewayInfo = twgl.primitives.reorientVertices(drivewayInfo, twgl.m4.scaling([0.85,0.001,2]));
            drivewayInfo = twgl.primitives.reorientVertices(drivewayInfo, twgl.m4.translation([-2.5,0.0006,5.5]));
            var drivewayArray = {
                v_position: { numComponents: drivewayInfo.position.numComponents, data: drivewayInfo.position},
                v_normal: { numComponents: drivewayInfo.normal.numComponents, data: drivewayInfo.normal},
                indices: { numComponents: drivewayInfo.indices.numComponents, data: drivewayInfo.indices}
            };
            drivewayBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, drivewayArray);

            var drivewayInfo = twgl.primitives.createCubeVertices();
            drivewayInfo = twgl.primitives.reorientVertices(drivewayInfo, twgl.m4.scaling([0.85,0.001,2]));
            drivewayInfo = twgl.primitives.reorientVertices(drivewayInfo, twgl.m4.translation([-2.5,0.0006,5.125]));
            var drivewayArray = {
                v_position: { numComponents: drivewayInfo.position.numComponents, data: drivewayInfo.position},
                v_normal: { numComponents: drivewayInfo.normal.numComponents, data: drivewayInfo.normal},
                indices: { numComponents: drivewayInfo.indices.numComponents, data: drivewayInfo.indices}
            };
            drivewayBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, drivewayArray);

            var overhangInfo = twgl.primitives.createCubeVertices();
            overhangInfo = twgl.primitives.reorientVertices(overhangInfo, twgl.m4.scaling([1.749,0.15,1]));
            overhangInfo = twgl.primitives.reorientVertices(overhangInfo, twgl.m4.translation([-5,1,5.35]));
            var overhangArray = {
                v_position: { numComponents: overhangInfo.position.numComponents, data: overhangInfo.position},
                v_normal: { numComponents: overhangInfo.normal.numComponents, data: overhangInfo.normal},
                indices: { numComponents: overhangInfo.indices.numComponents, data: overhangInfo.indices}
            };
            overhangBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, overhangArray);

            var overhangInfo = twgl.primitives.createCubeVertices();
            overhangInfo = twgl.primitives.reorientVertices(overhangInfo, twgl.m4.scaling([1.749,0.15,1]));
            overhangInfo = twgl.primitives.reorientVertices(overhangInfo, twgl.m4.translation([-5,1,5.35]));
            var overhangArray = {
                v_position: { numComponents: overhangInfo.position.numComponents, data: overhangInfo.position},
                v_normal: { numComponents: overhangInfo.normal.numComponents, data: overhangInfo.normal},
                indices: { numComponents: overhangInfo.indices.numComponents, data: overhangInfo.indices}
            };
            overhangBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, overhangArray);

            var lCylInfo = twgl.primitives.createCylinderVertices(0.025,1,12,24);
            lCylInfo = twgl.primitives.reorientVertices(lCylInfo, twgl.m4.rotationX(135*Math.PI/180));
            lCylInfo = twgl.primitives.reorientVertices(lCylInfo, twgl.m4.translation([-5.8,1.35,5.45]));
            var lCylArray = {
                v_position: { numComponents: lCylInfo.position.numComponents, data: lCylInfo.position},
                v_normal: { numComponents: lCylInfo.normal.numComponents, data: lCylInfo.normal},
                indices: { numComponents: lCylInfo.indices.numComponents, data: lCylInfo.indices}
            };
            lCylBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, lCylArray);

            var rCylInfo = twgl.primitives.createCylinderVertices(0.025,1,12,24);
            rCylInfo = twgl.primitives.reorientVertices(rCylInfo, twgl.m4.rotationX(135*Math.PI/180));
            rCylInfo = twgl.primitives.reorientVertices(rCylInfo, twgl.m4.translation([-4.25,1.35,5.45]));
            var rCylArray = {
                v_position: { numComponents: rCylInfo.position.numComponents, data: rCylInfo.position},
                v_normal: { numComponents: rCylInfo.normal.numComponents, data: rCylInfo.normal},
                indices: { numComponents: rCylInfo.indices.numComponents, data: rCylInfo.indices}
            };
            rCylBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rCylArray);

            var rCylInfo = twgl.primitives.createCylinderVertices(0.025,1,12,24);
            rCylInfo = twgl.primitives.reorientVertices(rCylInfo, twgl.m4.rotationX(135*Math.PI/180));
            rCylInfo = twgl.primitives.reorientVertices(rCylInfo, twgl.m4.translation([-4.25,1.35,5.45]));
            var rCylArray = {
                v_position: { numComponents: rCylInfo.position.numComponents, data: rCylInfo.position},
                v_normal: { numComponents: rCylInfo.normal.numComponents, data: rCylInfo.normal},
                indices: { numComponents: rCylInfo.indices.numComponents, data: rCylInfo.indices}
            };
            rCylBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, rCylArray);

            var sideCrossInfo = twgl.primitives.createCubeVertices();
            sideCrossInfo = twgl.primitives.reorientVertices(sideCrossInfo, twgl.m4.scaling([0.5,0.125,0.1]));
            sideCrossInfo = twgl.primitives.reorientVertices(sideCrossInfo, twgl.m4.translation([-5,2.5,5.25]));
            var sideCrossArray = {
                v_position: { numComponents: sideCrossInfo.position.numComponents, data: sideCrossInfo.position},
                v_normal: { numComponents: sideCrossInfo.normal.numComponents, data: sideCrossInfo.normal},
                indices: { numComponents: sideCrossInfo.indices.numComponents, data: sideCrossInfo.indices}
            };
            sideCrossBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, sideCrossArray);

            var topCrossInfo = twgl.primitives.createCubeVertices();
            topCrossInfo = twgl.primitives.reorientVertices(topCrossInfo, twgl.m4.scaling([0.5,0.125,0.1]));
            topCrossInfo = twgl.primitives.reorientVertices(topCrossInfo, twgl.m4.rotationZ(90*Math.PI/180));
            topCrossInfo = twgl.primitives.reorientVertices(topCrossInfo, twgl.m4.translation([-5,2.5,5.25]));
            var topCrossArray = {
                v_position: { numComponents: topCrossInfo.position.numComponents, data: topCrossInfo.position},
                v_normal: { numComponents: topCrossInfo.normal.numComponents, data: topCrossInfo.normal},
                indices: { numComponents: topCrossInfo.indices.numComponents, data: topCrossInfo.indices}
            };
            topCrossBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, topCrossArray);

            var garageDoorInfo = twgl.primitives.createCubeVertices();
            garageDoorInfo = twgl.primitives.reorientVertices(garageDoorInfo, twgl.m4.scaling([0.75,.8,0.6]));
            garageDoorInfo = twgl.primitives.reorientVertices(garageDoorInfo, twgl.m4.translation([-2.5,0.4,4.71]));
            var garageDoorArray = {
                v_position: { numComponents: garageDoorInfo.position.numComponents, data: garageDoorInfo.position},
                v_normal: { numComponents: garageDoorInfo.normal.numComponents, data: garageDoorInfo.normal},
                indices: { numComponents: garageDoorInfo.indices.numComponents, data: garageDoorInfo.indices}
            };
            garageDoorBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, garageDoorArray);
        }
    };
    Hospital.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.identity();
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection, model: modelM,
            w_color_in: this.wColor, b_color_in: this.bColor, tod: drawingState.timeOfDay, ambient: 0.0
        });
        twgl.setBuffersAndAttributes(gl,shaderProgram, towerBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, towerBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgram, garageBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, garageBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgram, middleBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, middleBuffer);

        twgl.setUniforms(shaderProgram, { w_color_in: [0,0,0], b_color_in: [0,0,0] });
        twgl.setBuffersAndAttributes(gl,shaderProgram, drivewayBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, drivewayBuffer);

        twgl.setUniforms(shaderProgram, { w_color_in: [0.59,0.41,0.31], b_color_in: [0.59,0.41,0.31] });
        twgl.setBuffersAndAttributes(gl,shaderProgram, garageDoorBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, garageDoorBuffer);

        twgl.setUniforms(shaderProgram, { w_color_in: this.bColor, b_color_in: this.bColor, ambient: 1.0 });
        twgl.setBuffersAndAttributes(gl,shaderProgram, padBufferSmall);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, padBufferSmall);

        twgl.setUniforms(shaderProgram, { w_color_in: [0.8,0.8,0.8], b_color_in: [0.8,0.8,0.8] });
        twgl.setBuffersAndAttributes(gl,shaderProgram, padBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, padBuffer);

        twgl.setUniforms(shaderProgram, {
            w_color_in: [0.329412,0.329412,0.329412], b_color_in: [0.329412,0.329412,0.329412]
        });
        twgl.setBuffersAndAttributes(gl,shaderProgram, lCylBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, lCylBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgram, rCylBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rCylBuffer);

        twgl.setUniforms(shaderProgram, { w_color_in: [1,0,0], b_color_in: [1,0,0] });
        twgl.setBuffersAndAttributes(gl,shaderProgram, supportABuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, supportABuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgram, supportBBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, supportBBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgram, supportCBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, supportCBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgram, supportDBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, supportDBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgram, overhangBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, overhangBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgram, topCrossBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, topCrossBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgram, sideCrossBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, sideCrossBuffer);

    };
    Hospital.prototype.center = function(drawingState) {
        return this.position;
    };
})();
grobjects.push(new Hospital());


