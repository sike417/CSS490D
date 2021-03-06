/* File: Hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture) {
    this.kDelta = 0.3;

    this.mRenderable = new SpriteRenderable(spriteTexture);
    this.mRenderable.setColor([1, 1, 1, 0]);
    this.mRenderable.getXform().setPosition(35, 20);
    this.mRenderable.getXform().setSize(9, 12);
    this.mRenderable.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.mRenderable);
    
    var r = new RigidRectangle(this.getXform(), 9, 12);
    this.setRigidBody(r);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function () {
    GameObject.prototype.update.call(this);
    // control by WASD
    var xform = this.getXform();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        xform.incYPosBy(this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        xform.incYPosBy(-this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        xform.incXPosBy(-this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        xform.incXPosBy(this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        xform.incRotationByDegree(1);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        xform.incRotationByDegree(-1);
    }
};