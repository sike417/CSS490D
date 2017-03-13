/**
 * Created by Jayse on 2/23/2017.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function CircleRigidBody(sprite, target) {
    RigidBodies.call(this, sprite, target);

    var mRigidCircle = new RigidCircle(this.getXform(), Math.max(this.getXform().getWidth(), this.getXform().getHeight()) / 2);
    mRigidCircle.setDrawBoundCircle(false);
    // mRigidCircle.setDrawMode(RigidRectangle.drawModes.drawBoundingBox);
    mRigidCircle.setVelocity([0,-1]);
    this.setRigidBody(mRigidCircle);
    // this.setPhysicsComponent(mRigidCircle);
}
gEngine.Core.inheritPrototype(CircleRigidBody, RigidBodies);

CircleRigidBody.prototype.draw = function(mCamera){
    RigidBodies.prototype.draw.call(this, mCamera);
};