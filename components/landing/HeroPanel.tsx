"use client";

import { HOME } from "@/lib/home";
import { useFrameMetrics } from "./Frame";
import { LiquidChrome } from "@/components/LiquidChrome";

export function HeroPanel() {
  const { left, fontSize } = HOME.hero;
  const { heroFill } = useFrameMetrics();

  return (
    <section
      className="relative shrink-0 overflow-hidden bg-black"
      style={{ width: 1566 + heroFill, height: HOME.frameHeight }}
      aria-label="Prativa Dahal"
    >
      <LiquidChrome />

      <div
        className="pointer-events-none absolute inset-y-0 z-10 flex flex-col justify-center"
        style={{ left }}
      >
        <h1
          className="pointer-events-auto font-semibold cursor-default whitespace-pre-line select-none text-[#d8d0bd]"
          style={{
            fontSize,
            lineHeight: `${fontSize}px`,
          }}
        >
          {"PRATIVA\nDAHAL"}
        </h1>
      </div>
    </section>
  );
}
