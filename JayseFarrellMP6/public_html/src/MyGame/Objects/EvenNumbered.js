/**
 * Created by Jayse on 2/23/2017.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function EvenNumbered(wcCenter, mainWidth, mainHeight) {
    this.mainX = wcCenter[0];
    this.mainY = wcCenter[1];
    this.mainWidth = mainWidth;
    this.mainHeight = mainHeight;
    
    var renderable = new Renderable();
    GameObject.call(this, renderable);
    this.initialize();
    // this.setPhysicsComponent(mRigidCircle);
}
gEngine.Core.inheritPrototype(EvenNumbered, GameObject);

EvenNumbered.prototype.initialize = function(){
    var minX = this.mainX - this.mainWidth / 2;
    var maxX = this.mainX + this.mainWidth / 2;
    var minY = this.mainY - this.mainHeight / 2;
    var maxY = this.mainY + this.mainHeight / 2;
    
    var xform = this.getXform();
    xform.setHeight(this.mainWidth / 10 + (this.mainWidth / 5) * Math.random());
    xform.setWidth(this.mainWidth / 10 + (this.mainWidth / 5) * Math.random());
    xform.setPosition((minX + xform.getWidth()) + (maxX - minX - xform.getWidth() * 2) * Math.random()
        , (minY + xform.getHeight()) + (maxY - minY - xform.getHeight() * 2) * Math.random());

    var mRigidRectangle = new RigidRectangle(xform, xform.getWidth(), xform.getHeight());
    this.setRigidBody(mRigidRectangle);
};