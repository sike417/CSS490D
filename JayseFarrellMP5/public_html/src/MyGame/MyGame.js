/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    // The camera to view the scene
    this.mCamera = null;

    this.mMsg = null;
    this.mHero = null;
    this.mAllMinions = new GameObjectSet();

    this.minionSprite = "assets/minion_sprite.png";

    this.mLineSet = null;
    this.mCurrentLine = null;
    this.mP1 = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.minionSprite);
};

MyGame.prototype.unloadScene = function(){
    gEngine.Textures.unloadTexture(this.minionSprite);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(30, 27.5), // position of the camera
        100,                       // width of camera
        [0, 0, 660, 660]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(-19, -8);
    this.mMsg.setTextHeight(3);
    
    // var obj = new LineRenderable();
    // obj.setFirstVertex(30, 27.5);
    //
    // obj.setSecondVertex(hypotenuse * Math.cos(this.mRigidCircle[0].getXform().getRotationInRad()),
    //     hypotenuse * Math.sin(this.mRigidCircle[0].getXform().getRotationInRad()));
    this.mHero = new Hero(this.minionSprite,
        this.mCamera.getWCCenter()[0], this.mCamera.getWCCenter()[1],
        this.mCamera.getWCWidth(), this.mCamera.getWCHeight());

    var enemy;
    for(var i = 0; i < 5; i++) {
        var xInc = Math.random() * (this.mCamera.getWCWidth()) - this.mCamera.getWCWidth() / 2;
        var yInc = Math.random() * (this.mCamera.getWCHeight()) - this.mCamera.getWCHeight() / 2;
        enemy = new Enemy(this.minionSprite, this.mCamera.getWCCenter()[0] + xInc, this.mCamera.getWCCenter()[1] + yInc,
        this.mCamera.getWCCenter()[0], this.mCamera.getWCCenter()[1], this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
        this.mAllMinions.addToSet(enemy);
    }
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    // this.mRigidCircle.draw(this.mCamera);
    this.mHero.draw(this.mCamera);
    this.mAllMinions.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mHero.update();
    this.mAllMinions.update();
    if(this.mCamera.isMouseInViewport()) {
        this.mHero.updateLocation([this.mCamera.mouseWCX(), this.mCamera.mouseWCY()]);
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.T)){
        this.mHero.setVisibility(!this.mHero.isVisible());
        this.mAllMinions.swapVisibility();
    }

    // Hero Minion
    gEngine.Physics.processObjSet(this.mHero, this.mAllMinions);
    gEngine.Physics.processSelfSet(this.mAllMinions);

};