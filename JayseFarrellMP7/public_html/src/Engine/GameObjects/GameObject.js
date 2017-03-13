/* File: GameObject.js 
 *
 * Abstracts a game object's behavior and apparance
 */

/*jslint node: true, vars: true */
/*global vec2, vec3, BoundingBox */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GameObject(renderableObj) {
    this.mRenderComponent = renderableObj;
    this.mVisible = true;
    this.mCurrentFrontDir = vec2.fromValues(0, 1);  // this is the current front direction of the object
    this.mRigidBody = null;
    this.mDrawRenderable = false;
    this.secondaryDrawRenderable = false;
    this.deltaX = .1;
}
GameObject.prototype.getXform = function () { return this.mRenderComponent.getXform(); };
//
GameObject.prototype.setDrawRenderable = function(drawMe){this.mDrawRenderable = drawMe};
GameObject.prototype.toggleSecondaryDrawRenderable = function(){this.secondaryDrawRenderable = !this.secondaryDrawRenderable};

GameObject.prototype.setRenderable = function(renderableObj){this.mRenderComponent = renderableObj};

GameObject.prototype.getBBox = function () {
    var xform = this.getXform();
    var b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    return b;
};
GameObject.prototype.setVisibility = function (f) { this.mVisible = f; };
GameObject.prototype.isVisible = function () { return this.mVisible; };

GameObject.prototype.setCurrentFrontDir = function (f) { vec2.normalize(this.mCurrentFrontDir, f); };
GameObject.prototype.getCurrentFrontDir = function () { return this.mCurrentFrontDir; };

GameObject.prototype.getRenderable = function () { return this.mRenderComponent; };

GameObject.prototype.setRigidBody = function (r) {
    this.mRigidBody = r;
};
GameObject.prototype.getRigidBody = function () { return this.mRigidBody; };
GameObject.prototype.toggleDrawRenderable = function() { 
    this.mDrawRenderable = !this.mDrawRenderable; };
GameObject.prototype.getDrawRenderable = function(){return this.mDrawRenderable};

GameObject.prototype.update = function () {
    // simple default behavior
    if (this.mRigidBody !== null)
            this.mRigidBody.update();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.T)) {
        this.toggleDrawRenderable();
    }
};

GameObject.prototype.checkKeyClicks = function(aCamera){
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)){
        this.getXform().incRotationByDegree(1);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.X)){
        this.getXform().incRotationByDegree(-1);
    }
    var v = this.getRigidBody().getVelocity();
    // var status = aCamera.collideWCBound(this.getXform(), 0.95);
    // if (((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0) ||
    //     ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0) ) {
    //     v[1] *= -1;
    // }
    // if (((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0) ||
    //     ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0) ) {
    //     v[0] *= -1;
    // }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W)){
        this.getXform().incYPosBy(this.deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S)){
        this.getXform().incYPosBy(-this.deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A)){
        this.getXform().incXPosBy(-this.deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D)){
        this.getXform().incXPosBy(this.deltaX);
    }
};

GameObject.prototype.setDrawBoundCircle = function(isTrue){
    this.mRigidBody.setDrawBoundCircle(isTrue);  
};

GameObject.prototype.getDrawBoundCircle = function(){
    return this.mRigidBody.getDrawBoundCircle();
};

GameObject.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        if (this.mDrawRenderable || this.secondaryDrawRenderable)
            this.mRenderComponent.draw(aCamera);
        if (this.mRigidBody !== null)
            this.mRigidBody.draw(aCamera);
    }
};