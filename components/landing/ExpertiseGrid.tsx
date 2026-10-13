"use client";

import { useState } from "react";
import { HOME, EXPERTISE } from "@/lib/home";

/**
 * The four expertise cards.
 *
 * Geometry comes from the Figma component (`node 8066:509`): a 440x802 card
 * with a 0.5px cream border on `#11120D`, and copy at fixed offsets — the
 * number at `calc(50% - 167px)` / top 40.5, the title centred at
 * `calc(50% - 16px)`, and the description centred at top 588.5 as three
 * `leading-none` lines.
 *
 * The component exposes only a `Default` variant, so there is no designed
 * hover. What the design does show is the picture swapping in behind the copy,
 * and the copy never moving — so the hover here fades an image up underneath a
 * copy layer that stays pinned at exactly the same coordinates.
 */
export function ExpertiseGrid() {
  const e = HOME.expertise;
  // Card index under the pointer, or null.
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      className="relative shrink-0 bg-night text-cream"
      style={{ width: 2394, height: HOME.frameHeight }}
      aria-label="Expertise"
    >
      <h2
        className="absolute whitespace-nowrap"
        style={{
          // Figma pins this at `calc(50% - 1156px)`; kept as the same centre
          // offset so it tracks the 2394-wide panel exactly as designed.
          left: `calc(50% - ${e.label.centreOffset}px)`,
          top: e.label.boxTop,
          fontSize: e.label.fontSize,
          lineHeight: `${e.label.fontSize}px`,
        }}
      >
        EXPERTISE
      </h2>

      {e.borderLefts.map((left) => (
        <div
          key={left}
          className="absolute bg-cream"
          style={{
            left,
            top: 0,
            width: e.borderThickness,
            height: HOME.frameHeight,
          }}
        />
      ))}

      {EXPERTISE.map((item, i) => (
        <div
          key={item.num}
          className="group absolute isolate"
          style={{
            left: e.borderLefts[i],
            top: 0,
            width: e.cardWidth,
            height: HOME.frameHeight,
            border: `${e.cardBorderWidth}px solid #fffaf4`,
          }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered((cur) => (cur === i ? null : cur))}
        >
          {/* Hover picture. Sits beneath the copy and runs the card's full
              length, so the words stay pinned while the image fades up under
              them rather than shifting to accommodate it. */}
          <div
            className="pointer-events-none absolute -z-10 transition-opacity duration-500 ease-out"
            style={{
              left: 0,
              top: 0,
              width: "100%",
              height: HOME.frameHeight,
              opacity: hovered === i ? 1 : 0,
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            role="img"
            aria-label={item.title}
          />

          {/* Copy layer sits above the image and fades out on hover.

              The hover picture already has "0n", the title and the body baked
              into the PNG, so keeping the live copy on screen as well would
              render the words twice — and visibly out of register, because
              the baked copy was laid out at the older per-card staggered
              offsets while the live copy now uses Figma's single shared
              position. Handing the copy over to the picture avoids that
              entirely and matches how the mockup is meant to read. */}
          <div
            className="absolute inset-0 z-10 transition-opacity duration-200 ease-out"
            style={{ opacity: hovered === i ? 0 : 1 }}
          >
            <div
              className="absolute whitespace-nowrap"
              style={{
                left: e.numberLeft,
                top: e.numberBoxTop,
                fontSize: e.numberFontSize,
                lineHeight: `${e.numberFontSize}px`,
                fontVariantNumeric: "lining-nums",
                fontFeatureSettings: '"lnum" 1',
              }}
            >
              {item.num}
            </div>

            <h3
              className="absolute w-full text-center whitespace-nowrap"
              style={{
                top: e.titleBoxTop,
                fontSize: e.titleFontSize,
                lineHeight: `${e.titleFontSize}px`,
              }}
            >
              {item.title}
            </h3>

            {/* Centre-anchored on the card, exactly as `left: 219px` plus
                `-translate-x-1/2` does in the component. */}
            <div
              className="absolute left-1/2 w-max -translate-x-1/2 text-center font-ruda"
              style={{
                top: e.bodyBoxTop,
                fontSize: e.bodyFontSize,
                lineHeight: `${e.bodyLineHeight}px`,
              }}
            >
              {item.descLines.map((line) => (
                <span key={line} className="block whitespace-pre">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}