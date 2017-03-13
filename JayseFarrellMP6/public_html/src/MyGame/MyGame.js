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
    this.kMinionSprite = "assets/minion_sprite.png";
    
    // The camera to view the scene
    this.mCamera = null;
    this.mDeltaR = .1;

    this.mMsg = null;

    this.mAllObjs = null;
    this.mHero = null;
    this.count = 0;
    this.mode = null;
    
    this.mCurrentObj = 0;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera 50, 40
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    this.mAllObjs = new GameObjectSet();
    this.mode = 0;
    this.switchModes();

    // this.mHero = new Hero(this.kMinionSprite);
    // this.mAllStationaryObjs.addToSet(this.mHero);
    // for (var i = 1; i<=5; i++) {
    //     var x = 20 + 60 * Math.random();
    //     var y = 15 + 45 * Math.random();
    //     var m = new Minion(this.kMinionSprite, x, y);
    //     this.mAllStationaryObjs.addToSet(m);
    // }
    //
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(2, 5);
    this.mMsg.setTextHeight(3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    // if(this.count < 20) {
        this.mAllStationaryObjs.draw(this.mCamera);
    // }
    // else {
    //     this.mAllStationaryObjs.renew();
    //     this.count = 0;
    // }
    // this.count++;
    // this.count = 0;
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    gEngine.Physics.drawCollision(this.mCamera);
};

MyGame.prototype.increaseBound = function(delta) {
    var s = this.mAllStationaryObjs.getObjectAt(this.mCurrentObj).getRigidBody();
    var r = s.getBoundRadius();
    r += delta;
    s.setBoundRadius(r);
};

MyGame.prototype.switchModes = function(){
    var mEven, mOdd;
    this.mAllStationaryObjs.empty();
    switch(this.mode){
        case 0: //two circles two squares
            mEven = new SquareRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mEven);

            mOdd = new CircleRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mOdd);

            mEven = new SquareRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mEven);

            mOdd = new CircleRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mOdd);
            break;
        case 1://four Squares
            mEven = new SquareRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mEven);
            mEven = new SquareRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mEven);
            mEven = new SquareRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mEven);
            mEven = new SquareRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mEven);
            break;
        case 2://four squares
            mOdd = new CircleRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mOdd);
            mOdd = new CircleRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mOdd);
            mOdd = new CircleRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mOdd);
            mOdd = new CircleRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
            this.mAllStationaryObjs.addToSet(mOdd);
            break;
    }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.kBoundDelta = 0.1;
MyGame.prototype.update = function () {
    var msg = "Num: " + this.mAllStationaryObjs.size() + " Current=" + this.mCurrentObj;
    // this.mOdd.update();
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.B)){
        this.mAllStationaryObjs.swapDrawBoundCircle();
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.N)){
        this.mode = (this.mode + 1) % 3;
        this.switchModes();
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.C)){
        var mOdd = new CircleRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
        this.mAllStationaryObjs.addToSet(mOdd);
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.R)){
        var mEven = new SquareRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
        this.mAllStationaryObjs.addToSet(mEven);
    }
    if(this.mAllStationaryObjs.size() <= 0)
    {
        this.mMsg.setText(msg);
        return;
    }

    this.mAllStationaryObjs.getObjectAt(this.mCurrentObj).checkKeyClicks(this.mCamera);

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {
        this.mCurrentObj = (this.mCurrentObj + 1) % this.mAllStationaryObjs.size();
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {
        this.mCurrentObj = (this.mCurrentObj - 1);
        if (this.mCurrentObj < 0)
            this.mCurrentObj = this.mAllStationaryObjs.size() - 1;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        this.increaseBound(MyGame.kBoundDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        this.increaseBound(-MyGame.kBoundDelta);
    }

    this.mAllStationaryObjs.update(this.mCamera);
    gEngine.Physics.processCollision(this.mAllStationaryObjs);

    msg += " R=" + this.mAllStationaryObjs.getObjectAt(this.mCurrentObj).getRigidBody().getBoundRadius();
    this.mMsg.setText(msg);
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.P)){
        this.mAllStationaryObjs.removeFromSet();
        this.mCurrentObj >= this.mAllStationaryObjs.size() ? this.mCurrentObj = this.mAllStationaryObjs.size() - 1 : null;
        this.mCurrentObj < 0 ? this.mCurrentObj = 0 : null;
    }
};