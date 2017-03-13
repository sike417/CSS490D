/**
 * Created by Jayse on 1/23/2017.
 */
function AnimationView(InteractiveBoundRef, SpriteSourceRef, kMin){
    this.mInteractiveBound = InteractiveBoundRef; this.mSpriteSourceRef = SpriteSourceRef;
    this.mCamera = null;
    this.kMinionSprite = kMin;
    this.ConstantSize = 220;
    this.yPos = 480;

    this.mMinion = new SpriteAnimateRenderable(this.kMinionSprite);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(15, 25);
    this.mMinion.getXform().setSize(24, 24);

    this.initialize();
}

AnimationView.prototype.initialize = function(){
    var xform2 = this.mSpriteSourceRef.mSpriteMap.getXform();
    var xform = this.mInteractiveBound.mIntBound.getXform();

    //pixel position
    var quantityTop  = (xform.getYPos() + xform.getHeight() / 2) - (xform2.getYPos() - xform2.getHeight() / 2);
    var quantityLeft = (xform.getXPos() - xform.getWidth() / 2) - (xform2.getXPos() - xform2.getWidth() / 2) - xform.getWidth() * 2;

    var rightDistance = (xform2.getXPos() + xform2.getWidth() / 2) - (xform.getXPos() + xform.getWidth() / 2);

    this.mMinion.setSpriteSequenceUV(quantityTop / xform2.getHeight(), quantityLeft / xform2.getWidth()
        , xform.getWidth() / xform2.getWidth(), xform.getHeight() / xform2.getHeight()
        , Math.floor(rightDistance / xform.getWidth()), 0);
    this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mMinion.setAnimationSpeed(60);

    this.mCamera = new Camera(
        vec2.fromValues(15,25),
        24,
        [0,330,this.ConstantSize,this.ConstantSize]
    );

    this.mCamera.setBackgroundColor([.7,1,.7,1]);
    this.mMinion.updateAnimation();
};

AnimationView.prototype.update = function(changeDetected){
    // this.initialize();
    if(changeDetected) {
        var xform2 = this.mSpriteSourceRef.mSpriteMap.getXform();
        var xform = this.mInteractiveBound.mIntBound.getXform();

        //pixel position
        var quantityTop = (xform.getYPos() + xform.getHeight() / 2) - (xform2.getYPos() - xform2.getHeight() / 2);

        var quantityLeft = (xform.getXPos() - xform.getWidth() / 2) - (xform2.getXPos() - xform2.getWidth() / 2) - xform.getWidth() * 2;
        var rightDistance = (xform2.getXPos() + xform2.getWidth() / 2) - (xform.getXPos() + xform.getWidth() / 2);

        this.mMinion.setSpriteSequenceUV(quantityTop / xform2.getHeight(), quantityLeft / xform2.getWidth()
            , xform.getWidth() / xform2.getWidth(), xform.getHeight() / xform2.getHeight()
            , Math.floor(rightDistance / xform.getWidth()), 0);
        this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
        this.mMinion.setAnimationSpeed(60);

        this.mCamera = new Camera(
            vec2.fromValues(15, 25),
            24,
            [0, 330, this.ConstantSize, this.ConstantSize]
        );

        this.mCamera.setBackgroundColor([.7, 1, .7, 1]);
    }
    this.mMinion.updateAnimation();
};

AnimationView.prototype.draw = function()
{
    this.mCamera.setupViewProjection();
    this.mMinion.draw(this.mCamera.getVPMatrix());
    // this.mSpriteSourceRef.mSpriteMap.draw(this.mCamera.getVPMatrix());
};