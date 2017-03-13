/**
 * Created by Jayse on 2/8/2017.
 */
function Patrol(spriteMap, xPos, yPos, centerX, centerY,  Width, Height){
    this.mSpriteMap = spriteMap;
    this.mTopMinion = null;
    this.mBottomMinion = null;
    this.mHead = null;
    this.kRate = .05;
    this.kCycles = 120;
    this.initialSpeed = .5;
    this.currentUpdateCount = 0;
    this.neededUpdateCount = 200;
    this.deleteMe = false;
    this.bBoxLines = [];
    
    this.mainX = centerX;
    this.mainY = centerY;
    this.mainWidth = Width;
    this.mainHeight = Height;

    this.initialize(xPos, yPos);
    GameObject.call(this, this.mHead);
    // this.setCurrentFrontDir(vec2.fromValues(-1,0));
    this.setCurrentFrontDir(vec2.fromValues(Math.random() * 2 - 1, Math.random() * 2 - 1));
    this.setSpeed(this.initialSpeed);

    this.location = [new InterpolateVec2(this.mTopMinion.getXform().getPosition(), this.kCycles, this.kRate),
        new InterpolateVec2(this.mBottomMinion.getXform().getPosition(), this.kCycles, this.kRate)];
}
gEngine.Core.inheritPrototype(Patrol, GameObject);

Patrol.prototype.initialize = function(xPos, yPos){
    this.mHead = new SpriteRenderable(this.mSpriteMap);
    this.mHead.setColor([1, 1, 1, 0]);  // tints red
    this.mHead.getXform().setPosition(xPos, yPos);
    this.mHead.getXform().setSize(22.5, 22.5);
    this.mHead.setElementPixelPositions(130, 310, 0, 180);


    this.mTopMinion = new SpriteAnimateRenderable(this.mSpriteMap);
    this.mTopMinion.setColor([1, 1, 1, 0]);
    this.mTopMinion.getXform().setPosition(xPos + 30, yPos + 18);
    this.mTopMinion.getXform().setSize(30, 24);
    this.mTopMinion.setSpriteSequence(348, 0,      // first element pixel position: top-right 164 from 512 is top of image, 0 is right of image
        204, 164,       // widthxheight in pixels
        5,              // number of elements in this sequence
        0);             // horizontal padding in between
    this.mTopMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mTopMinion.setAnimationSpeed(50);

    this.mBottomMinion = new SpriteAnimateRenderable(this.mSpriteMap);
    this.mBottomMinion.setColor([1,1,1,0]);
    this.mBottomMinion.getXform().setPosition(xPos + 30, yPos - 18);
    this.mBottomMinion.getXform().setSize(30,24);
    this.mBottomMinion.setSpriteSequence(348, 0,
        204, 164,
        5,
        0);
    this.mBottomMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mBottomMinion.setAnimationSpeed(50);

};

Patrol.prototype.update = function(HeroBBox, DyePacks) {
    this.mTopMinion.updateAnimation();
    this.mBottomMinion.updateAnimation();
    this.location[0].updateInterpolation();
    this.location[1].updateInterpolation();
    
    var collision = false;
    if(this.getHeadBBox().boundCollideStatus(HeroBBox) !== 0)
        collision = true;
    this.currentUpdateCount += 1;
    if(this.currentUpdateCount >= this.neededUpdateCount) {
        this.currentUpdateCount = 0;
        this.setCurrentFrontDir(vec2.fromValues(Math.random() * 2 - 1, Math.random() * 2 - 1));
        this.initialSpeed = Math.random();
        this.setSpeed(this.initialSpeed);
    }
    GameObject.prototype.update.call(this);
    this.updateLocations();
    this.computeBBoxLines();
    this.checkBounds();
    this.checkCollision(DyePacks);
    
    return collision;
};

Patrol.prototype.checkCollision = function(DyePacks){
    for(var i = 0; i < DyePacks.length; i++){
        if(DyePacks[i].collided === true)
            continue;
        var test = DyePacks[i].getBBox();
        if(test.boundCollideStatus(this.getHeadBBox()) !== 0) {
            DyePacks[i].setDefaultShake();
            this.headPatrolHitEvent();
            DyePacks[i].collided = true;
        }
        else if(test.boundCollideStatus(this.getWingBBoxes()[0]) !== 0){
            DyePacks[i].setDefaultShake();
            this.incrementAlpha(0);
            DyePacks[i].collided = true;
        }
        else if(test.boundCollideStatus(this.getWingBBoxes()[1]) !== 0){
            DyePacks[i].setDefaultShake();
            this.incrementAlpha(1);
            DyePacks[i].collided = true;
        }
        if(this.getBBox().boundCollideStatus(test) === 16)
            DyePacks[i].decelerateMe = true;
            // DyePacks[i].decelerateMe = this.getBBox().boundCollideStatus(test) === 16;
    }
    if(this.mBottomMinion.getAlpha() >= 1 || this.mTopMinion.getAlpha() >= 1)
        this.deleteMe = true;
};

Patrol.prototype.incrementAlpha = function(index){
    if(index >= 0 && index <= 1){
        var test;
        if(index === 0)
            this.mBottomMinion.incrementAlpha(.2);
        else {
            this.mTopMinion.incrementAlpha(.2);
        }
    }
};

Patrol.prototype.checkBounds = function(){
    var test = this.getWorldBBox().boundCollideStatus(this.getBBox());
    if(test !== BoundingBox.eboundCollideStatus.eInside){
        switch(test){
            case 0:
                this.deleteMe = true;
                break;
            case 1: //collideleft
                this.setCurrentFrontDir(vec2.fromValues(1,0));
                break;
            case 2://collideRight
                this.setCurrentFrontDir(vec2.fromValues(-1,0));
                break;
            case 4: //top
                this.setCurrentFrontDir(vec2.fromValues(0,-1));
                break;
            case 5://topleft
                this.setCurrentFrontDir(vec2.fromValues(1,-1));
                break;
            case 6://topRight
                this.setCurrentFrontDir(vec2.fromValues(-1,-1));
                break;
            case 8://bottom
                this.setCurrentFrontDir(vec2.fromValues(0,1));
                break;
            case 9://bottomleft
                this.setCurrentFrontDir(vec2.fromValues(1,1));
                break;
            case 10://bottomright
                this.setCurrentFrontDir(vec2.fromValues(-1,1));
                break;
        }
    }
};

Patrol.prototype.updateLocations = function(){
    this.location[0].setFinalValue([this.getXform().getXPos() + 30, this.getXform().getYPos() + 18]);
    this.location[1].setFinalValue([this.getXform().getXPos() + 30, this.getXform().getYPos() - 18]);
};

Patrol.prototype.headPatrolHitEvent = function(){
    this.getXform().setXPos(this.getXform().getXPos() + 15);
};

Patrol.prototype.computeBBoxLines = function(){
    this.bBoxLines = [];
    var boundingBox = this.getBBox();

    var mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox.minX(), boundingBox.minY());
    mCurrentLine.setSecondVertex(boundingBox.minX(), boundingBox.maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox.maxX(), boundingBox.minY());
    mCurrentLine.setSecondVertex(boundingBox.maxX(), boundingBox.maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox.minX(), boundingBox.minY());
    mCurrentLine.setSecondVertex(boundingBox.maxX(), boundingBox.minY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox.minX(), boundingBox.maxY());
    mCurrentLine.setSecondVertex(boundingBox.maxX(), boundingBox.maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    boundingBox = this.getHeadBBox();

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox.minX(), boundingBox.minY());
    mCurrentLine.setSecondVertex(boundingBox.minX(), boundingBox.maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox.maxX(), boundingBox.minY());
    mCurrentLine.setSecondVertex(boundingBox.maxX(), boundingBox.maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox.minX(), boundingBox.minY());
    mCurrentLine.setSecondVertex(boundingBox.maxX(), boundingBox.minY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox.minX(), boundingBox.maxY());
    mCurrentLine.setSecondVertex(boundingBox.maxX(), boundingBox.maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    boundingBox = this.getWingBBoxes();

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox[0].minX(), boundingBox[0].minY());
    mCurrentLine.setSecondVertex(boundingBox[0].minX(), boundingBox[0].maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox[0].maxX(), boundingBox[0].minY());
    mCurrentLine.setSecondVertex(boundingBox[0].maxX(), boundingBox[0].maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox[0].minX(), boundingBox[0].minY());
    mCurrentLine.setSecondVertex(boundingBox[0].maxX(), boundingBox[0].minY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox[0].minX(), boundingBox[0].maxY());
    mCurrentLine.setSecondVertex(boundingBox[0].maxX(), boundingBox[0].maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox[1].minX(), boundingBox[1].minY());
    mCurrentLine.setSecondVertex(boundingBox[1].minX(), boundingBox[1].maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox[1].maxX(), boundingBox[1].minY());
    mCurrentLine.setSecondVertex(boundingBox[1].maxX(), boundingBox[1].maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox[1].minX(), boundingBox[1].minY());
    mCurrentLine.setSecondVertex(boundingBox[1].maxX(), boundingBox[1].minY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);

    mCurrentLine = new LineRenderable();
    mCurrentLine.setFirstVertex(boundingBox[1].minX(), boundingBox[1].maxY());
    mCurrentLine.setSecondVertex(boundingBox[1].maxX(), boundingBox[1].maxY());
    mCurrentLine.setColor([1,1,1,1]);
    this.bBoxLines.push(mCurrentLine);
};

Patrol.prototype.getHeadBBox = function(){
    var xform = this.getXform();

    return new BoundingBox(xform.getPosition(),
        xform.getWidth(),
        xform.getHeight());
};

Patrol.prototype.getWingBBoxes = function(){
    var BottomXform = this.mBottomMinion.getXform();
    var TopXform = this.mTopMinion.getXform();

    return [new BoundingBox(BottomXform.getPosition(), BottomXform.getWidth(), BottomXform.getHeight()),
            new BoundingBox(TopXform.getPosition(), TopXform.getWidth(), TopXform.getHeight())];
};

Patrol.prototype.getBBox = function () {
    var xform = this.getXform();
    var BottomXform = this.mBottomMinion.getXform();

    var width = (BottomXform.getXPos() + BottomXform.getWidth() / 2) - (xform.getXPos() - xform.getWidth() / 2);
    var xPos = (xform.getXPos() - xform.getWidth() / 2) + width / 2;
    var yPos = (BottomXform.getYPos() - BottomXform.getHeight() / 2) + ((xform.getHeight() + BottomXform.getHeight() * 2) * 1.5) / 2;

    return new BoundingBox(vec2.fromValues(xPos, yPos),
                width, (xform.getHeight() + BottomXform.getHeight() * 2) * 1.5);
};

Patrol.prototype.getWorldBBox = function(){
    return new BoundingBox(vec2.fromValues(this.mainX, this.mainY), this.mainWidth, this.mainHeight);
};

Patrol.prototype.draw = function(camera){
    this.mHead.draw(camera);
    this.mTopMinion.draw(camera);
    this.mBottomMinion.draw(camera);
};

Patrol.prototype.drawBorders = function(camera){
    this.bBoxLines.forEach(function(Entry){
        Entry.draw(camera);
    });
};