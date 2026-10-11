"use client";

import { HOME } from "@/lib/home";
import { displayTop } from "@/lib/typography";
import { useFrameMetrics } from "./Frame";

export function HeroPanel() {
  const { left, fontSize, lineHeight, inkTop, scaleX, topAdjust } = HOME.hero;
  const { heroFill } = useFrameMetrics();

  return (
    <section
      className="relative shrink-0 bg-ink text-cream"
      style={{ width: 1566 + heroFill, height: HOME.frameHeight }}
      aria-label="Prativa Dahal"
    >
      <h1
        className="absolute whitespace-pre-line"
        style={{
          left,
          top: displayTop(inkTop, fontSize, lineHeight) + topAdjust,
          fontSize,
          lineHeight: `${lineHeight}px`,
          transform: `scaleX(${scaleX})`,
          transformOrigin: "left center",
        }}
      >
        {"PRATIVA\nDAHAL"}
      </h1>
    </section>
  );
}