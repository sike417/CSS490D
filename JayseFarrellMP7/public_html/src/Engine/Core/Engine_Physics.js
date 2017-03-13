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

    var mSystemtAcceleration = [0, -20];//change to -20        // system-wide default acceleration
    var positionalCorrectionRate = .8;
    var relaxationCount = 15;
    var mRelaxationOffset = 1/relaxationCount;
    var mHasCollision = false;
    
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

    var _positionalCorrection = function(s1, s2, mCollisionInfo){
        var s1InvMass = s1.getInvMass();
        var s2InvMass = s2.getInvMass();
        var num = mCollisionInfo.getDepth() / (s1InvMass + s2InvMass) * positionalCorrectionRate;
        var correctionAmount = [0, 0];
        vec2.scale(correctionAmount, mCollisionInfo.getNormal(), num);

        var ca = [0, 0];
        vec2.scale(ca, correctionAmount, s1InvMass);
        s1.move(ca);
        // var s1Pos = s1.getPosition();
        // vec2.add(s1Pos, s1Pos, ca);

        vec2.scale(ca, correctionAmount, s2InvMass);
        // var s2Pos = s2.getPosition();
        s2.move(vec2.negate([0,0], ca));
        // vec2.subtract(s2Pos, s2Pos, ca);
    };

    var _applyFriction = function(n, v, f, m) {
        var tangent = vec2.fromValues(n[1], -n[0]);  // perpendicular to n
        var tComponent = vec2.dot(v, tangent);
        if (Math.abs(tComponent) < 0.01)
            return;

        f *= m * mRelaxationOffset;
        if (tComponent < 0) {
            vec2.scale(tangent, tangent, -f);
        } else {
            vec2.scale(tangent, tangent, f);
        }
        vec2.sub(v, v, tangent);
    };

    var resolveCollision = function (s1, s2, collisionInfo) {
        // Step A: one collision has been found
        mHasCollision = true;

        // Step B: correct positions
        _positionalCorrection(s1, s2, collisionInfo);

        // collision normal direction is _against_ s2
        // Step C: apply friction
        var s1V = s1.getVelocity();
        var s2V = s2.getVelocity();
        var n = collisionInfo.getNormal();
        _applyFriction(n, s1V, s1.getFriction(), s1.getInvMass());
        _applyFriction(n, s2V, -s2.getFriction(), s2.getInvMass());

        // Step D: compute relatively velocity of the colliding objects
        var relativeVelocity = [0, 0];
        vec2.sub(relativeVelocity, s2V, s1V);

        // Step E: examine the component in the normal direction
        // Relative velocity in normal direction
        var rVelocityInNormal = vec2.dot(relativeVelocity, n);
        //if objects moving apart ignore
        if (rVelocityInNormal < 0)
            return;

        // Step F: compute and apply response impulses for each object
        var newRestitution = Math.min(s1.getRestitution(), s2.getRestitution());

        // Calc impulse scalar
        var j = -(1 + newRestitution) * rVelocityInNormal;
        j = j / (s1.getInvMass() + s2.getInvMass());

        var impulse = [0, 0];
        vec2.scale(impulse, collisionInfo.getNormal(), j);

        var newImpulse = [0, 0];
        vec2.scale(newImpulse, impulse, s1.getInvMass());
        vec2.sub(s1V, s1V, newImpulse);

        vec2.scale(newImpulse, impulse, s2.getInvMass());
        vec2.add(s2V, s2V, newImpulse);
    };

    var beginRelaxation = function(){
        relaxationCount = 15;
        mHasCollision = true;
    };

    var continueRelaxation = function(){
        var hasTemp = mHasCollision;
        mHasCollision = false;
        relaxationCount -= 1;
        return((relaxationCount > 0) && hasTemp);
    };

    var processSetSet = function(set1, set2){
        var i, j, s1, s2;
        beginRelaxation();
        while (continueRelaxation()) {
            for (i = 0; i < set1.size(); i++) {
                s1 = set1.getObjectAt(i).getRigidBody();
                for (j = 0; j < set2.size(); j++) {
                    s2 = set2.getObjectAt(j).getRigidBody();
                    if ((s1 !== s2) && (s1.CollisionTest(s2, mCollisionInfo))) {
                        // mAllCollisionInfo.push(mCollisionInfo);
                        resolveCollision(s1, s2, mCollisionInfo);
                    }
                }
            }
        }
    };
    
    var processCollision = function(set) {
        // set.clearAllMCollisionInfo();
        // mAllCollisionInfo = [];
        var i, j, s1, s2;
        beginRelaxation();
        while (continueRelaxation()) {
            for (i = 0; i < set.size(); i++) {
                s1 = set.getObjectAt(i).getRigidBody();
                for (j = i+1; j < set.size(); j++) {
                    s2 = set.getObjectAt(j).getRigidBody();
                    if ((s1 !== s2) && (s1.CollisionTest(s2, mCollisionInfo))) {
                        resolveCollision(s1, s2, mCollisionInfo);
                        // mAllCollisionInfo.push(mCollisionInfo);
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
        processSetSet: processSetSet,
        initialize: initialize,
        drawCollision: drawCollision
    };

    return mPublic;
}());