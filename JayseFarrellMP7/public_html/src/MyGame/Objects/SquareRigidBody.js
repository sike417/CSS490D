/**
 * Created by Jayse on 2/23/2017.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SquareRigidBody(sprite, target) {
    RigidBodies.call(this, sprite, target);

    var mRigidRectangle = new RigidRectangle(this.getXform(),
        this.getXform().getWidth(), this.getXform().getHeight());
    mRigidRectangle.setDrawBoundCircle(false);
    mRigidRectangle.setDrawMode(RigidRectangle.drawModes.drawBoundingBox);
    mRigidRectangle.setVelocity([0,-1]);
    this.setRigidBody(mRigidRectangle);
    // this.setPhysicsComponent(mRigidCircle);
}
gEngine.Core.inheritPrototype(SquareRigidBody, RigidBodies);

SquareRigidBody.prototype.draw = function(mCamera){
    RigidBodies.prototype.draw.call(this, mCamera);
};