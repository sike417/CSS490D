/**
 * Created by Jayse on 1/23/2017.
 */
function InteractiveBound(SpriteName)
{
    this.kMinionSprite = SpriteName;
    this.initialSize = null;
    // this.mSpriteMap = null;

    this.frames = [];
    this.mIntBound = null;
    this.boundary = "assets/Bound.png";
    this.dimensions = gEngine.ResourceMap.retrieveImageDimensions(this.kMinionSprite);
    this.drawFrames = false;
    this.initialize();
}

InteractiveBound.prototype.initialize = function() {
    // this.mSpriteMap = new SpriteRenderable(this.kMinionSprite);
    // this.mSpriteMap.getXform().setPosition(50,33);
    this.mIntBound = new SpriteRenderable(this.boundary);
    this.mIntBound.getXform().setPosition(50, 33);
    this.mIntBound.initialSize = this.dimensions[0] / 4;
    this.mIntBound.getXform().setSize(this.mIntBound.initialSize, this.mIntBound.initialSize);
    // this.mIntBound.setColor([1,1,1,1]);
};

InteractiveBound.prototype.update = function(){
    var deltaX = 1.5; var xform = this.mIntBound.getXform();
    var changeDetected = false;

    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space))
        deltaX = deltaX / 10;

    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        changeDetected = true;
        if(!(xform.getYPos() + xform.getHeight()/2 >= 33 + this.dimensions[1]/2))
            xform.setYPos(xform.getYPos() + deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        changeDetected = true;
        if(!(xform.getXPos() - xform.getWidth()/2 <= 50 - this.dimensions[0]/2))
            xform.setXPos(xform.getXPos() - deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S)){
        changeDetected = true;
        if(!(xform.getYPos() - xform.getHeight()/2 <= 33 - this.dimensions[1]/2))
            xform.setYPos(xform.getYPos() - deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D)){
        changeDetected = true;
        if(!(xform.getXPos() + xform.getWidth()/2 >= 50 + this.dimensions[0]/2))
            xform.setXPos(xform.getXPos() + deltaX);
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        changeDetected = true;
        if(xform.getWidth() - deltaX > 0)
            xform.setWidth(xform.getWidth() - deltaX);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        changeDetected = true;
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
            xform.setXPos(50 + this.dimensions[0]/2 - xform.getWidth() / 2);
        }
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        changeDetected = true;
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
        changeDetected = true;
        if(xform.getHeight() - deltaX > 0)
            xform.setHeight(xform.getHeight() - deltaX);
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
        this.drawFrames = !this.drawFrames;

    this.updateFrames();
    return changeDetected;


};

InteractiveBound.prototype.updateFrames = function(){
    this.frames = [];
    var currentObject = this.mIntBound;
    while(true) {
        if (currentObject.getXform().getXPos() + currentObject.getXform().getWidth() * 1.5 <= 50 + this.dimensions[0] / 2) {
            var obj = new SpriteRenderable(this.boundary);
            obj.getXform().setPosition(currentObject.getXform().getXPos() + currentObject.getXform().getWidth(), this.mIntBound.getXform().getPosition()[1]);
            obj.getXform().setSize(currentObject.getXform().getWidth(), currentObject.getXform().getHeight());
            obj.setColor([.6, .6, .6, 1]);
            this.frames.push(obj);
            currentObject = obj;
        }
        else
            break;
    }
};

InteractiveBound.prototype.draw = function(camera){
        this.mIntBound.draw(camera.getVPMatrix());

    if(this.drawFrames === true) {
        this.frames.forEach(function (entry) {
            entry.draw(camera.getVPMatrix());
        });
    }
};