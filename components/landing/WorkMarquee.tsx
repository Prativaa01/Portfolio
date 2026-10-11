"use client";

import Image from "next/image";
import { MARQUEE, PROJECTS } from "@/lib/home";

/**
 * Infinite, bidirectional image marquee sitting behind the "THE WORK" heading.
 *
 * Two rows drift against each other; each row renders its tiles twice and
 * translates by exactly -50% so the loop is seamless. Hovering a tile lifts it
 * out of the row (scale + shadow + raised stacking) without ever covering the
 * heading — the whole layer stays below the text in z-order.
 */
function Row({
  reverse,
  top,
}: {
  reverse: boolean;
  top: number;
}) {
  const track = (
    <div className="flex shrink-0" style={{ gap: MARQUEE.tileGap }}>
      {PROJECTS.map((project) => (
        <div
          key={project.name}
          className="group/tile relative shrink-0 transition-transform duration-500 ease-out hover:z-20 hover:scale-[1.06]"
        >
          <Image
            src={project.img}
            alt={project.name}
            width={MARQUEE.tileWidth}
            height={MARQUEE.tileHeight}
            className="block h-auto w-full transition-shadow duration-500 group-hover/tile:shadow-[0_18px_40px_rgba(17,18,13,0.28)]"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="absolute flex w-max"
      style={{
        top,
        animation: `marquee-${reverse ? "reverse" : "forward"} ${MARQUEE.durationSeconds}s linear infinite`,
      }}
    >
      {/* duplicated once so the -50% translate wraps without a seam */}
      {track}
      <div aria-hidden="true" className="flex shrink-0" style={{ gap: MARQUEE.tileGap }}>
        {PROJECTS.map((project) => (
          <div
            key={`dup-${project.name}`}
            className="group/tile relative shrink-0 transition-transform duration-500 ease-out hover:z-20 hover:scale-[1.06]"
          >
            <Image
              src={project.img}
              alt=""
              aria-hidden="true"
              width={MARQUEE.tileWidth}
              height={MARQUEE.tileHeight}
              className="block h-auto w-full transition-shadow duration-500 group-hover/tile:shadow-[0_18px_40px_rgba(17,18,13,0.28)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkMarquee() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        // Soften both ends so tiles enter and leave instead of being sliced off.
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 11%, black 89%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 11%, black 89%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      {MARQUEE.rows.map((row) => (
        <div key={row.top} className="pointer-events-auto">
          <Row reverse={row.reverse} top={row.top} />
        </div>
      ))}
    </div>
  );
}