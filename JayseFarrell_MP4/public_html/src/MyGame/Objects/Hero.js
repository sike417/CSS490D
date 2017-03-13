/**
 * Created by Jayse on 2/7/2017.
 */
function Hero(spriteMap, centerX, centerY, Width, Height){
    this.mHero = null;
    this.mAllDyePacks = new GameObjectSet();
    this.mAllDyePacks = [];
    this.mSpriteMap = spriteMap;

    this.mainX = centerX;
    this.mainY = centerY;
    this.mainWidth = Width;
    this.mainHeight = Height;

    this.kCycles = 120;
    this.kRate = .05;

    this.initialize();
    this.mOrgSize = vec2.clone(this.mHero.getXform().getSize());
    this.mShakeSize = vec2.clone(this.mOrgSize);
    this.mShake = null;//new ShakePosition(this.mOrgSize[0] / 2, this.mOrgSize[1] / 2, 4, 60);

    this.location = new InterpolateVec2(this.mHero.getXform().getPosition(), this.kCycles, this.kRate);
    GameObject.call(this, this.mHero);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.initialize = function()
{
    this.mHero = new SpriteRenderable(this.mSpriteMap);
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(this.mainX - this.mainWidth / 4, this.mainY);
    // this.mHero.getXform().setPosition(this.mainX, this.mainY);
    this.mHero.getXform().setSize(27, 36);
    this.mHero.setElementPixelPositions(0, 120, 0, 180);  
};

Hero.prototype.draw = function(camera){
    this.mHero.draw(camera);
    this.mAllDyePacks.forEach(function(Entry){
       Entry.draw(camera);
    });
};

Hero.prototype.update = function() {
    this.location.updateInterpolation();

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.newShake();
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.mAllDyePacks.push(new DyePack(this.mSpriteMap, this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos()));
    }
    if (this.mShake !== null) {
        this.updateShakeState();
        this.mHero.getXform().setSize(this.mShakeSize[0], this.mShakeSize[1]);
    }
    var i;

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        for (i = 0; i < this.mAllDyePacks.length; i++) {
            this.mAllDyePacks[i].decelerateMe = true;
            this.mAllDyePacks[i].decelerate();
            if(this.mAllDyePacks[i].deleteMe === true){
                this.mAllDyePacks.splice(i--, 1);
                if(i < 0)
                    break;
            }
        }
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.S)){
        for (i = 0; i < this.mAllDyePacks.length; i++){
            this.mAllDyePacks[i].setDefaultShake();
        }
    }
    for (i = 0; i < this.mAllDyePacks.length; i++) {
        this.mAllDyePacks[i].update();
        if((this.mAllDyePacks[i].getXform().getXPos() > (this.mainX + this.mainWidth / 2 + this.mAllDyePacks[i].getXform().getWidth() / 2))
            || this.mAllDyePacks[i].deleteMe === true)
            this.mAllDyePacks.splice(i--, 1);
        if(i < 0)
            break;
    }
};

Hero.prototype.newShake = function(){
    this.mShake = new ShakePosition(this.mOrgSize[0] / 2, this.mOrgSize[1] / 2, 4, 60);
};

Hero.prototype.updateLocation = function(position){
    this.location.setFinalValue(position);
};

Hero.prototype.updateShakeState = function(){
    var s = this.mShake.getShakeResults();
    vec2.add(this.mShakeSize, this.mOrgSize, s);
};

Hero.prototype.setXPos = function(WCXPos){
    this.mHero.getXform().setXPos(WCXPos);
};

Hero.prototype.setYPos = function(WCYPos){
  this.mHero.getXform().setYPos(WCYPos); 
};

Hero.prototype.getNumOfDyePacks = function(){
  return this.mAllDyePacks.length;
};

Hero.prototype.getFirstXDyePacks = function(count){
    if(count >= this.mAllDyePacks.length)
    {
        return this.mAllDyePacks.slice(0, count);
    }
    else{
        return this.mAllDyePacks;   
    }
};