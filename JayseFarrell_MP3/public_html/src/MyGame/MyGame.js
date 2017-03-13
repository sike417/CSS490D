/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, SpriteRenderable: false, Camera: false, vec2: false,
  TextureRenderable: false, Renderable: false, SpriteAnimateRenderable: false, GameOver: false,
  FontRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    // textures: 
    this.kFontImage = "assets/Consolas-72.png";
    this.kMinionSprite = "assets/minion_sprite.png";
    this.boundary = "assets/Bound.png";
    // this.kMinionSprite = this.kFontImage;

    // the fonts
    this.kFontCon16 = "assets/fonts/Consolas-16";  // notice font names do not need extensions!
    this.kFontCon24 = "assets/fonts/Consolas-24";
    this.kFontCon32 = "assets/fonts/Consolas-32";  // this is also the default system font
    this.kFontCon72 = "assets/fonts/Consolas-72";
    this.kFontSeg96 = "assets/fonts/Segment7-96";

    // The camera to view the scene
    this.mCamera = null;
    this.mMainView = null;
    this.mZoomedView = null;
    this.mAnimationView = null;

    // the hero and the support objects
    this.mHero = null;
    this.mFontImage = null;
    this.mMinion = null;

    this.mTextSysFont = null;
    this.mTextCon16 = null;
    this.mTextCon24 = null;
    this.mTextCon32 = null;
    this.mTextCon72 = null;
    this.mTextSeg96 = null;

    this.mTextToWork = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () 
{
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.boundary);
    // Step A: loads the textures    
    // gEngine.Textures.loadTexture(this.kFontImage);
    // gEngine.Textures.loadTexture(this.kMinionSprite);

    // Step B: loads all the fonts
    gEngine.Fonts.loadFont(this.kFontCon32);
    // gEngine.Fonts.loadFont(this.kFontCon24);
    // gEngine.Fonts.loadFont(this.kFontCon32);
    // gEngine.Fonts.loadFont(this.kFontCon72);
    // gEngine.Fonts.loadFont(this.kFontSeg96);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.boundary);
    // gEngine.Textures.unloadTexture(this.kFontImage);
    // gEngine.Textures.unloadTexture(this.kMinionSprite);

    // unload the fonts
    gEngine.Fonts.unloadFont(this.kFontCon32);
    // gEngine.Fonts.unloadFont(this.kFontCon24);
    // gEngine.Fonts.unloadFont(this.kFontCon32);
    // gEngine.Fonts.unloadFont(this.kFontCon72);
    // gEngine.Fonts.unloadFont(this.kFontSeg96);

    // Step B: starts the next level
    var nextLevel = new GameOver();  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

MyGame.prototype.initialize = function ()
{
    this.mMainView = new MainView(this.kMinionSprite, this.kFontCon32);
    this.mZoomedView = new ZoomedBound(this.mMainView.mInteractiveBound, this.mMainView.mSpriteSource);
    this.mAnimationView = new AnimationView(this.mMainView.mInteractiveBound, this.mMainView.mSpriteSource, this.kMinionSprite);
};

MyGame.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () 
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([1, 0.7, 0, .2]); // clear to light gray
    this.mMainView.draw();
    this.mZoomedView.draw();
    this.mAnimationView.draw();
};

// The 
//  function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    if(this.mMainView !== null)
        var changeDetected = this.mMainView.update();
    if(this.mZoomedView !== null)
        this.mZoomedView.update();
    if(this.mAnimationView !== null)
        this.mAnimationView.update(changeDetected);
};