var grobjects = grobjects || [],
    Landscape = undefined;

(function() { "use strict";
    var shaderProgram = undefined, landscapeBuffer = undefined,
        grassTex = undefined, rendered = false;

    Landscape = function Landscape() {
        this.name = "Landscape";
        this.position = [0,0,0];
        this.scale = [19,0.0001,19];
    };
    Landscape.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl,["landscape-vs","landscape-fs"]);
        }
        if(!landscapeBuffer) {
            var landscapeInfo = twgl.primitives.createCubeVertices();
            landscapeInfo = twgl.primitives.reorientVertices(landscapeInfo, twgl.m4.scaling(this.scale));
            for(var i = 0; i < landscapeInfo.texcoord.length; i++) {
                if(landscapeInfo.texcoord[i] != 0) { landscapeInfo.texcoord[i] += 9; }
            }
            var landscapeArray = {
                v_position: {numComponents: landscapeInfo.position.numComponents, data: landscapeInfo.position},
                v_normal: {numComponents: landscapeInfo.normal.numComponents, data: landscapeInfo.normal},
                indices: {numComponents: landscapeInfo.indices.numComponents, data: landscapeInfo.indices},
                v_texture : {numComponents: landscapeInfo.texcoord.numComponents, data: landscapeInfo.texcoord}
            };
            landscapeBuffer = twgl.createBufferInfoFromArrays(gl, landscapeArray);
        }
    };
    Landscape.prototype.draw = function(drawingState) {

        var modelM = twgl.m4.identity();
        twgl.m4.setTranslation(modelM,this.position, modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);

        if(!rendered) {
            rendered = true;
            var grassImg = new Image();
            grassImg.crossOrigin = 'Designed by 0melapics / Freepik';
            grassImg.src = 'https://i.imgur.com/gA9FbpJ.png';
            grassTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, grassTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            grassImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, grassTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, grassImg);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
        }
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, model: modelM,
            t_sample: grassTex, tod: drawingState.timeOfDay, lightdir: drawingState.sunDirection
        });
        twgl.setBuffersAndAttributes(gl,shaderProgram,landscapeBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, landscapeBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgram,landscapeBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, landscapeBuffer);
    };
    Landscape.prototype.center = function(drawingState) {
        return this.position;
    };
})();
grobjects.push(new Landscape());