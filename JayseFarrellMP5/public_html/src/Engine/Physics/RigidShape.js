/**
 * Created by Jayse on 2/21/2017.
 */
/*jslint node: true, vars:true , white: true*/
/*global gEngine, RigidShape, vec2, LineRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

function RigidShape(xform){
    
    this.mXform = xform; // this is typically from gameObject
    this.kPadding = .25; // size of the position mark

    this.mPositionMark = new LineRenderable();

    this.mDrawMe = true;

    // physical properties
    this.mInvMass = 1;
    this.mRestitution = 0.8;
    this.mVelocity = vec2.fromValues(0, 0);
    this.mFriction = 0.3;
    this.mAcceleration = .5;
    this.collisionDetected = false;
}

RigidShape.prototype.initialize = function(){
};

RigidShape.prototype.update = function () {
    var dt = gEngine.GameLoop.getUpdateIntervalInSeconds();

    // Symplectic Euler
    //    v += (1/m * F) * dt
    //    x += v * dt
    var v = this.getVelocity();
    // vec2.scaleAndAdd(v, v, this.mAcceleration, (this.getInvMass() * dt ));

    var pos = this.getPosition();
    vec2.scaleAndAdd(pos, pos, v, dt);
    if(this.getCollided())
        vec2.negate(this.mVelocity, this.mVelocity);
        // this.setVelocity(vec2.negate(this.getVelocity()));
    this.setCollided(false);
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
RigidShape.prototype.setCollided = function(isCollision){this.collisionDetected = isCollision};
RigidShape.prototype.getCollided = function(){return this.collisionDetected};

RigidShape.prototype.draw = function(camera){
    if(this.mDrawMe) {
        //calculation for the X at the center of the shape
        var x = this.mXform.getXPos();
        var y = this.mXform.getYPos();

        this.mPositionMark.setFirstVertex(x - this.kPadding, y + this.kPadding);  //TOP LEFT
        this.mPositionMark.setSecondVertex(x + this.kPadding, y - this.kPadding); //BOTTOM RIGHT
        this.mPositionMark.draw(camera);

        this.mPositionMark.setFirstVertex(x + this.kPadding, y + this.kPadding);  //TOP RIGHT
        this.mPositionMark.setSecondVertex(x - this.kPadding, y - this.kPadding); //BOTTOM LEFT
        this.mPositionMark.draw(camera);
    }
};

RigidShape.prototype.getXform = function () { return this.mXform; };
RigidShape.prototype.setXform = function (xform) { this.mXform = xform; };

//get/set position of the xform.
RigidShape.prototype.getPosition = function() {
    return this.mXform.getPosition();
};

RigidShape.prototype.setPosition = function(x, y ) {
    this.mXform.setPosition(x, y);
};
