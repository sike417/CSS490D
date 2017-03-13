/*
 * File: EngineCore_VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 * 
 * Notice, this is a singleton object.
 */

/*jslint node: true, vars: true */
/*global Float32Array */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

// The VertexBuffer object
gEngine.VertexBuffer = (function () {
    // reference to the vertex positions for the square in the gl context
    var mSquareVertexBuffer = null;
    var mCircleVertexBuffer = null;

    var mCircleVertices= [];
    var hypotenuse = .5;
    // reference to the texture positions for the square vertices in the gl context
    var mTextureCoordBuffer = null;

    // First: define the vertices for a square
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    // Second: define the corresponding texture coordinates
    var textureCoordinates = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];
    // this is to support the debugging of physics engine
    var verticesOfLine = [
        0.5, 0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    // reference to the texture positions for the square vertices in the gl context
    var mLineVertexBuffer = null;

    var initialize = function () {
        var gl = gEngine.Core.getGL();

        // <editor-fold desc="Step A: Allocate and store vertex positions into the webGL context">
        // Create a buffer on the gGL context for our vertex positions
        mSquareVertexBuffer = gl.createBuffer();

        // Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);

        // Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);
        //<editor-fold>

        // <editor-fold desc="Step  B: Allocate and store texture coordinates">
        // Create a buffer on the gGL context for our vertex positions
        mTextureCoordBuffer = gl.createBuffer();

        // Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, mTextureCoordBuffer);

        // Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        // </editor-fold>

        // <editor-fold desc="Step A: Allocate and store vertex positions into the webGL context">
        // Create a buffer on the gGL context for our vertex positions
        mLineVertexBuffer = gl.createBuffer();
        // Connect the vertexBuffer to the ARRAY_BUFFER global gl binding point.
        gl.bindBuffer(gl.ARRAY_BUFFER, mLineVertexBuffer);
        // Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfLine), gl.STATIC_DRAW);

        calculateVertices();
        gl.bindBuffer(gl.ARRAY_BUFFER, mCircleVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mCircleVertices), gl.STATIC_DRAW);
        //<editor-fold>
    };

    var calculateVertices = function () {
        //mCircleVertices
        for(var i = 0; i < 360; i += 6)
        {
            mCircleVertices.push(Math.cos(toRadians(i)) * hypotenuse);
            mCircleVertices.push(Math.sin(toRadians(i)) * hypotenuse);
            mCircleVertices.push(0);
        }
    };

    var toRadians = function(angle) {        return angle * (Math.PI / 180);};

    var getGLVertexRef = function () { return mSquareVertexBuffer; };
    var getGLCircleVertexRef = function() { return mCircleVertexBuffer};
    var getGLTexCoordRef = function () { return mTextureCoordBuffer; };
    var getGLLineVertexRef = function () { return mLineVertexBuffer; };

    var cleanUp = function () {
        var gl = gEngine.Core.getGL();
        gl.deleteBuffer(mSquareVertexBuffer);
        gl.deleteBuffer(mCircleVertexBuffer);
        gl.deleteBuffer(mTextureCoordBuffer);
        gl.deleteBuffer(mLineVertexBuffer);
    };

    var mPublic = {
        initialize: initialize,
        getGLVertexRef: getGLVertexRef,
        getGLTexCoordRef: getGLTexCoordRef,
        getGLLineVertexRef: getGLLineVertexRef,
        getGLCircleVertexRef: getGLCircleVertexRef,
        cleanUp: cleanUp
    };

    return mPublic;
}());