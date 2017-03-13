/**
 * Created by Jayse on 2/22/2017.
 */
function Hero(spriteMap, centerX, centerY, Width, Height){
    this.mHero = null;
    this.mSpriteMap = spriteMap;
    this.mRigidCircle = null;

    this.mainX = centerX;
    this.mainY = centerY;
    this.mainWidth = Width;
    this.mainHeight = Height;

    this.kCycles = 120;
    this.kRate = .05;

    this.initialize();
    var mRigidSquare =  new RigidSquare(this.mHero.getXform(), this.mHero.getXform().getWidth(), this.mHero.getXform().getHeight());
    mRigidSquare.setMass(0.7);  // less dense than Minions
    mRigidSquare.setRestitution(0.3);
    // mRigidSquare.setColor([0, 1, 0, 1]);
    this.location = new InterpolateVec2(this.mHero.getXform().getPosition(), this.kCycles, this.kRate);
    GameObject.call(this, this.mHero);
    this.setPhysicsComponent(mRigidSquare);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.initialize = function()
{
    this.mHero = new SpriteRenderable(this.mSpriteMap);
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(this.mainX - this.mainWidth / 4, this.mainY);
    // this.mHero.getXform().setPosition(this.mainX, this.mainY);
    this.mHero.getXform().setSize(9, 12);
    this.mHero.setElementPixelPositions(0, 120, 0, 180);
    
};

Hero.prototype.update = function() {
    this.location.updateInterpolation();
    GameObject.prototype.update.call(this);
    // this.mRigidCircle.update();
};

// Hero.prototype.newShake = function(){
//     this.mShake = new ShakePosition(this.mOrgSize[0] / 2, this.mOrgSize[1] / 2, 4, 60);
// };

Hero.prototype.updateLocation = function(position){
    this.location.setFinalValue(position);
};

// Hero.prototype.updateShakeState = function(){
//     var s = this.mShake.getShakeResults();
//     vec2.add(this.mShakeSize, this.mOrgSize, s);
// };

Hero.prototype.setXPos = function(WCXPos){
    this.mHero.getXform().setXPos(WCXPos);
};

Hero.prototype.setYPos = function(WCYPos){
    this.mHero.getXform().setYPos(WCYPos);
};