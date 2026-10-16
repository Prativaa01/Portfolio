"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Face Textures ───────────────────────────────────────────────────────────
const FACE_PATHS = [
  "/images/cube/face-0.webp", // Right (+X)
  "/images/cube/face-1.webp", // Left  (-X)
  "/images/cube/face-2.webp", // Top   (+Y)
  "/images/cube/face-3.webp", // Bottom(-Y)
  "/images/cube/face-4.webp", // Front (+Z)
  "/images/cube/face-5.webp", // Back  (-Z)
];

// ─── Physics Constants (Feather-light & Tossable) ─────────────────────────────
const GRAVITY = 5.2;           // Gentle, airy gravity (floats like a zero-G toy)
const RESTITUTION = 0.72;      // Bouncy elasticity on collisions
const FLOOR_FRICTION = 0.92;   // Silky surface glide
const AIR_DRAG = 0.997;        // Minimal air resistance for effortless gliding
const BASE_SPIN = 0.0055;      // Base self-rotation speed (calm gallery showcase rate)

// Canvas geometry: spans 3 panels (PersonPanel, WorkPanel, CaseStudiesPanel)
// Center of canvas aligns with center of WorkPanel
const PANEL_WIDTH = 1566;
const CANVAS_WIDTH = PANEL_WIDTH * 3; // 4698px
const CANVAS_HEIGHT = 770;

export function WorkCube({ reveal = 0 }: { reveal?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef(reveal);
  revealRef.current = reveal;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Three.js Renderer ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = `${CANVAS_WIDTH}px`;
    renderer.domElement.style.height = `${CANVAS_HEIGHT}px`;
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    // ── Scene & Camera ─────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    // Compute visible 3D world frustum at z = 0
    const vFOV = (camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
    const visibleWidth = visibleHeight * (CANVAS_WIDTH / CANVAS_HEIGHT);

    const cubeRadius = 0.95;
    const floorY = -visibleHeight / 2 + cubeRadius;
    const ceilY = visibleHeight / 2 - cubeRadius;
    // Bumper boundaries positioned deep behind PersonPanel (left) and CaseStudiesPanel (right)
    const leftX = -6.5;
    const rightX = 6.5;

    // ── Studio Lighting ────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 1.45));

    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.0);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0e8f5, 0.85);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const floorBounce = new THREE.DirectionalLight(0xd8d0bd, 0.45);
    floorBounce.position.set(0, -5, 2);
    scene.add(floorBounce);

    // ── Soft Contact Floor Shadow ──────────────────────────────────────────
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(17, 18, 13, 0.38)");
      grad.addColorStop(0.35, "rgba(17, 18, 13, 0.16)");
      grad.addColorStop(0.7, "rgba(17, 18, 13, 0.04)");
      grad.addColorStop(1, "rgba(17, 18, 13, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = floorY + 0.015;
    scene.add(shadowMesh);

    // ── Cube Mesh & Materials ──────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    const materials = FACE_PATHS.map((p) => {
      const tex = loader.load(p);
      tex.colorSpace = THREE.SRGBColorSpace;
      return new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.22,
        metalness: 0.05,
      });
    });

    const geo = new THREE.BoxGeometry(1.9, 1.9, 1.9);
    // Decrease the thick baked black border stroke from the face images:
    // Source images have 24px of black border on 768px images.
    // Insetting UVs by ~18px trims the heavy black border down to a sleek hairline ~6px stroke!
    const uvAttr = geo.attributes.uv;
    const uvInset = 18.0 / 768.0;
    for (let i = 0; i < uvAttr.count; i++) {
      const u = uvAttr.getX(i);
      const v = uvAttr.getY(i);
      uvAttr.setXY(i, uvInset + u * (1.0 - 2.0 * uvInset), uvInset + v * (1.0 - 2.0 * uvInset));
    }
    uvAttr.needsUpdate = true;

    const cube = new THREE.Mesh(geo, materials);
    cube.position.set(0, 0, 0);
    cube.rotation.set(-0.15, 0.55, 0);
    scene.add(cube);

    // ── Physics & Interaction State ────────────────────────────────────────
    let mode: "FLOATING" | "DRAGGING" | "PHYSICS" | "RETURNING" = "FLOATING";

    const pos = new THREE.Vector3(0, 0, 0);
    const vel = new THREE.Vector3(0, 0, 0);
    const dragOffset = new THREE.Vector3(0, 0, 0);

    // Dynamic rotation course steered by the direction the user pulls
    const rotVel = new THREE.Vector3(0, BASE_SPIN, 0);
    const targetRotVel = new THREE.Vector3(0, BASE_SPIN, 0);

    let squishY = 1.0;
    let untouchedTimer = 0;
    let behindPageTimer = 0;
    let lastMoveTime = 0;
    const dragHistory: { x: number; y: number; time: number }[] = [];

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2(0, 0);
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const planeHitPoint = new THREE.Vector3();

    let isPointerOverCube = false;
    let activePointerId: number | null = null;

    // Helper to calculate NDC across the 3-panel canvas span
    const getNDC = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      return { x, y };
    };

    // ── Pointer Handlers (Global Window Listeners) ──────────────────────────
    const onPointerMove = (e: PointerEvent) => {
      const ndc = getNDC(e.clientX, e.clientY);
      pointerNDC.set(ndc.x, ndc.y);
      const now = performance.now();

      if (mode === "DRAGGING") {
        raycaster.setFromCamera(pointerNDC, camera);
        if (raycaster.ray.intersectPlane(dragPlane, planeHitPoint)) {
          // Feather-light, immediate follow
          const targetX = THREE.MathUtils.clamp(planeHitPoint.x + dragOffset.x, leftX, rightX);
          const targetY = THREE.MathUtils.clamp(planeHitPoint.y + dragOffset.y, floorY, ceilY);

          pos.x += (targetX - pos.x) * 0.88;
          pos.y += (targetY - pos.y) * 0.88;
          cube.position.copy(pos);

          lastMoveTime = now;
          untouchedTimer = 0;
          dragHistory.push({ x: pos.x, y: pos.y, time: now });
          while (dragHistory.length > 0 && now - dragHistory[0].time > 80) {
            dragHistory.shift();
          }

          // Direct 360-degree rotation response under cursor
          if (dragHistory.length >= 2) {
            const oldest = dragHistory[0];
            const dtDrag = Math.max((now - oldest.time) / 1000, 0.016);
            const instVx = (pos.x - oldest.x) / dtDrag;
            const instVy = (pos.y - oldest.y) / dtDrag;

            // Rotate 360 degrees directly with drag movement
            cube.rotation.y += instVx * 0.018;
            cube.rotation.x -= instVy * 0.018;

            // Steer ongoing 360-degree spin direction and velocity
            if (Math.abs(instVx) > 0.25) {
              const signX = Math.sign(instVx);
              targetRotVel.y = signX * THREE.MathUtils.clamp(Math.abs(instVx) * 0.003, 0.005, 0.016);
            }
            if (Math.abs(instVy) > 0.25) {
              const signY = Math.sign(instVy);
              targetRotVel.x = -signY * THREE.MathUtils.clamp(Math.abs(instVy) * 0.003, 0.004, 0.014);
            }
          }
        }
      } else {
        // Hover detection: turn on pointer-events ONLY when hovering over the cube
        raycaster.setFromCamera(pointerNDC, camera);
        const hits = raycaster.intersectObject(cube);
        const isHover = hits.length > 0;

        if (isHover !== isPointerOverCube) {
          isPointerOverCube = isHover;
          renderer.domElement.style.pointerEvents = isHover ? "auto" : "none";
          document.body.style.cursor = isHover ? "grab" : "";
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const ndc = getNDC(e.clientX, e.clientY);
      pointerNDC.set(ndc.x, ndc.y);
      raycaster.setFromCamera(pointerNDC, camera);

      const hits = raycaster.intersectObject(cube);
      let canGrab = hits.length > 0;

      if (!canGrab && raycaster.ray.intersectPlane(dragPlane, planeHitPoint)) {
        if (planeHitPoint.distanceTo(pos) < 1.35) {
          canGrab = true;
        }
      }

      if (canGrab) {
        mode = "DRAGGING";
        activePointerId = e.pointerId;
        untouchedTimer = 0;
        behindPageTimer = 0;
        renderer.domElement.style.pointerEvents = "auto";
        document.body.style.cursor = "grabbing";

        raycaster.ray.intersectPlane(dragPlane, planeHitPoint);
        dragOffset.copy(pos).sub(planeHitPoint);

        vel.set(0, 0, 0);
        dragHistory.length = 0;
        const now = performance.now();
        lastMoveTime = now;
        dragHistory.push({ x: pos.x, y: pos.y, time: now });
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (mode === "DRAGGING" && (activePointerId === null || e.pointerId === activePointerId)) {
        mode = "PHYSICS";
        activePointerId = null;
        untouchedTimer = 0;
        document.body.style.cursor = isPointerOverCube ? "grab" : "";
        renderer.domElement.style.pointerEvents = isPointerOverCube ? "auto" : "none";

        // Compute throw velocity and finalize the steered rotation course
        const now = performance.now();
        if (now - lastMoveTime <= 75 && dragHistory.length >= 2) {
          const oldest = dragHistory[0];
          const dtThrow = Math.max((now - oldest.time) / 1000, 0.016);
          const rawVx = (pos.x - oldest.x) / dtThrow;
          const rawVy = (pos.y - oldest.y) / dtThrow;

          // Clamped toss velocity
          vel.x = THREE.MathUtils.clamp(rawVx * 1.05, -15.0, 15.0);
          vel.y = THREE.MathUtils.clamp(rawVy * 1.05, -15.0, 15.0);
          vel.z = 0;

          // Steer the cube's rotation course in the direction of the throw!
          if (Math.abs(rawVx) > 0.3) {
            targetRotVel.y = Math.sign(rawVx) * THREE.MathUtils.clamp(BASE_SPIN + Math.abs(rawVx) * 0.0025, 0.005, 0.012);
          }
          if (Math.abs(rawVy) > 0.3) {
            targetRotVel.x = -Math.sign(rawVy) * THREE.MathUtils.clamp(Math.abs(rawVy) * 0.002, 0.001, 0.007);
          }
        } else {
          vel.set(0, 0, 0);
        }
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });

    // ── Animation Loop ─────────────────────────────────────────────────────
    let raf: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) / 1000, 0.04);
      lastTime = now;
      const timeSec = now / 1000;

      // Scroll-reveal scale factor
      const grow = 1 - Math.pow(1 - Math.min(1, Math.max(0, revealRef.current)), 3);
      const baseScale = 0.85 + 0.22 * grow;

      if (!prefersReduced) {
        // ── Smooth 360° Multi-Axis Continuous Rotation ────────────────────
        rotVel.lerp(targetRotVel, 0.06);

        // Continuous 360-degree rotation across all axes (yaw, pitch, roll)
        cube.rotation.y += rotVel.y;
        cube.rotation.x += rotVel.x;
        cube.rotation.z += rotVel.z;

        // In idle/physics, gently ease rotation speeds back to calm, readable showcase rate
        if (mode !== "DRAGGING") {
          const calmSpeedY = Math.sign(targetRotVel.y || 1) * 0.0065;
          const calmSpeedX = Math.sign(targetRotVel.x || 1) * 0.0035;
          targetRotVel.y += (calmSpeedY - targetRotVel.y) * 0.012;
          targetRotVel.x += (calmSpeedX - targetRotVel.x) * 0.012;
          targetRotVel.z *= 0.985;
        }

        if (mode === "FLOATING") {
          // Gentle buoyant floating bobbing in the center of WorkPanel
          const targetBobY = Math.sin(timeSec * 1.4) * 0.12;
          const targetBobX = Math.cos(timeSec * 0.7) * 0.06;
          pos.y += (targetBobY - pos.y) * 0.06;
          pos.x += (targetBobX - pos.x) * 0.06;
          pos.z += (0 - pos.z) * 0.06;
          cube.position.copy(pos);
        } else if (mode === "PHYSICS") {
          // ── Feather-Light Gravity & Airy Flight ──────────────────────────
          vel.y -= GRAVITY * dt;
          vel.multiplyScalar(AIR_DRAG);
          vel.clampLength(0, 15.0);
          pos.addScaledVector(vel, dt);

          // Floor collision & lively light bounce
          if (pos.y <= floorY) {
            pos.y = floorY;
            if (Math.abs(vel.y) < 0.5) {
              // Settled on floor: kill tiny vertical bounce
              vel.y = 0;
            } else {
              vel.y = -vel.y * RESTITUTION;
              // Subtle visual squish on impact
              const impactSpeed = Math.abs(vel.y);
              if (impactSpeed > 1.5) {
                squishY = Math.max(0.92, 1.0 - impactSpeed * 0.012);
              }
            }

            vel.x *= FLOOR_FRICTION;

            if (Math.abs(vel.y) < 0.08 && Math.abs(vel.x) < 0.12) {
              vel.set(0, 0, 0);
            }
          }

          // Ceiling collision
          if (pos.y >= ceilY) {
            pos.y = ceilY;
            vel.y = -Math.abs(vel.y) * RESTITUTION;
          }

          // Left wall collision (extends across PersonPanel / previous page)
          if (pos.x <= leftX) {
            pos.x = leftX;
            vel.x = Math.abs(vel.x) * RESTITUTION;
            // Wall bounce also gently steers spin direction!
            targetRotVel.y = Math.abs(targetRotVel.y);
          }

          // Right wall collision (extends across CaseStudiesPanel / next page)
          if (pos.x >= rightX) {
            pos.x = rightX;
            vel.x = -Math.abs(vel.x) * RESTITUTION;
            // Wall bounce also gently steers spin direction!
            targetRotVel.y = -Math.abs(targetRotVel.y);
          }

          cube.position.copy(pos);

          // Check if the cube was sent behind either neighboring panel
          const isBehindNeighborPage = Math.abs(pos.x) > 3.85;
          if (isBehindNeighborPage) {
            behindPageTimer += dt;
            // If sent deep behind either page, hover back to center promptly
            if (behindPageTimer > 1.0 || (vel.lengthSq() < 1.8 && behindPageTimer > 0.35)) {
              mode = "RETURNING";
              behindPageTimer = 0;
              untouchedTimer = 0;
            }
          } else {
            behindPageTimer = 0;
          }

          // General untouched timer: if left untouched in WorkPanel for 3.5 seconds
          untouchedTimer += dt;
          if (untouchedTimer >= 3.5) {
            mode = "RETURNING";
            untouchedTimer = 0;
            behindPageTimer = 0;
          }
        } else if (mode === "RETURNING") {
          // Effortless magnetic buoyancy floats the cube back to center
          const returnRate = 1.0 - Math.exp(-2.2 * dt);
          pos.x += (0 - pos.x) * returnRate;
          pos.y += (0 - pos.y) * returnRate;
          pos.z += (0 - pos.z) * returnRate;
          cube.position.copy(pos);

          if (pos.length() < 0.04) {
            pos.set(0, 0, 0);
            mode = "FLOATING";
            untouchedTimer = 0;
            behindPageTimer = 0;
          }
        }

        // Rebound squish back to 1.0
        squishY += (1.0 - squishY) * 0.22;
        const sx = baseScale * (2.0 - squishY);
        const sy = baseScale * squishY;
        const sz = baseScale * (2.0 - squishY);
        cube.scale.set(sx, sy, sz);

        // Floor contact shadow follows cube position
        shadowMesh.position.x = pos.x;
        shadowMesh.position.z = pos.z;
        const heightAboveFloor = Math.max(0, pos.y - floorY);
        const shadowScale = (1.0 + heightAboveFloor * 0.40) * baseScale;
        shadowMesh.scale.set(shadowScale, shadowScale, 1.0);
        shadowMat.opacity = Math.max(0.02, 0.38 / (1.0 + heightAboveFloor * 1.4));
      }

      renderer.render(scene, camera);
    };

    animate(performance.now());

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.body.style.cursor = "";

      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
      geo.dispose();
      shadowGeo.dispose();
      shadowTex.dispose();
      shadowMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute top-0 z-0 h-[770px] select-none"
      style={{ left: "-1566px", width: "4698px" }}
      aria-label="3D interactive project cube with physics and gravity"
      role="region"
    />
  );
}
