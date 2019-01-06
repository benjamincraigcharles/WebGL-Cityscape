var grobjects = grobjects || [],
    Background = undefined;

(function() { "use strict";
    var shaderProgram = undefined, backgroundBuffer = undefined,
        backgroundTex = undefined, backgroundNormTex = undefined, rendered = false;

    Background = function Background() {
        this.name = "Background";
        this.position = [0,-21.09,0];
        this.scale = [46,42,46];
    };
    Background.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl,["landscape-vs","landscape-fs"]);
        }
        if(!backgroundBuffer) {
            var backgroundInfo = twgl.primitives.createCubeVertices();
            backgroundInfo = twgl.primitives.reorientVertices(backgroundInfo, twgl.m4.scaling(this.scale));
            for(var i = 0; i < backgroundInfo.texcoord.length; i++) {
                if(backgroundInfo.texcoord[i] != 0) {
                    backgroundInfo.texcoord[i] += 4;
                }
            }
            var backgroundArray = {
                v_position: {numComponents: backgroundInfo.position.numComponents, data: backgroundInfo.position},
                v_normal: {numComponents: backgroundInfo.normal.numComponents, data: backgroundInfo.normal},
                indices: {numComponents: backgroundInfo.indices.numComponents, data: backgroundInfo.indices},
                v_texture : {numComponents: backgroundInfo.texcoord.numComponents, data: backgroundInfo.texcoord}
            };
            backgroundBuffer = twgl.createBufferInfoFromArrays(gl, backgroundArray);
        }
    };
    Background.prototype.draw = function(drawingState) {

        var modelM = twgl.m4.identity();
        twgl.m4.setTranslation(modelM,this.position, modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);

        if(!rendered) {
            rendered = true;
            var backgroundImg = new Image();
            backgroundImg.crossOrigin = 'Designed by 0melapics / Freepik';
            backgroundImg.src = 'https://i.imgur.com/MBIDZWS.jpg?1';
            backgroundTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, backgroundTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            backgroundImg.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, backgroundTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, backgroundImg);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
        }
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, model: modelM,
            t_sample: backgroundTex, tod: drawingState.timeOfDay, lightdir: drawingState.sunDirection
        });
        twgl.setBuffersAndAttributes(gl,shaderProgram,backgroundBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backgroundBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgram,backgroundBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, backgroundBuffer);
    };
    Background.prototype.center = function(drawingState) {
        return this.position;
    };
})();
grobjects.push(new Background());