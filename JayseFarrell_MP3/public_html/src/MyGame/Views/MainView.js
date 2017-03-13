/**
 * Created by Jayse on 1/23/2017.
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, MyGame: false, JSONSceneFileParser: false */
/* find out more about jslint: http://www.jslint.com/help.html */
function MainView(MinionSpriteMap, kFontCon16)
{
    this.mSqSet = [];        // these are the Renderable objects
    // The camera to view the scene
    this.mSpriteSource = this.mInteractiveBound = null;
    this.mCamera = null;
    this.kMinionSprite = MinionSpriteMap;
    this.statusMessage = null;
    this.kFontCon16 = kFontCon16;
    // this.kFontImage = "assets/Consolas-72.png";
    this.initialize();
}
gEngine.Core.inheritPrototype(MainView, Scene);

MainView.prototype.initialize = function()
{
    
    this.mCamera = new Camera(
        vec2.fromValues(50,33), //center
        1200,                    //width
        [220, 0, 440, 550]      //viewport
    );
    this.mCamera.setBackgroundColor([0.8, 0.4, 0, 1]);

    this.mSpriteSource = new SpriteSource(this.kMinionSprite, this.mCamera);
    this.mInteractiveBound = new InteractiveBound(this.kMinionSprite);
    this._setStatus();
};

MainView.prototype._setStatus = function() {
    this.statusMessage = new FontRenderable("Status: Bound Pos=(" +
        this.mInteractiveBound.mIntBound.getXform().getXPos().toPrecision(4) + ',' +
        this.mInteractiveBound.mIntBound.getXform().getYPos().toPrecision(4) + ') Size=(' +
        this.mInteractiveBound.mIntBound.getXform().getWidth().toPrecision(5) + ',' +
        this.mInteractiveBound.mIntBound.getXform().getHeight().toPrecision(4) + ')');
    this.statusMessage.setFont(this.kFontCon16);
    this._initText(this.statusMessage, 50 - (this.mCamera.getWCWidth()/ 2.1), 33 - (this.mCamera.getWCWidth()/1.7), [0, 0, 0, 1], this.mCamera.getWCWidth() / 32);
};

MainView.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

MainView.prototype.update = function(){
    if(this.mInteractiveBound !== null) {
        var test = this.mInteractiveBound.update();
        this._setStatus();
        return test;
    }
    else
        return false;
};

MainView.prototype.draw = function()
{
    // gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    this.mSpriteSource.draw(this.mCamera);
    this.mInteractiveBound.draw(this.mCamera);
    this.statusMessage.draw(this.mCamera.getVPMatrix());
};