var grobjects = grobjects || [], Skybox = undefined;

(function() { "use strict";

    var shaderProgram = undefined, baseBuffer = undefined, cubeTex, rendered = false;

    // constructor for Skyboxes
    Skybox = function Skybox() {
        this.name = "Skybox";
        this.position = [0,0,0];
    };
    Skybox.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["Skybox-vs", "Skybox-fs"]);
        }
        if (!baseBuffer) {
            var baseInfo = twgl.primitives.createCubeVertices();
            baseInfo = twgl.primitives.reorientVertices(baseInfo, twgl.m4.scaling([100,400,100]));
            var baseArray = {
                v_position: {numComponents: baseInfo.position.numComponents, data: baseInfo.position},
                v_normal: {numComponents: baseInfo.normal.numComponents, data: baseInfo.normal},
                indices: {numComponents: baseInfo.indices.numComponents, data: baseInfo.indices},
                v_texture: {numComponents: baseInfo.texcoord.numComponents, data: baseInfo.texcoord}
            };
            baseBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, baseArray);
        }
    };
    Skybox.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.identity();
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        if (!rendered) {
            rendered = true;
            cubeTex = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTex);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            var posXImg = new Image();
            posXImg.crossOrigin = 'Designed by 0melapics / Freepik';
            posXImg.src = 'https://i.imgur.com/NQb3Xc2.jpg';
            var negXImg = new Image();
            negXImg.crossOrigin = 'Designed by 0melapics / Freepik';
            negXImg.src = 'https://i.imgur.com/jCIpMwM.jpg';
            var posYImg = new Image();
            posYImg.crossOrigin = 'Designed by 0melapics / Freepik';
            posYImg.src = 'https://i.imgur.com/ghfDaeA.jpg';
            var negYImg = new Image();
            negYImg.crossOrigin = 'Designed by 0melapics / Freepik';
            negYImg.src = 'https://i.imgur.com/MZMI1r5.jpg';
            var posZImg = new Image();
            posZImg.crossOrigin = 'Designed by 0melapics / Freepik';
            posZImg.src = 'https://i.imgur.com/gR04OTl.jpg';
            var negZImg = new Image();
            negZImg.crossOrigin = 'Designed by 0melapics / Freepik';
            negZImg.src = 'https://i.imgur.com/LKSxSrL.jpg';

            gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTex);
            posXImg.onload = function () {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, posXImg);
            };
            negXImg.onload = function () {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, negXImg);
            };
            posYImg.onload = function () {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, posYImg);
            };
            negYImg.onload = function () {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, negYImg);
            };
            posZImg.onload = function () {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, posZImg);
            };
            negZImg.onload = function () {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, negZImg);
            };
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        }
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, camera: drawingState.orient, proj: drawingState.proj,
            arcball: drawingState.ball, model: modelM, t_sample_cube: cubeTex, tod: drawingState.timeOfDay
        });
        twgl.setBuffersAndAttributes(gl,shaderProgram, baseBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, baseBuffer);
    };
    Skybox.prototype.center = function(drawingState) {
        return this.position;
    };
})();
grobjects.push(new Skybox());