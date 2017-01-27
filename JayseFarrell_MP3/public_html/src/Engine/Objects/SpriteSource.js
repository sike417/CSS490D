/**
 * Created by Jayse on 1/23/2017.
 */
function SpriteSource(SpriteName, camera) {
    this.kMinionSprite = SpriteName;
    this.mSpriteMap = null;
    this.border = null;
    this.initialize(camera);
}

SpriteSource.prototype.initialize = function(camera){
    this.mSpriteMap = new SpriteRenderable(this.kMinionSprite);
    this.mSpriteMap.getXform().setPosition(50,33);

    var dimensions = gEngine.ResourceMap.retrieveImageDimensions(this.kMinionSprite);
    this.mSpriteMap.getXform().setSize(dimensions[0], dimensions[1]);

    camera.setWCWidth(dimensions[0] * 1.2);

    this.border = [];
    this.borderBoxes = [];

    for(var i = 0; i < 4; i++)
        this.border.push(new Renderable(gEngine.DefaultResources.getConstColorShader()));
    for(i = 0; i < 4; i++)
        this.borderBoxes.push(new Renderable(gEngine.DefaultResources.getConstColorShader()));

    this.border[0].getXform().setPosition(this.mSpriteMap.getXform().getXPos(),
        this.mSpriteMap.getXform().getYPos() - dimensions[1]/2 - camera.getWCWidth() / 160);
    this.border[0].getXform().setSize(dimensions[0] + camera.getWCWidth() / 160 * 3, camera.getWCWidth() / 160);

    this.border[1].getXform().setPosition(this.mSpriteMap.getXform().getXPos(),
        this.mSpriteMap.getXform().getYPos() + dimensions[1]/2 + camera.getWCWidth() / 160);
    this.border[1].getXform().setSize(dimensions[0] + camera.getWCWidth() / 160 * 3, camera.getWCWidth() / 160);

    this.border[2].getXform().setPosition(this.mSpriteMap.getXform().getXPos() - dimensions[0]/2 - camera.getWCWidth() / 160, this.mSpriteMap.getXform().getYPos());
    this.border[2].getXform().setSize(camera.getWCWidth() / 160, dimensions[1] +  camera.getWCWidth() / 160 * 3);

    this.border[3].getXform().setPosition(this.mSpriteMap.getXform().getXPos() + dimensions[0]/2 + camera.getWCWidth() / 160, this.mSpriteMap.getXform().getYPos());
    this.border[3].getXform().setSize(camera.getWCWidth() / 160, dimensions[1] +  camera.getWCWidth() / 160 * 3);

    this.borderBoxes[0].getXform().setPosition(this.mSpriteMap.getXform().getXPos() + dimensions[0]/2, this.mSpriteMap.getXform().getYPos() + dimensions[1]/2);
    this.borderBoxes[0].getXform().setSize(camera.getWCWidth() / 20, camera.getWCWidth() / 20);

    this.borderBoxes[1].getXform().setPosition(this.mSpriteMap.getXform().getXPos() + dimensions[0]/2, this.mSpriteMap.getXform().getYPos() - dimensions[1]/2);
    this.borderBoxes[1].getXform().setSize(camera.getWCWidth() / 20, camera.getWCWidth() / 20);

    this.borderBoxes[2].getXform().setPosition(this.mSpriteMap.getXform().getXPos() - dimensions[0]/2, this.mSpriteMap.getXform().getYPos() - dimensions[1]/2);
    this.borderBoxes[2].getXform().setSize(camera.getWCWidth() / 20, camera.getWCWidth() / 20);

    this.borderBoxes[3].getXform().setPosition(this.mSpriteMap.getXform().getXPos() - dimensions[0]/2, this.mSpriteMap.getXform().getYPos() + dimensions[1]/2);
    this.borderBoxes[3].getXform().setSize(camera.getWCWidth() / 20, camera.getWCWidth() / 20);

    this.border.forEach(function(entry){
        entry.setColor([0,0,0,1]);
    });

    this.borderBoxes.forEach(function(entry){
        entry.setColor([Math.random(), Math.random(), Math.random(), 1]);
    });
};

SpriteSource.prototype.draw = function(camera) {
    this.border.forEach(function(entry){
        entry.draw(camera.getVPMatrix());
    });

    this.borderBoxes.forEach(function(entry){
        entry.draw(camera.getVPMatrix());
    });

    this.mSpriteMap.draw(camera.getVPMatrix());
};