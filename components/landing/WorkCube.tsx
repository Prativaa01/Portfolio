"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Tuning constants ─────────────────────────────────────────────────────────
/** Lerp factor per animation frame. 0 = frozen, 1 = instant snap. */
const DAMPING    = 0.09;

/** Maximum cursor-driven rotation in each axis (degrees → radians at bottom). */
const MAX_DEG_X  = 35;   // vertical   – tilt toward / away viewer
const MAX_DEG_Y  = 60;   // horizontal – turn left / right

/** Resting rotation the cube returns to when the cursor leaves, in radians. */
const REST_X     = -0.15;
const REST_Y     =  0.55;
// ─────────────────────────────────────────────────────────────────────────────

const MAX_RAD_X = (MAX_DEG_X * Math.PI) / 180;
const MAX_RAD_Y = (MAX_DEG_Y * Math.PI) / 180;

const FACE_PATHS = [
  "/images/cube/face-0.webp", // Right (+X)
  "/images/cube/face-1.webp", // Left  (-X)
  "/images/cube/face-2.webp", // Top   (+Y)
  "/images/cube/face-3.webp", // Bottom(-Y)
  "/images/cube/face-4.webp", // Front (+Z)
  "/images/cube/face-5.webp", // Back  (-Z)
];

export function WorkCube({ reveal = 0 }: { reveal?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef(reveal);
  revealRef.current = reveal;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── prefers-reduced-motion ─────────────────────────────────────────────
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ── Three.js renderer ──────────────────────────────────────────────────
    const W = 500;
    const H = 500;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ─────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // ── Lighting (no cast shadows) ─────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(4, 6, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.7);
    fill.position.set(-4, -3, 3);
    scene.add(fill);

    // ── Cube (unchanged appearance) ────────────────────────────────────────
    const loader    = new THREE.TextureLoader();
    const materials = FACE_PATHS.map((p) => {
      const tex = loader.load(p);
      tex.colorSpace = THREE.SRGBColorSpace;
      return new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.28,
        metalness: 0.04,
      });
    });
    const geo  = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(geo, materials);
    cube.rotation.x = REST_X;
    cube.rotation.y = REST_Y;
    scene.add(cube);

    // ── Pointer / touch state ──────────────────────────────────────────────
    //
    // STRATEGY:
    //   The Frame component scales the whole layout with CSS transform:scale()
    //   and the horizontal-scroll container intercepts pointer events before
    //   the section sees them.  Instead of fighting the event tree, we:
    //     1. Listen for pointermove + touchmove on the DOCUMENT in capture
    //        phase – guaranteed to fire before any child handler.
    //     2. Map clientX/clientY → section-relative –1…+1 by reading the
    //        section's getBoundingClientRect() in screen space.  getBCR already
    //        accounts for CSS transforms, so it matches clientX/clientY exactly.
    //     3. Skip frames where the cursor is outside the section rect.
    const section = container.closest("section") as Element | null;

    // Normalised cursor position inside the section (-1 … +1).
    let normX      = 0;
    let normY      = 0;
    let cursorInside = false;

    function updateFromClient(cx: number, cy: number) {
      if (!section) return;
      const r = section.getBoundingClientRect();
      // Is the cursor actually over this section?
      if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) {
        cursorInside = false;
        return;
      }
      cursorInside = true;
      // Remap [left…right] → [-1…+1], [top…bottom] → [-1…+1]
      normX = ((cx - r.left) / r.width)  * 2 - 1;
      normY = ((cy - r.top)  / r.height) * 2 - 1;
    }

    const onPointerMove = (e: PointerEvent) => updateFromClient(e.clientX, e.clientY);
    const onTouchMove   = (e: TouchEvent)  => {
      const t = e.touches[0];
      if (t) updateFromClient(t.clientX, t.clientY);
    };

    // Capture phase: fires before any child handler – nothing can suppress it.
    document.addEventListener("pointermove", onPointerMove, { capture: true, passive: true });
    document.addEventListener("touchmove",   onTouchMove,   { capture: true, passive: true });
    document.addEventListener("touchend",    () => { cursorInside = false; }, { capture: true });

    // ── Animation loop ─────────────────────────────────────────────────────
    let smoothX = REST_X;
    let smoothY = REST_Y;
    let raf: number;

    function animate() {
      raf = requestAnimationFrame(animate);

      if (!prefersReduced) {
        // Target:
        //   • cursor inside section → cursor-driven within ±MAX_RAD
        //   • cursor outside        → ease back to resting angle
        const targetX = cursorInside
          ? REST_X + normY * MAX_RAD_X   // normY -1 (top)  → top tilts away (−), +1 (bottom) → tilts toward (+)
          : REST_X;
        const targetY = cursorInside
          ? REST_Y + normX * MAX_RAD_Y   // normX -1 (left) → turns left (−), +1 (right) → turns right (+)
          : REST_Y;

        // Lerp with constant damping – never snaps, always eases.
        smoothX += (targetX - smoothX) * DAMPING;
        smoothY += (targetY - smoothY) * DAMPING;

        cube.rotation.x = smoothX;
        cube.rotation.y = smoothY;
      }

      // Scroll-reveal scale (no React re-render).
      const grow = 1 - Math.pow(1 - Math.min(1, Math.max(0, revealRef.current)), 3);
      const s    = 0.85 + 0.25 * grow;
      cube.scale.set(s, s, s);

      renderer.render(scene, camera);
    }

    animate();

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onPointerMove, { capture: true });
      document.removeEventListener("touchmove",   onTouchMove,   { capture: true });
      materials.forEach((m) => { m.map?.dispose(); m.dispose(); });
      geo.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none"
      aria-label="3D interactive project cube"
      role="region"
    >
      <div ref={mountRef} className="w-[500px] h-[500px]" />
    </div>
  );
}
