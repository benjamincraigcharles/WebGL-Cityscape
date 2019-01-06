var grobjects = grobjects || [],
    Fountain = undefined;

(function() { "use strict";

    var shaderProgram = undefined, baseBuffer = undefined, torusBuffer, poleBuffer, waterBuffer, ringBuffer,
        torusRingBuffer, topWaterBuffer, baseTex, poleTex, waterTex, baseNormTex, poleNormTex, waterNormTex,
        rendered = false;

    // constructor for Fountains
    Fountain = function Fountain() {
        this.name = "Fountain";
        this.position = [0,0,0];
        this.diff = [1,1,1,1];
    };
    Fountain.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["bumpMap-vs", "bumpMap-fs"]);
        }
        if (!baseBuffer) {
            var baseInfo = twgl.primitives.createCylinderVertices(1,0.3,192,192,false);
            baseInfo = twgl.primitives.reorientVertices(baseInfo, twgl.m4.translation([0,0.15,0]));
            var baseArray = {
                v_position : { numComponents: baseInfo.position.numComponents, data: baseInfo.position },
                v_normal : { numComponents: baseInfo.normal.numComponents, data: baseInfo.normal },
                indices : { numComponents: baseInfo.indices.numComponents, data: baseInfo.indices },
                v_texture : { numComponents: baseInfo.texcoord.numComponents, data: baseInfo.texcoord },
                v_tangent : { numComponents: baseInfo.normal.numComponents,
                    data: getTangent(baseInfo.position, baseInfo.texcoord, baseInfo.indices)}
            };
            baseBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, baseArray);

            var torusInfo = twgl.primitives.createTorusVertices(1,0.1,192,192);
            torusInfo = twgl.primitives.reorientVertices(torusInfo, twgl.m4.translation([0,0.3,0]));
            var torusArray = {
                v_position : { numComponents: torusInfo.position.numComponents, data: torusInfo.position },
                v_normal : { numComponents: torusInfo.normal.numComponents, data: torusInfo.normal },
                indices : { numComponents: torusInfo.indices.numComponents, data: torusInfo.indices },
                v_texture : { numComponents: torusInfo.texcoord.numComponents, data: torusInfo.texcoord },
                v_tangent : { numComponents: torusInfo.normal.numComponents,
                    data: getTangent(torusInfo.position, torusInfo.texcoord, torusInfo.indices)}
            };
            torusBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, torusArray);

            var poleInfo = twgl.primitives.createTruncatedConeVertices(0.2,0.1,1.25,192,192);
            poleInfo = twgl.primitives.reorientVertices(poleInfo, twgl.m4.translation([0,0.9,0]));
            var poleArray = {
                v_position : { numComponents: poleInfo.position.numComponents, data: poleInfo.position },
                v_normal : { numComponents: poleInfo.normal.numComponents, data: poleInfo.normal },
                indices : { numComponents: poleInfo.indices.numComponents, data: poleInfo.indices },
                v_texture : { numComponents: poleInfo.texcoord.numComponents, data: poleInfo.texcoord },
                v_tangent : { numComponents: poleInfo.normal.numComponents,
                    data: getTangent(poleInfo.position, poleInfo.texcoord, poleInfo.indices)}
            };
            poleBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, poleArray);

            var waterInfo = twgl.primitives.createCylinderVertices(0.975,0.32,192,192,false);
            waterInfo = twgl.primitives.reorientVertices(waterInfo, twgl.m4.translation([0,0.15,0]));
            var waterArray = {
                v_position : { numComponents: waterInfo.position.numComponents, data: waterInfo.position },
                v_normal : { numComponents: waterInfo.normal.numComponents, data: waterInfo.normal },
                indices : { numComponents: waterInfo.indices.numComponents, data: waterInfo.indices },
                v_texture : { numComponents: waterInfo.texcoord.numComponents, data: waterInfo.texcoord },
                v_tangent : { numComponents: waterInfo.normal.numComponents,
                    data: getTangent(waterInfo.position, waterInfo.texcoord, waterInfo.indices)}
            };
            waterBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, waterArray);

            var ringInfo = twgl.primitives.createCylinderVertices(0.5,0.15,192,192,false);
            ringInfo = twgl.primitives.reorientVertices(ringInfo, twgl.m4.translation([0,0.9,0]));
            var ringArray = {
                v_position : { numComponents: ringInfo.position.numComponents, data: ringInfo.position },
                v_normal : { numComponents: ringInfo.normal.numComponents, data: ringInfo.normal },
                indices : { numComponents: ringInfo.indices.numComponents, data: ringInfo.indices },
                v_texture : { numComponents: ringInfo.texcoord.numComponents, data: ringInfo.texcoord },
                v_tangent : { numComponents: ringInfo.normal.numComponents,
                    data: getTangent(ringInfo.position, ringInfo.texcoord, ringInfo.indices)}
            };
            ringBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, ringArray);

            var torusRingInfo = twgl.primitives.createTorusVertices(0.5,0.05,192,192);
            torusRingInfo = twgl.primitives.reorientVertices(torusRingInfo, twgl.m4.translation([0,1,0]));
            var torusRingArray = {
                v_position : { numComponents: torusRingInfo.position.numComponents, data: torusRingInfo.position },
                v_normal : { numComponents: torusRingInfo.normal.numComponents, data: torusRingInfo.normal },
                indices : { numComponents: torusRingInfo.indices.numComponents, data: torusRingInfo.indices },
                v_texture : { numComponents: torusRingInfo.texcoord.numComponents, data: torusRingInfo.texcoord },
                v_tangent : { numComponents: torusRingInfo.normal.numComponents,
                    data: getTangent(torusRingInfo.position, torusRingInfo.texcoord, torusRingInfo.indices)}
            };
            torusRingBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, torusRingArray);

            var topWaterInfo = twgl.primitives.createCylinderVertices(0.475,0.051,192,192,false);
            topWaterInfo = twgl.primitives.reorientVertices(topWaterInfo, twgl.m4.translation([0,1,0]));
            var topWaterArray = {
                v_position : { numComponents: topWaterInfo.position.numComponents, data: topWaterInfo.position },
                v_normal : { numComponents: topWaterInfo.normal.numComponents, data: topWaterInfo.normal },
                indices : { numComponents: topWaterInfo.indices.numComponents, data: topWaterInfo.indices },
                v_texture : { numComponents: topWaterInfo.texcoord.numComponents, data: topWaterInfo.texcoord },
                v_tangent : { numComponents: topWaterInfo.normal.numComponents,
                    data: getTangent(topWaterInfo.position, topWaterInfo.texcoord, topWaterInfo.indices)}
            };
            topWaterBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, topWaterArray);
        }
    };
    Fountain.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.identity();
        twgl.m4.setTranslation(modelM,this.position, modelM);
        var gl = drawingState.gl;
        var normalM = twgl.m4.transpose(twgl.m4.inverse(twgl.m4.multiply(modelM, drawingState.view)));
        gl.useProgram(shaderProgram.program);

        if(!rendered) {
            rendered = true;
            var baseImg = new Image();
            baseImg.crossOrigin = 'Designed by 0melapics / Freepik';
            baseImg.src = 'https://i.imgur.com/vJdbuCJ.png';
            baseTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, baseTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            baseImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, baseTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, baseImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var baseNormImg = new Image();
            baseNormImg.crossOrigin = 'Designed by 0melapics / Freepik';
            baseNormImg.src = 'https://i.imgur.com/TdSHq2u.jpg';
            baseNormTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, baseNormTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            baseNormImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, baseNormTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, baseNormImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var poleImg = new Image();
            poleImg.crossOrigin = 'Designed by 0melapics / Freepik';
            poleImg.src = 'https://i.imgur.com/I3tYMmf.jpg';
            poleTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, poleTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            poleImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, poleTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, poleImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var poleNormImg = new Image();
            poleNormImg.crossOrigin = 'Designed by 0melapics / Freepik';
            poleNormImg.src = 'https://i.imgur.com/x9Kn7zt.jpg';
            poleNormTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, poleNormTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            poleNormImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, poleNormTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, poleNormImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var waterImg = new Image();
            waterImg.crossOrigin = 'Designed by 0melapics / Freepik';
            waterImg.src = 'https://i.imgur.com/gj7OjZF.jpg';
            waterTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, waterTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            waterImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, waterTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, waterImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            var waterNormImg = new Image();
            waterNormImg.crossOrigin = 'Designed by 0melapics / Freepik';
            waterNormImg.src = 'https://i.imgur.com/kDHRa1a.jpg';
            waterNormTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, waterNormTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            waterNormImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, waterNormTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, waterNormImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
        }
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            model: modelM, norm: normalM, t_sample: baseTex, t_sample_norm: baseNormTex,
            light_a: [0.2,0.2,0.2,1.0], material_a: [0.7,0.7,0.7,1.0], light_d: this.diff, material_d: this.diff,
            shinniness: 5.0, tod: drawingState.timeOfDay
        });
        twgl.setBuffersAndAttributes(gl, shaderProgram, baseBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, baseBuffer);
        twgl.setBuffersAndAttributes(gl, shaderProgram, torusBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, torusBuffer);
        twgl.setBuffersAndAttributes(gl, shaderProgram, ringBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, ringBuffer);
        twgl.setBuffersAndAttributes(gl, shaderProgram, torusRingBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, torusRingBuffer);
        twgl.setUniforms(shaderProgram, {
            t_sample: poleTex, t_sample_norm: poleNormTex, material_d: [0.8,0.8,0.8,1.0], shinniness: 6.0 });
        twgl.setBuffersAndAttributes(gl, shaderProgram, poleBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, poleBuffer);

        twgl.setUniforms(shaderProgram, { t_sample: waterTex, t_sample_norm: waterNormTex, shinniness: 8.0 });
        twgl.setBuffersAndAttributes(gl, shaderProgram, waterBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, waterBuffer);
        twgl.setBuffersAndAttributes(gl, shaderProgram, topWaterBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, topWaterBuffer);
    };
    Fountain.prototype.center = function(drawingState) {
        return this.position;
    };
    function getTangent(vs, tc, ind){
        var i;
        var tangents = [];
        for(i=0;i<vs.length/3; i++){ tangents[i]=[0, 0, 0]; }

        // Calculate tangents
        var a = [0, 0, 0], b = [0, 0, 0];
        var triTangent = [0, 0, 0];
        for(i = 0; i < ind.length; i+=3) {
            var i0 = ind[i+0]; var i1 = ind[i+1]; var i2 = ind[i+2];
            var pos0 = [ vs[i0 * 3], vs[i0 * 3 + 1], vs[i0 * 3 + 2] ];
            var pos1 = [ vs[i1 * 3], vs[i1 * 3 + 1], vs[i1 * 3 + 2] ];
            var pos2 = [ vs[i2 * 3], vs[i2 * 3 + 1], vs[i2 * 3 + 2] ];
            var tex0 = [ tc[i0 * 2], tc[i0 * 2 + 1] ];
            var tex1 = [ tc[i1 * 2], tc[i1 * 2 + 1] ];
            var tex2 = [ tc[i2 * 2], tc[i2 * 2 + 1] ];

            twgl.v3.subtract(pos1,pos0,a);
            twgl.v3.subtract(pos2,pos0,b);
            var c2c1t = tex1[0] - tex0[0]; var c2c1b = tex1[1] - tex0[1]; 
            var c3c1t = tex2[0] - tex0[0]; var c3c1b = tex2[0] - tex0[1];
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
            ts.push(tan[0]); ts.push(tan[1]); ts.push(tan[2]);
        }
        return ts;
    }
})();
grobjects.push(new Fountain());
