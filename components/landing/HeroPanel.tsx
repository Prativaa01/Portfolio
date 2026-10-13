"use client";

import { HOME } from "@/lib/home";
import { useFrameMetrics } from "./Frame";

export function HeroPanel() {
  const { left, fontSize, boxTop } = HOME.hero;
  const { heroFill } = useFrameMetrics();

  return (
    <section
      className="relative shrink-0 bg-night"
      style={{ width: 1566 + heroFill, height: HOME.frameHeight }}
      aria-label="Prativa Dahal"
    >
      <h1
        className="absolute whitespace-pre-line"
        style={{
          left,
          // Figma's text box top for node 8066:472; each line is its own
          // `leading-none` block, so the line box is one em tall.
          top: boxTop,
          fontSize,
          lineHeight: `${fontSize}px`,
          // The name is set in "bone", not the cream used for headings on the
          // light panels.
          color: "#d8d0bd",
        }}
      >
        {"PRATIVA\nDAHAL"}
      </h1>
    </section>
  );
}