"use client";

import { useEffect, useRef, useState } from "react";
import { COPY } from "@/lib/content";
import { useStudy } from "./StudyContext";
import { ContactCard } from "./ContactCard";

/**
 * Full CareMate case study from the live "CASE STUDY OF CAREMATE" frame
 * (`node 8115:29`): a 17755x794 horizontal document — dark hero, role +
 * visual, problems, solution, background, competitive analysis, persona,
 * ideation/userflow, hifi wireframes, testing, final thoughts, connect.
 * Opens from the overview's "Case study" link; Back returns to it.
 *
 * Imagery mixes designer-supplied files (`public/images/works/case/`,
 * `public/images/works/`) with Figma-exported composites (phone mockups,
 * comparison table, flow connectors). The timer glyph is
 * `ic:sharp-timer`, an icon-component reference Figma cannot export, so a
 * minimal stroke timer stands in (noted, not redrawn from the design).
 */

const FRAME_WIDTH = 17755;
const FRAME_HEIGHT = 794;

/** Hamburger, white cut for the dark hero (`node 8115:36`). */
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
        stroke="#FFFAF4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Back arrow, white cut (ant-design:arrow-down-outlined, `node 8115:39`). */
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
        fill="#FFFAF4"
      />
    </svg>
  );
}

/**
 * Timer placeholder (`node 8115:98`, ic:sharp-timer). Icon components have
 * no exportable source, so this is a minimal stroke timer in the panel's
 * cream — a stand-in, not a trace of the design's glyph.
 */
function TimerGlyph() {
  return (
    <svg
      width="69.581"
      height="69.581"
      viewBox="0 0 70 70"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="35" cy="38" r="24" stroke="#FFFAF4" strokeWidth="4" />
      <path d="M35 38V24M35 38L45 42" stroke="#FFFAF4" strokeWidth="4" strokeLinecap="round" />
      <path d="M28 8h14M35 8v6" stroke="#FFFAF4" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** Flow connector curves (`node 8115:252` / `8115:253`, Vector 3 / 4). */
function CurveV4() {
  return (
    <svg width="166.634" height="217.025" viewBox="0 0 166.634 217.025" fill="none" aria-hidden="true" preserveAspectRatio="none" style={{ display: "block" }}>
      <path id="Vector 3" d="M0 216.738H58.2591V82.6353H97.2239V0.286312H166.634" stroke="#E2E8F0" strokeWidth="0.572624" />
    </svg>
  );
}

function CurveV5() {
  return (
    <svg width="166.634" height="217.597" viewBox="0 0 166.634 217.597" fill="none" aria-hidden="true" preserveAspectRatio="none" style={{ display: "block" }}>
      <path id="Vector 4" d="M0 217.311H58.2591V82.8531H97.2239V0.286312H166.634" stroke="#E2E8F0" stroke-width="0.572624" />
    </svg>
  );
}

/** Straight flow link (`node 8115:250`, Group 23). */
function Group23() {
  return (
    <svg width="61" height="0.795646" viewBox="0 0 61 0.795646" fill="none" aria-hidden="true" preserveAspectRatio="none" style={{ display: "block" }}>
      <g id="Group 23">
        <path id="Vector" d="M0 0.397823C27.7895 0.397823 27.7895 0.397823 55.5789 0.397823" stroke="#E2E8F0" strokeWidth="0.795646" />
      </g>
    </svg>
  );
}

/** Small flow chevrons (`node 8115:258`–`8115:264`, Vector 10–16). */
function ConnV10() {
  return (
    <svg width="40.1561" height="58.8026" viewBox="0 0 40.1561 58.8026" fill="none" aria-hidden="true" preserveAspectRatio="none" style={{ display: "block" }}>
      <path id="Vector 10" d="M0.317158 0.416025L39.3172 26.416L0.317158 58.416" stroke="#FFFAF4" />
    </svg>
  );
}

function ConnV11() {
  return (
    <svg width="59.5102" height="35.8601" viewBox="0 0 59.5102 35.8601" fill="none" aria-hidden="true" preserveAspectRatio="none" style={{ display: "block" }}>
      <path id="Vector 11" d="M0.255101 0.430027L59.2551 35.43" stroke="#FFFAF4" />
    </svg>
  );
}

function ConnV12() {
  return (
    <svg width="58.5222" height="36.3528" viewBox="0 0 58.5222 36.3528" fill="none" aria-hidden="true" preserveAspectRatio="none" style={{ display: "block" }}>
      <path id="Vector 12" d="M0.261281 35.9265C12.6613 28.3265 44.0946 9.09318 58.2613 0.426517" stroke="#FFFAF4" />
    </svg>
  );
}

function ConnV13() {
  return (
    <svg width="47.0451" height="37.4278" viewBox="0 0 47.0451 37.4278" fill="none" aria-hidden="true" preserveAspectRatio="none" style={{ display: "block" }}>
      <path id="Vector 13" d="M46.8438 36.97L1.34385 16.97L46.8438 0.470047" stroke="#FFFAF4" />
    </svg>
  );
}

function ConnV14() {
  return (
    <svg width="47.4618" height="40.917" viewBox="0 0 47.4618 40.917" fill="none" aria-hidden="true" preserveAspectRatio="none" style={{ display: "block" }}>
      <path id="Vector 14" d="M47.2542 40.4621L1.2542 19.4621L47.2542 0.462131" stroke="#FFFAF4" />
    </svg>
  );
}

function ConnV15() {
  return (
    <svg width="46.03" height="36.9269" viewBox="0 0 46.03 36.9269" fill="none" aria-hidden="true" preserveAspectRatio="none" style={{ display: "block" }}>
      <path id="Vector 15" d="M45.8337 36.4671L1.33365 17.4671L45.8337 0.467077" stroke="#FFFAF4" />
    </svg>
  );
}

function ConnV16() {
  return (
    <svg width="46.5342" height="37.4263" viewBox="0 0 46.5342 37.4263" fill="none" aria-hidden="true" preserveAspectRatio="none" style={{ display: "block" }}>
      <path id="Vector 16" d="M46.3311 36.9694L1.33115 16.9694L46.3311 0.469438" stroke="#FFFAF4" />
    </svg>
  );
}

/** Stat card shared by the problems panel. */
function StatCard({
  value,
  label,
  left,
  top,
}: {
  value: string;
  label: string;
  left: number;
  top: number;
}) {
  return (
    <div className="absolute h-[186.577px] w-[399.937px]" style={{ left, top }}>
      <div className="absolute left-0 top-0 h-[186.577px] w-[399.937px] overflow-clip bg-cream">
        <div className="absolute left-[44.94px] top-[32.69px] h-[121.203px] w-[310.062px] text-center leading-[normal] text-[#565448]">
          <p className="absolute left-[153.97px] top-0 -translate-x-1/2 whitespace-nowrap font-ruda text-[46.147px] font-extrabold">
            {value}
          </p>
          <p className="absolute left-[155.03px] top-[71.92px] w-[310.215px] -translate-x-1/2 font-ruda text-[20.473px]">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

/** SWOT card shared by the analysis panel. */
function SwotCard({
  title,
  titleLeft,
  titleWidth,
  titleTop,
  points,
}: {
  title: string;
  titleLeft: string;
  titleWidth: number;
  titleTop: number;
  points: [string, string];
}) {
  return (
    <div className="relative h-[387px] w-[330px] shrink-0 overflow-clip bg-[#565448]">
      <div
        className="absolute top-[44px] flex -translate-y-1/2 flex-col justify-center font-display text-[36px] text-cream"
        style={{ left: titleLeft, top: titleTop, width: titleWidth }}
      >
        <p className="leading-[48px]">{title}</p>
      </div>
      <div className="absolute left-[19px] top-[105px] flex w-[288px] flex-col items-center gap-[37px] text-center font-ruda text-[15px] lowercase tracking-[1.2px] text-cream">
        <div className="flex w-full flex-col justify-center">
          <p className="leading-[26px]">{points[0]}</p>
        </div>
        <div className="flex w-full flex-col justify-center">
          <p className="leading-[26px]">{points[1]}</p>
        </div>
      </div>
    </div>
  );
}

/** Solution feature card. Exact Figma 8115:127-147. */
function SolutionCard({ title, body, fixedHeight }: { title: string; body: string; fixedHeight?: number }) {
  return (
    <div
      className="flex w-[384px] shrink-0 flex-col items-start bg-[#d9d9d9] px-[26px] py-[25px]"
      style={fixedHeight !== undefined ? { height: fixedHeight } : undefined}
    >
      <div className="flex w-full flex-col items-center gap-[16px] text-center">
        <p className="w-full font-display text-[34.909px] capitalize leading-[normal] tracking-[-0.384px] text-[#313029]">{title}</p>
        <p className="w-full font-ruda text-[17.455px] leading-[1.22] tracking-[0.1745px] text-[#6b6962]">{body}</p>
      </div>
    </div>
  );
}

/** Userflow pill (white parent node). Widths match Figma 8115:203-241. */
function FlowPill({ label, width, semibold }: { label: string; width?: number; semibold?: boolean }) {
  return (
    <div
      className="flex shrink-0 flex-col items-start justify-center border-[0.573px] border-solid px-[14.316px] py-[6.299px] drop-shadow-[0px_0.573px_0.573px_rgba(0,0,0,0.05)]"
      style={{
        width: width ?? "auto",
        minHeight: 24.05,
        height: 24.05,
        whiteSpace: "nowrap",
        borderRadius: 5725.67,
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
      }}
    >
      <div
        className={`flex flex-col justify-center whitespace-nowrap font-outfit leading-[0] ${semibold ? "font-semibold" : "font-extrabold"}`}
        style={{ fontSize: 8.017, color: semibold ? "#1e293b" : "#334155" }}
      >
        <p className="leading-[11.452px]">{label}</p>
      </div>
    </div>
  );
}

/** Userflow pill (blue child node). Fixed Figma size 77.304 x 29.307, centered. */
function FlowSub({ lines, dark }: { lines: [string, string?]; dark?: boolean }) {
  return (
    <div
      className="flex w-[77.304px] flex-col items-center justify-center border-[0.573px] border-solid px-[12.025px] py-[5.154px]"
      style={{ minHeight: 29.307, borderRadius: 5725.67, backgroundColor: "#acc0fc", borderColor: "#e2e8f0" }}
    >
      <div className="flex w-[53.827px] flex-col justify-center text-center font-outfit text-[6.871px] font-medium leading-[0] text-[#334155]">
        <p className="leading-[9.162px]">{lines[0]}</p>
        {lines[1] !== undefined && <p className="leading-[9.162px]">{lines[1]}</p>}
      </div>
    </div>
  );
}

export function CaremateCaseStudy({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [viewportW, setViewportW] = useState(1528);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { openStudy } = useStudy();

  useEffect(() => {
    if (!open) return;
    const update = () => {
      setScale(window.innerHeight / FRAME_HEIGHT);
      setViewportW(window.innerWidth);
    };
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

  const backToOverview = () => openStudy("caremate");

  // Every frame covers the full desktop viewport: canvas fills viewport
  // height (scale up allowed) and each top-level panel stretches to at
  // least the visible canvas width. Positions accumulate so panels never
  // overlap and no neighbour peeks in.
  const viewW = viewportW / scale;
  const heroW = Math.max(1528, viewW);
  const pairW = Math.max(1567.17, viewW);
  const visualW = pairW - 714;
  const rowW = pairW + 1477 + 1567;
  const bgW = Math.max(1479, viewW);
  const anaW = Math.max(1538, viewW);
  const perW = Math.max(1743, viewW);
  const ideaW = Math.max(1245, viewW);
  const wireW = Math.max(1456, viewW);
  const testW = Math.max(1208, viewW);
  const finalW = Math.max(1208, viewW);
  const pRow = heroW;
  const pBg = pRow + rowW;
  const pAna = pBg + bgW;
  const pPer = pAna + anaW;
  const pIdea = pPer + perW;
  const pWire = pIdea + ideaW;
  const pTest = pWire + wireW;
  const pFinal = pTest + testW;
  const pConn = pFinal + finalW;
  const connW = Math.max(1542, viewW);
  const connFont = Math.min(192.941, (connW - 160) / 7.6);
  const frameWidth = pConn + connW;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="CareMate full case study"
      className="fixed inset-0 z-[70] bg-night"
    >
      <div
        ref={scrollerRef}
        className="flex h-full w-full items-center overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="relative shrink-0"
          style={{ width: frameWidth * scale, height: FRAME_HEIGHT * scale }}
        >
          <div
            className="absolute left-0 top-0 bg-night"
            style={{
              width: frameWidth,
              height: FRAME_HEIGHT,
              transform: scale === 1 ? undefined : `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%)",
              }}
            />

            {/* Hero dark panel (`node 8115:30`). Stretches to viewport width. */}
            <div className="absolute left-0 top-0 h-full" style={{ width: heroW }}>
              <div className="absolute left-0 top-0 h-full w-[115px] border-[0.25px] border-cream">
                <button
                  type="button"
                  onClick={backToOverview}
                  aria-label="Back to overview"
                  className="absolute left-1/2 top-[18.75px] -translate-x-1/2 cursor-pointer"
                  style={{ width: 48, height: 48 }}
                >
                  <MenuGlyph />
                </button>
                <div className="absolute left-0 top-[83.75px] h-px w-[115px] bg-cream" />
                <div className="absolute left-[61px] top-[271.75px] flex w-6 flex-col items-center">
                  <span className="vertical-rl-upright text-[24px] leading-6 text-cream">
                    {COPY.name}
                  </span>
                  <span aria-hidden="true" className="h-[247px] w-0 shrink-0" />
                  <span className="vertical-rl-upright text-center text-[15px] leading-[15px] text-cream">
                    {COPY.year}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={backToOverview}
                className="absolute flex cursor-pointer items-end font-ruda text-[20px] leading-none text-cream"
                style={{ left: 148, top: 74, gap: 9.375 }}
              >
                <span className="flex h-[18.75px] w-[18.75px] shrink-0 items-center justify-center">
                  <span className="flex-none rotate-90">
                    <BackArrow />
                  </span>
                </span>
                <span className="whitespace-nowrap">Back</span>
              </button>

              <h2
                className="absolute -translate-y-1/2 font-display font-semibold uppercase leading-[92px] tracking-[-6px]"
                style={{ left: 148, top: 218, width: 1309, fontSize: 86 }}
              >
                <span className="text-white">CAREMATE: </span>
                <span className="text-sand">HEALTHCARE THAT MEETS YOU WHERE YOU ARE</span>
              </h2>

              <p
                className="absolute -translate-y-1/2 font-ruda text-[20px] text-sand"
                style={{ left: 157, top: 407, width: 1157, lineHeight: "28px" }}
              >
                A digital health platform engineered to bridge the critical gap between feeling unwell and
                receiving verified clinical care. Helping people understand symptoms, schedule vetted doctors,
                consult remotely, and access emergency help—even in constrained network environments.
              </p>

              <div className="absolute flex w-[162px] flex-col items-start gap-[16px]" style={{ left: 157, top: 542 }}>
                {["Online consultation", "PRODUCT DESIGNER", "DIGITAL HEALTH", "MOBILE APP"].map((pill, i) => (
                  <div
                    key={pill}
                    className="flex h-[30px] flex-col items-start border border-solid px-[15px] py-[7px]"
                    style={{
                      borderColor: "rgba(253,249,242,0.2)",
                      width: i === 0 ? "100%" : undefined,
                    }}
                  >
                    <p className="whitespace-nowrap font-ruda text-[12px] uppercase leading-[16px] tracking-[0.6px] text-[#fdf9f2]">
                      {pill}
                    </p>
                  </div>
                ))}
              </div>

              <p
                className="absolute whitespace-nowrap font-ruda text-[12px] uppercase leading-[16px] tracking-[1.2px]"
                style={{ left: heroW - 297, top: 698, color: "rgba(253,249,242,0.65)" }}
              >
                MOBILE APP · HEALTHCARE · 2026
              </p>
            </div>

            {/* Role + visual + problems + solution flex row (`node 8115:56`). */}
            <div className="absolute top-[-6px] flex items-center" style={{ left: heroW }}>
              <div className="flex items-end bg-white">
                {/* Role cream panel (`node 8115:58`). */}
                <div className="relative h-[770px] w-[714px] shrink-0 bg-cream">
                  <div className="absolute flex w-[601px] flex-col items-start gap-[229px]" style={{ left: 31, top: 57 }}>
                    <div className="flex w-full flex-col items-start gap-[12px] leading-[0]">
                      <p className="w-full font-ruda text-[12px] font-semibold uppercase leading-[16px] tracking-[1.2px] text-ink">
                        ROLE &amp; OWNERSHIP
                      </p>
                      <div className="flex w-full flex-col items-start gap-[8px]">
                        <p className="w-full font-display text-[61.667px] font-light uppercase leading-[74px] text-ink">
                          PRODUCT DESIGNER
                        </p>
                        <div className="w-full font-ruda text-[16px] text-[#7a7568]">
                          <p className="mb-0 leading-[24px]">Sole end-to-end execution: User Research, Competitive Audits, Persona</p>
                          <p className="mb-0 leading-[24px]">Development, System Architecture, Interaction Design, Design Systems, High-</p>
                          <p className="leading-[24px]">Fidelity UI, Micro-interactions, and Usability Validation.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-[280px] flex-col items-start">
                      {[
                        ["INDUSTRY", "Healthcare Services"],
                        ["PLATFORM", "iOS & Android (Flutter Engine)"],
                        ["CATEGORY", "AI Telehealth & Triage"],
                        ["TIMELINE", "Q1 2026 (Concept & Systems)"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex h-[64px] w-full flex-col items-start gap-[8px] pb-[20px]">
                          <p className="w-full font-ruda text-[12px] uppercase leading-[16px] tracking-[1.2px] text-[#7a7568]">
                            {label}
                          </p>
                          <p className="w-full font-ruda text-[14px] font-medium leading-[20px] text-[#0f0f0b]">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual gradient panel (`node 8115:86`). */}
                <div className="relative h-[772px] shrink-0 bg-gradient-to-b from-[#5a81fa] from-[21.154%] via-[#cedeff] via-[99.99%] to-[#f1f5f9]" style={{ width: visualW }}>
                  <p
                    className="absolute -translate-y-1/2 whitespace-nowrap font-semibold text-white"
                    style={{ left: "calc(50% - 328.58px)", top: 119.63, fontSize: 168.348, lineHeight: "normal", fontFamily: "var(--font-display)" }}
                  >
                    CareMate
                  </p>
                  <p
                    className="absolute whitespace-nowrap font-outfit text-white"
                    style={{ left: 677.2, top: 210.33, fontSize: 23.699, lineHeight: "normal" }}
                  >
                    Healthcare
                  </p>
                  <p
                    className="absolute whitespace-pre font-outfit"
                    style={{ left: 57.47, top: 676.61, fontSize: 14.219, lineHeight: "normal", color: "#696e82" }}
                  >
                    {`Healthcare app \nthat everyone\nneeds`}
                  </p>
                  <div
                    className="absolute flex items-center justify-center"
                    style={{ left: 256.54, top: 329.42, width: 408.009, height: 460.266 }}
                  >
                    <div className="flex-none rotate-[-56.08deg]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/works/caremate-splash.png"
                        alt="CareMate splash screen"
                        className="block max-w-none object-cover"
                        style={{ width: 408.937, height: 216.693 }}
                      />
                    </div>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/works/caremate-home.png"
                    alt="CareMate home screen"
                    className="absolute block max-w-none object-cover"
                    style={{ left: 558.12, top: 239.95, width: 257.623, height: 486.18 }}
                  />
                </div>
              </div>

              {/* Problems olive panel (`node 8115:92`). */}
              <div className="relative h-[777px] w-[1477px] shrink-0 bg-[#565448]">
                <p
                  className="absolute whitespace-nowrap font-bold capitalize leading-[normal] tracking-[-0.3827px] text-white"
                  style={{ left: 101, top: 88, fontSize: 34.79, fontFamily: "var(--font-display)" }}
                >
                  Major Problems
                </p>
                <div className="absolute" style={{ left: 101, top: 130, width: 1179.976, height: 224.688 }}>
                  <div className="absolute left-[1110.4px] top-[66.68px] h-[69.581px] w-[69.581px]">
                    <TimerGlyph />
                  </div>
                  <p className="absolute left-0 top-[33px] w-[749.444px] font-ruda font-bold leading-[normal] text-white">
                    <span style={{ fontSize: 52.186 }}>People</span>{" "}
                    <span style={{ fontSize: 29.396 }}>
                      struggle to quickly identify the right doctor, understand the urgency of their symptoms, and
                      book timely healthcare appointments, leading to delayed treatment and inefficient use of
                      medical services.
                    </span>
                  </p>
                  <StatCard value="50%" label="Patients schedule and don't even show up." left={837.87} top={63.78} />
                </div>
                <StatCard value="73%" label="Patients see the wrong specialist first" left={101} top={437.9} />
                <StatCard value="4.2 days" label="Average wait for an appointment" left={517.04} top={435} />
                <StatCard value="60%" label="ER visits are non emergency cases" left={933.07} top={435} />
              </div>

              {/* Solution cream panel (`node 8115:122`). */}
              <div className="relative h-[783px] w-[1567px] shrink-0 overflow-clip border border-solid border-ink bg-cream">
                <p className="absolute left-[calc(50%-3.67px)] top-[149px] w-[1356px] -translate-x-1/2 -translate-y-1/2 text-center font-display text-[48px] leading-[48px] text-ink">
                  “Five intentional features that treat the doctor appointment ghosting problem and daily health
                  management as one connected ecosystem.”
                </p>
                <p className="absolute -translate-y-1/2 font-ruda text-[13px] font-bold uppercase leading-[16px] tracking-[1.2px] text-ink" style={{ left: 83, top: 60, width: 601 }}>
                  The Solution
                </p>
                <div className="absolute bottom-[73px] left-[83px] flex w-[1400px] flex-col items-center gap-[47px]">
                  <div className="flex w-full items-center gap-[124px]">
                    <SolutionCard
                      title="Anti-ghosting rules"
                      body="Unlike other existing apps ai voice feature will be used to fill up symptoms and entire case of a appointment, which can be edited manually too."
                    />
                    <SolutionCard
                      title="AI Broadcast"
                      body="According to the users location any major outbreak or anything health related will be broadcasted & notified according to location."
                      fixedHeight={186}
                    />
                    <SolutionCard
                      title="AI navigation"
                      body="Unlike other existing apps ai voice feature will be used to fill up symptoms and entire case of a appointment, which can be edited manually too."
                    />
                  </div>
                  <div className="flex items-center gap-[112px]">
                    <SolutionCard
                      title="Rescheduling"
                      body="Manual rescheduling takes away doctors important time which will be managed by AI entirely."
                    />
                    <SolutionCard
                      title="Offline Mode"
                      body="Unlike other existing apps offline mode will be available along with low network mode."
                      fixedHeight={168}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Background night panel (`node 8115:148`). */}
            <section
              className="absolute h-[783px] w-[1479px] overflow-clip"
              style={{ left: pBg, top: "calc(50% + 0.5px)", transform: "translateY(-50%)", width: bgW, backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, #11120d 0%, #11120d 100%)" }}
              aria-label="Background"
            >
              <div className="absolute left-[81px] top-[62px] flex w-[1258px] flex-col items-start gap-[28px] leading-[0] text-cream">
                <p className="w-full font-ruda text-[13px] font-bold uppercase leading-[16px] tracking-[1.2px]">
                  BACKGROUND
                </p>
                <div className="flex w-full flex-col items-start gap-[50px]">
                  <p className="w-full font-display text-[64px] leading-[48px]">
                    From Doctor Booking to Accessible Healthcare
                  </p>
                  <div className="flex w-full flex-col items-start gap-[127px] font-ruda uppercase tracking-[1.2px]">
                    <div className="flex w-full flex-col items-start gap-[51px]">
                      <div className="flex w-[883px] flex-col items-start gap-[16px] text-[16px]">
                        <p className="w-full leading-[26px]">I initially designed caremate to make finding a doctor and booking appointments easier, with online consultations and prescriptions in one place.</p>
                        <p className="w-full leading-[26px]">But healthcare needs don’t always happen during a planned appointment. Users may need quick guidance, access to prescriptions, or emergency support at unexpected moments.</p>
                        <p className="w-full leading-[26px]">That shifted my focus from simply booking care to creating a more accessible healthcare experience.</p>
                      </div>
                      <p className="leading-[46px]" style={{ fontSize: 32 }}>
                        How might we make essential healthcare support available when people need it—not just when they have an appointment?
                      </p>
                    </div>
                    <p className="w-full text-[16px] leading-[26px]">
                      This became the foundation for Kearmaid’s consultation, AI assistance, prescription, and emergency support features.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Analysis cream panel (`node 8115:161`). */}
            <section
              className="absolute h-[783px] w-[1538px] overflow-clip bg-cream"
              style={{ left: pAna, top: "calc(50% + 0.5px)", transform: "translateY(-50%)", width: anaW }}
              aria-label="Competitive analysis"
            >
              <p className="absolute left-[63px] top-[158px] flex w-[1258px] -translate-y-1/2 flex-col justify-center font-display text-[64px] leading-[0] text-[#565448]">
                <span className="leading-[68px]">Competitive Analysis: Understanding the Healthcare Landscape</span>
              </p>
              <p className="absolute left-[63px] top-[49px] flex w-[1258px] -translate-y-1/2 flex-col justify-center font-ruda text-[13px] font-bold uppercase leading-[0] tracking-[1.2px] text-[#565448]">
                <span className="leading-[16px]">ANALYSIS AND ITS OUTCOME</span>
              </p>
              <p className="absolute left-[63px] top-[285px] flex w-[1070px] -translate-y-1/2 flex-col justify-center font-ruda text-[16px] uppercase leading-[0] tracking-[1.2px] text-[#565448]">
                <span className="leading-[26px]">I looked at existing healthcare platforms to understand what they offer well, where gaps remain, and where Kearmaid could create a more connected experience</span>
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/works/case/competitive-table.svg"
                alt="Competitive analysis chart"
                className="absolute block max-w-none"
                style={{ left: 63, top: 344, width: 1338, height: 386 }}
              />
              <div className="absolute left-[49px] top-[343px] flex items-center gap-[16px] leading-[0] text-cream">
                <SwotCard
                  title="STRENGTH"
                  titleLeft="calc(50% - 94px)"
                  titleWidth={188}
                  titleTop={44}
                  points={[
                    "end-to-end healthcare journey — connects doctor discovery, consultation, prescriptions, and emergency support.",
                    "Multiple access points — combines online care, AI symptom guidance, and offline appointment access.",
                  ]}
                />
                <SwotCard
                  title="WEAKNESS"
                  titleLeft="calc(50% - 92px)"
                  titleWidth={184}
                  titleTop={44}
                  points={[
                    "Broad feature set can make the experience harder to navigate",
                    "Trust-dependent experience requires users to feel confident in AI guidance and digital healthcare",
                  ]}
                />
                <SwotCard
                  title="OPPORTUNITIES"
                  titleLeft="calc(50% - 139px)"
                  titleWidth={277}
                  titleTop={41}
                  points={[
                    "Personalized healthcare guidance through AI-assisted symptom discovery and recommendations",
                    "One connected healthcare experience instead of users switching between separate services",
                  ]}
                />
                <SwotCard
                  title="THREATS"
                  titleLeft="calc(50% - 80px)"
                  titleWidth={160}
                  titleTop={41}
                  points={[
                    "Established competitors already have strong doctor networks and user trust",
                    "Rapidly evolving health-tech platforms can quickly introduce similar AI and emergency features",
                  ]}
                />
              </div>
            </section>

            {/* Persona sand panel (`node 8115:188`). */}
            <section
              className="absolute h-[777px] w-[1743px] overflow-clip bg-sand"
              style={{ left: pPer, top: "calc(50% + 0.5px)", transform: "translateY(-50%)", width: perW }}
              aria-label="User persona"
            >
              <p className="absolute left-[56px] top-[109px] flex w-[1118px] -translate-y-1/2 flex-col justify-center font-display text-[64px] leading-[0] text-ink">
                <span className="leading-[68px]">Beyond the Algorithm, Defining User Needs</span>
              </p>
              <p className="absolute left-[56px] top-[210px] flex w-[993px] -translate-y-1/2 flex-col justify-center font-ruda text-[16px] uppercase leading-[0] tracking-[1.2px] text-[#565448]">
                <span className="leading-[26px]">
                  For Caremate, I focused beyond individual features to understand what users actually need:
                  finding the right care, understanding symptoms, accessing consultations and prescriptions, and
                  getting timely help when it matters most.
                </span>
              </p>
              <div className="absolute left-[56px] top-[317px] flex w-[457px] flex-col items-start gap-[25px] leading-[0]">
                <p className="flex h-[60px] min-w-full w-[min-content] flex-col justify-center font-display text-[48px] leading-[25px] text-ink">
                  [Fictional Character]
                </p>
                <div className="flex flex-col justify-center whitespace-nowrap font-ruda text-[16px] text-[#565448]">
                  <p className="mb-0 whitespace-pre leading-[25px]">A user persona is a research-based, semi-fictional </p>
                  <p className="mb-0 whitespace-pre leading-[25px]">profile of your target user — including their demographics, </p>
                  <p className="mb-0 whitespace-pre leading-[25px]">goals, and pain points — used to align design and product </p>
                  <p className="whitespace-pre leading-[25px]">decisions around real user needs instead of assumptions </p>
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/works/case/lia-hetic.png"
                alt="Persona portrait"
                className="absolute block max-w-none object-cover"
                style={{ left: 615, top: 317, width: 416, height: 623 }}
              />
              <div
                className="absolute flex -translate-y-1/2 items-center justify-center"
                style={{ left: "calc(50% + 60.5px)", top: 543.67, width: 152, height: 329.333 }}
              >
                <div className="-rotate-90 flex-none">
                  <p className="flex h-[152px] w-[329.333px] flex-col justify-center font-display text-[71.529px] italic leading-[32.726px] tracking-[-2.0908px] text-[#121a32]">
                    LIA HETIC
                  </p>
                </div>
              </div>
              <div className="absolute left-[1173px] top-[622px] flex h-[300px] w-[526px] -translate-y-1/2 flex-col justify-center whitespace-pre-wrap font-ruda text-[16px] leading-[25px] text-[#565448]">
                <p className="mb-0 font-bold">LIA HETIC</p>
                <p className="mb-0">32 Years, Working Professional &amp; Caregiver</p>
                <p className="mb-0">​</p>
                <p className="mb-0">
                  Priya juggles a demanding job with caring for her aging parents, leaving little time to navigate
                  hospital queues or spotty network coverage on the go. She relies on quick AI-guided symptom
                  checks, easy doctor booking, and instant teleconsults to manage care for her family, and needs
                  the app to work reliably even with poor connectivity, with fast access to emergency help when
                  something urgent comes up.
                </p>
                <p>​</p>
              </div>
            </section>

            {/* Ideation night panel (`node 8115:197`). */}
            <section
              className="absolute h-[788px] w-[1245px] overflow-clip"
              style={{ left: pIdea, top: "50%", transform: "translateY(-50%)", width: ideaW, backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, #11120d 0%, #11120d 100%)" }}
              aria-label="Ideation and user flow"
            >
              <div className="absolute left-[94px] top-[68px] flex w-[993px] flex-col items-start gap-[11px] leading-[0] text-cream">
                <p className="w-full font-display text-[64px] leading-[68px]">IDEATION/USERFLOW</p>
                <p className="w-full font-ruda text-[16px] uppercase leading-[26px] tracking-[1.2px]">
                  I explored ideas to make Caremate a simpler, more connected healthcare experience—from finding
                  care to getting guidance and support
                </p>
              </div>
              <div
                className="absolute flex items-center justify-center overflow-hidden rounded-[12px]"
                style={{ left: 136, top: 277, width: 227, height: 428.388 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/works/case/splash7-landscape.png"
                  alt="Splash screen landscape"
                  className="block h-full w-full max-w-none object-cover"
                />
              </div>

              <div className="absolute" style={{ left: 447, top: 491.71 }}>
                <FlowPill label="Sign In / OTP" width={76.159} />
              </div>
              <div className="absolute" style={{ left: 449.29, top: 428.14 }}>
                <FlowPill label="Onboarding" width={74.441} />
              </div>
              <div className="absolute flex items-center" style={{ left: 732.17, top: 308.47, gap: 45.81 }}>
                <FlowPill label="Appointments" width={80.631} semibold />
                <div className="flex w-[77.304px] shrink-0 flex-col items-start gap-[9.735px]">
                  <FlowSub lines={["Doctor Search", "& Filter"]} />
                  <FlowSub lines={["Slot, Booking", "&Pay"]} />
                </div>
              </div>
              <div className="absolute flex items-center" style={{ left: 732.17, top: 571.87, gap: 45.81 }}>
                <FlowPill label="Care & Consult" width={82.631} semibold />
                <div className="flex w-[77.304px] shrink-0 flex-col items-start gap-[9.735px]">
                  <FlowSub lines={["Live Teleconsult", "session"]} />
                  <FlowSub lines={["Digital pescription"]} />
                </div>
              </div>
              <div className="absolute flex items-center" style={{ left: 799.74, top: 655.48, gap: 45.81 }}>
                <FlowPill label="SOS & Emergency" width={93.631} semibold />
                <div className="flex w-[77.304px] shrink-0 flex-col items-start gap-[9.735px]">
                  <FlowSub lines={["One tap dispatch", "& telemetry"]} />
                  <FlowSub lines={["Family alert ", "& care protocol"]} />
                </div>
              </div>
              <div className="absolute flex items-center" style={{ left: 801.45, top: 222, gap: 45.81 }}>
                <FlowPill label="Offline & sync" width={78.631} semibold />
                <div className="flex w-[77.304px] shrink-0 flex-col items-start gap-[9.735px]">
                  <FlowSub lines={["Local, cache &", "reconnect"]} />
                  <FlowSub lines={["Network Detection"]} />
                </div>
              </div>
              <div className="absolute flex items-center" style={{ left: 693.8, top: 417.84, gap: 60.126 }}>
                <FlowPill label="AI assistant" width={71.631} semibold />
                <div className="relative flex w-[77.304px] shrink-0 flex-col items-start gap-[9.735px]">
                  <FlowSub lines={["Symptom check input"]} />
                  <FlowSub lines={["AI clinical ", "triage"]} />
                  <FlowSub lines={["Direct care", "recommendation"]} />
                  <div className="absolute" style={{ inset: "50.43% 36.77% 49.57% 34.06%" }}>
                    <div className="absolute inset-[-0.4px_0]">
                      <Group23 />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute" style={{ left: 633.1, top: 255.5, width: 166.634, height: 216.452 }}>
                <div className="absolute inset-[-0.13%_0]">
                  <CurveV4 />
                </div>
              </div>
              <div className="absolute flex items-center justify-center" style={{ left: 633.1, top: 471.95, width: 166.634, height: 217.025 }}>
                <div className="-scale-y-100 flex-none">
                  <div className="absolute inset-[-0.13%_0]">
                    <CurveV5 />
                  </div>
                </div>
              </div>
              <div
                className="absolute flex items-center px-[16.033px] py-[6.871px]"
                style={{ left: 563.82, top: 456.78, width: 105.935, height: 27.486, gap: 5.726, borderRadius: 5725.67, backgroundColor: "#2d407d" }}
              >
                <div
                  className="absolute"
                  style={{ inset: "0 0.13px 0 0", borderRadius: 5725.67, backgroundColor: "rgba(255,255,255,0)", boxShadow: "0px 0px 0px 2.29px #f1f5f9,0px 5.726px 8.589px -1.718px rgba(0,0,0,0.1),0px 2.29px 3.436px -2.29px rgba(0,0,0,0.1)" }}
                />
                <p className="relative shrink-0 whitespace-nowrap font-outfit text-[9.162px] font-bold leading-[13.743px] text-white">
                  Home Navigation
                </p>
              </div>
              <div className="absolute" style={{ left: 524.5, top: 443, width: 39, height: 58 }}>
                <div className="absolute inset-[-0.72%_-2.15%_-0.67%_-0.81%]">
                  <ConnV10 />
                </div>
              </div>
              <div className="absolute" style={{ left: 766.5, top: 473.5, width: 59, height: 35 }}>
                <div className="absolute inset-[-1.23%_-0.43%]">
                  <ConnV11 />
                </div>
              </div>
              <div className="absolute" style={{ left: 766.5, top: 436, width: 58, height: 35.5 }}>
                <div className="absolute inset-[-1.2%_-0.45%]">
                  <ConnV12 />
                </div>
              </div>
              <div className="absolute" style={{ left: 815, top: 589, width: 45.5, height: 36.5 }}>
                <div className="absolute inset-[-1.29%_-0.44%_-1.25%_-2.95%]">
                  <ConnV13 />
                </div>
              </div>
              <div className="absolute" style={{ left: 893.5, top: 670.5, width: 46, height: 40 }}>
                <div className="absolute inset-[-1.16%_-0.45%_-1.14%_-2.73%]">
                  <ConnV14 />
                </div>
              </div>
              <div className="absolute" style={{ left: 814, top: 327.5, width: 44.5, height: 36 }}>
                <div className="absolute inset-[-1.3%_-0.44%_-1.28%_-3%]">
                  <ConnV15 />
                </div>
              </div>
              <div className="absolute" style={{ left: 881.5, top: 240, width: 45, height: 36.5 }}>
                <div className="absolute inset-[-1.29%_-0.45%_-1.25%_-2.96%]">
                  <ConnV16 />
                </div>
              </div>
            </section>

            {/* Wireframes white panel (`node 8115:265`). Flips in the export
                cancel out pairwise, so everything renders unmirrored. */}
            <section
              className="absolute h-[782px] w-[1456px] overflow-clip bg-white"
              style={{ left: pWire, top: "50%", transform: "translateY(-50%)", width: wireW }}
              aria-label="Hifi wireframes"
            >
              <p className="absolute left-1/2 top-[20px] w-[543px] -translate-x-1/2 text-center font-display text-[64px] leading-[68px] text-[#565448]">
                HIFI WIREFRAMES
              </p>
              <div className="absolute left-[calc(50%+0.5px)] top-[125px] flex w-[579px] -translate-x-1/2 items-center">
                <div className="relative mr-[-92px] flex shrink-0 items-center gap-[28.248px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/works/case/homepage.png" alt="Homepage screen" className="block h-[186px] w-[98.56px] max-w-none object-cover" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/works/case/ai-assistant.png" alt="AI assistant screen" className="block h-[186px] w-[98.56px] max-w-none object-cover" />
                </div>
                <div className="relative grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]">
                  {[
                    { src: "/images/works/case/mock-r1a.png", ml: 0, mt: 0 },
                    { src: "/images/works/case/mock-r1b.png", ml: 125.08, mt: 0 },
                    { src: "/images/works/case/mock-r1c.png", ml: 250.05, mt: 0.08 },
                  ].map((m) => (
                    <div key={m.src} className="relative col-start-1 row-start-1 h-[202.917px] w-[297.462px]" style={{ marginLeft: m.ml, marginTop: m.mt }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.src} alt="App screen in phone frame" className="absolute inset-0 block max-w-none object-cover" style={{ width: "100%", height: "100%" }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-1/2 top-[355px] flex w-[1330px] -translate-x-1/2 items-center">
                <div className="relative mr-[-122px] flex shrink-0 items-start gap-[37.938px]">
                  {[
                    ["/images/works/case/home-screen.png", 136.174, 256.985],
                    ["/images/works/case/splash6.png", 136.476, 257.553],
                    ["/images/works/case/splash7.png", 136.174, 256.985],
                    ["/images/works/case/login.png", 137.415, 259.326],
                  ].map(([src, w, h]) => (
                    <div key={src as string} className="relative shrink-0" style={{ width: w as number, height: h as number }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src as string} alt="App screen" className="absolute inset-0 block max-w-none object-cover" style={{ width: "100%", height: "100%" }} />
                    </div>
                  ))}
                </div>
                <div className="relative grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]">
                  {[
                    { src: "/images/works/case/mock-r2a.png", ml: 0, mt: 0 },
                    { src: "/images/works/case/mock-r2b.png", ml: 174.59, mt: 0 },
                    { src: "/images/works/case/mock-r2c.png", ml: 342.57, mt: 0 },
                    { src: "/images/works/case/mock-r2d.png", ml: 523.01, mt: 0.12 },
                  ].map((m) => (
                    <div key={m.src} className="relative col-start-1 row-start-1 h-[290.071px] w-[425.224px]" style={{ marginLeft: m.ml, marginTop: m.mt }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.src} alt="App screen in phone frame" className="absolute inset-0 block max-w-none object-cover" style={{ width: "100%", height: "100%" }} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testing olive panel (`node 8115:286`). */}
            <section
              className="absolute h-[776px] w-[1208px] overflow-clip bg-[#565448]"
              style={{ left: pTest, top: "calc(50% + 0.5px)", transform: "translateY(-50%)", width: testW }}
              aria-label="Testing and iteration"
            >
              <div className="absolute left-[92px] top-[67px] flex w-[993px] flex-col items-start gap-[61px] leading-[0] text-cream">
                <div className="flex w-full flex-col items-start gap-[11px]">
                  <p className="w-full font-display text-[64px] leading-[68px]">TESTING AND ITERATION</p>
                  <p className="w-full font-ruda text-[16px] uppercase leading-[26px] tracking-[1.2px]">
                    I tested the key flows and refined the interface based on usability issues, focusing on
                    clearer navigation, simpler interactions, and a smoother healthcare journey
                  </p>
                </div>
                <p className="w-full font-ruda text-[16px] uppercase leading-[26px] tracking-[1.2px]">
                  Through testing and iterations, I refined Caremate by identifying areas where users could get
                  confused or slowed down. I adjusted the navigation, simplified key interactions, and improved
                  the overall flow to make finding care, booking consultations, and accessing support feel more
                  intuitive and seamless
                </p>
              </div>
            </section>

            {/* Final thoughts cream panel (`node 8115:292`). */}
            <section
              className="absolute h-[776px] w-[1208px] overflow-clip bg-cream"
              style={{ left: pFinal, top: "calc(50% + 0.5px)", transform: "translateY(-50%)", width: finalW }}
              aria-label="Final thoughts"
            >
              <div className="absolute left-[75px] top-[67px] flex w-[993px] flex-col items-start leading-[0] text-[#565448]">
                <div className="flex w-full flex-col items-start gap-[11px]">
                  <p className="w-[549px] font-display text-[64px] leading-[68px]">FINAL THOUGHTS</p>
                  <p className="w-[min-content] min-w-full font-ruda text-[16px] uppercase leading-[26px] tracking-[1.2px]">
                    The problem was never the lack of doctors. It was everything standing between feeling unwell
                    and reaching the right one
                  </p>
                </div>
              </div>
              <div className="absolute left-[calc(50%-32px)] top-[279px] flex -translate-x-1/2 items-center gap-[41px] text-center leading-[0]">
                {[
                  {
                    title: "WHAT I LEARNED",
                    body: "Healthcare design is design for uncertainty. People struggle to know which doctor to see and how urgent symptoms are. So I put AI triage before booking, made entry voice-first, and made it work on weak networks.",
                  },
                  {
                    title: "NEXT STEPS",
                    body: "CareMate is a concept, so next is validation. I would test AI triage and SOS with patients and caregivers, test offline mode, and measure if anti-ghosting rules reduce no-shows.",
                  },
                  {
                    title: "I AM MOST PROUD OF?",
                    body: "The balance between automation and control. AI fills in symptoms and details, but everything stays editable. With SOS one gesture away, the app feels supportive everyday and urgent.",
                  },
                ].map((card) => (
                  <div key={card.title} className="flex h-[411px] w-[304px] shrink-0 flex-col items-center bg-sand px-[27px] pb-[72px]">
                    <p className="w-full shrink-0 text-center font-display text-[20px] font-semibold leading-[68px] text-ink">{card.title}</p>
                    <p className="flex h-[271px] w-full shrink-0 flex-col justify-center font-ruda text-[14px] uppercase leading-[26px] tracking-[1.2px] text-[#4e4949]">
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Finale (`node 8115:307`). Own full-viewport black frame. */}
            <section
              className="absolute flex flex-col items-center justify-center overflow-clip bg-black"
              style={{
                left: pConn,
                top: "50%",
                transform: "translateY(-50%)",
                width: connW,
                height: 776,
                gap: 36,
              }}
              aria-label="Let's connect"
            >
              <h2
                className="whitespace-nowrap text-center font-display leading-[1.06] text-cream"
                style={{ fontSize: Math.min(connFont, 140) }}
              >
                LET’S CONNECT
              </h2>
              <ContactCard variant="finale" />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
