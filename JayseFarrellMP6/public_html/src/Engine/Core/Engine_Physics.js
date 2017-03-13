/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*jslint node: true, vars: true, white: true */
/*global vec2, CollisionInfo */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * Static refrence to gEngine
 * @type gEngine
 */
var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

/**
 * Default Constructor<p>
 * Physics engine supporting projection and impulse collision resolution. <p>
 * @class gEngine.Physics
 * @type gEngine.Physics
 */
gEngine.Physics = (function () {

    var mSystemtAcceleration = [0, -20];        // system-wide default acceleration
    
    var getSystemtAcceleration = function() { return mSystemtAcceleration; };

    var mCollisionInfo = null;                  // information of the current collision
    var mAllCollisionInfo = null;
    var mLine = new LineRenderable();
    /**
     * Initilize the Engine Physics
     * @memberOf gEngine.Physics
     * @returns {void}
     */
    var initialize = function() {
        mCollisionInfo = new CollisionInfo(); // to avoid allocating this constantly
    };
    
    var processCollision = function(set) {
        // set.clearAllMCollisionInfo();
        mAllCollisionInfo = [];
        var i = 0, j;
        for (i = 0; i < set.size(); i++) {
            var one = set.getObjectAt(i).getRigidBody();
            for (j = i+1; j<set.size(); j++) {
                mCollisionInfo = new CollisionInfo();
                var g = set.getObjectAt(j).getRigidBody();
                if(one.boundTest(g)) {
                    if (one.CollisionTest(g, mCollisionInfo)) {
                        // one.flipVelocity();
                        // g.flipVelocity();
                        mAllCollisionInfo.push(mCollisionInfo);
                        // g.setCollisionInfo(mCollisionInfo);
                    }
                }
            }
        }
    };
    
    var drawCollision = function(mCamera){
        if(mAllCollisionInfo !== null){
            var mLine = new LineRenderable();
            for(var i = 0; i < mAllCollisionInfo.length; i++) {
                mLine.setColor([1, 0, 1, 1]);
                mLine.setPointSize(15);
                var test = mAllCollisionInfo[i].getStart();
                mLine.setFirstVertex(test[0], test[1]);
                test = mAllCollisionInfo[i].getEnd();
                mLine.setSecondVertex(test[0], test[1]);
                mLine.setDrawVertices(true);
                mLine.draw(mCamera);
                // mCollisionInfo = null;
                mLine.setDrawVertices(false);
            }
        }
    };
    
    var mPublic = {
        getSystemAcceleration: getSystemtAcceleration,
        processCollision: processCollision,
        initialize: initialize,
        drawCollision: drawCollision
    };
    return mPublic;
}());