var grobjects = grobjects || [];

var Skyscraper = undefined;
(function() { "use strict";
    var shaderProgram = undefined, towerBuffer = undefined, baseBuffer = undefined, midBuffer = undefined, numSkyscrapers = 1;

    Skyscraper = function Skyscraper(position,angle,buildingCol,sideCol) {
        this.name = "Skyscraper" + numSkyscrapers++;
        this.position = position || [0,0,0];
        this.windowColor = [0,1,1];
        this.buildingColor = buildingCol || [0.80,0.80,0.80];
        this.sideColor = sideCol || [0.329412,0.329412,0.329412];
        this.angle = angle || 0;
    };

    Skyscraper.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["skyscraper-vs", "skyscraper-fs"]);
        }
        if (!towerBuffer) {
            var towerInfo = twgl.primitives.createCubeVertices();
            towerInfo = twgl.primitives.reorientVertices(towerInfo, twgl.m4.scaling([1.7,9.5,1.7]));
            towerInfo = twgl.primitives.reorientVertices(towerInfo, twgl.m4.translation([0,4.75,0]));
            var towerArray = {
                v_position: {numComponents: towerInfo.position.numComponents, data: towerInfo.position},
                v_normal: {numComponents: towerInfo.normal.numComponents, data: towerInfo.normal},
                indices: {numComponents: towerInfo.indices.numComponents, data: towerInfo.indices}
            };
            towerBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, towerArray);

            var baseInfo = twgl.primitives.createCubeVertices();
            baseInfo = twgl.primitives.reorientVertices(baseInfo, twgl.m4.scaling([2,9,2]));
            baseInfo = twgl.primitives.reorientVertices(baseInfo, twgl.m4.translation([0,4.5,0]));
            var baseArray = {
                v_position: {numComponents: baseInfo.position.numComponents, data: baseInfo.position},
                v_normal: {numComponents: baseInfo.normal.numComponents, data: baseInfo.normal},
                indices: {numComponents: baseInfo.indices.numComponents, data: baseInfo.indices}
            };
            baseBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, baseArray);

            var midInfo = twgl.primitives.createCubeVertices();
            midInfo = twgl.primitives.reorientVertices(midInfo, twgl.m4.scaling([2.50,9.2,1.4]));
            midInfo = twgl.primitives.reorientVertices(midInfo, twgl.m4.translation([0,4.6,0]));
            var midArray = {
                v_position: {numComponents: midInfo.position.numComponents, data: midInfo.position},
                v_normal: {numComponents: midInfo.normal.numComponents, data: midInfo.normal},
                indices: {numComponents: midInfo.indices.numComponents, data: midInfo.indices}
            };
            midBuffer = twgl.createBufferInfoFromArrays(drawingState.gl, midArray);
        }
    };
    Skyscraper.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.rotationY(this.angle);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection, model: modelM,
            w_color_in: this.windowColor, b_color_in: this.buildingColor, tod: drawingState.timeOfDay, window: 1.0
        });
        twgl.setBuffersAndAttributes(gl,shaderProgram, baseBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, baseBuffer);

        twgl.setUniforms(shaderProgram, { w_color_in: this.sideColor, b_color_in: this.sideColor, window: 0.0 });
        twgl.setBuffersAndAttributes(gl,shaderProgram, midBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, midBuffer);

        twgl.setUniforms(shaderProgram, { w_color_in: this.buildingColor, b_color_in: this.buildingColor, window: 0.0 });
        twgl.setBuffersAndAttributes(gl,shaderProgram, towerBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, towerBuffer);

    };
    Skyscraper.prototype.center = function(drawingState) {
        return this.position;
    };
})();

//-Z Back
grobjects.push(new Skyscraper([0,0,-22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([5.5,0,-22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-5.5,0,-22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([11,0,-22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-11,0,-22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([16.5,0,-22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-16.5,0,-22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([22,0,-22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-22,0,-22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));

//+Z Back
grobjects.push(new Skyscraper([0,0,22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([5.5,0,22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-5.5,0,22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([11,0,22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-11,0,22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([16.5,0,22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-16.5,0,22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([22,0,22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-22,0,22],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));

//-Z Front
grobjects.push(new Skyscraper([2.75,0,-20]));
grobjects.push(new Skyscraper([-2.75,0,-20]));
grobjects.push(new Skyscraper([8.25,0,-20]));
grobjects.push(new Skyscraper([-8.25,0,-20]));
grobjects.push(new Skyscraper([13.75,0,-20]));
grobjects.push(new Skyscraper([-13.75,0,-20]));
grobjects.push(new Skyscraper([19.25,0,-20]));
grobjects.push(new Skyscraper([-19.25,0,-20]));

//+Z Front
grobjects.push(new Skyscraper([2.75,0,20]));
grobjects.push(new Skyscraper([-2.75,0,20]));
grobjects.push(new Skyscraper([8.25,0,20]));
grobjects.push(new Skyscraper([-8.25,0,20]));
grobjects.push(new Skyscraper([13.75,0,20]));
grobjects.push(new Skyscraper([-13.75,0,20]));
grobjects.push(new Skyscraper([19.25,0,20]));
grobjects.push(new Skyscraper([-19.25,0,20]));

//-X Back
grobjects.push(new Skyscraper([-22,0,16.5],90*Math.PI/180));
grobjects.push(new Skyscraper([-22,0,11],90*Math.PI/180));
grobjects.push(new Skyscraper([-22,0,5.5],90*Math.PI/180));
grobjects.push(new Skyscraper([-22,0,0],90*Math.PI/180));
grobjects.push(new Skyscraper([-22,0,-5.5],90*Math.PI/180));
grobjects.push(new Skyscraper([-22,0,-11],90*Math.PI/180));
grobjects.push(new Skyscraper([-22,0,-16.5],90*Math.PI/180));

//+X Back
grobjects.push(new Skyscraper([22,0,16.5],90*Math.PI/180));
grobjects.push(new Skyscraper([22,0,11],90*Math.PI/180));
grobjects.push(new Skyscraper([22,0,5.5],90*Math.PI/180));
grobjects.push(new Skyscraper([22,0,0],90*Math.PI/180));
grobjects.push(new Skyscraper([22,0,-5.5],90*Math.PI/180));
grobjects.push(new Skyscraper([22,0,-11],90*Math.PI/180));
grobjects.push(new Skyscraper([22,0,-16.5],90*Math.PI/180));

//-X Front
grobjects.push(new Skyscraper([-20,0,13.75],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-20,0,8.25],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-20,0,2.75],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-20,0,-2.75],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-20,0,-8.25],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-20,0,-13.75],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));

//X+ Front
grobjects.push(new Skyscraper([20,0,13.75],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([20,0,8.25],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([20,0,2.75],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([20,0,-2.75],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([20,0,-8.25],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([20,0,-13.75],90*Math.PI/180,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));

//Center Tower
grobjects.push(new Skyscraper([0,-1,-3],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([0,-1,-4.25],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([2,-1.7,-4.25],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-2,-1.7,-4.25],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([4,-2.5,-4.25],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-4,-2.5,-4.25],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));

//+X Tower
grobjects.push(new Skyscraper([2,-1.7,-3],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([4,-2.5,-3],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([4,-3.25,-1.75],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([4,-4,-0.5],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));

//-X Tower
grobjects.push(new Skyscraper([-2,-1.7,-3],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-4,-2.5,-3],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-4,-3.25,-1.75],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
grobjects.push(new Skyscraper([-4,-4,-0.5],0,[0.623529,0.623529,0.372549],[0.847059,0.847059,0.74902]));
