/**
 * Created by Jayse on 1/17/2017.
 */
/*
 * File: SceneFile_Parse.js
 */
/*jslint node: true, vars: true */
/*global gEngine: false, console: false, Camera: false, vec2: false, Renderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function JSONSceneFileParser(sceneFilePath) {
    this.mSceneJson = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
}

JSONSceneFileParser.prototype.parseCamera = function ()
{
    var cx = this.mSceneJson.Camera.Center[0];
    var cy = this.mSceneJson.Camera.Center[1];
    var w = this.mSceneJson.Camera.Width;
    var viewport = [];
    var bgColor = [];
    
    this.mSceneJson.Camera.Viewport.forEach(function(myEntry)
    {
       viewport.push(Number(myEntry)); 
    });
    
    this.mSceneJson.Camera.BgColor.forEach(function(myEntry)
    {
       bgColor.push(Number(myEntry)); 
    });
    //
    // var j;
    // for (j = 0; j < 4; j++) {
    //     bgColor[j] = Number(bgColor[j]);
    //     viewport[j] = Number(viewport[j]);
    // }

    var cam = new Camera(
        vec2.fromValues(cx, cy),  // position of the camera
        w,                        // width of camera
        viewport                  // viewport (orgX, orgY, width, height)
    );
    cam.setBackgroundColor(bgColor);
    return cam;
};

JSONSceneFileParser.prototype.updateCamera = function(camera)
{
    this.mSceneJson.Camera.Center[0] = camera.getWCCenter()[0];
    this.mSceneJson.Camera.Center[1] = camera.getWCCenter()[1];
    this.mSceneJson.Camera.Width = camera.getWCWidth();
    this.mSceneJson.Camera.Viewport = camera.getViewport();
    this.mSceneJson.Camera.BgColor = camera.getBackgroundColor();
    return this.mSceneJson;
};


JSONSceneFileParser.prototype.parseSquares = function (sqSet) {
    var sq;
    this.mSceneJson.Square.forEach(function(Entry)
    {
        sq = new Renderable(gEngine.DefaultResources.getConstColorShader());
        sq.getXform().setPosition(Entry.Pos[0], Entry.Pos[1]);
        sq.getXform().setRotationInDegree(Entry.Rotation);
        sq.getXform().setSize(Entry.Width, Entry.Height);
        sq.setColor(Entry.Color);
        sqSet.push(sq);
    });
};
