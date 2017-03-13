/**
 * Created by Jayse on 2/21/2017.
 */
"use strict";

function RigidCircle(mShader){
    this.mRigidCircle = null;
    this.mShader = mShader;
    this.initialize();
}

RigidCircle.prototype.initialize = function () {
    this.mRigidCircle = new CircleRenderable(this.mShader);
    // this.mRigidCircle.setColor([1, 1, 1, 1]);
    this.mRigidCircle.getXform().setPosition(30, 27.5);
    this.mRigidCircle.getXform().setRotationInRad(0);
    this.mRigidCircle.getXform().setSize(500, 500);
};

RigidCircle.prototype.draw = function (camera) {
    this.mRigidCircle.draw(camera)
};