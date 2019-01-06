var grobjects = grobjects || [],
    Ocean = undefined;

(function() { "use strict";
    var shaderProgram = undefined, oceanBuffer = undefined, 
        waterTex = undefined, waterNormTex = undefined, rendered = false;

    Ocean = function Ocean() {
        this.name = "Ocean";
        this.position = [0,-0.005,0];
        this.scale = [15,1,15];
        this.diff = [1,1,1,1];
    };
    Ocean.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl,["bumpMap-vs","bumpMap-fs"]);
        }
        if(!oceanBuffer) {
            var oceanInfo = twgl.primitives.createDiscVertices(1,192,1);
            oceanInfo = twgl.primitives.reorientVertices(oceanInfo, twgl.m4.scaling(this.scale));
            var oceanArray = {
                v_position: { numComponents: oceanInfo.position.numComponents, data: oceanInfo.position },
                v_normal: { numComponents: oceanInfo.normal.numComponents, data: oceanInfo.normal },
                indices: { numComponents: oceanInfo.indices.numComponents, data: oceanInfo.indices },
                v_texture : { numComponents: oceanInfo.texcoord.numComponents, data: oceanInfo.texcoord },
                v_tangent : { numComponents: oceanInfo.normal.numComponents,
                    data: getTangent(oceanInfo.position, oceanInfo.texcoord, oceanInfo.indices)}
            };
            oceanBuffer = twgl.createBufferInfoFromArrays(gl, oceanArray);
        }
    };
    Ocean.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.identity();
        twgl.m4.setTranslation(modelM,this.position, modelM);
        var normalM = twgl.m4.transpose(twgl.m4.inverse(twgl.m4.multiply(modelM, drawingState.view)));
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);

        if(!rendered) {
            rendered = true;
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
            model: modelM, norm: normalM, t_sample: waterTex, t_sample_norm: waterNormTex,
            light_a: [0.2,0.2,0.2,1.0], material_a: [0.7,0.7,0.7,1.0], light_d: this.diff, material_d: this.diff,
            shinniness: 8.0, tod: drawingState.timeOfDay
        });
        twgl.setBuffersAndAttributes(gl,shaderProgram,oceanBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, oceanBuffer);
    };
    Ocean.prototype.center = function(drawingState) {
        return this.position;
    };
    function getTangent(vs, tc, ind) {
        var i;
        var tangents = [];
        for (i = 0; i < vs.length / 3; i++) {
            tangents[i] = [0, 0, 0];
        }

        // Calculate tangents
        var a = [0, 0, 0], b = [0, 0, 0];
        var triTangent = [0, 0, 0];
        for (i = 0; i < ind.length; i += 3) {
            var i0 = ind[i + 0];
            var i1 = ind[i + 1];
            var i2 = ind[i + 2];

            var pos0 = [vs[i0 * 3], vs[i0 * 3 + 1], vs[i0 * 3 + 2]];
            var pos1 = [vs[i1 * 3], vs[i1 * 3 + 1], vs[i1 * 3 + 2]];
            var pos2 = [vs[i2 * 3], vs[i2 * 3 + 1], vs[i2 * 3 + 2]];

            var tex0 = [tc[i0 * 2], tc[i0 * 2 + 1]];
            var tex1 = [tc[i1 * 2], tc[i1 * 2 + 1]];
            var tex2 = [tc[i2 * 2], tc[i2 * 2 + 1]];

            twgl.v3.subtract(pos1, pos0, a);
            twgl.v3.subtract(pos2, pos0, b);

            var c2c1t = tex1[0] - tex0[0];
            var c2c1b = tex1[1] - tex0[1];
            var c3c1t = tex2[0] - tex0[0];
            var c3c1b = tex2[0] - tex0[1];

            triTangent = [c3c1b * a[0] - c2c1b * b[0], c3c1b * a[1] - c2c1b * b[1], c3c1b * a[2] - c2c1b * b[2]];

            twgl.v3.add(tangents[i0], triTangent, tangents[i0]);
            twgl.v3.add(tangents[i1], triTangent, tangents[i1]);
            twgl.v3.add(tangents[i2], triTangent, tangents[i2]);
        }
        // Normalize tangents
        var ts = [];
        for (i = 0; i < tangents.length; i++) {
            var tan = tangents[i];
            twgl.v3.normalize(tan, tan);
            ts.push(tan[0]);
            ts.push(tan[1]);
            ts.push(tan[2]);
        }
        return ts;
    }
})();
grobjects.push(new Ocean());