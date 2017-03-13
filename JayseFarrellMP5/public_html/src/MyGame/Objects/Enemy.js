/**
 * Created by Jayse on 2/22/2017.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Enemy(spriteTexture, atX, atY, centerX, centerY, Width, Height) {
    this.kSpeed = 20;
    this.rotateSpeed = .01;
    this.mEnemy = new SpriteAnimateRenderable(spriteTexture);
    this.mainX = centerX;
    this.mainY = centerY;
    this.mainWidth = Width;
    this.mainHeight = Height;
    this.count = 0;
    
    this.mEnemy.setColor([1, 1, 1, 0]);
    this.mEnemy.getXform().setPosition(atX, atY);
    this.mEnemy.getXform().setSize(12, 9.6);
    this.mEnemy.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
        204, 164,    // widthxheight in pixels
        5,           // number of elements in this sequence
        0);          // horizontal padding in between
    this.mEnemy.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mEnemy.setAnimationSpeed(30);
    // show each element for mAnimSpeed updates
    
    GameObject.call(this, this.mEnemy);
    this.setSpeed(0);
    var mRigidCircle = new RigidCircle(this.getXform(), 4);
    mRigidCircle.drawMe = true;
    mRigidCircle.setMass(2);
    mRigidCircle.setAcceleration([0, 0]);
    mRigidCircle.setFriction(0);

    var vx = this.kSpeed * (Math.random() - 0.5);
    var vy = this.kSpeed * (Math.random() - 0.5);
    mRigidCircle.setVelocity(vec2.fromValues(vx, vy));

    this.setPhysicsComponent(mRigidCircle);

    this.mHasCollision = false;
}
gEngine.Core.inheritPrototype(Enemy, GameObject);

Enemy.prototype.update = function () {
    GameObject.prototype.update.call(this);
    // remember to update this.mEnemy's animation
    this.mEnemy.updateAnimation();
    this.count++;
    if(this.count >= 500) {
        var vx = this.kSpeed * (Math.random() - 0.5);
        var vy = this.kSpeed * (Math.random() - 0.5);
        this.getPhysicsComponent().setVelocity(vx, vy);
    }
    this.checkBounds();
};

Enemy.prototype.flipVelocity = function () {
    var v = this.getPhysicsComponent().getVelocity();
    vec2.scale(v, v, -1);
};

Enemy.prototype.hasCollision = function () {
    this.mHasCollision = true;
};

Enemy.prototype.checkBounds = function(){
    var test = this.getWorldBBox().boundCollideStatus(this.getBBox());
    if(test !== BoundingBox.eboundCollideStatus.eInside){
        var physics = this.getPhysicsComponent();
        switch(test){
            case 0:
                // this.deleteMe = true;
                break;
            case 1: //collideleft
                physics.setVelocity(vec2.fromValues(-physics.getVelocity()[0], physics.getVelocity()[1]));
                break;
            case 2://collideRight
                physics.setVelocity(vec2.fromValues(-physics.getVelocity()[0], physics.getVelocity()[1]));
                break;
            case 4: //top
                physics.setVelocity(vec2.fromValues(physics.getVelocity()[0], -physics.getVelocity()[1]));
                break;
            case 5://topleft
                physics.setVelocity(vec2.fromValues(-physics.getVelocity()[0], -physics.getVelocity()[1]));
                break;
            case 6://topRight
                physics.setVelocity(vec2.fromValues(-physics.getVelocity()[0], -physics.getVelocity()[1]));
                break;
            case 8://bottom
                physics.setVelocity(vec2.fromValues(physics.getVelocity()[0], -physics.getVelocity()[1]));
                break;
            case 9://bottomleft
                physics.setVelocity(vec2.fromValues(-physics.getVelocity()[0], -physics.getVelocity()[1]));
                break;
            case 10://bottomright
                physics.setVelocity(vec2.fromValues(-physics.getVelocity()[0], -physics.getVelocity()[1]));
                break;
        }
    }
};

Enemy.prototype.getWorldBBox = function(){
    return new BoundingBox(vec2.fromValues(this.mainX, this.mainY), this.mainWidth, this.mainHeight);
};
