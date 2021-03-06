/* File: Minion.js 
 *
 * Creates and initializes a Minion object
 * overrides the update function of GameObject to define
 * simple sprite animation behavior behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteAnimateRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Minion(spriteTexture, atX, atY, createCircle) {
    this.kDelta = 0.3;
    
    this.mMinion = new SpriteAnimateRenderable(spriteTexture);
    this.spriteRenderable.setColor([1, 1, 1, 0]);
    this.spriteRenderable.getXform().setPosition(atX, atY);
    this.spriteRenderable.getXform().setSize(24, 19.2);
    this.spriteRenderable.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,   // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.spriteRenderable.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.spriteRenderable.setAnimationSpeed(30);
                                // show each element for mAnimSpeed updates

    GameObject.call(this, this.spriteRenderable);
    
    var r;
    if (createCircle)
        r = new RigidCircle(this.getXform(), 8); 
    else
        r = new RigidRectangle(this.getXform(), 20, 18);
    this.setRigidBody(r);
    this.toggleDrawRenderable();
}
gEngine.Core.inheritPrototype(Minion, WASDObj);

Minion.prototype.update = function (aCamera) {
    GameObject.prototype.update.call(this);
    // remember to update this.spriteRenderable's animation
    this.spriteRenderable.updateAnimation();
};