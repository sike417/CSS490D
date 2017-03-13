/**
 * Created by Jayse on 3/5/2017.
 */

function Stationary(texture, position, rotationInDegree, size) {
    this.mRenderable = null;
    this.texture = texture;

    this.mRenderable = new TextureRenderable(this.texture);
    this.mRenderable.setColor([1, 1, 1, 0]);
    this.mRenderable.getXform().setPosition(position[0], position[1]);
    size === undefined ? this.mRenderable.getXform().setSize(20, 2) : this.mRenderable.getXform().setSize(size[0], size[1]);
    this.mRenderable.getXform().setRotationInDegree(rotationInDegree);

    GameObject.call(this, this.mRenderable);
    var mRigidRectangle = new RigidRectangle(this.mRenderable.getXform(),
        this.mRenderable.getXform().getWidth(), this.mRenderable.getXform().getHeight());
    mRigidRectangle.setDrawBoundCircle(false);
    mRigidRectangle.setDrawMode(RigidRectangle.drawModes.drawBoundingBox);
    mRigidRectangle.setMass(0);
    this.setRigidBody(mRigidRectangle);
}
gEngine.Core.inheritPrototype(Stationary, GameObject);
