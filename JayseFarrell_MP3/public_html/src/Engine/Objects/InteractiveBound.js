/**
 * Created by Jayse on 1/23/2017.
 */
function InteractiveBound(SpriteName)
{
    this.kMinionSprite = SpriteName;
    // this.mSpriteMap = null;
    // this.border = null;
    // this.initialize(camera);
    this.boundary = "assets/Bound.png";
    this.mIntBound = null;
    this.dimensions = gEngine.ResourceMap.retrieveImageDimensions(this.kMinionSprite);
    this.initialize();
}

InteractiveBound.prototype.initialize = function() {
    // this.mSpriteMap = new SpriteRenderable(this.kMinionSprite);
    // this.mSpriteMap.getXform().setPosition(50,33);
    this.mIntBound = new SpriteRenderable(this.boundary);
    this.mIntBound.getXform().setPosition(50,33);
    // this.mIntBound.getXform().setSize(this.mIntBound.getXform().getWidth() * 150, this.mIntBound.getXform().getHeight() * 150);
    this.mIntBound.getXform().setSize(this.dimensions[0] / 4, this.dimensions[0] / 4);
    // this.mIntBound.setColor([1,1,1,1]);
};

InteractiveBound.prototype.update = function(){
    var deltaX = 1.5; var xform = this.mIntBound.getXform();
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
    {
        if(!(xform.getYPos() + xform.getHeight()/2 >= 33 + this.dimensions[1]/2))
            xform.setYPos(xform.getYPos() + deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
    {
        if(!(xform.getXPos() - xform.getWidth()/2 <= 50 - this.dimensions[0]/2))
            xform.setXPos(xform.getXPos() - deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    {
        if(!(xform.getYPos() - xform.getHeight()/2 <= 33 - this.dimensions[1]/2))
            xform.setYPos(xform.getYPos() - deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        if(!(xform.getXPos() + xform.getWidth()/2 >= 50 + this.dimensions[0]/2))
            xform.setXPos(xform.getXPos() + deltaX);
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        if(xform.getWidth() - deltaX > 0)
            xform.setWidth(xform.getWidth() - deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if(xform.getWidth() + deltaX < this.dimensions[0] &&
            (xform.getXPos() + (xform.getWidth() + deltaX) / 2 <= 50 + this.dimensions[0]/2) &&
            (xform.getXPos() - (xform.getWidth() - deltaX) / 2 >= 50 - this.dimensions[0]/2))
            xform.setWidth(xform.getWidth() + deltaX);
        else if(xform.getWidth() + deltaX < this.dimensions[0] &&
            (xform.getXPos() + (xform.getWidth() + deltaX) / 2 <= 50 + this.dimensions[0]/2))
        {
            xform.setXPos(xform.getXPos() + deltaX);
            xform.setWidth(xform.getWidth() + deltaX);
        }
        else if(xform.getWidth() + deltaX < this.dimensions[0] &&
            (xform.getXPos() - (xform.getWidth() - deltaX) / 2 >= 50 - this.dimensions[0]/2))
        {
            xform.setXPos(xform.getXPos() - deltaX);
            xform.setWidth(xform.getWidth() + deltaX);
        }
        else if(xform.getWidth() + deltaX >= this.dimensions[0])
        {
            xform.setWidth(this.dimensions[0]);
            xform.setXPos(50 + this.dimensions[1]/2 - xform.getWidth() / 2);
        }
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if(xform.getHeight() + deltaX < this.dimensions[1] &&
            (xform.getYPos() + (xform.getHeight() + deltaX) / 2 <= 33 + this.dimensions[1]/2) &&
            (xform.getYPos() - (xform.getHeight() - deltaX) / 2 >= 33 - this.dimensions[1]/2))
            xform.setHeight(xform.getHeight() + deltaX);
        else if(xform.getHeight() + deltaX < this.dimensions[1] &&
            (xform.getYPos() + (xform.getHeight() + deltaX) / 2 <= 33 + this.dimensions[1]/2))
        {
            xform.setYPos(xform.getYPos() + deltaX);
            xform.setHeight(xform.getHeight() + deltaX);
        }
        else if(xform.getHeight() + deltaX < this.dimensions[1] &&
            (xform.getYPos() - (xform.getHeight() - deltaX) / 2 >= 33 - this.dimensions[1]/2))
        {
            xform.setYPos(xform.getYPos() - deltaX);
            xform.setHeight(xform.getHeight() + deltaX);
        }
        else if(xform.getHeight() + deltaX >= this.dimensions[1])
        {
            xform.setHeight(this.dimensions[1]);
            xform.setYPos(33 + this.dimensions[1]/2 - xform.getHeight() / 2);
        }
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if(xform.getHeight() - deltaX > 0)
            xform.setHeight(xform.getHeight() - deltaX);
    }
};

InteractiveBound.prototype.draw = function(camera){
        this.mIntBound.draw(camera.getVPMatrix());    
};