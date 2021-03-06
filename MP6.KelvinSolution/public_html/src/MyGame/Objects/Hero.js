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
    this.mRenderable.getXform().setPosition(50, 40);
    this.mRenderable.getXform().setSize(18, 24);
    this.mRenderable.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.mRenderable);
    
    var r = new RigidRectangle(this.getXform(), 18, 24);
    this.setRigidBody(r);
    this.toggleDrawRenderable();
}
gEngine.Core.inheritPrototype(Hero, WASDObj);

Hero.prototype.update = function () {
    GameObject.prototype.update.call(this);
};