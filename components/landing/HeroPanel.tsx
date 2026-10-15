"use client";

import { useRef, useCallback, useState } from "react";
import { HOME } from "@/lib/home";
import { useFrameMetrics } from "./Frame";
import { LiquidChrome, type LiquidMotionState } from "@/components/LiquidChrome";

export function HeroPanel() {
  const { left, fontSize, boxTop } = HOME.hero;
  const { heroFill } = useFrameMetrics();

  const textRef = useRef<HTMLHeadingElement>(null);
  const [isDirectHover, setIsDirectHover] = useState(false);
  const isDirectHoverRef = useRef(false);

  // Synchronized callback from the WebGL animation frame
  const handleMotionUpdate = useCallback((state: LiquidMotionState) => {
    const textEl = textRef.current;
    if (!textEl) return;

    // Check proximity to text bounds
    const rect = textEl.getBoundingClientRect();
    const isInsideOrNear =
      state.clientX >= rect.left - 24 &&
      state.clientX <= rect.right + 24 &&
      state.clientY >= rect.top - 24 &&
      state.clientY <= rect.bottom + 24;

    const isHovering = isDirectHoverRef.current || isInsideOrNear;

    if (!isHovering) {
      // NOT hovering: pristine, calm editorial typography with zero chromatic offset
      textEl.style.color = "#d8d0bd";
      textEl.style.textShadow = "0 4px 32px rgba(0, 0, 0, 0.9)";
      textEl.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    // HOVERING: Apply slight, elegant chromatic dispersion to the edges of the text
    // Refined sub-pixel channel split: ruby-rose on left, crystal-cyan on right
    textEl.style.color = "#f2efe9";
    textEl.style.textShadow =
      "-1.2px 0 rgba(255, 60, 90, 0.48), 1.2px 0 rgba(0, 220, 255, 0.48), 0 0 20px rgba(255, 255, 255, 0.22), 0 4px 32px rgba(0, 0, 0, 0.95)";

    // Buttery subtle magnetic inertia (clamped under 1.2px)
    if (state.active > 0.05) {
      const subtleX = Math.max(-1.2, Math.min(1.2, state.velX * 0.4)).toFixed(2);
      const subtleY = Math.max(-1.2, Math.min(1.2, state.velY * 0.4)).toFixed(2);
      textEl.style.transform = `translate3d(${subtleX}px, ${subtleY}px, 0)`;
    } else {
      textEl.style.transform = "translate3d(0, 0, 0)";
    }
  }, []);

  const handleMouseEnter = () => {
    isDirectHoverRef.current = true;
    setIsDirectHover(true);
    if (textRef.current) {
      textRef.current.style.color = "#f2efe9";
      textRef.current.style.textShadow =
        "-1.2px 0 rgba(255, 60, 90, 0.48), 1.2px 0 rgba(0, 220, 255, 0.48), 0 0 20px rgba(255, 255, 255, 0.22), 0 4px 32px rgba(0, 0, 0, 0.95)";
    }
  };

  const handleMouseLeave = () => {
    isDirectHoverRef.current = false;
    setIsDirectHover(false);
    if (textRef.current) {
      textRef.current.style.color = "#d8d0bd";
      textRef.current.style.textShadow = "0 4px 32px rgba(0, 0, 0, 0.9)";
      textElTransformReset(textRef.current);
    }
  };

  const textElTransformReset = (el: HTMLElement) => {
    el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <section
      className="relative shrink-0 overflow-hidden bg-black"
      style={{ width: 1566 + heroFill, height: HOME.frameHeight }}
      aria-label="Prativa Dahal"
    >
      <LiquidChrome onMotionUpdate={handleMotionUpdate} />

      <h1
        ref={textRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="chromatic-hover absolute z-10 cursor-default whitespace-pre-line select-none will-change-transform"
        style={{
          left,
          top: boxTop,
          fontSize,
          lineHeight: `${fontSize}px`,
          color: isDirectHover ? "#f2efe9" : "#d8d0bd",
          textShadow: isDirectHover
            ? "-1.2px 0 rgba(255, 60, 90, 0.48), 1.2px 0 rgba(0, 220, 255, 0.48), 0 0 20px rgba(255, 255, 255, 0.22), 0 4px 32px rgba(0, 0, 0, 0.95)"
            : "0 4px 32px rgba(0, 0, 0, 0.9)",
          transition:
            "color 0.35s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {"PRATIVA\nDAHAL"}
      </h1>
    </section>
  );
}