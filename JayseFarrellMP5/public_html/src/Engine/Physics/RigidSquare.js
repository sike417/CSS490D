/**
 * Created by Jayse on 2/22/2017.
 */
"use strict";

function RigidSquare(xform, w, h) {
    RigidShape.call(this, xform);
    this.mSides = new LineRenderable();
    this.mDrawMe = true;

    this.mWidth = w;
    this.mHeight = h;
    var radius = Math.sqrt(Math.pow(this.mWidth / 2, 2) + Math.pow(this.mHeight / 2, 2));
    this.mRigidCircle = new RigidCircle(xform, radius);
}
gEngine.Core.inheritPrototype(RigidSquare, RigidShape);

RigidSquare.prototype.draw = function (aCamera) {
    if(this.mDrawMe) {
        RigidShape.prototype.draw.call(this, aCamera);
        var xPos = this.getPosition()[0];
        var yPos = this.getPosition()[1];
        var width = this.mWidth / 2;
        var height = this.mHeight / 2;

        this.mSides.setFirstVertex(xPos - width, yPos + height);  //TOP LEFT
        this.mSides.setSecondVertex(xPos + width, yPos + height); //TOP RIGHT
        this.mSides.setColor([1,0,0,1]);
        this.mSides.draw(aCamera);
        this.mSides.setFirstVertex(xPos + width, yPos + height + 3);
        this.mSides.draw(aCamera);

        this.mSides.setFirstVertex(xPos + width, yPos - height); //BOTTOM RIGHT
        this.mSides.setColor([0,1,0,1]);
        this.mSides.draw(aCamera);
        this.mSides.setSecondVertex(xPos + width + 3, yPos - height);
        this.mSides.draw(aCamera);

        this.mSides.setSecondVertex(xPos - width, yPos - height); //BOTTOM LEFT
        this.mSides.setColor([0,0,1,1]);
        this.mSides.draw(aCamera);
        this.mSides.setFirstVertex(xPos - width, yPos - height - 3);
        this.mSides.draw(aCamera);

        this.mSides.setFirstVertex(xPos - width, yPos + height); //TOP LEFT
        this.mSides.setColor([1,1,0,1]);//yellow
        this.mSides.draw(aCamera);
        this.mSides.setSecondVertex(xPos - width - 3, yPos + height);
        this.mSides.draw(aCamera);
        this.mRigidCircle.draw(aCamera);
    }
};

RigidSquare.prototype.update = function(){
    this.mRigidCircle.update();
    // if(this.collided === true)
    // {
    //     RigidShape.prototype.setVelocity.call(vec2.negate(vec2.create(), RigidShape.prototype.getVelocity.call()))
    // }
    RigidShape.prototype.update.call(this);
};

RigidSquare.prototype.collided = function(otherShape, collisionInfo){
    collisionInfo.setDepth(0);
    return this.collidedCircCirc(this.mRigidCircle, otherShape, collisionInfo);
};

RigidSquare.prototype.collidedCircCirc = function(c1, c2, collisionInfo) {
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


RigidSquare.prototype.getWidth = function () { return this.mWidth; };
RigidSquare.prototype.getHeight = function () { return this.mHeight; };
RigidSquare.prototype.setColor = function (color) {
    RigidShape.prototype.setColor.call(this, color);
    this.mSides.setColor(color);
};

RigidSquare.prototype.setMass = function (m) {
    this.mRigidCircle.setMass(m);
    RigidShape.prototype.setMass.call(this, m);
};
RigidSquare.prototype.setVelocity = function (v) {
    this.mRigidCircle.setVelocity(v);
    this.mVelocity = v;
};
RigidSquare.prototype.setRestitution = function (r) {
    this.mRigidCircle.setRestitution(r);
    this.mRestitution = r;
};
RigidSquare.prototype.setFriction = function (f) {
    this.mRigidCircle.setFriction(f);
    this.mFriction = f;
};
RigidSquare.prototype.setAcceleration = function (g) {
    this.mRigidCircle.setAcceleration(g);
    this.mAcceleration = g;
};

RigidSquare.prototype.getCollided = function(){return this.mRigidCircle.getCollided();};