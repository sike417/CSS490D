/**
 * Created by Jayse on 3/7/2017.
 */

function RigidBodies(sprite, target) {
    this.sprite = sprite;
    this.target = target;

    var height = Math.random() * 5 + 4; var width = Math.random() * 5 + 5;
    var xPos = Math.random() * (90 - width) + (5 + width / 2);
    var yPos = Math.random() * (15 - height / 2) + 55;
    
    this.showTarget = false;
    this.targetRenderable = null;
    this.spriteRenderable = null;

    this.targetRenderable = new TextureRenderable(this.target);
    this.targetRenderable.getXform().setPosition(xPos, yPos);
    this.targetRenderable.getXform().setSize(width, height);

    this.spriteRenderable = new SpriteAnimateRenderable(this.sprite);
    this.spriteRenderable.setColor([1, 1, 1, 0]);
    this.spriteRenderable.getXform().setPosition(xPos, yPos);
    this.spriteRenderable.getXform().setSize(width, height);
    this.spriteRenderable.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
        204, 164,   // widthxheight in pixels
        5,          // number of elements in this sequence
        0);         // horizontal padding in between
    this.spriteRenderable.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.spriteRenderable.setAnimationSpeed(30);



    GameObject.call(this, this.spriteRenderable);
    // GameObject.prototype.setMDrawRenderable.call(this, true);
}
gEngine.Core.inheritPrototype(RigidBodies, GameObject);

RigidBodies.prototype.swapTexture = function(){
    this.showTarget = !this.showTarget;
    this.toggleSecondaryDrawRenderable();
    if(this.showTarget)
    {
        this.setRenderable(this.targetRenderable);
        this.targetRenderable.getXform().setPosition(this.spriteRenderable.getXform().getPosition()[0], this.spriteRenderable.getXform().getPosition()[1]);
    } else{
        this.setRenderable(this.spriteRenderable);
        this.spriteRenderable.getXform().setPosition(this.targetRenderable.getXform().getPosition()[0], this.targetRenderable.getXform().getPosition()[1]);
    }
    var test = this.getRigidBody();
    test.setXform(this.getXform());
};

RigidBodies.prototype.draw = function(mCamera){
    GameObject.prototype.draw.call(this, mCamera);
};