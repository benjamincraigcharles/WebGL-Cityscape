var grobjects = grobjects || [],
    House = undefined;

(function() { "use strict";

    var shaderProgram = undefined, baseBuffer = undefined, frontDoorBuffer, windowBuffer, garageBuffer,
        roofFillBuffer, doorBuffer, drivewayBuffer, houseTex, houseNormTex, roofTex, roofNormTex, drivewayTex,
        drivewayNormTex, doorTex, doorNormTex, windowTex, windowNormTex, numHouses = 1, rendered = false;

    // constructor for Houses
    House = function House(position,angle) {
        this.name = "House" + numHouses++;
        this.position = position || [0,0,0];
        this.angle = angle || 0;
        this.diff = [1,1,1,1];
    };
    House.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["bumpMap-vs", "bumpMap-fs"]);
        }
        if (!baseBuffer) {
            var baseInfo = twgl.primitives.createCubeVertices();
            baseInfo = twgl.primitives.reorientVertices(baseInfo, twgl.m4.scaling([1.7,1.2,1]));
            baseInfo = twgl.primitives.reorientVertices(baseInfo, twgl.m4.translation([0,0.6,0]));
            var baseArray = {
                v_position : { numComponents: baseInfo.position.numComponents, data: baseInfo.position },
                v_normal : { numComponents: baseInfo.normal.numComponents, data: baseInfo.normal },
                indices : { numComponents: baseInfo.indices.numComponents, data: baseInfo.indices },
                v_texture : { numComponents: baseInfo.texcoord.numComponents, data: baseInfo.texcoord },
                v_tangent : { numComponents: baseInfo.normal.numComponents,
                    data: getTangent(baseInfo.position, baseInfo.texcoord, baseInfo.indices)}
            };
            baseBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, baseArray);
            var garageInfo = twgl.primitives.createCubeVertices();
            garageInfo = twgl.primitives.reorientVertices(garageInfo, twgl.m4.scaling([.8,0.75,1.35]));
            garageInfo = twgl.primitives.reorientVertices(garageInfo, twgl.m4.translation([1.25,0.375,0.175]));
            var garageArray = {
                v_position : { numComponents: garageInfo.position.numComponents, data: garageInfo.position },
                v_normal : { numComponents: garageInfo.normal.numComponents, data: garageInfo.normal },
                indices : { numComponents: garageInfo.indices.numComponents, data: garageInfo.indices },
                v_texture : { numComponents: garageInfo.texcoord.numComponents, data: garageInfo.texcoord },
                v_tangent : { numComponents: garageInfo.normal.numComponents,
                    data: getTangent(garageInfo.position, garageInfo.texcoord, garageInfo.indices)}
            };
            garageBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, garageArray);

            var doorInfo = twgl.primitives.createCubeVertices();
            doorInfo = twgl.primitives.reorientVertices(doorInfo, twgl.m4.scaling([0.65,0.6,0.01]));
            doorInfo = twgl.primitives.reorientVertices(doorInfo, twgl.m4.translation([1.25,0.3,0.8475]));
            var doorArray = {
                v_position : { numComponents: doorInfo.position.numComponents, data: doorInfo.position },
                v_normal : { numComponents: doorInfo.normal.numComponents, data: doorInfo.normal },
                indices : { numComponents: doorInfo.indices.numComponents, data: doorInfo.indices },
                v_texture : { numComponents: doorInfo.texcoord.numComponents, data: doorInfo.texcoord },
                v_tangent : { numComponents: baseInfo.normal.numComponents,
                    data: getTangent(doorInfo.position, doorInfo.texcoord, doorInfo.indices)}
            };
            doorBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, doorArray);

            var drivewayInfo = twgl.primitives.createCubeVertices();
            drivewayInfo = twgl.primitives.reorientVertices(drivewayInfo, twgl.m4.scaling([0.7,0.001,1]));
            drivewayInfo = twgl.primitives.reorientVertices(drivewayInfo, twgl.m4.translation([1.25,0,1.25]));
            var drivewayArray = {
                v_position : { numComponents: drivewayInfo.position.numComponents, data: drivewayInfo.position },
                v_normal : { numComponents: drivewayInfo.normal.numComponents, data: drivewayInfo.normal },
                indices : { numComponents: drivewayInfo.indices.numComponents, data: drivewayInfo.indices },
                v_texture : { numComponents: drivewayInfo.texcoord.numComponents, data: drivewayInfo.texcoord },
                v_tangent : { numComponents: drivewayInfo.normal.numComponents,
                    data: getTangent(drivewayInfo.position, drivewayInfo.texcoord, drivewayInfo.indices)}
            };
            drivewayBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, drivewayArray);

            var roofFillInfo = twgl.primitives.createCubeVertices();
            roofFillInfo = twgl.primitives.reorientVertices(roofFillInfo, twgl.m4.scaling([1.699,0.75,0.675]));
            roofFillInfo = twgl.primitives.reorientVertices(roofFillInfo, twgl.m4.rotationX([49*Math.PI/180]));
            roofFillInfo = twgl.primitives.reorientVertices(roofFillInfo, twgl.m4.translation([0,1.2,0]));
            var roofFillArray = {
                v_position : { numComponents: roofFillInfo.position.numComponents, data: roofFillInfo.position },
                v_normal : { numComponents: roofFillInfo.normal.numComponents, data: roofFillInfo.normal },
                indices : { numComponents: roofFillInfo.indices.numComponents, data: roofFillInfo.indices },
                v_texture : { numComponents: roofFillInfo.texcoord.numComponents, data: roofFillInfo.texcoord },
                v_tangent : { numComponents: roofFillInfo.normal.numComponents,
                    data: getTangent(roofFillInfo.position, roofFillInfo.texcoord, roofFillInfo.indices)}
            };
            roofFillBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, roofFillArray);

            var frontDoorInfo = twgl.primitives.createCubeVertices();
            frontDoorInfo = twgl.primitives.reorientVertices(frontDoorInfo, twgl.m4.scaling([0.4,0.75,0.1]));
            frontDoorInfo = twgl.primitives.reorientVertices(frontDoorInfo, twgl.m4.translation([0.25,0.375,0.46]));
            var frontDoorArray = {
                v_position : { numComponents: frontDoorInfo.position.numComponents, data: frontDoorInfo.position },
                v_normal : { numComponents: frontDoorInfo.normal.numComponents, data: frontDoorInfo.normal },
                indices : { numComponents: frontDoorInfo.indices.numComponents, data: frontDoorInfo.indices },
                v_texture : { numComponents: frontDoorInfo.texcoord.numComponents, data: frontDoorInfo.texcoord },
                v_tangent : { numComponents: frontDoorInfo.normal.numComponents,
                    data: getTangent(frontDoorInfo.position, frontDoorInfo.texcoord, frontDoorInfo.indices)}
            };
            frontDoorBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, frontDoorArray);

            var windowInfo = twgl.primitives.createCubeVertices();
            windowInfo = twgl.primitives.reorientVertices(windowInfo, twgl.m4.scaling([0.4,0.4,0.1]));
            windowInfo = twgl.primitives.reorientVertices(windowInfo, twgl.m4.translation([-0.4,0.75,0.46]));
            var windowArray = {
                v_position : { numComponents: windowInfo.position.numComponents, data: windowInfo.position },
                v_normal : { numComponents: windowInfo.normal.numComponents, data: windowInfo.normal },
                indices : { numComponents: windowInfo.indices.numComponents, data: windowInfo.indices },
                v_texture : { numComponents: windowInfo.texcoord.numComponents, data: windowInfo.texcoord },
                v_tangent : { numComponents: windowInfo.normal.numComponents,
                    data: getTangent(windowInfo.position, windowInfo.texcoord, windowInfo.indices)}
            };
            windowBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, windowArray);
        }
    };
    House.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.rotationY(this.angle);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        var normalM = twgl.m4.transpose(twgl.m4.inverse(twgl.m4.multiply(modelM, drawingState.view)));
        gl.useProgram(shaderProgram.program);

        if(!rendered) {
            rendered = true;
            var houseImg = new Image();
            houseImg.crossOrigin = 'Designed by 0melapics / Freepik';
            houseImg.src = 'https://i.imgur.com/a7sKro8.jpg';
            houseTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, houseTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            houseImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, houseTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, houseImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var houseNormImg = new Image();
            houseNormImg.crossOrigin = 'Designed by 0melapics / Freepik';
            houseNormImg.src = 'https://i.imgur.com/TdSHq2u.jpg';
            houseNormTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, houseNormTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            houseNormImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, houseNormTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, houseNormImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var roofImg = new Image();
            roofImg.crossOrigin = 'Designed by 0melapics / Freepik';
            roofImg.src = 'https://i.imgur.com/xWp8Vp8.jpg';
            roofTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, roofTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            roofImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, roofTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, roofImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var roofNormImg = new Image();
            roofNormImg.crossOrigin = 'Designed by 0melapics / Freepik';
            roofNormImg.src = 'https://i.imgur.com/R2tOXTW.jpg';
            roofNormTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, roofNormTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            roofNormImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, roofNormTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, roofNormImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var drivewayImg = new Image();
            drivewayImg.crossOrigin = 'Designed by 0melapics / Freepik';
            drivewayImg.src = 'https://i.imgur.com/UQiunIZ.jpg';
            drivewayTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, drivewayTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            drivewayImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, drivewayTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drivewayImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var drivewayNormImg = new Image();
            drivewayNormImg.crossOrigin = 'Designed by 0melapics / Freepik';
            drivewayNormImg.src = 'https://i.imgur.com/ceXVf33.jpg';
            drivewayNormTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, drivewayNormTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            drivewayNormImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, drivewayNormTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drivewayNormImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var doorImg = new Image();
            doorImg.crossOrigin = 'Designed by 0melapics / Freepik';
            doorImg.src = 'https://i.imgur.com/vJdbuCJ.png';
            doorTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, doorTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            doorImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, doorTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, doorImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var doorNormImg = new Image();
            doorNormImg.crossOrigin = 'Designed by 0melapics / Freepik';
            doorNormImg.src = 'https://i.imgur.com/JHPOZjx.png';
            doorNormTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, doorNormTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            doorNormImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, doorNormTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, doorNormImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var windowImg = new Image();
            windowImg.crossOrigin = 'Designed by 0melapics / Freepik';
            windowImg.src = 'https://i.imgur.com/D5IdwNg.jpg';
            windowTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, windowTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            windowImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, windowTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, windowImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var windowNormImg = new Image();
            windowNormImg.crossOrigin = 'Designed by 0melapics / Freepik';
            windowNormImg.src = 'https://i.imgur.com/JHPOZjx.png';
            windowNormTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, windowNormTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            windowNormImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, windowNormTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, windowNormImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
        }
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            model: modelM, norm: normalM, t_sample: houseTex, t_sample_norm: houseNormTex,
            light_a: [0.2,0.2,0.2,1.0], material_a: [0.7,0.7,0.7,1.0], light_d: this.diff, material_d: this.diff,
            shinniness: 8.0, tod: drawingState.timeOfDay
        });
        twgl.setBuffersAndAttributes(gl, shaderProgram, baseBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, baseBuffer);
        twgl.setBuffersAndAttributes(gl, shaderProgram, garageBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, garageBuffer);

        twgl.setUniforms(shaderProgram, { t_sample: roofTex, t_sample_norm: roofNormTex, shinniness: 7.0 });
        twgl.setBuffersAndAttributes(gl, shaderProgram, roofFillBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, roofFillBuffer);

        twgl.setUniforms(shaderProgram, { t_sample: drivewayTex, t_sample_norm: drivewayNormTex, shinniness: 2.0 });
        twgl.setBuffersAndAttributes(gl, shaderProgram, drivewayBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, drivewayBuffer);

        twgl.setUniforms(shaderProgram, { t_sample: doorTex, t_sample_norm: doorNormTex, shinniness: 8.0 });
        twgl.setBuffersAndAttributes(gl, shaderProgram, frontDoorBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, frontDoorBuffer);
        twgl.setBuffersAndAttributes(gl, shaderProgram, doorBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, doorBuffer);

        twgl.setUniforms(shaderProgram, { t_sample: windowTex, t_sample_norm: windowNormTex });
        twgl.setBuffersAndAttributes(gl, shaderProgram, windowBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, windowBuffer);
    };
    House.prototype.center = function(drawingState) {
        return this.position;
    };
    function getTangent(vs, tc, ind){
        var i;
        var tangents = [];
        for(i=0;i<vs.length/3; i++){
            tangents[i]=[0, 0, 0];
        }

        // Calculate tangents
        var a = [0, 0, 0], b = [0, 0, 0];
        var triTangent = [0, 0, 0];
        for(i = 0; i < ind.length; i+=3) {
            var i0 = ind[i+0];
            var i1 = ind[i+1];
            var i2 = ind[i+2];

            var pos0 = [ vs[i0 * 3], vs[i0 * 3 + 1], vs[i0 * 3 + 2] ];
            var pos1 = [ vs[i1 * 3], vs[i1 * 3 + 1], vs[i1 * 3 + 2] ];
            var pos2 = [ vs[i2 * 3], vs[i2 * 3 + 1], vs[i2 * 3 + 2] ];

            var tex0 = [ tc[i0 * 2], tc[i0 * 2 + 1] ];
            var tex1 = [ tc[i1 * 2], tc[i1 * 2 + 1] ];
            var tex2 = [ tc[i2 * 2], tc[i2 * 2 + 1] ];

            twgl.v3.subtract(pos1,pos0,a);
            twgl.v3.subtract(pos2,pos0,b);

            var c2c1t = tex1[0] - tex0[0];
            var c2c1b = tex1[1] - tex0[1];
            var c3c1t = tex2[0] - tex0[0];
            var c3c1b = tex2[0] - tex0[1];

            triTangent = [c3c1b * a[0] - c2c1b * b[0], c3c1b * a[1] - c2c1b * b[1], c3c1b * a[2] - c2c1b * b[2]];

            twgl.v3.add(tangents[i0],triTangent,tangents[i0]);
            twgl.v3.add(tangents[i1],triTangent,tangents[i1]);
            twgl.v3.add(tangents[i2],triTangent,tangents[i2]);
        }
        // Normalize tangents
        var ts = [];
        for(i=0;i<tangents.length; i++){
            var tan = tangents[i];
            twgl.v3.normalize(tan,tan);
            ts.push(tan[0]);
            ts.push(tan[1]);
            ts.push(tan[2]);
        }
        return ts;
    }
})();

//-X Houses
grobjects.push(new House([-8.5,0,-4.5],90*Math.PI/180));
grobjects.push(new House([-8.5,0,-1],90*Math.PI/180));
grobjects.push(new House([-8.5,0,2.5],90*Math.PI/180));
grobjects.push(new House([-8.5,0,6],90*Math.PI/180));

//X Houses
grobjects.push(new House([8.5,0,-6],270*Math.PI/180));
grobjects.push(new House([8.5,0,-2.5],270*Math.PI/180));
grobjects.push(new House([8.5,0,1],270*Math.PI/180));
grobjects.push(new House([8.5,0,4.5],270*Math.PI/180));

//-Z Houses
grobjects.push(new House([-6,0,-8.5]));
grobjects.push(new House([-2.5,0,-8.5]));
grobjects.push(new House([1,0,-8.5]));
grobjects.push(new House([4.5,0,-8.5]));

//Z Houses
grobjects.push(new House([6,0,8.5],180*Math.PI/180));
grobjects.push(new House([2.5,0,8.5],180*Math.PI/180));
grobjects.push(new House([-1,0,8.5],180*Math.PI/180));
grobjects.push(new House([-4.5,0,8.5],180*Math.PI/180));

//Center Houses
grobjects.push(new House([3.95,0,2.25],90*Math.PI/180));
grobjects.push(new House([2.75,0,4]));