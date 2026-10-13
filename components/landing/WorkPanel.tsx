"use client";

import { useRef } from "react";
import { HOME, PANEL_WIDTHS, WORK_REVEAL } from "@/lib/home";
import { useRevealProgress } from "@/lib/useRevealProgress";
import { WorkMarquee } from "./WorkMarquee";

const PANEL_WIDTH = PANEL_WIDTHS[1];

/**
 * Slows the expansion in and out so it has weight.
 *
 * Reference uses a long, deliberate ease — the reveal should feel like
 * something is opening, not snapping open at the end of the scroll.
 */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Linear remap of `value` across [from, to], clamped to 0..1. */
function span(value: number, from: number, to: number) {
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}

/**
 * Blend two hex colours. The heading flips from ink to cream as dark imagery
 * fills the panel behind it, so it stays legible throughout the reveal.
 */
function mix(from: string, to: string, t: number) {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  const channel = (a: number, b: number) =>
    Math.round(a + (b - a) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r1, r2)}${channel(g1, g2)}${channel(b1, b2)}`;
}

export function WorkPanel() {
  const { fontSize, boxTop } = HOME.work;
  const panelRef = useRef<HTMLElement>(null);
  const reveal = useRevealProgress(panelRef, WORK_REVEAL.travel);

  const spread = easeInOutCubic(reveal);
  const flip = span(reveal, WORK_REVEAL.flipFrom, WORK_REVEAL.flipTo);
  const colour = mix("#0E0E0A", "#FFFAF4", flip);

  // "THE" and "WORK" start as one centred string, so the gap between them is
  // however wide a space renders at this size. Sliding each word outward from
  // the centre splits the heading exactly where the eye expects it to break.
  const gap = fontSize * 0.25;

  return (
    <section
      ref={panelRef}
      className="relative shrink-0 overflow-hidden bg-cream text-ink"
      style={{ width: PANEL_WIDTH, height: HOME.frameHeight }}
      aria-label="The work"
    >
      <WorkMarquee reveal={reveal} />

      {/* Sits above the collage but below the heading, so the cream type has
          contrast without the panel ever fully going black. */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background: "#0E0E0A",
          opacity: WORK_REVEAL.scrimOpacity * spread,
        }}
        aria-hidden="true"
      />

      <h2
        className="absolute z-10 whitespace-nowrap"
        style={{
          // Figma pins this to `50% - 476px`, which is exact only for the
          // design's own typeface: Chamberi Headline sets the string 953px
          // wide, but Cormorant renders it 1004px, so the same offset would
          // leave the heading ~26px off-centre. Centring on the box instead
          // keeps it optically centred for whichever face actually loads.
          left: "50%",
          top: boxTop,
          fontSize,
          lineHeight: `${fontSize}px`,
          transform: "translateX(-50%)",
          // Two flex children so the gap is real layout rather than margin
          // guesswork, and each word can be translated independently.
          display: "flex",
          color: colour,
        }}
      >
        <span
          style={{
            transform: `translateX(${-spread * WORK_REVEAL.splitX}px)`,
            transition: "color 120ms linear",
          }}
        >
          THE
        </span>
        <span aria-hidden="true" style={{ width: gap }} />
        <span
          style={{
            transform: `translateX(${spread * WORK_REVEAL.splitX}px)`,
            transition: "color 120ms linear",
          }}
        >
          WORK
        </span>
      </h2>
    </section>
  );
}