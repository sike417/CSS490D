/**
 * Created by Jayse on 1/23/2017.
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, MyGame: false, JSONSceneFileParser: false */
/* find out more about jslint: http://www.jslint.com/help.html */
function MainView(MinionSpriteMap)
{
    this.mSqSet = [];        // these are the Renderable objects
    // The camera to view the scene
    this.mSpriteSource = this.mInteractiveBound = null;
    this.mCamera = null;
    this.kMinionSprite = MinionSpriteMap;
    // this.kFontImage = "assets/Consolas-72.png";
    this.initialize();
}
gEngine.Core.inheritPrototype(MainView, Scene);

MainView.prototype.initialize = function()
{
    
    this.mCamera = new Camera(
        vec2.fromValues(50,33), //center
        1200,                    //width
        [200, 0, 440, 480]      //viewport
    );
    this.mCamera.setBackgroundColor([0.8, 0.4, 0, 1]);

    this.mSpriteSource = new SpriteSource(this.kMinionSprite, this.mCamera);
    this.mInteractiveBound = new InteractiveBound(this.kMinionSprite);
};

MainView.prototype.update = function(){
    if(this.mInteractiveBound !== null)
        this.mInteractiveBound.update();
};

MainView.prototype.draw = function()
{
    // gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    this.mSpriteSource.draw(this.mCamera);
    this.mInteractiveBound.draw(this.mCamera);
};