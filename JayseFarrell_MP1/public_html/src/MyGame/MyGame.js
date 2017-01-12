/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, Camera: false, mat4: false, vec3: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID) {
    // variables of the constant color shader
    this.mConstColorShader = null;

    // variables for the squares
    this.mRedSq = null;
    this.timeLags = [];
    this.nextLag = 0;
    this.lastTime = 0;
    this.clusters = [];
    this.currentCluster = [];
    this.numberInCluster = [];
    this.deleteMode = "False";
    this.numberOfRend = 0;
    // The camera to view the scene
    this.mCamera = null;

    // Initialize the webGL Context
    gEngine.Core.initializeEngineCore(htmlCanvasID);

    // Initialize the game
    this.initialize();
}

var fixedInterval = 0;
MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0),   // position of the camera
        100,                        // width of camera
        [0, 0, 640, 480]         // viewport (orgX, orgY, width, height)
        );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

    // Step  B: create the shader
    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the Simple FragmentShader    

    // Step  C: Create the Renderable objects:
    this.mRedSq = new SquareRenderable(this.mConstColorShader);
    this.mRedSq.setColor([1, 0, 0, 1]);

    // Step  E: Initialize the red Renderable object: centered 2x2
    this.mRedSq.getXform().setPosition(0, 0);
    this.mRedSq.getXform().setSize(1, 1);

    // Step F: Start the game loop running
    gEngine.GameLoop.start(this);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    var test = this;

    for( var i = 0; i < this.clusters.length; i++)
    {
        for (var n = 0; n < this.clusters[i].length; n++)
        {
            this.clusters[i][n].draw(this.mCamera.getVPMatrix());
        }
    }
    this.mRedSq.draw(this.mCamera.getVPMatrix());
    gUpdateObject(this.numberOfRend, this.deleteMode);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    // For this very simple game, let's move the white square and pulse the red
    var redXform = this.mRedSq.getXform();
    var deltaX = 0.1;
    var deltaY = 0.1;

    // Step A: test for white square movement
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if (redXform.getXPos() > 50) // this is the right-bound of the window
            redXform.setXPos(-50);
        redXform.incXPosBy(deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Left))
    {
        if (redXform.getXPos() < -50) // this is the right-bound of the window
            redXform.setXPos(50);
        redXform.incXPosBy(-deltaX);
    }

    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Up))
    {
        if(redXform.getYPos() > 75/2)
            redXform.setYPos(-(75/2));
        redXform.incYPosBy(deltaY);
    }

    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Down))
    {
        if(redXform.getYPos() < -(75/2))
            redXform.setYPos(75/2);
        redXform.incYPosBy(-deltaY);
    }

    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.H)  && this.deleteMode === "False")
        this.fixedCluster(redXform, true);
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.V) && this.deleteMode === "False")
        this.fixedCluster(redXform, false);
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)  && this.deleteMode === "False")
        this.createCluster(redXform);
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.D) && this.deleteMode === "False") {
        this.timeLags.shift();
        this.deleteMode = "True";
        this.deleteMe();
    }
};

MyGame.prototype.fixedCluster = function(redXform, isHorizontal)
{
    this.currentCluster = [];

    var newSq;
    fixedInterval = Math.ceil(Math.random() * 8) + 2;
    var quantity = Math.floor(60 / fixedInterval);

    for(var i = -quantity + 1; i < quantity; i++) {
        newSq = new SquareRenderable(this.mConstColorShader);
        newSq.setColor([Math.random(), Math.random(), Math.random(), 1]);

        // Step  E: Initialize the red Renderable object: centered 2x2
        if(isHorizontal)
            newSq.getXform().setPosition(i * fixedInterval, redXform.getYPos());
        else
            newSq.getXform().setPosition(redXform.getXPos(), i * fixedInterval);
        newSq.getXform().setWidth(Math.random() * 5 + 1);
        newSq.getXform().setHeight(newSq.getXform().getWidth());
        // newSq.getXform().setSize(Math.random() * 5 + 1, Math.random() * 5 + 1);

        this.currentCluster.push(newSq);
    }
    this.numberInCluster.push(this.currentCluster.length);
    this.numberOfRend += this.numberInCluster[this.numberInCluster.length - 1];
    this.clusters.push(this.currentCluster);

    var time = new Date();
    if(this.clusters.length === 1)
        this.timeLags.push(0);
    else
        this.timeLags.push(time.getTime() - this.lastTime);
    this.lastTime = time.getTime();
};

MyGame.prototype.createCluster = function(redXform)
{
    this.currentCluster = [];

    var newSq;

    for(var i = 0; i < Math.ceil((Math.random() * 10) + 10); i++) {
        newSq = new SquareRenderable(this.mConstColorShader);
        newSq.setColor([Math.random(), Math.random(), Math.random(), 1]);

        // Step  E: Initialize the red Renderable object: centered 2x2
        newSq.getXform().setPosition(redXform.getXPos() + (Math.random() * 10) - 5, redXform.getYPos() + (Math.random() * 10) - 5);
        newSq.getXform().setWidth(Math.random() * 5 + 1);
        newSq.getXform().setHeight(newSq.getXform().getWidth());
        // newSq.getXform().setSize(Math.random() * 5 + 1, Math.random() * 5 + 1);
        newSq.getXform().setRotationInRad(Math.random() * Math.PI * 2);

        this.currentCluster.push(newSq);
    }
    this.numberInCluster.push(this.currentCluster.length);
    this.numberOfRend += this.numberInCluster[this.numberInCluster.length - 1];
    this.clusters.push(this.currentCluster);

    var time = new Date();
    if(this.clusters.length === 1)
        this.timeLags.push(0);
    else
        this.timeLags.push(time.getTime() - this.lastTime);
    this.lastTime = time.getTime();
};

MyGame.prototype.deleteMe = function()
{
    if(this.clusters.length > 0) {
        this.clusters.shift();
        this.numberOfRend -= this.numberInCluster.shift();
        gUpdateObject(this.numberOfRend, this.deleteMode);

        if(this.timeLags.length === 0)
            this.deleteMode = "False";
        else
            this.nextLag = this.timeLags.shift();
    }
    else
        this.deleteMode = "False"
};
