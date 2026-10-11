"use client";

import Image from "next/image";
import { useState } from "react";
import { HOME, EXPERTISE } from "@/lib/home";
import { displayTop, sansTop } from "@/lib/typography";

export function ExpertiseGrid() {
  const e = HOME.expertise;
  // Card index under the pointer, or null. Figma expresses this as a variant
  // swap per card; tracking it in state lets the image and the dimmed copy
  // cross-fade together within a single 300ms EASE_OUT transition.
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      className="relative shrink-0 bg-ink text-cream"
      style={{ width: 2394, height: HOME.frameHeight }}
      aria-label="Expertise"
    >
      <h2
        className="absolute whitespace-nowrap"
        style={{
          left: e.labelLeft,
          top: displayTop(e.labelInkTop, e.labelFontSize),
          fontSize: e.labelFontSize,
          lineHeight: `${e.labelFontSize}px`,
          transform: `scaleX(${e.labelScaleX})`,
          transformOrigin: "left center",
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
          className="group absolute"
          style={{
            left: e.borderLefts[i],
            top: 0,
            width: e.cardWidth,
            height: HOME.frameHeight,
          }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered((cur) => (cur === i ? null : cur))}
        >
          {/* Text layer dims to 0.7 on hover, per Variant2 in Figma. */}
          <div
            className="absolute inset-0 transition-opacity duration-300 ease-out"
            style={{ opacity: hovered === i ? 0.7 : 1 }}
          >
            <div
              className="absolute whitespace-nowrap"
              style={{
                left: e.numberOffset,
                top: displayTop(e.numberInkTops[i], e.numberFontSize),
                fontSize: e.numberFontSize,
                lineHeight: `${e.numberFontSize}px`,
                transform: `scaleX(${e.numberScaleX})`,
                transformOrigin: "left center",
                fontVariantNumeric: "lining-nums",
                fontFeatureSettings: '"lnum" 1',
              }}
            >
              {item.num}
            </div>

          <h3
            className="absolute w-full text-center whitespace-nowrap"
            style={{
              top: displayTop(e.titleInkTops[i], e.titleFontSize),
              fontSize: e.titleFontSize,
              lineHeight: `${e.titleFontSize}px`,
              transform: `scaleX(${e.titleScaleX})`,
              transformOrigin: "center center",
            }}
          >
            {item.title}
          </h3>

          <p
            className="absolute m-0 w-full px-9 text-center font-ruda"
            style={{
              top: sansTop(
                e.bodyInkTops[i],
                e.bodyFontSize,
                e.bodyLineHeight,
              ),
              fontSize: e.bodyFontSize,
              lineHeight: `${e.bodyLineHeight}px`,
            }}
          >
            {item.desc}
          </p>
          </div>

          {/* Hover state, mirroring the Figma component variant swap
              (ON_HOVER -> CHANGE_TO "Property 1=Variant2", SMART_ANIMATE,
              EASE_OUT, 300ms).

              Variant2 is layered, not a swap: a partial-width image sits at
              top 207px / 408x430, and the whole text card dims to 0.7
              underneath it. The copy therefore stays visible on hover. */}
          <div
            className="pointer-events-none absolute transition-opacity duration-300 ease-out"
            style={{
              left: 16,
              top: 207,
              width: 408.2,
              height: 430.2,
              opacity: hovered === i ? 1 : 0,
            }}
          >
            <Image
              src={item.img}
              alt={item.title}
              width={880}
              height={1604}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ))}
    </section>
  );
}