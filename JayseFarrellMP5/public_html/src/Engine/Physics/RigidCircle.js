/**
 * Created by Jayse on 2/21/2017.
 */
/*jslint node: true, vars:true , white: true*/
/*global gEngine, RigidShape, vec2, LineRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

function RigidCircle(xform, radius){
    RigidShape.call(this, xform);
    //Math.max(xform.getWidth(), xform.getHeight())
    this.mRadius = radius;
    this.mPosition = xform.getPosition();
    this.mSides = new LineRenderable();
    this.mSides.setColor([1,1,1,1]);
    this.mXform = xform;
    this.mRigidCircle = [];
    this.drawMe = true;
    this.numberOfSides = 64;
    this.initialize();
}
gEngine.Core.inheritPrototype(RigidCircle, RigidShape);

RigidCircle.prototype.initialize = function(){
    this.mRigidCircle = [];
    var obj = new LineRenderable();
    obj.setFirstVertex(this.mPosition[0], this.mPosition[1] - this.mRadius / 4);
    obj.setSecondVertex(this.mPosition[0], this.mPosition[1] + this.mRadius / 4);
    obj.setColor([1,1,1,1]);
    this.mRigidCircle.push(obj);

    obj = new LineRenderable();
    obj.setFirstVertex(this.mPosition[0] - this.mRadius / 4, this.mPosition[1]);
    obj.setSecondVertex(this.mPosition[0] + this.mRadius / 4, this.mPosition[1]);
    obj.setColor([1,1,1,1]);
    this.mRigidCircle.push(obj);

    var hypotenuse = .5 * this.mRadius;
    obj = new LineRenderable();
    obj.setFirstVertex(this.mPosition[0], this.mPosition[1]);
    obj.setSecondVertex(hypotenuse * Math.cos(this.mXform.getRotationInRad() + Math.PI/2) + this.mPosition[0],
        hypotenuse * Math.sin(this.mXform.getRotationInRad() + Math.PI/2) + this.mPosition[1]);
    obj.setColor([1,1,1,1]);
    this.mRigidCircle.push(obj);
};

RigidCircle.prototype.update = function(){
  // this.mRigidCircle[0].update();
    this.initialize();
    if(this.collided === true)
    {
        RigidShape.prototype.setVelocity.call(vec2.negate(vec2.create(), RigidShape.prototype.getVelocity.call()))
    }
    RigidShape.prototype.update.call(this);
};

RigidCircle.prototype.collided = function(otherShape, collisionInfo){
    collisionInfo.setDepth(0);
    return this.collidedCircCirc(this, otherShape, collisionInfo);
};

RigidCircle.prototype.collidedCircCirc = function(c1, c2, collisionInfo) {
    var vFrom1to2 = [0, 0];
    vec2.sub(vFrom1to2, c2.getPosition(), c1.getPosition());
    var rSum = c1.getRadius() + c2.getRadius();
    var sqLen = vec2.squaredLength(vFrom1to2);
    if (sqLen > (rSum * rSum)) {
        return false;
    }
    var dist = Math.sqrt(sqLen);

    if (dist !== 0) { // overlapping
        vec2.scale(vFrom1to2, vFrom1to2, 1/dist);
        collisionInfo.setNormal(vFrom1to2);
        collisionInfo.setDepth(rSum - dist);
    }
    else //same position
    {
        collisionInfo.setDepth(rSum / 10);
        collisionInfo.setNormal([0, 1]);
    }

    return true;
};

RigidCircle.prototype.setRadius = function(radius){
    this.mRadius = radius;
};

RigidCircle.prototype.getRadius = function(){return this.mRadius;};

RigidCircle.prototype.incrementRotate = function(inc){
    this.mRigidCircle[0].getXform().setRotationInRad(this.mRigidCircle[0].getXform() + inc);
    this.mRigidCircle.pop();
    var hypotenuse = .3 * this.mRadius;
    var obj = new LineRenderable();
    obj.setFirstVertex(this.mPosition[0], this.mPosition[1]);
    obj.setSecondVertex(hypotenuse * Math.cos(this.mRigidCircle[0].getXform().getRotationInRad() + Math.PI/2) + this.mPosition[0],
        hypotenuse * Math.sin(this.mRigidCircle[0].getXform().getRotationInRad() + Math.PI/2) + this.mPosition[1]);
    obj.setColor([1,1,1,1]);
    this.mRigidCircle.push(obj);
};

RigidCircle.prototype.draw = function (camera) {
    if(this.drawMe) {
        RigidShape.prototype.draw.call(this, camera);
        // this.initialize();

        // kNumSides forms the circle.
        var pos = this.mPosition;
        var prevPoint = vec2.clone(pos);
        var deltaTheta = (Math.PI * 2.0) / this.numberOfSides;
        var theta = deltaTheta;
        prevPoint[0] += this.mRadius;
        var i, x, y;
        for (i = 1; i <= this.numberOfSides; i++) {
            x = pos[0] + this.mRadius * Math.cos(theta);
            y = pos[1] + this.mRadius * Math.sin(theta);

            this.mSides.setFirstVertex(prevPoint[0], prevPoint[1]);
            this.mSides.setSecondVertex(x, y);
            this.mSides.draw(camera);

            theta = theta + deltaTheta;
            prevPoint[0] = x;
            prevPoint[1] = y;
        }
        this.mRigidCircle.forEach(function (Entry) {
            Entry.draw(camera);
        });
    }
};
