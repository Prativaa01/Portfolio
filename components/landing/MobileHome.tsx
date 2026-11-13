"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HOME, CASE_STUDIES, EXPERTISE, SOCIALS, SOCIAL_HREFS } from "@/lib/home";
import { useStudy } from "../StudyContext";
import type { StudyKey } from "../WorksMenu";
import { useContactModal } from "../ContactModal";
import { LiquidChrome } from "../LiquidChrome";
import { WorkCube } from "./WorkCube";

/**
 * Vertical mobile presentation of the landing page (below 768px).
 *
 * The desktop landing is a scaled horizontal frame; on phones the panels
 * become stacked full-width sections that keep the design's palette, type
 * and content while scrolling naturally in the document direction.
 */

/** Which case-studies row opens which study. */
const STUDY_FOR_CASE: Record<string, StudyKey | undefined> = {
  CAREMATE: "caremate",
  PROLEAP: "proleap",
  ARKIVA: "arkiva",
  AEVA: "aeva",
};

/** Arrow-up-right glyph, same as the desktop case-studies rows. */
function ArrowUpRight({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7 17 17 7m0 0H8m9 0v9"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="square"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function MobileHome() {
  const { openStudy } = useStudy();
  const { openContactModal } = useContactModal();
  // Expertise card with its hover picture revealed (tap to toggle).
  const [flipped, setFlipped] = useState<number | null>(null);
  // Square canvas for the 3D work cube, sized to the viewport.
  const [cubeSize, setCubeSize] = useState(340);

  useEffect(() => {
    const update = () => setCubeSize(Math.min(window.innerWidth - 48, 460));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="w-full bg-canvas">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        aria-label="Prativa Dahal"
        className="relative flex min-h-[92svh] items-center overflow-hidden bg-black"
      >
        <LiquidChrome />
        <h1
          className="pointer-events-none relative z-10 cursor-default select-none px-6 font-semibold whitespace-pre-line text-[#d8d0bd]"
          style={{
            fontSize: "clamp(60px, 21vw, 120px)",
            lineHeight: 1,
          }}
        >
          {"PRATIVA\nDAHAL"}
          <span className="sr-only">
            — Product Designer in Kathmandu, Nepal · UI/UX &amp; digital products
          </span>
        </h1>
      </section>

      {/* ── Person behind the pixel ──────────────────────────────────── */}
      <section aria-label="Person behind the pixel" className="bg-cream px-6 py-16 text-ink">
        <h2
          className="font-semibold uppercase"
          style={{ fontSize: "clamp(30px, 8.5vw, 44px)", lineHeight: 1.05 }}
        >
          PERSON BEHIND THE PIXEL
        </h2>

        <div className="mt-10 flex justify-center">
          {/* Placeholder sits behind and slightly larger than the photo,
              matching the desktop panel's stacked rectangles. */}
          <div className="relative">
            <div className="absolute left-2.5 top-2.5 h-full w-[calc(100%+5px)] bg-slot" />
            <Image
              src="/photos/profile.png"
              alt="Portrait of Prativa Dahal"
              width={319}
              height={422}
              priority
              className="relative object-cover object-bottom"
              style={{ width: "min(64vw, 300px)", height: "auto" }}
            />
          </div>
        </div>

        <Link
          href="/about-me"
          className="mt-10 flex w-fit items-center gap-3 font-ruda text-[22px] font-semibold leading-none text-ink"
        >
          Myself
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 12h18m0 0-7-7m7 7-7 7"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="square"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </Link>
      </section>

      {/* ── The work ─────────────────────────────────────────────────── */}
      <section
        aria-label="The work"
        className="flex flex-col items-center overflow-hidden bg-cream px-6 py-16 text-ink"
      >
        <h2
          className="select-none text-center font-semibold uppercase"
          style={{ fontSize: "clamp(44px, 13vw, 80px)", lineHeight: 1 }}
        >
          THE WORK
        </h2>
        <div
          className="mt-4"
          style={{ width: cubeSize, height: cubeSize }}
          aria-label="3D interactive project cube with physics and gravity"
          role="region"
        >
          <WorkCube reveal={1} width={cubeSize} height={cubeSize} />
        </div>
      </section>

      {/* ── Case studies ─────────────────────────────────────────────── */}
      <section aria-label="Case studies" className="bg-sand px-6 py-16 text-ink">
        <h2
          className="font-semibold uppercase"
          style={{ fontSize: "clamp(30px, 8.5vw, 44px)", lineHeight: 1.05 }}
        >
          CASE STUDIES
        </h2>

        <ul className="mt-10 w-full">
          {CASE_STUDIES.map((name, i) => (
            <li key={name} className={i > 0 ? "border-t border-rule/60" : ""}>
              <button
                type="button"
                onClick={() => {
                  const key = STUDY_FOR_CASE[name];
                  if (key) openStudy(key);
                }}
                aria-label={`Open ${name} case study`}
                className="group flex w-full cursor-pointer items-center justify-between py-5 text-left"
              >
                <span className="font-ruda text-[26px] font-bold leading-none text-[#0e0e0a] transition-opacity duration-200 group-active:opacity-60">
                  {name}
                </span>
                <span className="inline-flex items-center text-[#0e0e0a]">
                  <ArrowUpRight size={26} />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-8 font-ruda text-[11px] uppercase leading-[16px] tracking-[0.6px] text-ink/60">
          *Livesite unavailable for some inactive
          <br />
          or incomplete project
        </p>

        <Link
          href="/about-me?view=work"
          className="mt-6 flex w-fit items-center gap-3 font-ruda text-[18px] font-extrabold text-ink transition-opacity duration-200 active:opacity-60"
          aria-label="View all portfolio work"
        >
          View all work
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 12h18m0 0-7-7m7 7-7 7"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="square"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </Link>
      </section>

      {/* ── Expertise ────────────────────────────────────────────────── */}
      <section aria-label="Expertise" className="bg-night px-6 py-16 text-cream">
        <h2
          className="font-semibold uppercase"
          style={{ fontSize: "clamp(30px, 8.5vw, 44px)", lineHeight: 1.05 }}
        >
          EXPERTISE
        </h2>

        <div className="mt-10 flex flex-col gap-5">
          {EXPERTISE.map((item, i) => (
            <button
              key={item.num}
              type="button"
              onClick={() => setFlipped((cur) => (cur === i ? null : i))}
              aria-pressed={flipped === i}
              className="relative isolate w-full cursor-pointer overflow-hidden border border-cream/60 text-left"
              style={{ aspectRatio: "440 / 560" }}
            >
              {/* Tap-revealed picture, same treatment as the desktop hover
                  state: 20% black gradient over the card mockup. */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
                style={{
                  opacity: flipped === i ? 1 : 0,
                  backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), url(${item.img})`,
                  backgroundSize: "cover, cover",
                  backgroundPosition: "center, center",
                }}
                role="img"
                aria-label={item.title}
              />

              <div
                className="absolute inset-0 z-10 flex flex-col p-5 transition-opacity duration-200 ease-out"
                style={{ opacity: flipped === i ? 0 : 1 }}
              >
                <span
                  className="font-display leading-none"
                  style={{ fontSize: 36, fontVariantNumeric: "lining-nums" }}
                >
                  {item.num}
                </span>
                <span
                  className="mt-[38%] w-full text-center font-display uppercase leading-tight"
                  style={{ fontSize: 21 }}
                >
                  {item.title}
                </span>
                <span className="mx-auto mt-auto w-full pb-2 text-center font-ruda text-[13px] leading-[1.45] text-cream/85">
                  {item.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Socials ──────────────────────────────────────────────────── */}
      <section aria-label="Social links" className="bg-ink px-6 py-14 text-cream">
        <div className="flex flex-wrap gap-x-5 gap-y-4">
          {SOCIALS.map((label, i) => {
            const href = SOCIAL_HREFS[i];
            const opensPopup = label === "MAIL" || label === "DISCORD";
            const shared =
              "flex flex-col gap-1 font-ruda text-[15px] leading-none text-[#E8E1D3]";

            const labelNode = (
              <>
                <span>{label}</span>
                <span className="block h-px w-full bg-[#E8E1D3]" />
              </>
            );

            if (opensPopup) {
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => openContactModal(label === "MAIL" ? "mail" : "discord")}
                  className={`cursor-pointer border-none bg-transparent p-0 text-left ${shared}`}
                >
                  {labelNode}
                </button>
              );
            }
            return (
              <a
                key={label}
                href={href}
                {...(href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noreferrer noopener" })}
                className={shared}
              >
                {labelNode}
              </a>
            );
          })}
        </div>

        <p className="mt-12 font-ruda text-[13px] tracking-[1px] text-[#E8E1D3]">
          WHERE EVERY PIXEL TELLS A STORY
        </p>
      </section>
    </div>
  );
}
