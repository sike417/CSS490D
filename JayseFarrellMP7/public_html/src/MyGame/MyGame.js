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
    this.platform = "assets/platform.png";
    this.wall = "assets/wall.png";
    this.target = "assets/target.png";
    
    // The camera to view the scene
    this.mCamera = null;
    this.hasVelocity = true;
    // this.mDeltaR = .1;

    this.mMsg = null;

    this.mAllStationaryObjs = null;
    this.mAllObjs = null;
    this.mHero = null;
    this.count = 0;
    this.mode = null;
    
    this.mCurrentObj = 0;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.platform);
    gEngine.Textures.loadTexture(this.wall);
    gEngine.Textures.loadTexture(this.target);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.platform);
    gEngine.Textures.unloadTexture(this.wall);
    gEngine.Textures.unloadTexture(this.target);
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
    this.mAllStationaryObjs = new GameObjectSet();
    this.mAllObjs = new GameObjectSet();

    //platforms
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [30, 40], 330));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [70, 40], 30));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [50, 20], 0));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [30, 60], 0));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [70, 60], 0));

    //bottom Platforms
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [-7, 3.5], 0));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [13, 3.5], 0));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [33, 3.5], 0));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [53, 3.5], 0));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [73, 3.5], 0));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [93, 3.5], 0));

    //top Platforms
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [-7, 76.5], 180));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [13, 76.5], 180));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [33, 76.5], 180));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [53, 76.5], 180));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [73, 76.5], 180));
    this.mAllStationaryObjs.addToSet(new Stationary(this.platform, [93, 76.5], 180));

    //walls
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [1.5, 8.575], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [1.5, 20.725], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [1.5, 32.875], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [1.5, 45.025], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [1.5, 57.175], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [1.5, 69.325], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [1.5, 81.5], 0, [3,12.15]));

    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [98.5, 8.575], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [98.5, 20.725], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [98.5, 32.875], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [98.5, 45.025], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [98.5, 57.175], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [98.5, 69.325], 0, [3,12.15]));
    this.mAllStationaryObjs.addToSet(new Stationary(this.wall, [98.5, 81.5], 0, [3,12.15]));

    // this.mAllObjs.addToSet(new SquareRigidBody([50, 24], 7, 7, this.kMinionSprite, this.target));
    // this.mAllObjs.addToSet(new SquareRigidBody([45, 25], 8, 9, this.kMinionSprite, this.target));

    for(var i = 1; i < 5; i++){
        if(i % 2 === 0)
            this.mAllObjs.addToSet(new SquareRigidBody(this.kMinionSprite, this.target));
        else
            this.mAllObjs.addToSet(new CircleRigidBody(this.kMinionSprite, this.target));
            // null;
    }//creates 20 objects

    this.mAllObjs.getObjectAt(0).swapTexture();


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
    this.mAllStationaryObjs.draw(this.mCamera);
    this.mAllObjs.draw(this.mCamera);
    // this.mMsg.draw(this.mCamera);
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
    // var msg = "Num: " + this.mAllObjs.size() + " Current=" + this.mCurrentObj;
    // if(gEngine.Input.isKeyClicked(gEngine.Input.keys.B)){
    //     this.mAllStationaryObjs.swapDrawBoundCircle();
    // }
    // if(gEngine.Input.isKeyClicked(gEngine.Input.keys.N)){
    //     this.mode = (this.mode + 1) % 3;
    //     this.switchModes();
    // }
    // if(gEngine.Input.isKeyClicked(gEngine.Input.keys.C)){
    //     var mOdd = new CircleRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
    //     this.mAllStationaryObjs.addToSet(mOdd);
    // }
    // if(gEngine.Input.isKeyClicked(gEngine.Input.keys.R)){
    //     var mEven = new SquareRigidBody(this.mCamera.getWCCenter(), this.mCamera.getWCWidth(), this.mCamera.getWCHeight());
    //     this.mAllStationaryObjs.addToSet(mEven);
    // }
    // if(this.mAllStationaryObjs.size() <= 0)
    // {
    //     this.mMsg.setText(msg);
    //     return;
    // }
    //
    this.mAllObjs.getObjectAt(this.mCurrentObj).checkKeyClicks(this.mCamera);
    // this.mAllObjs.getObjectAt(this.mCurrentObj).swapTexture();
    //
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {
        this.mAllObjs.getObjectAt(this.mCurrentObj).swapTexture();
        this.mCurrentObj = (this.mCurrentObj + 1) % this.mAllObjs.size();
        this.mAllObjs.getObjectAt(this.mCurrentObj).swapTexture();
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {
        this.mAllObjs.getObjectAt(this.mCurrentObj).swapTexture();
        this.mCurrentObj = (this.mCurrentObj - 1);
        if (this.mCurrentObj < 0)
            this.mCurrentObj = this.mAllObjs.size() - 1;
        this.mAllObjs.getObjectAt(this.mCurrentObj).swapTexture();
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.V))
        this.hasVelocity = !this.hasVelocity;
    this.mAllStationaryObjs.update(this.mCamera);


    this.hasVelocity ? this.mAllObjs.update(this.mCamera) : null;
    gEngine.Physics.processCollision(this.mAllObjs);
    gEngine.Physics.processSetSet(this.mAllObjs, this.mAllStationaryObjs);
    //
    // msg += " R=" + this.mAllStationaryObjs.getObjectAt(this.mCurrentObj).getRigidBody().getBoundRadius();
    // this.mMsg.setText(msg);
    // // if(gEngine.Input.isKeyClicked(gEngine.Input.keys.P)){
    // //     this.mAllStationaryObjs.removeFromSet();
    // //     this.mCurrentObj >= this.mAllStationaryObjs.size() ? this.mCurrentObj = this.mAllStationaryObjs.size() - 1 : null;
    // //     this.mCurrentObj < 0 ? this.mCurrentObj = 0 : null;
    // // }
};