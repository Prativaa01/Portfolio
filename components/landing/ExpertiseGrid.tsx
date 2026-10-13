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
          className="group absolute isolate"
          style={{
            left: e.borderLefts[i],
            top: 0,
            width: e.cardWidth,
            height: HOME.frameHeight,
          }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered((cur) => (cur === i ? null : cur))}
        >
          {/* Copy layer is pinned above the image and never animates.

              It deliberately carries no opacity transition: an opacity
              value other than 1 promotes this layer to its own compositing
              layer, and the text then renders twice with a few-pixel offset
              (lines visibly ghosting over each other on hover). Only the
              image fades; this stays fully opaque and pinned. */}
          <div
          className="absolute inset-0 z-10 transition-opacity duration-300 ease-out"
          style={{ opacity: hovered === i ? 0 : 1 }}
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

          {/* Hover state: only the picture changes. It runs the card's full
              length (0,0 -> cardWidth x frameHeight) and sits beneath the copy
              layer, so the number, title and description never shift or move —
              they simply stay put on top of the incoming image. */}
<div
            className="pointer-events-none absolute -z-10"
            style={{
              left: 0,
              top: 0,
              width: e.cardWidth,
              height: HOME.frameHeight,
              opacity: hovered === i ? 1 : 0,
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              // The asset is a complete hover-state mockup: "0n", the title
              // and the description are all baked into the PNG. Its copy sits
              // at one fixed spot, while the live copy is staggered per card,
              // so shift each picture to put the two back in register.
              backgroundPosition: `center calc(50% + ${e.hoverTextShift[i]}px)`,
            }}
            role="img"
            aria-label={item.title}
          />
        </div>
      ))}
    </section>
  );
}