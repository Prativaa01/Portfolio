"use client";

import { useEffect, useRef, useState } from "react";

export type LiquidMotionState = {
  active: number;
  speed: number;
  mouseX: number;
  mouseY: number;
  clientX: number;
  clientY: number;
  velX: number;
  velY: number;
};

/**
 * Ultra-Sleek, Buttery Smooth Liquid Metal WebGL Shader.
 *
 * Smoothness Enhancements:
 * - Continuous exponential decay for motion energy: eliminates abrupt on/off threshold steps.
 * - Center-damped wave ripples: keeps the cursor contact point calm, silky, and glassy.
 * - Anti-aliased studio reflection ribbons with soft falloff: zero harsh edges or moiré.
 * - 8-bit photographic dither: eliminates color banding in dark gradients for velvety transitions into black.
 * - Compact, precious radius: gathers tightly under the cursor.
 */

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_mouse_vel;
uniform float u_mouse_speed;
uniform float u_mouse_active;
uniform float u_reduced_motion;

// 2D Simplex Noise for silky fluid currents
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
         + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Buttery smooth studio reflection bands
float getLiquidMetalBand(float stripe_p, float blur) {
  float w0 = 0.22;
  float w1 = 0.16;
  float b2 = max(blur * 2.2, 0.008);

  // Band 1: Leading polished highlight ribbon
  float ch = smoothstep(0.0, b2, stripe_p);
  ch = mix(ch, 0.0, smoothstep(w0, w0 + b2, stripe_p));

  // Band 2: Secondary specular ribbon
  ch = mix(ch, 1.0, smoothstep(w0 + 0.04, w0 + 0.04 + b2, stripe_p));
  ch = mix(ch, 0.0, smoothstep(w0 + w1, w0 + w1 + b2, stripe_p));

  // Band 3: Soft ambient roll-off
  float grad = smoothstep(w0 + w1, 1.0, stripe_p);
  ch = mix(ch, grad * 0.20, smoothstep(w0 + w1, w0 + w1 + 0.10, stripe_p));

  return ch;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;

  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);
  vec2 vel = u_mouse_vel * vec2(aspect, 1.0);

  float d = length(p - m);

  // Smooth, focused interaction radius
  float radius = 0.21 + 0.06 * u_mouse_speed;

  // Immediate discard beyond interactive radius or when idle
  if (u_mouse_active <= 0.0003 || d > radius * 1.25) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  // Smooth cubic falloff for seamless blending into darkness
  float tFalloff = clamp(1.0 - d / radius, 0.0, 1.0);
  float falloff = tFalloff * tFalloff * (3.0 - 2.0 * tFalloff) * u_mouse_active;
  if (falloff <= 0.0008) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  float t = u_time * (u_reduced_motion > 0.5 ? 0.02 : 0.13);

  // Heavy viscous fluid drag with smooth falloff
  vec2 fluidDrag = vel * exp(-d * 5.5) * 0.32 * smoothstep(0.0, 1.0, u_mouse_active);
  vec2 warpedP = p - fluidDrag;

  // Silky, gentle fluid curl
  vec2 flow = vec2(
    snoise(warpedP * 1.6 + vec2(t * 0.18, t * 0.12)),
    snoise(warpedP * 1.6 + vec2(-t * 0.14, t * 0.16) + vec2(4.1, 2.3))
  );

  // Viscous fluid surface folds
  vec2 fluidUV = warpedP + flow * (0.05 + 0.07 * falloff);

  // Gentle wave ripple with center damping to keep pointer center glassy and steady
  float centerDamp = smoothstep(0.015, 0.08, d);
  float wave = sin(d * 22.0 - u_time * 4.2) * centerDamp * exp(-d * 5.2) * (0.02 + 0.05 * u_mouse_speed) * u_mouse_active;

  // Studio light direction: diagonal liquid chrome flow
  float diagonal = (fluidUV.x * 0.86 + fluidUV.y * 0.50);
  float stripeBase = diagonal * 3.0 - t * 0.24 + wave * 1.6;

  // Tasteful sub-pixel chromatic dispersion (crisp, expensive, zero carnival colors)
  float disp = (0.011 + 0.007 * u_mouse_speed) * (0.7 + 0.3 * falloff);
  float blur = 0.022 + 0.016 * (1.0 - falloff);

  float stripe_r = fract(stripeBase + disp);
  float stripe_g = fract(stripeBase);
  float stripe_b = fract(stripeBase - disp);

  float band_r = getLiquidMetalBand(stripe_r, blur);
  float band_g = getLiquidMetalBand(stripe_g, blur);
  float band_b = getLiquidMetalBand(stripe_b, blur);

  // Luxury Liquid Metal Palette:
  // Smoked Obsidian Titanium -> Polished Mercury -> Brilliant Platinum Glint
  vec3 colDeepObsidian = vec3(0.02, 0.025, 0.035);
  vec3 colSmokedChrome = vec3(0.22, 0.24, 0.28);
  vec3 colMercury      = vec3(0.76, 0.80, 0.86);
  vec3 colPlatinum     = vec3(0.98, 0.99, 1.00);

  // Per-channel chrome reflection with sub-pixel dispersion
  vec3 chrome;
  chrome.r = mix(colDeepObsidian.r, mix(colSmokedChrome.r, colMercury.r, band_r), band_r);
  chrome.g = mix(colDeepObsidian.g, mix(colSmokedChrome.g, colMercury.g, band_g), band_g);
  chrome.b = mix(colDeepObsidian.b, mix(colSmokedChrome.b, colMercury.b, band_b), band_b);

  // Razor-sharp specular glint on the reflection apex
  float glint = pow(band_g, 12.0) * 0.45;
  chrome += colPlatinum * glint;

  // Subtle hint of cool champagne / pale lilac reflection at glancing angles
  float glancing = pow(clamp(d / radius, 0.0, 1.0), 2.2);
  vec3 subtleSheen = vec3(0.04, 0.035, 0.06) * glancing;
  chrome += subtleSheen;

  // Dissolve gracefully into pitch black
  vec3 finalColor = chrome * falloff;

  // Micro-dither to eliminate 8-bit gradient banding in dark transitions
  float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  finalColor += vec3(dither);

  gl_FragColor = vec4(max(vec3(0.0), finalColor), 1.0);
}
`;

export function LiquidChrome({
  className = "",
  onMotionUpdate,
}: {
  className?: string;
  onMotionUpdate?: (state: LiquidMotionState) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  const onMotionUpdateRef = useRef(onMotionUpdate);
  onMotionUpdateRef.current = onMotionUpdate;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = mediaQuery.matches;

    const onMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", onMotionChange);

    // Initialize WebGL context
    const gl =
      canvas.getContext("webgl", {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        powerPreference: "high-performance",
      }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      console.warn("WebGL not supported; liquid chrome background disabled.");
      return;
    }

    // Compile shader helper
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full screen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uMouseVel = gl.getUniformLocation(program, "u_mouse_vel");
    const uMouseSpeed = gl.getUniformLocation(program, "u_mouse_speed");
    const uMouseActive = gl.getUniformLocation(program, "u_mouse_active");
    const uReducedMotion = gl.getUniformLocation(program, "u_reduced_motion");

    // Interaction state with physical smoothing
    const targetMouse = { x: 0.5, y: 0.5 };
    const currentMouse = { x: 0.5, y: 0.5 };
    const prevMouse = { x: 0.5, y: 0.5 };
    const currentVel = { x: 0.0, y: 0.0 };
    let currentSpeed = 0.0;
    let currentActive = 0.0;

    let lastMoveTime = 0;
    let lastClientX = 0;
    let lastClientY = 0;
    let isPointerInside = false;

    let width = 0;
    let height = 0;
    let cachedRect: DOMRect | null = null;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      cachedRect = rect;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Translate window coordinates into canvas UV
    const handlePointerCoord = (clientX: number, clientY: number) => {
      lastClientX = clientX;
      lastClientY = clientY;
      lastMoveTime = performance.now();

      const rect = cachedRect || canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const normX = (clientX - rect.left) / rect.width;
      const normY = 1.0 - (clientY - rect.top) / rect.height;

      if (normX >= -0.05 && normX <= 1.05 && normY >= -0.05 && normY <= 1.05) {
        targetMouse.x = Math.max(0.0, Math.min(1.0, normX));
        targetMouse.y = Math.max(0.0, Math.min(1.0, normY));
        isPointerInside = true;
      } else {
        isPointerInside = false;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      handlePointerCoord(e.clientX, e.clientY);
    };

    const onPointerLeave = () => {
      isPointerInside = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerCoord(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerCoord(e.touches[0].clientX, e.touches[0].clientY);
        currentMouse.x = targetMouse.x;
        currentMouse.y = targetMouse.y;
      }
    };

    const onTouchEnd = () => {
      isPointerInside = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    const onScrollUpdate = () => {
      cachedRect = canvas.getBoundingClientRect();
    };
    window.addEventListener("scroll", onScrollUpdate, { passive: true, capture: true });

    // Render loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let isTabVisible = !document.hidden;

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const startTime = performance.now();
    setIsReady(true);

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isTabVisible) return;

      const rect = cachedRect || canvas.getBoundingClientRect();
      if (rect.right < 0 || rect.left > window.innerWidth) {
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsedTime = (now - startTime) / 1000;

      // Silky, heavy exponential smoothing for cursor position
      const posLerp = 1.0 - Math.exp(-14.0 * dt);
      currentMouse.x += (targetMouse.x - currentMouse.x) * posLerp;
      currentMouse.y += (targetMouse.y - currentMouse.y) * posLerp;

      const rawVelX = (currentMouse.x - prevMouse.x) / Math.max(dt, 0.001);
      const rawVelY = (currentMouse.y - prevMouse.y) / Math.max(dt, 0.001);
      prevMouse.x = currentMouse.x;
      prevMouse.y = currentMouse.y;

      const velLerp = 1.0 - Math.exp(-8.0 * dt);
      currentVel.x += (rawVelX * 0.02 - currentVel.x) * velLerp;
      currentVel.y += (rawVelY * 0.02 - currentVel.y) * velLerp;

      const instantSpeed = Math.hypot(rawVelX, rawVelY);
      const speedLerp = 1.0 - Math.exp(-6.0 * dt);
      currentSpeed += (Math.min(instantSpeed * 0.3, 1.0) - currentSpeed) * speedLerp;

      // CONTINUOUS movement energy decay: no abrupt threshold cliffs!
      const timeSinceMove = now - lastMoveTime;
      // Smooth decay factor that naturally glides towards 0 after user pauses
      const timeFactor = Math.exp(-Math.max(0, timeSinceMove - 60) / 180);
      const speedFactor = Math.min(1.0, currentSpeed * 2.8);
      const targetActive = isPointerInside ? speedFactor * timeFactor : 0.0;

      // Smooth, luxurious easing into pitch black
      const activeRate = targetActive > currentActive ? 12.0 : 3.8;
      const activeLerp = 1.0 - Math.exp(-activeRate * dt);
      currentActive += (targetActive - currentActive) * activeLerp;
      if (currentActive < 0.0005) currentActive = 0.0;

      // Notify synchronized text interaction observer
      if (onMotionUpdateRef.current) {
        onMotionUpdateRef.current({
          active: currentActive,
          speed: currentSpeed,
          mouseX: currentMouse.x,
          mouseY: currentMouse.y,
          clientX: lastClientX,
          clientY: lastClientY,
          velX: currentVel.x,
          velY: currentVel.y,
        });
      }

      // Update shader uniforms
      gl.uniform2f(uResolution, width, height);
      gl.uniform1f(uTime, elapsedTime);
      gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);
      gl.uniform2f(uMouseVel, currentVel.x, currentVel.y);
      gl.uniform1f(uMouseSpeed, currentSpeed);
      gl.uniform1f(uMouseActive, currentActive);
      gl.uniform1f(uReducedMotion, isReducedMotion ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      mediaQuery.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onScrollUpdate, { capture: true });
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (vertShader) gl.deleteShader(vertShader);
      if (fragShader) gl.deleteShader(fragShader);
      if (program) gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 h-full w-full transition-opacity duration-700 ease-out ${
        isReady ? "opacity-100" : "opacity-0"
      } ${className}`}
      aria-hidden="true"
    />
  );
}
