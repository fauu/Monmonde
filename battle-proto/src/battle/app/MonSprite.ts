/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AnimatedSprite, Filter, Program, Texture } from "pixi.js";

const shadowFragmentProgram = `
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform vec2 shadowDirection;
uniform float floorY;

void main(void) {
    // 1. Get the screen coordinate
    vec2 screenCoord = vTextureCoord * inputSize.xy + outputFrame.xy;
    // 2. Calculate Y shift of our dimension vector
    vec2 shadow;
    // Shadow coordinate system is a bit skewed, but it has to be the same for screenCoord.y = floorY
    float paramY = (screenCoord.y - floorY) / shadowDirection.y;
    shadow.y = paramY + floorY;
    shadow.x = screenCoord.x + paramY * shadowDirection.x;
    vec2 bodyFilterCoord = (shadow - outputFrame.xy) * inputSize.zw; // same as / inputSize.xy

    vec4 originalColor = texture2D(uSampler, vTextureCoord);
    vec4 shadowColor = texture2D(uSampler, bodyFilterCoord);
    shadowColor.rgb = vec3(0.0);
    shadowColor.a *= 0.3;

    // Normal blend mode coefficients (1, 1-src_alpha)
    // Shadow is destination (backdrop), original is source
    gl_FragColor = originalColor + shadowColor * (1.0 - originalColor.a);
}
`;

export interface MonSpriteShadowParams {
  direction: [number, number];
  floorY: number;
  padding: number;
}

export class MonSprite extends AnimatedSprite {
  constructor(animation: Texture[], shadowParams: MonSpriteShadowParams) {
    super(animation);
    this.init(shadowParams);
  }

  private init(shadowParams: MonSpriteShadowParams) {
    this.animationSpeed = 0.5;

    const shadow = new Filter(Program.defaultVertexSrc, shadowFragmentProgram);
    shadow.uniforms.shadowDirection = shadowParams.direction;
    shadow.uniforms.floorY = shadowParams.floorY;
    shadow.padding = shadowParams.padding;
    // this.filters = [shadow];
  }
}
