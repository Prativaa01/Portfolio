"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hardware-accelerated WebGL 3D Rubik's-style photo cube using Three.js:
 * - Genuine 3D space: immune to CSS clipping, scaling, or overflow flattening.
 * - Actively tracks and follows the cursor across the screen in real-time 3D space.
 * - Continuous organic tumbling float when cursor is stationary.
 * - 6 faces mapped with high-res 3x3 grids of the user's authentic design work.
 * - Clean lighting with NO drop shadows.
 */

const FACE_TEXTURE_PATHS = [
  "/images/cube/face-0.webp", // Right (+X)
  "/images/cube/face-1.webp", // Left (-X)
  "/images/cube/face-2.webp", // Top (+Y)
  "/images/cube/face-3.webp", // Bottom (-Y)
  "/images/cube/face-4.webp", // Front (+Z)
  "/images/cube/face-5.webp", // Back (-Z)
];

export function WorkCube({ reveal = 0 }: { reveal?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Cursor and rotation targets
  const mouseRef = useRef({
    normX: 0,
    normY: 0,
    accumX: -0.25,
    accumY: 0.55,
    lastX: 0,
    lastY: 0,
    hasMoved: false,
    lastMoveTime: 0,
  });

  const grow = 1 - Math.pow(1 - Math.min(1, Math.max(0, reveal)), 3);
  const scale = 0.85 + 0.25 * grow;
  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 500;
    const height = 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // 2. WebGL Renderer with transparency & no shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3. Lighting (clean studio lighting, NO drop shadows)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(4, 6, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight2.position.set(-4, -3, 3);
    scene.add(dirLight2);

    // 4. Load 6 Face Textures & Materials
    const textureLoader = new THREE.TextureLoader();
    const materials = FACE_TEXTURE_PATHS.map((path) => {
      const texture = textureLoader.load(path);
      texture.colorSpace = THREE.SRGBColorSpace;
      return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.32,
        metalness: 0.05,
      });
    });

    // 5. 3D Cube Mesh (Size 2x2x2)
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(geometry, materials);
    cube.rotation.x = -0.25;
    cube.rotation.y = 0.55;
    scene.add(cube);

    // 6. Pointer Move Listener: Follow cursor without clicking!
    const onPointerMove = (e: MouseEvent | PointerEvent) => {
      const m = mouseRef.current;
      const now = performance.now();

      // Normalized coordinates: -1 (left/top) to +1 (right/bottom)
      m.normX = (e.clientX / window.innerWidth) * 2 - 1;
      m.normY = (e.clientY / window.innerHeight) * 2 - 1;

      if (!m.hasMoved) {
        m.lastX = e.clientX;
        m.lastY = e.clientY;
        m.hasMoved = true;
        m.lastMoveTime = now;
        return;
      }

      const dx = e.clientX - m.lastX;
      const dy = e.clientY - m.lastY;
      m.lastX = e.clientX;
      m.lastY = e.clientY;
      m.lastMoveTime = now;

      // Moving cursor directly steers the cube in 3D space
      const sensitivity = 0.007;
      m.accumY += dx * sensitivity;
      m.accumX += dy * sensitivity;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    // 7. Animation Loop
    let animId: number;
    let prefersReduced = false;
    if (typeof window !== "undefined") {
      prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const animate = () => {
      const m = mouseRef.current;
      const now = performance.now();
      const timeSinceMove = now - m.lastMoveTime;

      if (!prefersReduced) {
        // When cursor is idle (>120ms), smoothly auto-tumble in 3D
        if (timeSinceMove > 120) {
          m.accumY += 0.0055;
          m.accumX += 0.0022;
        }

        // Target angles: combines continuous accumulation with cursor positional pull
        // When cursor is on the right, cube turns right; cursor up, cube tilts up!
        const targetRotY = m.accumY + m.normX * 0.9;
        const targetRotX = m.accumX + m.normY * 0.9;

        // Smooth 3D rotation interpolation
        cube.rotation.y += (targetRotY - cube.rotation.y) * 0.12;
        cube.rotation.x += (targetRotX - cube.rotation.x) * 0.12;
        cube.rotation.z = Math.sin(now * 0.001) * 0.06;
      }

      // Smooth scale from scroll reveal
      const s = scaleRef.current;
      cube.scale.set(s, s, s);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousemove", onPointerMove);
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
      geometry.dispose();
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
      <div
        ref={mountRef}
        className="w-[500px] h-[500px] flex items-center justify-center"
      />
    </div>
  );
}
