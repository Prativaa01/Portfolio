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

export function WorkPanel() {
  const { fontSize, boxTop } = HOME.work;
  const panelRef = useRef<HTMLElement>(null);
  const reveal = useRevealProgress(panelRef, WORK_REVEAL.travel);

  const spread = easeInOutCubic(reveal);

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

      {/*
        The heading stays ink-black for the whole reveal, as in the design.
        That is why the cluster only grows to WORK_REVEAL.coverScale rather
        than filling the panel — black type over a full-bleed collage of
        screenshots is unreadable, and the design keeps the images as a
        contained group behind the words.
      */}
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
        }}
      >
        <span style={{ transform: `translateX(${-spread * WORK_REVEAL.splitX}px)` }}>
          THE
        </span>
        <span aria-hidden="true" style={{ width: gap }} />
        <span style={{ transform: `translateX(${spread * WORK_REVEAL.splitX}px)` }}>
          WORK
        </span>
      </h2>
    </section>
  );
}