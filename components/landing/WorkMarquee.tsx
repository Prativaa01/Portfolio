"use client";

import Image from "next/image";
import { MARQUEE, PROJECTS, WORK_REVEAL } from "@/lib/home";

/**
 * The infinite image marquee behind the "THE WORK" heading.
 *
 * A fixed, centred window clips two rows of landscape tiles that drift in
 * opposite directions. Each row renders its tiles twice and translates by
 * exactly -50%, so the loop wraps without a seam. The whole layer is clipped
 * by the window, which is what keeps the motion contained to the middle of the
 * panel instead of washing across it.
 *
 * As the panel centres, `reveal` scales that window up until it covers the
 * whole panel. The window is already centred on the panel's centre, so scaling
 * from `transform-origin: center` is all that is needed — the clip window grows
 * outward symmetrically and the tiles get to fill the frame.
 *
 * The heading sits above this layer (z-10 on the <h2>), so the type always
 * stays legible — a hovered tile lifts within the image layer but can never
 * cover the words.
 */
function Tile({ project, decorative }: { project: (typeof PROJECTS)[number]; decorative: boolean }) {
  return (
    <div className="group/tile relative shrink-0 transition-transform duration-500 ease-out hover:z-20 hover:scale-[1.12]">
      <Image
        src={project.img}
        alt={decorative ? "" : project.name}
        aria-hidden={decorative}
        width={MARQUEE.tileWidth}
        height={MARQUEE.tileHeight}
        className="block h-full w-full object-cover transition-shadow duration-500 group-hover/tile:shadow-[0_10px_24px_rgba(17,18,13,0.3)]"
      />
    </div>
  );
}

function Track({ reverse, top }: { reverse: boolean; top: number }) {
  return (
    <div
      className="absolute w-full"
      style={{
        top,
        // vertical drift; the two rows run in antiphase
        animation: `marquee-drift-${reverse ? "down" : "up"} ${MARQUEE.driftSeconds}s ease-in-out infinite`,
      }}
    >
      <div
        className="flex w-max"
        style={{
          gap: MARQUEE.tileGap,
          animation: `marquee-${reverse ? "reverse" : "forward"} ${MARQUEE.durationSeconds}s linear infinite`,
        }}
      >
        {PROJECTS.map((project) => (
          <Tile key={project.name} project={project} decorative={false} />
        ))}
        {/* second copy makes the -50% translate a seamless loop */}
        {PROJECTS.map((project) => (
          <Tile key={`dup-${project.name}`} project={project} decorative />
        ))}
      </div>
    </div>
  );
}

/** Slows the clip window down and up so the expansion has weight. */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Linear remap of `value` across [from, to], clamped to 0..1. */
function span(value: number, from: number, to: number) {
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}

export function WorkMarquee({ reveal = 0 }: { reveal?: number }) {
  const grow = easeOutCubic(span(reveal, 0, 1));
  const scale = 1 + (WORK_REVEAL.coverScale - 1) * grow;

  return (
    <div
      className="pointer-events-none absolute z-0 overflow-hidden"
      style={{
        left: MARQUEE.windowLeft,
        top: MARQUEE.windowTop,
        width: MARQUEE.windowWidth,
        height: MARQUEE.windowHeight,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      {MARQUEE.rows.map((row) => (
        <div key={row.top} className="pointer-events-auto">
          <Track reverse={row.reverse} top={row.top} />
        </div>
      ))}
    </div>
  );
}