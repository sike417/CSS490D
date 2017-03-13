/**
 * Created by Jayse on 2/23/2017.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function OddNumbered(wcCenter, mainWidth, mainHeight) {
    this.mainX = wcCenter[0];
    this.mainY = wcCenter[1];
    this.mainWidth = mainWidth;
    this.mainHeight = mainHeight;

    var renderable = new Renderable();
    GameObject.call(this, renderable);
    this.initialize();
}
gEngine.Core.inheritPrototype(OddNumbered, GameObject);

OddNumbered.prototype.initialize = function(){
    var minX = this.mainX - this.mainWidth / 2;
    var maxX = this.mainX + this.mainWidth / 2;
    var minY = this.mainY - this.mainHeight / 2;
    var maxY = this.mainY + this.mainHeight / 2;

    var xform = this.getXform();
    xform.setHeight(this.mainWidth / 10 + (this.mainWidth / 7) * Math.random());
    xform.setWidth(xform.getHeight());
    xform.setPosition((minX + xform.getWidth()) + (maxX - minX - xform.getWidth() * 2) * Math.random()
        , (minY + xform.getHeight()) + (maxY - minY - xform.getHeight() * 2) * Math.random());

    var mRigidCircle = new RigidCircle(xform, xform.getHeight());
    this.setRigidBody(mRigidCircle);
};