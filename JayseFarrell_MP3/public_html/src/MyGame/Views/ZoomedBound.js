/**
 * Created by Jayse on 1/23/2017.
 */
function ZoomedBound(InteractiveBoundRef, SpriteSourceRef) {
    this.mInteractiveBound = InteractiveBoundRef; this.mSpriteSourceRef = SpriteSourceRef;
    this.mCameraTop = this.mCameraBottom = this.mCameraRight = this.mCameraLeft = null;
    this.initialize();
}

ZoomedBound.prototype.initialize = function()
{
    var xform = this.mInteractiveBound.mIntBound.getXform();
    this.mCameraTop = new Camera(
        vec2.fromValues(xform.getXPos(), xform.getYPos() + xform.getHeight() / 2),
        xform.getWidth() / 2,
        [45, 180, 90, 90]
    );
    this.mCameraLeft = new Camera(
        vec2.fromValues(xform.getXPos() + xform.getWidth() / 2, xform.getYPos()),
        xform.getWidth() / 2,
        [90, 90, 90, 90]
    );
    this.mCameraRight = new Camera(
        vec2.fromValues(xform.getXPos() - xform.getWidth() / 2, xform.getYPos()),
        xform.getWidth() / 2,
        [0, 90, 90, 90]
    );
    this.mCameraBottom = new Camera(
        vec2.fromValues(xform.getXPos(), xform.getYPos() - xform.getHeight() / 2),
        xform.getWidth() / 2,
        [45, 0, 90, 90]
    );
};

ZoomedBound.prototype.update = function()
{
    this.initialize();
};

ZoomedBound.prototype.draw = function()
{
    this.mCameraTop.setupViewProjection();
    this.mSpriteSourceRef.mSpriteMap.draw(this.mCameraTop.getVPMatrix());
    this.mInteractiveBound.mIntBound.draw(this.mCameraTop.getVPMatrix());

    this.mCameraRight.setupViewProjection();
    this.mSpriteSourceRef.mSpriteMap.draw(this.mCameraRight.getVPMatrix());
    this.mInteractiveBound.mIntBound.draw(this.mCameraRight.getVPMatrix());

    this.mCameraLeft.setupViewProjection();
    this.mSpriteSourceRef.mSpriteMap.draw(this.mCameraLeft.getVPMatrix());
    this.mInteractiveBound.mIntBound.draw(this.mCameraLeft.getVPMatrix());

    this.mCameraBottom.setupViewProjection();
    this.mSpriteSourceRef.mSpriteMap.draw(this.mCameraBottom.getVPMatrix());
    this.mInteractiveBound.mIntBound.draw(this.mCameraBottom.getVPMatrix());
};