"use client";

import Image from "next/image";
import { COPY } from "@/lib/content";

/**
 * Vertical mobile presentation of the about page's three panels
 * (below 768px). The horizontal scaled frame stays desktop-only; on
 * phones the same content stacks in document order, and the hamburger
 * opens the shared WorksMenu overlay (which has its own mobile layout).
 */

export function MobileAbout({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <div className="w-full bg-canvas">
      {/* Fixed menu button — the mobile counterpart of the desktop
          sidebar's always-visible hamburger. */}
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Open menu"
        className="fixed left-4 top-4 z-40 flex size-12 cursor-pointer items-center justify-center rounded-full border border-[#565448]/60 bg-cream/90 backdrop-blur-sm"
      >
        <svg width="22" height="22" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
          <path d="M10 12H38M10 24H38M10 36H38" stroke="#565448" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* ── Panel one: intro + portrait ──────────────────────────────── */}
      <section aria-label="Introduction" className="bg-cream px-6 pb-14 pt-24 text-ink">
        <h1
          className="font-semibold uppercase"
          style={{ fontSize: "clamp(44px, 13vw, 84px)", lineHeight: 0.98 }}
        >
          {COPY.name}
        </h1>
        <p className="mt-3 font-ruda text-[12px] uppercase tracking-[1.6px] text-[#565448]">
          {COPY.year} · PORTFOLIO
        </p>

        <div className="photo-slot mt-10 w-full max-w-md" style={{ aspectRatio: "429 / 567" }}>
          <Image
            src="/photos/portrait.png"
            alt="Portrait of Prativa Dahal"
            width={429}
            height={567}
            priority
            className="h-full w-full object-cover object-bottom"
          />
        </div>
      </section>

      {/* ── Panel two: statement + philosophy ────────────────────────── */}
      <section aria-label="About and philosophy" className="bg-ink px-6 py-16 text-cream">
        <p
          className="font-thin-figma text-cream"
          style={{ fontSize: "clamp(22px, 6.4vw, 30px)", lineHeight: 1.3 }}
        >
          {COPY.statement}
        </p>

        <div className="mt-12 flex flex-col gap-8">
          {COPY.columns.map((column, i) => (
            <p key={i} className="font-thin-figma text-[15px] leading-[1.6] text-cream/90">
              {column}
            </p>
          ))}
        </div>

        <div className="mt-14 border-t border-cream/25 pt-8">
          <p className="font-thin-figma text-[15px] font-semibold uppercase tracking-[1.6px] text-cream">
            {COPY.philosophyLabel}
          </p>
          <p className="mt-4 font-thin-figma text-[15px] leading-[1.6] text-cream/80">
            {COPY.philosophyNote}
          </p>
        </div>
      </section>

      {/* ── Panel three: at work ─────────────────────────────────────── */}
      <section aria-label="Photograph" className="bg-cream px-6 py-14 text-ink">
        <div className="photo-slot w-full" style={{ aspectRatio: "741 / 770" }}>
          <Image
            src="/photos/myself-at-work.png"
            alt="Prativa Dahal at her laptop"
            width={741}
            height={770}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-8 flex justify-center">
          <svg width="96" height="132" viewBox="0 0 215 295" fill="none" aria-hidden="true">
            <rect x="0.5" y="0.5" width="214" height="294" stroke="#565448" />
            <path d="M1.5 1L214 294.5" stroke="#565448" />
          </svg>
        </div>
      </section>
    </div>
  );
}
