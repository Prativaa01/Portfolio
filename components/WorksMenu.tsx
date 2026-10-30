"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { COPY } from "@/lib/content";
import { ContactCard } from "./ContactCard";

/**
 * Menu / Works overlay from the live "Works" frame (`node 8066:548`).
 *
 * A 3134x770 design frame (1566 dark menu panel + 1568 cream all-work
 * panel) scaled to the viewport height, opened from the hamburger on the
 * myself page. Same scaler + wheel-to-horizontal pattern as `Frame`.
 */

const FRAME_WIDTH = 3134;
const FRAME_HEIGHT = 770;
const MENU_PANEL_WIDTH = 1566;
const WORKS_PANEL_X = 1566;

/**
 * The menu panel must cover the whole first screen, so it stretches past
 * its 1566px design width on wide viewports. Same buffer rationale as
 * Frame's HERO_COVER_BUFFER.
 */
const MENU_COVER_BUFFER = 32;

/** Which card opens which case study (card 03 has none yet). */
export type StudyKey = "caremate" | "caremate-full" | "aeva" | "aeva-full" | "proleap";
const STUDY_FOR_CARD: (StudyKey | undefined)[] = [
  "caremate",
  "aeva",
  undefined,
  "proleap",
];

/** Nav links from `node 8066:558`: 175.34px, #565448, 29px column gap. */
const NAV_FONT_SIZE = 175.34;

/** Right-panel cards (`node 8066:574 / 581 / 588 / 595`), built exactly as
 * the Figma components specify: image, then a caption grid where the
 * category, number and name share one grid cell and separate purely by
 * margins — the number spans the full row height with the category and
 * name offset into it. Per-card ml values kept verbatim. */
const CARDS = [
  {
    num: "01.",
    name: "CAREMATE",
    category: "HEALTHCARE-2026",
    img: "/images/works/caremate.png",
    width: 720,
    height: 652,
    left: 134,
    top: 317,
    nameMl: 71,
    catMl: 71,
  },
  {
    num: "02.",
    name: "AEVA",
    category: "E-commerce-2025",
    // Exact match: same file the case-studies panel already previews.
    img: "/images/projects/aeva.png",
    width: 462,
    height: 422,
    left: 481,
    top: 395,
    nameMl: 81,
    catMl: 85.27,
  },
  {
    num: "03.",
    name: "PRO REPAIR GURU",
    category: "E-commerce-2025",
    img: "/images/works/pro-repair-guru.jpg",
    width: 1024,
    height: 682,
    left: 837,
    top: 317,
    nameMl: 86,
    catMl: 71,
  },
  {
    num: "04.",
    name: "PROLEAP",
    category: "Pet healthcare-2026",
    // Exact match: same file the case-studies panel already previews.
    img: "/images/projects/proleap.png",
    width: 462,
    height: 422,
    left: 1165,
    top: 395,
    nameMl: 86,
    catMl: 71,
  },
] as const;

/** Socials + hrefs from `node 8066:566` (designer's real profiles). */
const SOCIALS = [
  { label: "INSTAGRAM", href: "https://www.instagram.com/prativa_designs/?hl=en", width: 128 },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/prativadahal01", width: 96 },
  { label: "BEHANCE", href: "https://www.behance.net/prativadahal01", width: 105 },
  { label: "TIKTOK", href: "https://www.tiktok.com/@prateeva.dahal8?_r=1&_t=ZS-9AD6H3uHAfJ", width: 82 },
] as const;

export function WorksMenu({
  open,
  onClose,
  onOpenStudy,
  inactive = false,
}: {
  open: boolean;
  onClose: () => void;
  onOpenStudy?: (key: StudyKey) => void;
  /** Suspends menu shortcuts while a study overlay sits above it. */
  inactive?: boolean;
}) {
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const update = () => setScale(Math.max(0.4, window.innerHeight / FRAME_HEIGHT));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  // Viewport width in screen px, so the menu panel can stretch to cover
  // the whole first screen (same heroFill idea as `Frame`).
  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => setViewportWidth(el.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);

  // Start at the menu panel on every open.
  useEffect(() => {
    if (open) scrollerRef.current?.scrollTo({ left: 0 });
  }, [open]);

  // Wheel maps to horizontal, same as the page frames.
  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      const isTrackpad = Math.abs(event.deltaY) < 50;
      el.scrollLeft += event.deltaY * (isTrackpad ? 1 : 1.5);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open]);

  // ESC closes (suspended while a study overlay is on top).
  useEffect(() => {
    if (!open || inactive) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, inactive, onClose]);

  if (!open) return null;

  // Extra night width so the menu panel covers the whole first screen —
  // without it the cream works panel peeks in at the right edge on wide
  // desktops. Design-anchored content stays left-pinned; only the
  // background extends.
  const menuFill =
    scale > 0 && viewportWidth > 0
      ? Math.max(0, viewportWidth / scale - MENU_PANEL_WIDTH + MENU_COVER_BUFFER)
      : 0;
  const totalWidth = FRAME_WIDTH + menuFill;
  const worksX = (WORKS_PANEL_X + menuFill) * scale;
  const scrollToWorks = () =>
    scrollerRef.current?.scrollTo({ left: worksX, behavior: "smooth" });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu and all work"
      className="fixed inset-0 z-50 bg-night"
    >
      <div
        ref={scrollerRef}
        className="flex h-full w-full items-center overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="relative shrink-0"
          style={{ width: totalWidth * scale, height: FRAME_HEIGHT * scale }}
        >
          <div
            className="absolute left-0 top-0 flex"
            style={{
              width: totalWidth,
              height: FRAME_HEIGHT,
              transform: scale === 1 ? undefined : `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {/* Menu panel from `node 8066:550`, stretched by menuFill so the
                night background covers the whole first screen. */}
            <section
              className="relative h-full shrink-0 bg-night text-cream"
              style={{ width: MENU_PANEL_WIDTH + menuFill }}
              aria-label="Menu"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%)",
                }}
              />

              {/* Sidebar: cream 0.25px border on night (`node 8066:551`). */}
              <div className="absolute left-0 top-0 h-full w-[115px] border-[0.25px] border-cream">
                {/* Menu-state glyph (`node 8066:557` "Vector"): a single 28px
                    white dash where the hamburger was — doubles as close. */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="absolute cursor-pointer"
                  style={{ left: 58, top: 42 }}
                >
                  <svg width="29" height="1" viewBox="0 0 29 1" fill="none" aria-hidden="true">
                    <path d="M28.5 0.5H0.5" stroke="white" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="absolute left-0 top-[84px] h-px w-[115px] bg-cream" />

                <div className="absolute left-[61px] top-[300px] flex w-6 flex-col items-center">
                  <span className="vertical-rl-upright text-[24px] leading-6 tracking-[0.01em]">
                    {COPY.name}
                  </span>
                  <span aria-hidden="true" className="h-[247px] w-0 shrink-0" />
                  <span className="vertical-rl-upright text-center text-[15px] leading-[15px]">
                    {COPY.year}
                  </span>
                </div>

                {/* Minus glyph (`node 8066:556`, akar-icons:minus). */}
                <div className="absolute" style={{ left: 45.75, top: 372.75 }} aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14" stroke="#FFFAF4" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Nav from `node 8066:558`. */}
              <nav
                className="absolute flex flex-col items-start"
                style={{ left: 185, top: 44, gap: 29 }}
                aria-label="Site"
              >
                <Link
                  href="/"
                  className="whitespace-nowrap leading-[1.185] text-[#565448] transition-colors duration-200 hover:text-cream"
                  style={{ fontSize: NAV_FONT_SIZE }}
                >
                  HOME
                </Link>
                <Link
                  href="/about-me"
                  onClick={onClose}
                  className="cursor-pointer whitespace-nowrap leading-[1.185] text-[#565448] transition-colors duration-200 hover:text-cream"
                  style={{ fontSize: NAV_FONT_SIZE }}
                >
                  ABOUT
                </Link>
                <button
                  type="button"
                  onClick={scrollToWorks}
                  className="cursor-pointer whitespace-nowrap leading-[1.185] text-[#565448] transition-colors duration-200 hover:text-cream text-left"
                  style={{ fontSize: NAV_FONT_SIZE }}
                >
                  WORKS
                </button>
              </nav>

              {/* Contact Me card near nav — sends directly to Discord */}
              <div
                className="absolute z-20"
                style={{ left: 740, top: 180 }}
              >
                <ContactCard variant="panel" />
              </div>

              {/* CLOSE + socials column from `node 8066:562`. */}
              <div
                className="absolute flex flex-col items-end"
                style={{ left: 1043, top: 90, width: 441, gap: 544 }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer whitespace-nowrap leading-none"
                  style={{ fontSize: 32 }}
                >
                  CLOSE
                </button>
                <div className="flex items-center" style={{ gap: 10 }}>
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-ruda leading-none underline [text-underline-position:from-font]"
                      style={{ fontSize: 20, width: s.width }}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* All-work panel from `node 8066:571`. */}
            <section
              className="relative h-full shrink-0 bg-cream text-ink"
              style={{ width: 1568 }}
              aria-label="All work"
            >
              <h2
                className="absolute whitespace-pre"
                style={{ left: 135, top: 52, fontSize: 208.236, lineHeight: "208.236px" }}
              >
                ALL WORK (4)
              </h2>

              {CARDS.map((card, i) => {
                // Cards 01, 02 and 04 open their case study.
                const studyKey = STUDY_FOR_CARD[i];
                const clickable = studyKey !== undefined && onOpenStudy !== undefined;
                const CardTag = clickable ? "button" : "div";
                return (
                <CardTag
                  key={card.name}
                  {...(clickable
                    ? {
                        type: "button" as const,
                        onClick: () => onOpenStudy(studyKey as StudyKey),
                        "aria-label": `Open ${card.name} case study`,
                      }
                    : {})}
                  className={`absolute flex flex-col items-center${clickable ? " cursor-pointer text-left" : ""}`}
                  style={{ left: card.left, top: card.top, width: 267.544, gap: 15 }}
                >
                  <div className="relative h-[250px] w-full shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.img}
                      alt={`${card.name} project preview`}
                      className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                    />
                  </div>
                  {/* Caption grid verbatim from the components
                      (`node 8066:576 / 583 / 590 / 597`): single max-content
                      cell shared by category, number and name, separated
                      only by the design's own ml/mt offsets. */}
                  <div className="relative grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start shrink-0 whitespace-nowrap [word-break:break-word]">
                    <p
                      className="relative col-start-1 row-start-1 font-ruda font-normal leading-none text-black"
                      style={{
                        fontSize: 14,
                        marginLeft: card.catMl,
                        marginTop: 13,
                      }}
                    >
                      {card.category}
                    </p>
                    <div className="relative col-start-1 row-start-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start">
                      <p
                        className="relative col-start-1 row-start-1 leading-none"
                        style={{
                          color: "#0e0e0a",
                          fontSize: 64,
                          marginLeft: 0,
                          marginTop: 0,
                        }}
                      >
                        {card.num}
                      </p>
                      <p
                        className="relative col-start-1 row-start-1 font-ruda font-normal leading-none text-black"
                        style={{
                          fontSize: 24,
                          marginLeft: card.nameMl,
                          marginTop: 36,
                        }}
                      >
                        {card.name}
                      </p>
                    </div>
                  </div>
                </CardTag>
                );
              })}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
