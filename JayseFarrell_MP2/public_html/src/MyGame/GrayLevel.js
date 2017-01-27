/**
 * Created by Jayse on 1/17/2017.
 */
/*
 * File: GrayLevel.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, MyGame: false, JSONSceneFileParser: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GrayLevel() {
    // audio clips: supports both mp3 and wav formats
    this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/BlueLevel_cue.wav";

    // scene file name
    this.kSceneFile = "assets/GrayLevel.json";
    // all squares
    this.mSqSet = [];        // these are the Renderable objects

    // The camera to view the scene
    this.mCamera = null;

    var smallSceneParser = gEngine.DefaultResources.retrieveDefaultJSON();
    this.mSmallCamera = smallSceneParser.parseCamera();
}
gEngine.Core.inheritPrototype(GrayLevel, Scene);

GrayLevel.prototype.loadScene = function () {
    // load the scene file
    // gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile);
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eJSONFile);
    // loads the audios
    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);
};

GrayLevel.prototype.unloadScene = function () {
    // stop the background audio
    gEngine.AudioClips.stopBackgroundAudio();

    // unload the scene flie and loaded resources
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    gEngine.DefaultResources.updateDefaultJSON(this.mSmallCamera);
    gEngine.AudioClips.unloadAudio(this.kBgClip);
    gEngine.AudioClips.unloadAudio(this.kCue);
    
    var nextLevel = new MyGame();  // load the next level
    gEngine.Core.startScene(nextLevel);
};

GrayLevel.prototype.initialize = function () {
    var sceneParser = new JSONSceneFileParser(this.kSceneFile);

    // Step A: Read in the camera
    this.mCamera = sceneParser.parseCamera();

    // Step B: Read all the squares
    sceneParser.parseSquares(this.mSqSet);

    // now start the bg music ...
    // gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
GrayLevel.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Step  C: draw all the squares
    var i;
    for (i = 0; i < this.mSqSet.length; i++) {
        this.mSqSet[i].draw(this.mCamera.getVPMatrix());
    }

    this.mSmallCamera.setupViewProjection();

    for (i = 0; i < this.mSqSet.length; i++) {
        this.mSqSet[i].draw(this.mSmallCamera.getVPMatrix());
    }
};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
GrayLevel.prototype.update = function () {
    // For this very simple game, let's move the first square
    var xform = this.mSqSet[1].getXform();
    var xform2 = this.mSqSet[0].getXform();
    var deltaX = 0.05;

    xform.setRotationInDegree(xform.getRotationInDegree() + gEngine.GameLoop.getRotateSpeed());
    xform2.setXPos(xform2.getXPos() - gEngine.GameLoop.getShiftSpeed());

    xform2.getXPos() < 11 ? xform2.setPosition(30, 60) : null;

    /// Move right and swap ovre
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        // gEngine.AudioClips.playACue(this.kCue);
        xform.incXPosBy(deltaX);
        if (xform.getXPos() > 30) { // this is the right-bound of the window
            xform.setPosition(12, 60);
        }
    }

    // Step A: test for white square movement
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        // gEngine.AudioClips.playACue(this.kCue);
        xform.incXPosBy(-deltaX);
        if (xform.getXPos() < 11) { // this is the left-boundary
            xform.setPosition(30, 60);
            // gEngine.GameLoop.stop();
        }
    }

    var test;
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
    {
        test = this.mSmallCamera.getViewport();
        test[1] += 50 * deltaX;
        this.mSmallCamera.setViewport(test);
    }
    if(gEngine.Input.isKeyReleased(gEngine.Input.keys.A))
    {
        test = this.mSmallCamera.getViewport();
        test[0] -= 150 * deltaX;
        this.mSmallCamera.setViewport(test);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    {
        test = this.mSmallCamera.getViewport();
        test[1] -= 50 * deltaX;
        this.mSmallCamera.setViewport(test);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        test = this.mSmallCamera.getViewport();
        test[0] += 50 * deltaX;
        this.mSmallCamera.setViewport(test);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.F))
    {
        test = this.mCamera.getWCCenter();
        test[1] += deltaX;
        this.mCamera.setWCCenter(test[0], test[1]);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.C))
    {
        test = this.mCamera.getWCCenter();
        test[0] -= deltaX;
        this.mCamera.setWCCenter(test[0], test[1]);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.V))
    {
        test = this.mCamera.getWCCenter();
        test[1] -= deltaX;
        this.mCamera.setWCCenter(test[0], test[1]);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.B))
    {
        test = this.mCamera.getWCCenter();
        test[0] += deltaX;
        this.mCamera.setWCCenter(test[0], test[1]);
    }

    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Z))//zoom in
    {
        this.mCamera.setWCWidth(this.mCamera.getWCWidth() - deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.X))//zoom out
    {
        this.mCamera.setWCWidth(this.mCamera.getWCWidth() + deltaX);
    }

    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
        this.unloadScene();
};