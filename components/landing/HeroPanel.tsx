"use client";

import { useEffect, useRef } from "react";
import { HOME } from "@/lib/home";
import { useFrameMetrics } from "./Frame";
import { LiquidChromeBackground } from "./LiquidChromeBackground";

/**
 * Liquid-glass hover over the hero name. A glass disc follows the cursor;
 * inside it a duplicate of the name is warped by an animated SVG
 * turbulence/displacement filter, so the letters themselves ripple like
 * liquid under glass. Settles and fades when the pointer leaves.
 */
export function HeroPanel() {
  const { left, fontSize, boxTop } = HOME.hero;
  const { heroFill } = useFrameMetrics();
  const sectionRef = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLHeadingElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const stateRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, active: false, warp: 0, t: 0, raf: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const lens = lensRef.current;
    const copy = copyRef.current;
    if (!section || !lens || !copy) return;
    const s = stateRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const R = fontSize * 0.85;
    lens.style.width = `${R * 2}px`;
    lens.style.height = `${R * 2}px`;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      s.tx = e.clientX - r.left;
      s.ty = e.clientY - r.top;
      if (!s.active) {
        s.active = true;
        s.x = s.tx;
        s.y = s.ty;
        lens.style.opacity = "1";
      }
    };
    const onLeave = () => {
      s.active = false;
      lens.style.opacity = "0";
    };

    const tick = () => {
      s.t += 0.016;
      // Smooth liquid trailing (pixels, section space).
      s.x += (s.tx - s.x) * 0.14;
      s.y += (s.ty - s.y) * 0.14;
      // Ramp the warp up on hover, ease it out on leave.
      s.warp += ((s.active ? 1 : 0) - s.warp) * 0.08;
      const lx = s.x - R;
      const ly = s.y - R;
      lens.style.transform = `translate(${lx}px, ${ly}px)`;
      // Counter-shift the duplicate so it sits exactly over the base name.
      copy.style.transform = `translate(${left - lx}px, ${boxTop - ly}px)`;
      // Animated glass shimmer — fine ripple, low amplitude so it reads
      // as refraction, not chrome.
      if (turbRef.current) {
        const f = 0.02 + Math.sin(s.t * 1.4) * 0.004;
        turbRef.current.setAttribute("baseFrequency", `${f} ${f * 1.6}`);
      }
      if (dispRef.current) {
        dispRef.current.setAttribute("scale", `${(10 + Math.sin(s.t * 1.9) * 3) * s.warp}`);
      }
      s.raf = requestAnimationFrame(tick);
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    s.raf = requestAnimationFrame(tick);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(s.raf);
    };
  }, [fontSize, left, boxTop]);

  const nameStyle = {
    left,
    top: boxTop,
    fontSize,
    lineHeight: `${fontSize}px`,
    color: "#d8d0bd",
    textShadow: "0 2px 34px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.5)",
  } as const;

  return (
    <section
      ref={sectionRef}
      className="relative shrink-0 overflow-clip bg-night"
      style={{ width: 1566 + heroFill, height: HOME.frameHeight }}
      aria-label="Prativa Dahal"
    >
      {/* Interactive liquid-chrome base. Falls back to bg-night if WebGL is
          unavailable; content below stays fully interactive above it. */}
      <LiquidChromeBackground />
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <filter id="hero-liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.02 0.032"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="0" />
          </filter>
        </defs>
      </svg>
      <h1 className="absolute z-[1] whitespace-pre-line" style={nameStyle}>
        {"PRATIVA\nDAHAL"}
      </h1>
      {/* Lens: clipped disc holding the warped duplicate + glass tint. */}
      <div
        ref={lensRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[2] overflow-hidden rounded-full opacity-0"
        style={{ transition: "opacity 0.35s ease" }}
      >
        <h1
          ref={copyRef}
          aria-hidden="true"
          className="absolute left-0 top-0 whitespace-pre-line"
          style={{ ...nameStyle, filter: "url(#hero-liquid-glass)" }}
        >
          {"PRATIVA\nDAHAL"}
        </h1>
        <div
          className="absolute inset-0 rounded-full backdrop-blur-[6px] backdrop-saturate-150 backdrop-brightness-110"
          style={{
            background: "radial-gradient(circle at 32% 26%, rgba(255,255,255,0.28), rgba(255,255,255,0.06) 48%, rgba(255,255,255,0) 68%)",
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -8px 18px rgba(255,255,255,0.08), inset 0 0 22px rgba(216,208,189,0.10), 0 12px 40px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.35)",
          }}
        />
      </div>
    </section>
  );
}
