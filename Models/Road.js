var grobjects = grobjects || [],
    Road = undefined;

(function() { "use strict";

    var shaderProgram = undefined, roadBuffer = undefined, roadNum = 1, texture = undefined, rendered = false;

    // constructor for Roads
    Road = function Road(position,angle) {
        this.name = 'Road' + roadNum++;
        this.position = position || [0,0,0];
        this.angle = angle || 0;
    };
    Road.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["road-vs", "road-fs"]);
        }
        if (!roadBuffer) {
            var roadInfo = twgl.primitives.createCubeVertices();
            roadInfo = twgl.primitives.reorientVertices(roadInfo, twgl.m4.scaling([1.5,0.0001,13.75]));
            roadInfo = twgl.primitives.reorientVertices(roadInfo, twgl.m4.translation([0,0.001,0]));
            var roadArray = {
                v_position : { numComponents: roadInfo.position.numComponents, data: roadInfo.position },
                v_normal : { numComponents: roadInfo.normal.numComponents, data: roadInfo.normal },
                indices : { numComponents: roadInfo.indices.numComponents, data: roadInfo.indices },
                v_texture : { numComponents: roadInfo.texcoord.numComponents, data: roadInfo.texcoord }
            };
            roadBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, roadArray);
        }
    };
    Road.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.rotationY(this.angle);
        twgl.m4.setTranslation(modelM,this.position, modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);

        if(!rendered) {
            rendered = true;
            var image = new Image();
            image.crossOrigin = 'Designed by Benjamin Charles';
            image.src = 'https://i.imgur.com/ZXt2JML.png';
            texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            image.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
        }
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            model: modelM, t_sample: texture, tod: drawingState.timeOfDay
        });
        twgl.setBuffersAndAttributes(gl, shaderProgram, roadBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, roadBuffer);
    };
    Road.prototype.center = function(drawingState) {
        return this.position;
    };
})();
grobjects.push(new Road([-6.125,0,0],0));
grobjects.push(new Road([6.125,0,0],0));
grobjects.push(new Road([0,0.001,-6.25],90*Math.PI/180));
grobjects.push(new Road([0,0.001,6.25],90*Math.PI/180));

