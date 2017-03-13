/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function DyePack(spriteMap, initialXPos, initialYPos){
    this.mSpriteMap = spriteMap;
    this.initialSpeed = 6;
    this.deleteMe = false;
    this.decelerateMe = false;
    this.collided = false;
    this.deceleration = .3;

    this.mDyePack = new SpriteRenderable(this.mSpriteMap);
    this.mDyePack.getXform().setPosition(initialXPos, initialYPos);
    this.mDyePack.getXform().setSize(6, 9.75);
    // this.mDyePack.getXform.setRotationInDegree(90);
    this.mDyePack.setElementPixelPositions(510, 595, 23, 153);
    var that = this;

    setTimeout(function(){that.deleteMe = true}, 5000);

    GameObject.call(this, this.mDyePack);
    this.setCurrentFrontDir(vec2.fromValues(1,0));
    // GameObject.prototype.setCurrentFrontDir().call(this, vec2.fromValues(1,0));
    this.setSpeed(this.initialSpeed);

    this.mOrgCenter = vec2.clone(this.getXform().getPosition());
    this.mShakeCenter = vec2.clone(this.mOrgCenter);
    this.mShake = null;

}
gEngine.Core.inheritPrototype(DyePack, GameObject);

DyePack.prototype.update = function(){
    GameObject.prototype.update.call(this);  

    if(this.mShake !== null) {
        this.getXform().setPosition(this.mShakeCenter[0], this.mShakeCenter[1]);
        this.updateShakeState();
    }
    if(this.decelerateMe === true)
        this.decelerate();

};

DyePack.prototype.setDefaultShake = function(){
    this.mOrgCenter = vec2.clone(this.getXform().getPosition());
    this.mShake = new ShakePosition(12, .6, 20, 300);
};

DyePack.prototype.decelerate = function(){
    if(this.decelerateMe === true){
        this.initialSpeed -= this.deceleration;
        this.setSpeed(this.initialSpeed);
    }
    if(this.initialSpeed <= 0)
        this.deleteMe = true;
};

DyePack.prototype.updateShakeState = function(){
    var s = this.mShake.getShakeResults();
    vec2.add(this.mShakeCenter, this.mOrgCenter, s);
    if(this.mShake.shakeDone() === true){
        this.deleteMe = true;
        this.mShake = null;
    }
};
