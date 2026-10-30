"use client";

import { COPY, DESIGN } from "@/lib/content";
import { PhotoSlot } from "./PhotoSlot";

/**
 * Hamburger glyph, inlined from Figma `akar-icons:three-line-horizontal`
 * (`node 8066:529`): 48x48, three lines at y 12/24/36, stroke #565448.
 */
function MenuGlyph() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10 12H38M10 24H38M10 36H38"
        stroke="#565448"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PanelOne({ onMenuOpen }: { onMenuOpen?: () => void }) {
  return (
    <section
      style={{ width: DESIGN.panelOneWidth }}
      className="relative h-full shrink-0 bg-cream"
      aria-label="Introduction"
    >
      {/* Sidebar from `node 8066:525`: 115px, cream, 0.25px #565448 border. */}
      <div className="absolute left-0 top-0 h-full w-[115px] border-[0.25px] border-[#565448]">
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Open menu"
          className="absolute cursor-pointer"
          style={{ left: 34, top: 20 }}
        >
          <MenuGlyph />
        </button>
        <div className="absolute left-0 top-[84px] h-px w-[115px] bg-[#565448]" />

        {/* Vertical name centered in the sidebar, year pinned near the
            bottom (`node 8066:526`). */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="vertical-rl-upright text-[32px] leading-8 tracking-[0.01em]">
            {COPY.name}
          </span>
        </div>
        <div className="pointer-events-none absolute bottom-[18px] left-0 flex w-full justify-center">
          <span className="vertical-rl-upright text-center text-[15px] leading-[15px]">
            {COPY.year}
          </span>
        </div>
      </div>

      {/* Photo stack from `node 8066:532` / `8066:533`: #d9d9d9 placeholder
          with the 429x567 portrait at top 203, object-bottom. */}
      <div className="absolute left-[115px] top-0 h-full w-[514px] photo-slot" />
      <PhotoSlot
        src="/photos/portrait.png"
        alt="Portrait of Prativa Dahal"
        width={429}
        height={567}
        priority
        className="absolute left-[115px] top-[203px] w-[429px] h-[567px]"
      />
    </section>
  );
}
