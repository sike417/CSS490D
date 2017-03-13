/* 
 * File:RigidCircle.js
 *      define a circle
 *     
 */
/*jslint node: true, vars: true, evil: true, bitwise: true */
"use strict";
/* global RigidShape */

var RigidCircle = function (xf, radius) {
    RigidShape.call(this, xf);
    this.mType = "RigidCircle";
    this.mRadius = radius;
    this.mBoundRadius = radius;
};
gEngine.Core.inheritPrototype(RigidCircle, RigidShape);

RigidCircle.prototype.travel = function (dt) {
    // linear motion
    var p = this.mXform.getPosition();
    vec2.scaleAndAdd(p, p, this.mVelocity, dt);
    
    return this;
};

RigidCircle.prototype.draw = function (aCamera) {
    
    // kNumSides forms the circle.
    this.mLine.setColor([0, 0, 0, 1]);
    this.drawCircle(aCamera, this.mRadius);

    var p = this.mXform.getPosition();
    var u = [p[0], p[1] + this.mBoundRadius];
    // angular motion
    vec2.rotateWRT(u, u, this.mXform.getRotationInRad(), p);
    this.mLine.setColor([1, 1, 1, 1]);
    this.mLine.setFirstVertex(p[0], p[1]);
    this.mLine.setSecondVertex(u[0], u[1]);
    this.mLine.draw(aCamera);

    if(this.getDrawBoundCircle()) {
        this.drawCircle(aCamera, this.mBoundRadius);
    }
    RigidShape.prototype.draw.call(this, aCamera);
};

RigidCircle.prototype.update = function () {
    RigidShape.prototype.update.call(this);
};

RigidCircle.prototype.checkCircCirc = function(otherShape, collisionInfo){
    var vFrom1to2 = [0, 0];
    var position = [0,0];

    vec2.subtract(vFrom1to2, this.mXform.getPosition(), otherShape.mXform.getPosition());
    var rSum = this.mRadius + otherShape.mRadius;
    var dist = vec2.length(vFrom1to2);

    if(dist > rSum)
        return false;

    if(dist !== 0){ //overlapping
        vec2.scale(vFrom1to2, vFrom1to2, 1/dist);

        vec2.scale(position, vFrom1to2, otherShape.mRadius);
        vec2.add(position, otherShape.mXform.getPosition(), position);
        collisionInfo.setInfo(rSum - dist, vFrom1to2, position);
    }
    else
    {
        collisionInfo.setInfo(rSum / 10, [0,1], otherShape.mCenter);
    }
    return true;
};
