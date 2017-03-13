
/*jslint node: true, vars: true, evil: true, bitwise: true */
"use strict";

/* global gEngine */

function RigidShape(xf) {
    this.mLine = new LineRenderable();
    this.mLine.setColor([1, 1, 1, 1]);

    this.mXform = xf;
    this.mInvMass = 1;
    this.mRestitution = 0.8;
    this.mVelocity = vec2.fromValues(0, 0);
    this.mFriction = 0.3;
    this.mAcceleration = gEngine.Physics.getSystemAcceleration();
    this.drawBoundCircle = true;
    this.mCollisionInfo = null;
}

RigidShape.prototype.setXform = function(xf){this.mXform = xf};
RigidShape.prototype.getXform = function () { return this.mXform; };

RigidShape.prototype.setBoundRadius = function(r) {
    this.mBoundRadius = r;
};
RigidShape.prototype.getBoundRadius = function() {
    return this.mBoundRadius;
};

RigidShape.prototype.setCollisionInfo = function(CI){
    if(this.mCollisionInfo === null)
    {
        this.mCollisionInfo = [];
        this.mCollisionInfo.push(CI)
    }
    else
        this.mCollisionInfo.push(CI);
};

RigidShape.prototype.getPosition = function() {
    return this.mXform.getPosition();
};
RigidShape.prototype.setPosition = function(x, y ) {
    this.mXform.setPosition(x, y);
};

RigidShape.prototype.getInvMass = function () { return this.mInvMass; };
RigidShape.prototype.setMass = function (m) {
    if(m > 0) {
        this.mInvMass = 1/m;
    } else {
        this.mInvMass = 0;
    }
};
RigidShape.prototype.getVelocity = function () { return this.mVelocity; };
RigidShape.prototype.setVelocity = function (v) { this.mVelocity = v; };
RigidShape.prototype.getRestitution = function () { return this.mRestitution; };
RigidShape.prototype.setRestitution = function (r) { this.mRestitution = r; };
RigidShape.prototype.getFriction = function () { return this.mFriction; };
RigidShape.prototype.setFriction = function (f) { this.mFriction = f; };
RigidShape.prototype.getAcceleration = function () { return this.mAcceleration; };
RigidShape.prototype.setAcceleration = function (g) { this.mAcceleration = g; };
RigidShape.prototype.flipVelocity = function() { 
    this.mVelocity[0] = -this.mVelocity[0];
    this.mVelocity[1] = -this.mVelocity[1];
};

RigidShape.prototype.setDrawBoundCircle = function(isTrue){this.drawBoundCircle = isTrue;};

RigidShape.prototype.getDrawBoundCircle = function(){return this.drawBoundCircle;};

RigidShape.prototype.boundTest = function (otherShape) {
    var vFrom1to2 = [0, 0];
    vec2.subtract(vFrom1to2, otherShape.mXform.getPosition(), this.mXform.getPosition());
    var rSum = this.mBoundRadius + otherShape.mBoundRadius;
    var dist = vec2.length(vFrom1to2);
    return dist <= rSum;

};

RigidShape.prototype.CollisionTest = function (otherShape, collisionInfo) {
    collisionInfo.setDepth(0);
    if(this instanceof RigidCircle && otherShape instanceof RigidCircle) {
        return this.checkCircCirc(otherShape, collisionInfo);
    }
    else if(this instanceof RigidCircle && otherShape instanceof RigidRectangle){
        return otherShape.checkRectCirc(this, collisionInfo);
    }
    else if(this instanceof RigidRectangle && otherShape instanceof RigidCircle) {
        return this.checkRectCirc(otherShape, collisionInfo);
    }
    else if(this instanceof RigidRectangle && otherShape instanceof RigidRectangle) {
        return this.checkRectRect(otherShape, collisionInfo);
    }
};

RigidShape.prototype.draw = function(aCamera) {
    if(this.drawBoundCircle) {
        var len = this.mBoundRadius * 0.5;
        //calculation for the X at the center of the shape
        var x = this.mXform.getXPos();
        var y = this.mXform.getYPos();

        this.mLine.setColor([1, 1, 1, 1]);
        this.mLine.setFirstVertex(x - len, y);  //Horizontal
        this.mLine.setSecondVertex(x + len, y); //
        this.mLine.draw(aCamera);

        this.mLine.setFirstVertex(x, y + len);  //Vertical
        this.mLine.setSecondVertex(x, y - len); //
        this.mLine.draw(aCamera);
    }

    if(this.mCollisionInfo !== null){
        for(var i = 0; i < this.mCollisionInfo.length; i++) {
            this.mLine.setColor([1, 0, 1, 1]);
            this.mLine.setPointSize(15);
            var test = this.mCollisionInfo[i].getStart();
            this.mLine.setFirstVertex(test[0], test[1]);
            test = this.mCollisionInfo[i].getEnd();
            this.mLine.setSecondVertex(test[0], test[1]);
            this.mLine.setDrawVertices(true);
            this.mLine.draw(aCamera);
            this.mCollisionInfo = null;
            this.mLine.setDrawVertices(false);
        }
    }
};

RigidShape.prototype.update = function(){
    var dt = gEngine.GameLoop.getUpdateIntervalInSeconds();

    // Symplectic Euler
    //    v += (1/m * F) * dt
    //    x += v * dt
    var v = this.getVelocity();
    vec2.scaleAndAdd(v, v, this.mAcceleration, (this.getInvMass() * dt ));

    var pos = this.getPosition();
    vec2.scaleAndAdd(pos, pos, v, dt);
};

RigidShape.kNumCircleSides = 32;
RigidShape.prototype.drawCircle = function(aCamera, r) {
    var pos = this.mXform.getPosition();
    var prevPoint = vec2.clone(pos);
    var deltaTheta = (Math.PI * 2.0) / RigidShape.kNumCircleSides;
    var theta = deltaTheta;
    prevPoint[0] += r;
    var i, x, y;

    for (i = 1; i <= RigidShape.kNumCircleSides; i++) {
        x = pos[0] + r * Math.cos(theta);
        y = pos[1] +  r * Math.sin(theta);

        this.mLine.setFirstVertex(prevPoint[0], prevPoint[1]);
        this.mLine.setSecondVertex(x, y);
        this.mLine.draw(aCamera);

        theta = theta + deltaTheta;
        prevPoint[0] = x;
        prevPoint[1] = y;
    }
};