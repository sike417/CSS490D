/**
 * Created by Jayse on 2/4/2017.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Patrols(spriteMap, centerX, centerY, Width, Height){
    this.patrols = [];
    this.mCurrentLine = null;
    this.mSpriteMap = spriteMap;
    this.mTopMinion = null;
    this.mBottomMinion = null;
    this.mHead = null;
    this.mAutoSpawn = false;
    this.toggleBorder = false;

    this.mainX = centerX;
    this.mainY = centerY;
    this.mainWidth = Width;
    this.mainHeight = Height;
    
    this.initialize();
}

Patrols.prototype.initialize = function(){
    this.spawnNew();
    this.spawnNew();
};

Patrols.prototype.switchAutoSpawn = function(){
    this.mAutoSpawn = !this.mAutoSpawn;
};

Patrols.prototype.spawnNew = function(){
    var xPos = Math.floor(Math.random() * (this.mainWidth / 2) + this.mainX);
    var yPos = Math.random() > .5 ? this.mainY + Math.random() * (this.mainHeight / 4) :
    this.mainY - Math.random() * (this.mainHeight / 4);

    this.patrols.push(new Patrol(this.mSpriteMap, xPos, yPos, this.mainX, this.mainY, this.mainWidth, this.mainHeight));
};

Patrols.prototype.autoSpawn = function(){

    if(this.mAutoSpawn === true)
        this.spawnNew();
        //between this.mainX and this.mainX + this.mainWidth / 2
        //between right half of the world, bounded between top/bottom 25%
    else
        clearInterval(this.autoSpawn)

};

Patrols.prototype.getNumOfPatrols = function(){
    return this.patrols.length;  
};

Patrols.prototype.update = function(HeroBBox, DyePacks){
    var test = false;
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.P)){
        this.switchAutoSpawn();
        this.autoSpawn();

        var that = this;

        setInterval(that.autoSpawn.bind(that), 2000 + Math.random() * 1000);
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.C)){
        this.spawnNew();
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.B))
        this.toggleBorder = !this.toggleBorder;
    var i;
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) {
        for (i = 0; i < this.patrols.length; i++) {
            this.patrols[i].headPatrolHitEvent();
            if (this.patrols[i].deleteMe === true)
                this.patrols.splice(i--, 1);
            if(i < 0)
                break;
        }
    }
    for(i = 0; i < this.patrols.length; i++){
        test = this.patrols[i].update(HeroBBox, DyePacks);
        if(this.patrols[i].deleteMe === true)
            this.patrols.splice(i--, 1);
        if(i < 0)
            break;
    }
    return test;
};

Patrols.prototype.draw = function(camera){
    for(var i = 0; i < this.patrols.length; i++)
    {
        this.patrols[i].draw(camera);
        if(this.toggleBorder)
            this.patrols[i].drawBorders(camera);
    }
};