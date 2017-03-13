/* File: GameObjectSet.js 
 *
 * Support for working with a set of GameObjects
 */

/*jslint node: true, vars: true */
/*global  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function GameObjectSet() {
    this.mSet = [];
}

GameObjectSet.prototype.size = function () { return this.mSet.length; };

GameObjectSet.prototype.getObjectAt = function (index) {
    return this.mSet[index];
};

GameObjectSet.prototype.empty = function(){
    this.mSet = [];
};

GameObjectSet.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};

GameObjectSet.prototype.removeFromSet = function(){
    this.mSet.pop();
};

GameObjectSet.prototype.update = function (aCamera) {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].update(aCamera);
    }
};

GameObjectSet.prototype.clearAllMCollisionInfo = function(){
    for( var i = 0; i < this.mSet.length; i++){
        this.mSet[i].getRigidBody().mCollisionInfo = null;
    }
};

GameObjectSet.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera);
    }
};

GameObjectSet.prototype.renew = function(){
    for(var i = 0; i < this.mSet.length; i++){
        if(typeof this.mSet[i].initialize === "function")
            this.mSet[i].initialize();
    }
};

GameObjectSet.prototype.setDrawBoundCircle = function(isTrue){
    this.mSet.forEach(function(Entry){
        Entry.setDrawBoundCircle(isTrue); 
    });  
};

GameObjectSet.prototype.swapDrawBoundCircle = function(){
    this.mSet.forEach(function(Entry){
        Entry.setDrawBoundCircle(!Entry.getDrawBoundCircle());
    });
};
