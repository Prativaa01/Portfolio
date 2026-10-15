"use client";

import { useEffect, useRef, useState } from "react";
import { COPY } from "@/lib/content";

/**
 * ProLeap case-study overlay from the live "PROLEAP" frame
 * (`node 8103:570`). Same 1683x770 chrome as the CareMate study:
 * sidebar, Back, title, overview/details, next-project footer, and a
 * full-bleed visual panel. Opens from the ProLeap card; Back (or the
 * hamburger, or ESC) returns to ALL WORK.
 */

const FRAME_WIDTH = 1683;
const FRAME_HEIGHT = 770;

/** Back-arrow glyph (ant-design:arrow-down-outlined). */
function BackArrow() {
  return (
    <svg
      width="18.75"
      height="18.75"
      viewBox="0 0 18.75 18.75"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M15.7835 8.5199H14.3003C14.2161 8.5199 14.1355 8.55652 14.0787 8.62061L10.0706 13.2404V2.92969C10.0706 2.84912 10.0047 2.7832 9.92408 2.7832H8.82545C8.74488 2.7832 8.67897 2.84912 8.67897 2.92969V13.2404L4.67079 8.62061C4.61586 8.55652 4.53529 8.5199 4.44923 8.5199H2.96607C2.84156 8.5199 2.77381 8.66821 2.85621 8.7616L8.93348 15.7654C8.98842 15.8288 9.05633 15.8796 9.13263 15.9144C9.20892 15.9493 9.29181 15.9673 9.37568 15.9673C9.45955 15.9673 9.54244 15.9493 9.61874 15.9144C9.69503 15.8796 9.76295 15.8288 9.81788 15.7654L15.8933 8.7616C15.9757 8.66638 15.908 8.5199 15.7835 8.5199Z"
        fill="#1E1E1E"
      />
    </svg>
  );
}

/** Hamburger glyph, same as the myself page (`akar-icons:three-line-horizontal`). */
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

/** Small arrow after "LIVE SITE" (`node 8103:608`). */
function PreviewArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="rotate-90 -scale-y-100"
    >
      <path
        d="M11.8663 5.22148H10.5087C10.4316 5.22148 10.3579 5.25481 10.3059 5.31314L6.63692 9.51799V0.133328C6.63692 0.0599978 6.57658 0 6.50283 0H5.49717C5.42342 0 5.36308 0.0599978 5.36308 0.133328V9.51799L1.6941 5.31314C1.64382 5.25481 1.57007 5.22148 1.49129 5.22148H0.13365C0.0196753 5.22148 -0.0423404 5.35647 0.0330841 5.44147L5.59606 11.8162C5.64635 11.8739 5.70851 11.9202 5.77835 11.9519C5.84819 11.9836 5.92406 12 6.00084 12C6.07761 12 6.15349 11.9836 6.22332 11.9519C6.29316 11.9202 6.35533 11.8739 6.40562 11.8162L11.9669 5.44147C12.0423 5.3548 11.9803 5.22148 11.8663 5.22148Z"
        fill="#565448"
      />
    </svg>
  );
}

function Rule() {
  return <div aria-hidden="true" className="h-[0.5px] w-[534px] shrink-0 bg-[#565448]" />;
}

export function ProleapStudy({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const update = () => setScale(Math.min(1, window.innerHeight / FRAME_HEIGHT));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open ]);

  useEffect(() => {
    if (open) scrollerRef.current?.scrollTo({ left: 0 });
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ProLeap case study"
      className="fixed inset-0 z-[60] bg-sand"
    >
      <div
        ref={scrollerRef}
        className="flex h-full w-full items-center overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="relative shrink-0"
          style={{ width: FRAME_WIDTH * scale, height: FRAME_HEIGHT * scale }}
        >
          <div
            className="absolute left-0 top-0 flex bg-cream"
            style={{
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              transform: scale === 1 ? undefined : `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {/* Sidebar (`node 8103:572`). */}
            <div className="absolute left-0 top-0 h-full w-[115px] border-[0.25px] border-[#565448]">
              <button
                type="button"
                onClick={onClose}
                aria-label="Back to all work"
                className="absolute cursor-pointer"
                style={{ left: 33.75, top: 19.75 }}
              >
                <MenuGlyph />
              </button>
              <div className="absolute left-0 top-[83.75px] h-px w-[115px] bg-[#565448]" />
              <div className="absolute left-[61px] top-[300px] flex w-6 flex-col items-center">
                <span className="vertical-rl-upright text-[24px] leading-6 tracking-[0.01em]">
                  {COPY.name}
                </span>
                <span aria-hidden="true" className="h-[247px] w-0 shrink-0" />
                <span className="vertical-rl-upright text-center text-[15px] leading-[15px]">
                  {COPY.year}
                </span>
              </div>
            </div>

            {/* Back (`node 8103:579`). */}
            <button
              type="button"
              onClick={onClose}
              className="absolute flex cursor-pointer items-end font-ruda leading-none text-black"
              style={{ left: 147, top: 74, gap: 9.375, fontSize: 20 }}
            >
              <span
                className="flex shrink-0 items-center justify-center"
                style={{ width: 18.75, height: 18.75 }}
              >
                <span className="flex-none rotate-90">
                  <BackArrow />
                </span>
              </span>
              <span className="whitespace-nowrap">Back</span>
            </button>

            {/* Title (`node 8103:584`). */}
            <h2
              className="absolute"
              style={{
                left: 151.3,
                top: 104.45,
                width: 521.664,
                fontSize: 100.966,
                lineHeight: "100.966px",
              }}
            >
              PROLEAP
            </h2>

            {/* Overview + details (`node 8103:586`). */}
            <div
              className="absolute flex flex-col items-start"
              style={{ left: 157, top: 253, width: 770, gap: 47 }}
            >
              <div className="flex w-full items-start" style={{ gap: 113 }}>
                <p className="shrink-0 whitespace-nowrap font-ruda leading-none text-[#565448]" style={{ fontSize: 24 }}>
                  OVERVIEW
                </p>
                <p className="font-ruda text-[#565448]" style={{ width: 552, fontSize: 16, lineHeight: "28px" }}>
                  ProLeap is a career-focused platform designed to help people discover their potential, build
                  skills, and connect with real career opportunities. It brings together learning, mentorship,
                  workshops, and career resources to create a more practical and guided path toward career growth
                </p>
              </div>

              <div className="flex items-start" style={{ gap: 135 }}>
                <p className="shrink-0 whitespace-nowrap font-ruda leading-none text-[#565448]" style={{ fontSize: 24 }}>
                  DETAILS
                </p>
                <div className="flex flex-col items-end" style={{ width: 536, gap: 20 }}>
                  <div className="flex w-full flex-col items-start" style={{ gap: 18 }}>
                    <Rule />
                    <p className="font-ruda leading-none text-[#565448]" style={{ fontSize: 16 }}>
                      Office project
                    </p>
                  </div>
                  <div className="flex w-full flex-col items-start" style={{ gap: 18 }}>
                    <Rule />
                    <div className="flex items-center font-ruda leading-none text-[#565448]" style={{ width: 303, gap: 234, fontSize: 16 }}>
                      <p className="shrink-0">Year</p>
                      <p className="shrink-0">2026</p>
                    </div>
                  </div>
                  {/* Preview row (`node 8103:601`): label at -1.5, link group at 252.5. */}
                  <div className="flex w-full flex-col items-start" style={{ gap: 15 }}>
                    <Rule />
                    <div
                      className="relative shrink-0 font-ruda leading-none text-[#565448]"
                      style={{ width: 368.092, height: 16, fontSize: 16 }}
                    >
                      <p className="absolute whitespace-nowrap" style={{ left: -1.5, top: 0 }}>
                        Preview
                      </p>
                      <div className="absolute flex items-center justify-center" style={{ left: 252.5, top: 0, width: 107.092, gap: 8 }}>
                        <p className="shrink-0 whitespace-nowrap">LIVE SITE</p>
                        <span className="flex shrink-0 items-center justify-center" style={{ width: 12, height: 12 }}>
                          <PreviewArrow />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-start" style={{ gap: 15 }}>
                    <Rule />
                    <div className="flex items-center justify-between font-ruda leading-none text-[#565448]" style={{ width: 392, fontSize: 16 }}>
                      <p className="shrink-0">Scope</p>
                      <p className="shrink-0 whitespace-nowrap">Product Designer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next project (`node 8103:614`). */}
            <div
              className="absolute flex items-center leading-none"
              style={{ left: 157, top: 677, gap: 78 }}
            >
              <p className="shrink-0 whitespace-nowrap font-ruda text-[#565448]" style={{ fontSize: 24 }}>
                Nextproject
              </p>
              <p className="shrink-0 font-ruda font-bold text-black" style={{ width: 370, fontSize: 48 }}>
                AEVA
              </p>
            </div>

            {/* Visual panel (`node 8103:617`): full-bleed ProLeap art. */}
            <div className="absolute left-[920px] top-0 h-[770px] w-[763px] overflow-clip">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/works/proleap-hero.png"
                alt="ProLeap brand artwork"
                className="absolute inset-0 block max-w-none object-cover pointer-events-none size-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
