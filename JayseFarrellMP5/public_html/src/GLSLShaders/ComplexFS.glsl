// this is the fragment (or pixel) shader that
// outputs constant red color for every pixel rendered.

   precision mediump float;

    varying vec4 pos;

    uniform vec2 middle;
    uniform float r;
    uniform vec4 uPixelColor;

    void main() {
           float factor = r * .2;
        float inside = pow(pos.r - middle.r, 2.0) + pow(pos.g - middle.g, 2.0);
        if (inside < pow(r, 2.0) && inside > pow(r, 2.1)) {
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        }
        else {
                if((abs(pos.r - middle.r) < .005 && abs(pos.g - middle.g) < factor)
                || (abs(pos.g - middle.g) < .005 && abs(pos.r - middle.r) < factor))
                    gl_FragColor = uPixelColor;
                else{

                    gl_FragColor = vec4(0.0, 1.0, 0.0, 0.0);
                }
        }
}