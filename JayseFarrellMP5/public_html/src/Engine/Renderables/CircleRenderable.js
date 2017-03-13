/**
 * Created by jayse on 10/20/16.
 */
/*
* File: SquareRenderable.js
*
* draws from the Circle vertex buffer
*/
/*jslint node: true, vars: true */
/*global gEngine, Renderable */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mMode such that variables must be declared before used!

function CircleRenderable(xform) {
    Renderable.call(this);
    this.xform = xform;
    this.mRadius = Math.max(xform.getWidth(), xform.getHeight());
    this.mCenter = xform.getPosition();
    this.drawMe = true;
    this.kNumSides = 16;
    this.mSides = new LineRenderable();
    
    this._setShader(gEngine.DefaultResources.getRingColorShader());
    // this.initialize();
    // Notice how to call the super class constructor!
    // The constructor takes on paramter, but we are calling it with two arguments!
    // First argument says, "this" is the caller of the constructor
}
gEngine.Core.inheritPrototype(CircleRenderable, Renderable);
// This line MUST be defined right after the constructor
// To get all the methods defined in the super-class.prototype


CircleRenderable.prototype.update = function(){
    this.mRadius = Math.max(this.mXform.getWidth(), this.mXform.getHeight());
    this.mCenter = this.mXform.getPosition();
};

CircleRenderable.prototype.setRadius = function(r){
    this.getXform().setSize(r * 2, r * 2);
};

// Override the super-class "draw()" method!
CircleRenderable.prototype.draw = function (camera) {
    if (!this.drawMe) {
        return;
    }
    else {
        
        // kNumSides forms the circle.
        var pos = this.mCenter;
        var prevPoint = vec2.clone(pos);
        var deltaTheta = (Math.PI * 2.0) / this.kNumSides;
        var theta = deltaTheta;
        prevPoint[0] += this.mRadius;
        var i, x, y;
        for (i = 1; i <= this.kNumSides; i++) {
            x = pos[0] + this.mRadius * Math.cos(theta);
            y = pos[1] + this.mRadius * Math.sin(theta);

            this.mSides.setFirstVertex(prevPoint[0], prevPoint[1]);
            this.mSides.setSecondVertex(x, y);
            this.mSides.draw(aCamera);

            theta = theta + deltaTheta;
            prevPoint[0] = x;
            prevPoint[1] = y;
        }
    }
};