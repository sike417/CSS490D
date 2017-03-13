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
    this.mHeroCam = null;
    this.mCamera2 = null;
    this.mCamera3 = null;
    this.mCamera4 = null;
    this.mInstructionCamera = null;
    this.mPatrols = null;
    this.Hero = null;
    this.dimensions = null;
    this.scene = null;
    this.mMsg = null;
    this.constantMsg = "Status: ";

    // this.spaceScene = "assets/Space_Scene_3.png";
    this.spaceScene = "assets/Space_Scene.jpg";
    this.minionSprite = "assets/minion_sprite.png";
    
    this.mLineSet = [];
    this.mCurrentLine = null;
    this.mInstructionSet = ["Hero Controls:", "     Space: fire DyePack", "     Q-key: triggers hero hit event"
    , "DyePack Controls:", "     D-key: triggers slow Down", "     S-key: triggers hit for all DyePacks"
    ,"Patrol Controls:", "     P-key: toggles auto spawning on/off", "     C-key: spawns a new patrol"
    ,"     B-key: toggles drawing of all Bounds", "     J-key: triggers the Head Patrol hit event for ALL Patrol objects"];
    this.TextRends = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.spaceScene);
    gEngine.Textures.loadTexture(this.minionSprite);
};

MyGame.prototype.unloadScene = function(){
   gEngine.Textures.unloadTexture(this.spaceScene);
   gEngine.Textures.unloadTexture(this.minionSprite);
};

MyGame.prototype.initialize = function () {
    this.dimensions = gEngine.ResourceMap.retrieveImageDimensions(this.spaceScene);

    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(30, 27.5), // position of the camera
        this.dimensions[0] * .5,                       // width of camera
        [0, 0, 655, 490]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray
    this.scene = new TextureRenderable(this.spaceScene);
    this.scene.getXform().setPosition(30, 27.5);
    this.scene.getXform().setSize(this.dimensions[0], this.dimensions[1]);

    this.mPatrols = new Patrols(this.minionSprite,
        this.mCamera.getWCCenter()[0], this.mCamera.getWCCenter()[1],
        this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
    this.Hero = new Hero(this.minionSprite,
        this.mCamera.getWCCenter()[0], this.mCamera.getWCCenter()[1],
        this.mCamera.getWCWidth(), this.mCamera.getWCHeight());

    this.mHeroCam = new Camera(
        vec2.fromValues(30,27.5),
        this.Hero.getXform().getWidth() * 3,
        [0, 495, 160, 160]
    );
    this.mHeroCam.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    this.mHeroCam.configInterpolation(.7, 10);


    this.mCamera2 = new Camera(
        vec2.fromValues(30,27.5),
        this.dimensions[0] / 16,
        [165, 495, 160, 160]
    );
    this.mCamera2.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mCamera3 = new Camera(
        vec2.fromValues(30,27.5),
        this.dimensions[0] / 16,
        [330, 495, 160, 160]
    );
    this.mCamera3.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mCamera4 = new Camera(
        vec2.fromValues(30,27.5),
        this.dimensions[0] / 16,
        [495, 495, 160, 160]
    );
    this.mCamera4.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mInstructionCamera = new Camera(
        vec2.fromValues(1030,1027.5),
        100, [660, 0, 700, 655]
    );
    this.mInstructionCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mMsg = new FontRenderable(this.constantMsg);
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(30 - this.dimensions[0] / 4.25, 27.5 - this.dimensions[0] / 5.75);
    this.mMsg.setTextHeight(9);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.Hero.update();
    var test = this.mPatrols.update(this.Hero.getBBox(), this.Hero.getFirstXDyePacks(this.Hero.getNumOfDyePacks() - 1));
    if(test[0] === true)
        this.Hero.newShake();

    this.mCamera.update();
    this.mHeroCam.update();
    this.mCamera2.update();
    this.mCamera3.update();
    this.mCamera4.update();
    this.updateStatusMessage();

    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.One)) {
        //simulates new creation of die pack
        this.mCount += 1;
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Two)){
        this.mCount -= 1;
        this.mCount < 0 ? this.mCount = 0 : null;
    }
    if(this.mCamera.isMouseInViewport()) {
        this.Hero.updateLocation([this.mCamera.mouseWCX(), this.mCamera.mouseWCY()]);
    }

    this.mHeroCam.panTo(this.Hero.getXform().getXPos(), this.Hero.getXform().getYPos());

    var mCount = this.Hero.getNumOfDyePacks() >= 3 ? 3 : this.Hero.getNumOfDyePacks();
    var DyePacks = this.Hero.getFirstXDyePacks(mCount);

    switch(true) {
        case (mCount === 3):
            this.mCamera4.panTo(DyePacks[2].getXform().getXPos(), DyePacks[2].getXform().getYPos());
        case (mCount === 2):
            this.mCamera3.panTo(DyePacks[1].getXform().getXPos(), DyePacks[1].getXform().getYPos());
        case (mCount === 1):
            this.mCamera2.panTo(DyePacks[0].getXform().getXPos(), DyePacks[0].getXform().getYPos());
    }
};

MyGame.prototype.updateStatusMessage = function(){
    this.mMsg.setText(this.constantMsg + " DyePacks(" + this.Hero.getNumOfDyePacks() + ") Patrols("
        + this.mPatrols.getNumOfPatrols() + ") AutoSpawn(" + this.mPatrols.mAutoSpawn.toString() + ")");
};

MyGame.prototype.drawCamera = function(camera){
    camera.setupViewProjection();
    this.scene.draw(camera);
    this.mPatrols.draw(camera);
    this.Hero.draw(camera);
};

MyGame.prototype.drawInstructions = function(){
    this.mInstructionCamera.setupViewProjection();
    var tmp = this;

    if(this.TextRends === null) {
        this.TextRends = [];
        for (var i = 0; i < this.mInstructionSet.length; i++) {
            var tempMsg = new FontRenderable(this.mInstructionSet[i]);
            tempMsg.setColor([0, 0, 0, 1]);
            tempMsg.getXform().setPosition(985, 1072.5 - i * 2);
            tempMsg.setTextHeight(2);
            tempMsg.draw(this.mInstructionCamera);
            this.TextRends.push(tempMsg);
        }
    }
    else {
        this.TextRends.forEach(function(Entry){
            Entry.draw(tmp.mInstructionCamera)
        });
    }

};

MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.drawCamera(this.mCamera);
    this.mMsg.draw(this.mCamera);
    this.drawCamera(this.mHeroCam);
    // this.drawInstructions();
    // this.TextRends === null ? this.drawInstructions() : this.mInstructionCamera.setupViewProjection();

    var mCount = this.Hero.getNumOfDyePacks();
    if(mCount >= 1)
        this.drawCamera(this.mCamera2);
    else
        this.mCamera2.setupViewProjection();
    if(mCount >= 2)
        this.drawCamera(this.mCamera3);
    else
        this.mCamera3.setupViewProjection();
    if(mCount >= 3)
        this.drawCamera(this.mCamera4);
    else
        this.mCamera4.setupViewProjection();
};