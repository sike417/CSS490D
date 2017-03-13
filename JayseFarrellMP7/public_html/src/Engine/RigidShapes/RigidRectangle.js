/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*jslint node: true, vars: true, evil: true, bitwise: true */
"use strict";
/* global RigidShape */
var RigidRectangle = function (xf, width, height) {
    RigidShape.call(this, xf);
    this.mType = "RigidRectangle";
    this.mWidth = width;
    this.mHeight = height;
    this.drawMode = RigidRectangle.drawModes.drawColorEdges;
    this.mBoundRadius = Math.sqrt(width * width + height * height) / 2;
    this.mVertex = [];
    this.mFaceNormal = [];

    this.setVertices();
    this.rotateVertices();
    // this.computeFaceNormals();
};
gEngine.Core.inheritPrototype(RigidRectangle, RigidShape);

RigidRectangle.drawModes = Object.freeze({
   drawColorEdges: 0,
    drawBoundingBox: 1
});

RigidRectangle.prototype.setVertices = function () {
    var center = this.mXform.getPosition();
    var hw = this.mWidth / 2;
    var hh = this.mHeight / 2;
    //0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
    this.mVertex[0] = vec2.fromValues(center[0] - hw, center[1] - hh);
    this.mVertex[1] = vec2.fromValues(center[0] + hw, center[1] - hh);
    this.mVertex[2] = vec2.fromValues(center[0] + hw, center[1] + hh);
    this.mVertex[3] = vec2.fromValues(center[0] - hw, center[1] + hh);    
};

RigidRectangle.prototype.computeFaceNormals = function () {
    //0--Top;1--Right;2--Bottom;3--Left
    //mFaceNormal is normal of face toward outside of rectangle    
    for (var i = 0; i<4; i++) {
        var v = (i+1) % 4;
        var nv = (i+2) % 4;
        this.mFaceNormal[i] = vec2.clone(this.mVertex[v]);
        vec2.subtract(this.mFaceNormal[i], this.mFaceNormal[i], this.mVertex[nv]);
        vec2.normalize(this.mFaceNormal[i], this.mFaceNormal[i]);
    }
};

RigidRectangle.prototype.rotateVertices = function () {
    var center = this.mXform.getPosition();
    var r = this.mXform.getRotationInRad();
    for (var i = 0; i<4; i++) {
        vec2.rotateWRT(this.mVertex[i], this.mVertex[i], r, center);
    }
    this.computeFaceNormals();
};

RigidRectangle.prototype.setDrawMode = function(mode){
    this.drawMode = mode;
};

RigidRectangle.prototype.travel = function (dt) {
    var p = this.mXform.getPosition();

    // Linear
    vec2.scaleAndAdd(p, p, this.mVelocity, dt);
    this.setVertices();
    
    // angular motion
    this.rotateVertices();
    
    return this;
};

RigidRectangle.prototype.move = function(dt){
    var p = this.mXform.getPosition();

    // Linear
    vec2.add(p, p, dt);
    this.setVertices();

    // angular motion
    this.rotateVertices();

    return this;
};

RigidRectangle.kBoundColor = [
    [1, 1, 0, 1],
    [1, 0, 0, 1],
    [0, 0, 1, 1],
    [0, 1, 1, 1]
];
RigidRectangle.prototype.drawAnEdge = function (i1, i2, aCamera) {
    this.mLine.setColor(RigidRectangle.kBoundColor[i1]);
    this.mLine.setFirstVertex(this.mVertex[i1][0], this.mVertex[i1][1]);  
    this.mLine.setSecondVertex(this.mVertex[i2][0], this.mVertex[i2][1]); 
    this.mLine.draw(aCamera);
    var n = [3*this.mFaceNormal[i1][0], 3*this.mFaceNormal[i1][1]];
    vec2.add(n, this.mVertex[i1], n);
    this.mLine.setSecondVertex(n[0], n[1]); 
    this.mLine.draw(aCamera);
};

RigidRectangle.prototype.drawBoundingEdge = function(i1, i2, aCamera){
    this.mLine.setColor([0,0,0,1]);
    this.mLine.setFirstVertex(this.mVertex[i1][0], this.mVertex[i1][1]);
    this.mLine.setSecondVertex(this.mVertex[i2][0], this.mVertex[i2][1]);
    this.mLine.draw(aCamera);
};

RigidRectangle.prototype.draw = function (aCamera) {
    RigidShape.prototype.draw.call(this, aCamera);
    var i = 0;
    this.setVertices();
    this.rotateVertices();
    for (i=0; i<4; i++) {
        this.drawMode === RigidRectangle.drawModes.drawColorEdges ? this.drawAnEdge(i, (i+1)%4, aCamera) :
            this.drawBoundingEdge(i, (i+1)%4, aCamera);
    }

    if(this.getDrawBoundCircle()) {
        this.mLine.setColor([1, 1, 1, 1]);
        this.drawCircle(aCamera, this.mBoundRadius);
    }
};

RigidRectangle.prototype.update = function () {
    RigidShape.prototype.update.call(this);
};

RigidRectangle.prototype.findAxisOfLeast = function(otherShape, collisionInfo){
    var n;
    var supportPoint;
    var bestDistance = 999999;
    var bestIndex = null;
    var hasSupport = true;
    var tmpSupport;
    for(var i = 0; i < this.mFaceNormal.length && hasSupport; i++){
        //retrieve a facenormal from A.
        n = this.mFaceNormal[i];
        //use -n as direction and the vertex on edge i as point on edge
        var dir = vec2.scale(vec2.create(), n, -1);

        var ptOnEdge = this.mVertex[i];
        tmpSupport = otherShape.findSupportPoints(dir, ptOnEdge);
        hasSupport = tmpSupport.mSupportPoint !== null;
        if(hasSupport && tmpSupport.mSupportPointDist < bestDistance){
            bestDistance = tmpSupport.mSupportPointDist;
            bestIndex = i;
            supportPoint = tmpSupport.mSupportPoint;
        }
        else if(!hasSupport)
            break;
        // i++;
    }
    if(hasSupport){
        //all four directions have support point. is this true. I don't believe so
        var bestVec = vec2.scale(vec2.create(), this.mFaceNormal[bestIndex], bestDistance);
        collisionInfo.setInfo(bestDistance, this.mFaceNormal[bestIndex],
            vec2.add(vec2.create(), supportPoint, bestVec));
    }
    return hasSupport;
};

RigidRectangle.prototype.findSupportPoints = function(dir, ptOnEdge){
    //the longest project length
    var vToEdge;
    var projection;
    var tmpSupport = {
        mSupportPointDist : -999999,
        mSupportPoint: null
    };
    for(var i = 0; i < this.mVertex.length; i++){
        vToEdge = vec2.subtract(vec2.create(), this.mVertex[i], ptOnEdge);
        projection = vec2.dot(vToEdge, dir);
        if((projection > 0) && (projection > tmpSupport.mSupportPointDist)){
            tmpSupport.mSupportPoint = this.mVertex[i];
            tmpSupport.mSupportPointDist = projection;
        }
    }
    return tmpSupport;
    //initialize the computed results
};

RigidRectangle.prototype.checkRectRect = function(otherShape, collisionInfo){
    var status1 = false, status2 = false;
    var collisionInfo2 = new CollisionInfo();
    //find Axis of seperation for both rectangles
    status1 = this.findAxisOfLeast(otherShape, collisionInfo);

    if(status1){
        status2 = otherShape.findAxisOfLeast(this, collisionInfo2);
        if(status2) {
            if (collisionInfo.getDepth() < collisionInfo2.getDepth()) {
                var depthVec = vec2.create();
                vec2.scale(depthVec, collisionInfo.getNormal(), collisionInfo.getDepth());
                collisionInfo.setInfo(collisionInfo.getDepth(), vec2.scale(vec2.create(), collisionInfo.getNormal(), -1),
                    vec2.subtract(vec2.create(), collisionInfo.mStart, depthVec));
            } else{
                collisionInfo.setInfo(collisionInfo2.getDepth(),
                    vec2.scale(vec2.create(), collisionInfo2.getNormal(), 1),collisionInfo2.mStart);
            }
            collisionInfo.swapStartAndEnd();
        }
    }
    return status1 && status2;
};

RigidRectangle.prototype.checkRectCirc = function(otherShape, collisionInfo){
    //otherShape should be a circle
    //step A: compute nearest edge
    //otherShape should be a circle
    //step A: compute nearest edge
    var circ2Pos = otherShape.mXform.getPosition();
    var projection, v, bestDistance = 99999999, nearestEdge, inside = true, firstTime = true;
    for(var i = 0; i < this.mFaceNormal.length; i++){
        v = vec2.subtract(vec2.create(), circ2Pos, this.mVertex[i]);
        projection = vec2.dot(v, this.mFaceNormal[i]);
        if(projection > 0 && (projection < bestDistance || inside)){
            bestDistance = projection;
            nearestEdge = i;
            inside = false;
        }
        if((projection > bestDistance || firstTime) && inside === true){
            bestDistance = projection;
            nearestEdge = i;
        }
        firstTime = false;
    }
    if(inside){
        var radiusVec = vec2.scale(vec2.create(), this.mFaceNormal[nearestEdge], otherShape.mRadius);
        collisionInfo.setInfo(otherShape.mRadius - bestDistance, this.mFaceNormal[nearestEdge],
            vec2.subtract(vec2.create(), circ2Pos, radiusVec));
    }
    else {
        var v1 = vec2.subtract(vec2.create(), circ2Pos, this.mVertex[nearestEdge]);
        var v2 = vec2.subtract(vec2.create(), this.mVertex[(nearestEdge + 1) % 4], this.mVertex[nearestEdge]);
        var dot = vec2.dot(v1, v2);
        if(dot < 0) { //region 1
            var dis = vec2.length(v1);
            if(dis > otherShape.mRadius)
                return false;
            var normal = vec2.normalize(vec2.create(), v1);
            var radiusVec = vec2.scale(vec2.create(), normal, -otherShape.mRadius);
            collisionInfo.setInfo(otherShape.mRadius - dis, normal,
                vec2.add(vec2.create(), circ2Pos, radiusVec))
        }
        else {
            v1 = vec2.subtract(vec2.create(), circ2Pos, this.mVertex[(nearestEdge + 1) % 4]);
            v2 = vec2.scale(vec2.create(), v2, -1);
            dot = vec2.dot(v1, v2);
            if(dot < 0){//region 2
                var dis = vec2.length(v1);
                if(dis > otherShape.mRadius)
                    return false;
                var normal = vec2.normalize(vec2.create(), v1);
                var radiusVec = vec2.scale(vec2.create(), normal, -otherShape.mRadius);
                collisionInfo.setInfo(otherShape.mRadius - dis, vec2.create(), normal,
                    vec2.add(vec2.create(),circ2Pos, radiusVec));
            }
            else {
                if(bestDistance < otherShape.mRadius){
                    var radiusVec = vec2.scale(vec2.create(), this.mFaceNormal[nearestEdge], otherShape.mRadius);
                    var depth = otherShape.mRadius - bestDistance;
                    collisionInfo.setInfo(depth, this.mFaceNormal[nearestEdge],
                        vec2.subtract(vec2.create(), circ2Pos, radiusVec));
                }
                else
                    return false;
            }
        }
    }
    return true;
};