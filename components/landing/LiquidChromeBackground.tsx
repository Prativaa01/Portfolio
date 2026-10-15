"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

varying vec2 vUv;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform float uEnergy;
uniform vec4 uTrail[8];
uniform float uAspect;
uniform float uReveal;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(17.3, 9.1);
    a *= 0.5;
  }
  return v;
}

vec2 warpDomain(vec2 ac) {
  vec2 p = ac * 1.35;
  vec2 push = vec2(0.0);

  vec2 mPos = vec2(uMouse.x * uAspect, uMouse.y);
  vec2 dm = ac - mPos;
  float d2 = dot(dm, dm);
  float rad = 0.9;
  float eAmt = clamp(uEnergy * 1.5, 0.0, 1.0);
  float infl = exp(-d2 / (rad * rad)) * (0.35 + 0.65 * eAmt);
  vec2 dir = dm / (sqrt(d2) + 0.0001);
  vec2 perp = vec2(-dir.y, dir.x);
  float spd = clamp(length(uVel) * 3.0, 0.0, 1.5);
  push += dir * (-infl * 0.35);
  push += perp * (infl * (0.25 + spd * 0.6));
  float vlen = length(uVel);
  if (vlen > 0.0001) {
    vec2 vdir = uVel / vlen;
    float along = dot(dm, vdir);
    push += vdir * (along * infl * clamp(vlen * 2.0, 0.0, 1.0) * 0.5);
  }

  for (int i = 0; i < 8; i++) {
    vec4 tr = uTrail[i];
    float m = step(0.003, tr.z);
    vec2 tp = vec2(tr.x * uAspect, tr.y);
    vec2 d = ac - tp;
    float dd = dot(d, d);
    float inf = exp(-dd / (0.55 * 0.55)) * tr.z * m;
    vec2 dd2 = d / (sqrt(dd) + 0.0001);
    vec2 pp = vec2(-dd2.y, dd2.x);
    push += (dd2 * -0.18 + pp * 0.30) * inf;
  }

  return p + push * 2.2;
}

float liquidH(vec2 ac) {
  float t = uTime;
  vec2 p = warpDomain(ac);
  vec2 q = vec2(
    fbm(p + vec2(0.0, t * 0.18)),
    fbm(p + vec2(5.2, 1.3) - vec2(t * 0.14, 0.0))
  );
  vec2 r = vec2(
    fbm(p + 2.1 * q + vec2(1.7, 9.2) + vec2(0.12 * t, 0.05 * t)),
    fbm(p + 2.2 * q + vec2(8.3, 2.8) - vec2(0.10 * t, 0.07 * t))
  );
  float h = fbm(p + 2.4 * r);

  float dent = 0.0;
  float rings = 0.0;
  vec2 mPos = vec2(uMouse.x * uAspect, uMouse.y);
  vec2 dm = ac - mPos;
  float dist = length(dm);
  float rad = 0.9;
  float infl = exp(-dist * dist / (rad * rad));
  float e = clamp(uEnergy, 0.0, 1.0);
  dent = -infl * (0.18 + 0.30 * e);
  rings += sin(dist * 26.0 - uTime * 6.0) * infl * (0.06 + 0.16 * e) * exp(-dist * 2.2);
  rings += sin(dm.x * 24.0 + dm.y * 20.0 + uTime * 3.0) * infl * 0.03;

  for (int i = 0; i < 8; i++) {
    vec4 tr = uTrail[i];
    float m = step(0.003, tr.z);
    vec2 tp = vec2(tr.x * uAspect, tr.y);
    vec2 d = ac - tp;
    float dd = length(d);
    float inf = exp(-dd * dd / (0.55 * 0.55)) * tr.z * m;
    rings += sin(dd * 30.0 - uTime * 7.0) * inf * 0.10 * exp(-dd * 2.0);
    dent += -inf * 0.08;
  }

  float breathe = sin(uTime * 0.6 + ac.x * 1.2 + ac.y * 0.8) * 0.015;
  return h * 0.85 + dent + rings + breathe;
}

float sq(float x) { return x * x; }

vec3 studioEnv(vec3 R) {
  float y = R.y;
  float x = R.x;
  float horizon = exp(-sq((y - 0.05) * 2.0));
  float topGlow = exp(-sq((y - 0.75) * 2.4)) * 0.5;
  float botGlow = exp(-sq((y + 0.8) * 3.0)) * 0.25;
  float s1 = exp(-sq((x * 1.4 + y * 0.9 - 0.25) * 2.6));
  float s2 = exp(-sq((x * 1.1 - y * 1.2 + 0.45) * 3.2));
  float s3 = exp(-sq((y * 4.0 - 0.6) * 2.0)) * exp(-x * x * 1.2);
  float lum = horizon * 0.75 + topGlow * 0.6 + botGlow * 0.3 + s1 * 0.9 + s2 * 0.7 + s3 * 1.1;
  vec3 deep = vec3(0.015, 0.016, 0.013);
  vec3 mid = vec3(0.10, 0.105, 0.095);
  vec3 silv = vec3(0.55, 0.56, 0.53);
  vec3 hi = vec3(1.15, 1.10, 0.98);
  vec3 col = deep;
  col = mix(col, mid, smoothstep(0.05, 0.45, lum));
  col = mix(col, silv, smoothstep(0.45, 0.85, lum));
  col = mix(col, hi, smoothstep(0.85, 1.35, lum));
  return col;
}

void main() {
  vec2 uv = vUv;
  float aspect = uAspect;
  vec2 ac = vec2(uv.x * aspect, uv.y);

  float e = 0.02;
  float h0 = liquidH(ac);
  float hx = liquidH(ac + vec2(e, 0.0));
  float hy = liquidH(ac + vec2(0.0, e));
  float bump = 0.6;
  vec3 N = normalize(vec3(-(hx - h0) / e * bump, -(hy - h0) / e * bump, 1.0));

  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 I = vec3(0.0, 0.0, -1.0);
  vec3 R = normalize(reflect(I, N));

  vec3 refl = studioEnv(R);
  float occ = smoothstep(0.05, 0.9, h0);
  float shade = mix(0.45, 1.25, occ);
  vec3 col = refl * shade;

  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fr = 1.0 - ndv;
  float fres = fr * fr * fr;
  col = mix(col * 0.85, col, 0.55 + 0.45 * fres);

  vec3 L1 = normalize(vec3(0.5, 0.6, 0.7));
  vec3 L2 = normalize(vec3(-0.6, -0.2, 0.5));
  float sp1 = pow(max(dot(R, L1), 0.0), 48.0) * 1.4;
  float sp2 = pow(max(dot(R, L2), 0.0), 90.0) * 1.0;
  col += vec3(1.0, 0.98, 0.92) * (sp1 + sp2) * 0.9;

  col = mix(col, col * vec3(1.08, 1.02, 0.88), 0.28 * smoothstep(0.0, 0.6, occ));

  vec2 qc = vUv - 0.5;
  qc.x *= aspect * 0.55;
  float vig = smoothstep(1.05, 0.25, length(qc));
  col *= mix(0.62, 1.08, vig);

  float dith = hash12(vUv * uRes) * 2.0 - 1.0;
  col += dith * 0.012;

  // Reveal mask: the chrome lives only around the cursor and its recent
  // trail. Everywhere else — and before the first pointer entry — the panel
  // stays exactly the solid night colour of the design frame.
  vec2 mPos = vec2(uMouse.x * uAspect, uMouse.y);
  vec2 dm0 = ac - mPos;
  float m = exp(-dot(dm0, dm0) / (0.65 * 0.65));
  for (int i = 0; i < 8; i++) {
    vec4 tr = uTrail[i];
    float tm = step(0.003, tr.z);
    vec2 tp = vec2(tr.x * uAspect, tr.y);
    vec2 dd = ac - tp;
    m += exp(-dot(dd, dd) / (0.45 * 0.45)) * tr.z * tm;
  }
  m = smoothstep(0.0, 0.7, clamp(m, 0.0, 1.0));
  float mask = m * uReveal;
  vec3 night = vec3(0.0667, 0.0706, 0.0510);
  col = mix(night, col, mask);

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("shader alloc failed");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`shader compile: ${log}`);
  }
  return sh;
}

type TrailPt = { x: number; y: number; s: number };

/**
 * Interactive liquid-chrome background (dark mercury variant).
 *
 * Raw WebGL1 fragment shader — no extra dependencies. Fills its positioned
 * parent, stays behind content (pointer-events-none), and exposes no visual
 * chrome of its own when WebGL is unavailable (falls back to the parent's
 * solid background).
 *
 * Reveal behaviour: at rest the canvas holds a single pure-night frame that
 * matches the design exactly. The chrome blooms in locally around the cursor
 * only after pointer entry, follows the cursor via a cursor + trail mask,
 * and settles back to plain night after pointer leave (loop parks at zero
 * GPU cost once settled).
 */
export function LiquidChromeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Static first frame only — no motion loop.
      try {
        renderStill(canvas);
      } catch {
        canvas.style.display = "none";
      }
      return;
    }

    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        (canvas.getContext("webgl", {
          antialias: false,
          alpha: false,
          depth: false,
          stencil: false,
          powerPreference: "high-performance",
        }) as WebGLRenderingContext | null) ??
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    let prog: WebGLProgram | null = null;
    try {
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      prog = gl.createProgram();
      if (!prog) throw new Error("program alloc failed");
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(`link: ${gl.getProgramInfoLog(prog)}`);
      }
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    } catch (err) {
      console.error("[liquid-chrome]", err);
      canvas.style.display = "none";
      return;
    }
    const program = prog;
    gl.useProgram(program);

    // Fullscreen triangle.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const loc = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      mouse: gl.getUniformLocation(program, "uMouse"),
      vel: gl.getUniformLocation(program, "uVel"),
      energy: gl.getUniformLocation(program, "uEnergy"),
      trail: gl.getUniformLocation(program, "uTrail[0]"),
      aspect: gl.getUniformLocation(program, "uAspect"),
      reveal: gl.getUniformLocation(program, "uReveal"),
    };

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dprCap = coarse ? 1.25 : 1.6;
    let quality = 1.0; // adaptive multiplier, only ever decreases

    const state = {
      tx: 0.5,
      ty: 0.55,
      sx: 0.5,
      sy: 0.55,
      px: 0.5,
      py: 0.55,
      vx: 0,
      vy: 0,
      energy: 0,
      down: false,
      inside: false,
      // Global reveal: 0 = plain night frame (rest state), 1 = fully bloomed
      // around the cursor. Ramps up on entry, eases back down on leave.
      reveal: 0,
      // The loop only runs while there is something to show or settle.
      // At rest the canvas holds one pure-night frame and costs nothing.
      running: false,
      trail: [] as TrailPt[],
      lastPush: 0,
      visible: true,
      raf: 0,
      start: performance.now(),
      elapsed: 0.8,
      last: performance.now(),
      emaMs: 16,
      slowFrames: 0,
      disposed: false,
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap) * quality;
      const pw = Math.min(2048, Math.max(1, Math.round(w * dpr)));
      const ph = Math.min(2048, Math.max(1, Math.round(h * dpr)));
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    window.addEventListener("resize", resize);

    const toUv = (clientX: number, clientY: number) => {
      const r = parent.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return null;
      const x = (clientX - r.left) / r.width;
      const y = 1 - (clientY - r.top) / r.height;
      return { x: Math.min(1.2, Math.max(-0.2, x)), y: Math.min(1.2, Math.max(-0.2, y)) };
    };

    const onMove = (ev: PointerEvent) => {
      const p = toUv(ev.clientX, ev.clientY);
      if (!p) return;
      state.tx = p.x;
      state.ty = p.y;
      if (!state.inside) {
        state.inside = true;
        state.px = state.sx = p.x;
        state.py = state.sy = p.y;
      }
      ensureRunning();
    };
    const onDown = (ev: PointerEvent) => {
      const p = toUv(ev.clientX, ev.clientY);
      if (p) {
        state.tx = p.x;
        state.ty = p.y;
        if (!state.inside) {
          state.inside = true;
          state.px = state.sx = p.x;
          state.py = state.sy = p.y;
        }
      } else {
        state.inside = true;
      }
      state.down = true;
      state.energy = Math.min(1, state.energy + 0.5);
      ensureRunning();
    };
    const onUp = (ev: PointerEvent) => {
      state.down = false;
      // A lifted touch is gone; a mouse button release is not a leave.
      if (ev.pointerType === "touch") state.inside = false;
    };
    const onLeave = () => {
      state.inside = false;
      state.down = false;
    };

    parent.addEventListener("pointermove", onMove, { passive: true });
    parent.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    parent.addEventListener("pointerleave", onLeave);
    // Touch drags that never fire pointermove on some browsers.
    const onTouch = (ev: TouchEvent) => {
      const t = ev.touches[0];
      if (!t) return;
      const p = toUv(t.clientX, t.clientY);
      if (!p) return;
      state.tx = p.x;
      state.ty = p.y;
      if (!state.inside) {
        state.inside = true;
        state.px = state.sx = p.x;
        state.py = state.sy = p.y;
      }
      ensureRunning();
    };
    parent.addEventListener("touchmove", onTouch, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        const v = entries[0]?.isIntersecting ?? true;
        if (v === state.visible) return;
        state.visible = v;
        if (!v) {
          cancelAnimationFrame(state.raf);
          state.running = false;
        } else if (!state.disposed && needsWork()) {
          ensureRunning();
        }
      },
      { threshold: 0.02 }
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(state.raf);
        state.running = false;
      } else if (state.visible && !state.disposed && needsWork()) {
        ensureRunning();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    const onCtxLost = (ev: Event) => {
      ev.preventDefault();
      cancelAnimationFrame(state.raf);
      state.running = false;
      canvas.style.display = "none";
    };
    canvas.addEventListener("webglcontextlost", onCtxLost);

    const trailArr = new Float32Array(8 * 4);

    const drawFrame = () => {
      for (let i = 0; i < 8; i++) {
        const t = state.trail[i];
        trailArr[i * 4] = t?.x ?? -10;
        trailArr[i * 4 + 1] = t?.y ?? -10;
        trailArr[i * 4 + 2] = t?.s ?? 0;
        trailArr[i * 4 + 3] = 0;
      }
      gl.uniform2f(loc.res, canvas.width, canvas.height);
      gl.uniform1f(loc.time, state.elapsed);
      gl.uniform2f(loc.mouse, state.sx, state.sy);
      gl.uniform2f(loc.vel, state.vx, state.vy);
      gl.uniform1f(loc.energy, state.energy);
      gl.uniform4fv(loc.trail, trailArr);
      gl.uniform1f(loc.aspect, canvas.width / Math.max(1, canvas.height));
      gl.uniform1f(loc.reveal, state.reveal);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const needsWork = () =>
      state.inside ||
      state.reveal > 0.004 ||
      state.energy > 0.02 ||
      state.trail.length > 0;

    const ensureRunning = () => {
      if (state.running || state.disposed) return;
      if (!state.visible || document.hidden) return;
      state.running = true;
      state.last = performance.now();
      state.raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      if (state.disposed) {
        state.running = false;
        return;
      }
      if (!state.visible || document.hidden) {
        // Parked while off-screen; a resume trigger restarts the loop.
        state.running = false;
        return;
      }
      const now = performance.now();
      let dt = (now - state.last) / 1000;
      state.last = now;
      dt = Math.min(0.05, Math.max(0.0001, dt));
      state.elapsed += dt;

      // Frame-rate independent smoothing.
      const kPos = 1 - Math.exp(-dt * 7.5);
      const kVel = 1 - Math.exp(-dt * 6.0);
      state.sx += (state.tx - state.sx) * kPos;
      state.sy += (state.ty - state.sy) * kPos;
      const ivx = (state.sx - state.px) / dt;
      const ivy = (state.sy - state.py) / dt;
      state.px = state.sx;
      state.py = state.sy;
      // Clamp spikes from tab-switch / jank so the metal never jumps.
      const cvx = Math.max(-3, Math.min(3, ivx));
      const cvy = Math.max(-3, Math.min(3, ivy));
      state.vx += (cvx - state.vx) * kVel;
      state.vy += (cvy - state.vy) * kVel;

      const speed = Math.hypot(state.vx, state.vy);
      const target = state.inside
        ? Math.min(1, speed * 1.1 + (state.down ? 0.55 : 0))
        : 0;
      state.energy += (target - state.energy) * (1 - Math.exp(-dt * 4.5));
      if (!state.inside) state.energy *= Math.exp(-dt * 1.4);

      // Reveal: bloom in around the cursor on entry, settle out on leave.
      const rTarget = state.inside ? 1 : 0;
      const rRate = state.inside ? 2.2 : 1.1;
      state.reveal += (rTarget - state.reveal) * (1 - Math.exp(-dt * rRate));

      // Trail: record smoothed cursor, decay strengths.
      if (
        state.inside &&
        now - state.lastPush > 48 &&
        (Math.hypot(state.sx - (state.trail[0]?.x ?? 99), state.sy - (state.trail[0]?.y ?? 99)) > 0.0015 ||
          state.energy > 0.06)
      ) {
        state.trail.unshift({
          x: state.sx,
          y: state.sy,
          s: Math.min(1, Math.max(0.15, 0.25 + speed * 2.0)),
        });
        if (state.trail.length > 8) state.trail.pop();
        state.lastPush = now;
      }
      for (let i = state.trail.length - 1; i >= 0; i--) {
        state.trail[i].s *= Math.exp(-dt * 0.9);
        if (state.trail[i].s < 0.01) state.trail.splice(i, 1);
      }
      drawFrame();

      // Fully settled back to the plain frame: hold pure night and park
      // the loop (zero GPU cost) until the next pointer entry.
      if (!state.inside && state.reveal < 0.004 && state.energy < 0.02) {
        state.reveal = 0;
        state.energy = 0;
        state.trail.length = 0;
        drawFrame();
        state.running = false;
        return;
      }

      // Adaptive quality: sustained slow frames step the resolution down.
      const frameMs = performance.now() - now;
      state.emaMs = state.emaMs * 0.95 + frameMs * 0.05;
      if (state.emaMs > 26 && quality > 0.55) {
        state.slowFrames++;
        if (state.slowFrames > 90) {
          quality *= 0.85;
          state.slowFrames = 0;
          resize();
        }
      } else {
        state.slowFrames = 0;
      }

      state.raf = requestAnimationFrame(tick);
    };
    // Rest state: paint one pure-night frame and park until first entry,
    // so the hero initially matches the design frame exactly.
    drawFrame();

    return () => {
      state.disposed = true;
      cancelAnimationFrame(state.raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      parent.removeEventListener("pointerleave", onLeave);
      parent.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("webglcontextlost", onCtxLost);
      try {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        /* noop */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full bg-night"
    />
  );
}

/** Single static frame for prefers-reduced-motion (no animation loop). */
function renderStill(canvas: HTMLCanvasElement) {
  const gl = (canvas.getContext("webgl", { antialias: false, alpha: false }) ??
    canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  if (!gl) throw new Error("no webgl");
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  if (!prog) throw new Error("no program");
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const parent = canvas.parentElement;
  const rect = parent?.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect?.width ?? 800));
  const h = Math.max(1, Math.round(rect?.height ?? 400));
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(gl.getUniformLocation(prog, "uRes"), canvas.width, canvas.height);
  gl.uniform1f(gl.getUniformLocation(prog, "uTime"), 0.8);
  gl.uniform2f(gl.getUniformLocation(prog, "uMouse"), 0.5, 0.55);
  gl.uniform2f(gl.getUniformLocation(prog, "uVel"), 0, 0);
  gl.uniform1f(gl.getUniformLocation(prog, "uEnergy"), 0);
  gl.uniform4fv(
    gl.getUniformLocation(prog, "uTrail[0]"),
    new Float32Array(8 * 4)
  );
  gl.uniform1f(gl.getUniformLocation(prog, "uAspect"), canvas.width / canvas.height);
  gl.uniform1f(gl.getUniformLocation(prog, "uReveal"), 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
