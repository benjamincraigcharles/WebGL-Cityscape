var grobjects = grobjects || [],
    PorchLight = undefined;

(function() { "use strict";

    var shaderProgramLight = undefined, leftLightBuffer = undefined, rightLightBuffer = undefined, porchLightNum = 1;

    // constructor for PorchLights
    PorchLight = function PorchLight(position, angle) {
        this.name = "Porch Light" + porchLightNum++;
        this.position = position || [0,0,0];
        this.lightColor = [1,1,0];
        this.angle = angle || 0;
    };
    PorchLight.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgramLight) {
            shaderProgramLight = twgl.createProgramInfo(gl, ["light-vs", "light-fs"]);
        }
        if (!leftLightBuffer) {

            var frontLInfo = twgl.primitives.createSphereVertices(0.065, 12, 24);
            frontLInfo = twgl.primitives.reorientVertices(frontLInfo, twgl.m4.translation([0, 0.6, 0.24]));
            var frontLArray = {
                vpos: {numComponents: frontLInfo.position.numComponents, data: frontLInfo.position},
                vnormal: {numComponents: frontLInfo.normal.numComponents, data: frontLInfo.normal},
                indices: {numComponents: frontLInfo.indices.numComponents, data: frontLInfo.indices}
            };
            leftLightBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, frontLArray);

            var frontRInfo = twgl.primitives.createSphereVertices(0.065, 12, 24);
            frontRInfo = twgl.primitives.reorientVertices(frontRInfo, twgl.m4.translation([-0.5, 0.6, 0.24]));
            var frontRArray = {
                vpos: {numComponents: frontRInfo.position.numComponents, data: frontRInfo.position},
                vnormal: {numComponents: frontRInfo.normal.numComponents, data: frontRInfo.normal},
                indices: {numComponents: frontRInfo.indices.numComponents, data: frontRInfo.indices}
            };
            rightLightBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, frontRArray);
        }
    };
    PorchLight.prototype.draw = function(drawingState) {

        var modelM = twgl.m4.rotationY(this.angle);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgramLight.program);
        twgl.setUniforms(shaderProgramLight,{
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            model: modelM, lightcolor: this.lightColor, tod: drawingState.timeOfDay, light: 1.0
        });
        twgl.setBuffersAndAttributes(gl,shaderProgramLight,leftLightBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,leftLightBuffer);
        twgl.setBuffersAndAttributes(gl,shaderProgramLight,rightLightBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES,rightLightBuffer);
    };
    PorchLight.prototype.center = function(drawingState) {
        return this.position;
    };
})();

//Z Porch Lights
grobjects.push(new PorchLight([2.5,0,7.8]));
grobjects.push(new PorchLight([6,0,7.8]));
grobjects.push(new PorchLight([-1,0,7.8]));
grobjects.push(new PorchLight([-4.5,0,7.8]));

//-Z Porch Lights
grobjects.push(new PorchLight([-2.5,0,-7.8],180*Math.PI/180));
grobjects.push(new PorchLight([-6,0,-7.8],180*Math.PI/180));
grobjects.push(new PorchLight([1,0,-7.8],180*Math.PI/180));
grobjects.push(new PorchLight([4.5,0,-7.8],180*Math.PI/180));

//X Lights
grobjects.push(new PorchLight([-7.8,0,2.5],270*Math.PI/180));
grobjects.push(new PorchLight([-7.8,0,6],270*Math.PI/180));
grobjects.push(new PorchLight([-7.8,0,-1],270*Math.PI/180));
grobjects.push(new PorchLight([-7.8,0,-4.5],270*Math.PI/180));

//-X Lights
grobjects.push(new PorchLight([7.8,0,-2.5],90*Math.PI/180));
grobjects.push(new PorchLight([7.8,0,-6],90*Math.PI/180));
grobjects.push(new PorchLight([7.8,0,1],90*Math.PI/180));
grobjects.push(new PorchLight([7.8,0,4.5],90*Math.PI/180));

//Fountain
grobjects.push(new PorchLight([0.25,0.45,-0.25]));

//Center Houses
grobjects.push(new PorchLight([3.25,0,4.25]));
grobjects.push(new PorchLight([4.2,0,1.75],90*Math.PI/180));
