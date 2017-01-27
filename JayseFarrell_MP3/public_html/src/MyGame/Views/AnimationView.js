/**
 * Created by Jayse on 1/23/2017.
 */
function AnimationView(InteractiveBoundRef, SpriteSourceRef){
    this.mInteractiveBound = InteractiveBoundRef; this.mSpriteSourceRef = SpriteSourceRef;
    this.mCamera = null;
    this.initialize();
}

AnimationView.prototype.initialize = function(){
    var xform = this.mInteractiveBound.mIntBound.getXform();
    this.mCamera = new Camera(
        vec2.fromValues(xform.getXPos(),xform.getYPos()),
        xform.getWidth() > xform.getHeight() ? xform.getWidth() : xform.getHeight(),
        [0,280,200,200]
    );
    this.mCamera.setBackgroundColor([.7,1,.7,1]);
};

AnimationView.prototype.update = function(){
    this.initialize();  
};

AnimationView.prototype.draw = function()
{
    this.mCamera.setupViewProjection();
    this.mSpriteSourceRef.mSpriteMap.draw(this.mCamera.getVPMatrix());
};