"use client";

import { useEffect, useRef, useState } from "react";
import { COPY } from "@/lib/content";
import { useStudy } from "./StudyContext";
import { ContactCard } from "./ContactCard";

/**
 * Full Aeva case study from the live "CASE STUDY OF AEVA" frame
 * (`node 8115:308`): a horizontal document — dark hero with motion video,
 * role + visual, problems, solution, background, competitive analysis,
 * persona, ideation, hifi wireframes, testing, final thoughts, connect.
 * Same full-viewport cover layout as the CareMate case study: the canvas
 * fills the viewport height and every top-level panel stretches to at
 * least the visible canvas width.
 * Opens from the overview's "Case study" link; Back returns to it.
 */

const FRAME_WIDTH = 17755;
const FRAME_HEIGHT = 794;

/** Hamburger, white cut for the dark hero (`node 8115:315`). */
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

/** Back arrow, white cut (ant-design:arrow-down-outlined, `node 8115:318`). */
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
        d="M15.7835 8.5199H14.3003C14.2161 8.5199 14.1355 8.55652 14.0787 8.62061L10.0706 13.2404V2.92969C10.0706 2.92969 10.0047 2.7832 9.92408 2.7832H8.82545C8.74488 2.7832 8.67897 2.84912 8.67897 2.92969V13.2404L4.67079 8.62061C4.61586 8.55652 4.53529 8.5199 4.44923 8.5199H2.96607C2.84156 8.5199 2.77381 8.66821 2.85621 8.7616L8.93348 15.7654C8.98842 15.8288 9.05633 15.8796 9.13263 15.9144C9.20892 15.9493 9.29181 15.9673 9.37568 15.9673C9.45955 15.9673 9.54244 15.9493 9.61874 15.9144C9.69503 15.8796 9.76295 15.8288 9.81788 15.7654L15.8933 8.7616C15.9757 8.66638 15.908 8.5199 15.7835 8.5199Z"
        fill="#0e0e0a"
      />
    </svg>
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

/** Solution feature card (`node 8115:369`-`8115:389`). Blue with white text. */
function SolutionCard({ title, body, fixedHeight }: { title: string; body: string; fixedHeight?: number }) {
  return (
    <div
      className="flex w-[384px] shrink-0 flex-col items-start bg-[#7aa5dc] px-[26px] py-[25px]"
      style={fixedHeight !== undefined ? { height: fixedHeight } : undefined}
    >
      <div className="flex w-full flex-col items-center gap-[9px] text-center font-ruda text-[#fffaf4]">
        <p className="w-full text-[34.909px] capitalize leading-[normal] tracking-[-0.384px]">{title}</p>
        <p className="w-full text-[17.455px] leading-[1.014] tracking-[-0.192px]">{body}</p>
      </div>
    </div>
  );
}

export function AevaCaseStudy({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  const backToOverview = () => openStudy("aeva");

  // Every frame covers the full desktop viewport: canvas fills viewport
  // height (scale up allowed) and each top-level panel stretches to at
  // least the visible canvas width. Positions accumulate so panels never
  // overlap and no neighbour peeks in.
  const viewW = viewportW / scale;
  const heroW = Math.max(1528, viewW);
  const pairW = Math.max(1567.17, viewW);
  const visualW = pairW - 714;
  const probW = Math.max(1477, viewW);
  const solW = Math.max(1567, viewW);
  const rowW = pairW + probW + solW;
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
      aria-label="Aeva full case study"
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

            {/* Hero cream frame (`node 8115:309`) matching the motion video
                background; all chrome dark for contrast. */}
            <div className="absolute left-0 top-0 h-full bg-[#F8F3E0]" style={{ width: heroW }}>
              <div className="absolute left-0 top-0 h-full w-[115px] border-[0.25px] border-[#565448]">
                <button
                  type="button"
                  onClick={backToOverview}
                  aria-label="Back to overview"
                  className="absolute left-1/2 top-[18.75px] -translate-x-1/2 cursor-pointer"
                  style={{ width: 48, height: 48 }}
                >
                  <MenuGlyph />
                </button>
                <div className="absolute left-0 top-[83.75px] h-px w-[115px] bg-[#565448]" />
                <div className="absolute left-[61px] top-[271.75px] flex w-6 flex-col items-center">
                  <span className="vertical-rl-upright text-[24px] leading-6 text-ink">
                    {COPY.name}
                  </span>
                  <span aria-hidden="true" className="h-[247px] w-0 shrink-0" />
                  <span className="vertical-rl-upright text-center text-[15px] leading-[15px] text-ink">
                    {COPY.year}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={backToOverview}
                className="absolute flex cursor-pointer items-end font-ruda text-[20px] leading-none text-ink"
                style={{ left: 148, top: 74, gap: 9.375 }}
              >
                <span className="flex h-[18.75px] w-[18.75px] shrink-0 items-center justify-center">
                  <span className="flex-none rotate-90">
                    <BackArrow />
                  </span>
                </span>
                <span className="whitespace-nowrap">Back</span>
              </button>

              {/* Motion video hero (`node 8115:321`, "MOTION VIDEO HERE").
                  Covers the hero frame edge-to-edge with a matching surround
                  so no black gaps show. */}
              <div
                className="absolute flex items-center justify-center overflow-clip bg-[#F8F3E0]"
                style={{ left: 148, top: 112, width: heroW - 196, height: 794 - 112 - 24 }}
              >
                <p
                  className="absolute whitespace-nowrap font-ruda leading-none text-[#565448]"
                  style={{ fontSize: 88 }}
                >
                  MOTION VIDEO
                </p>
                <video
                  className="absolute inset-0 h-full w-full object-contain"
                  src="/videos/aeva-animation.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-label="Aeva motion animation"
                />
              </div>
            </div>

            {/* Role + visual + problems + solution flex row (`node 8115:322`). */}
            <div className="absolute left-0 top-0 flex items-center" style={{ left: pRow }}>
              <div className="flex items-end bg-white">
                {/* Role cream panel (`node 8115:324`). */}
                <div className="relative h-[794px] w-[714px] shrink-0 bg-cream">
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
                        ["INDUSTRY", "E commerce"],
                        ["PLATFORM", "Desktop"],
                        ["CATEGORY", "Beauty and gloss"],
                        ["TOOLs", "Figma, Figma motion, Nano-banana"],
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

                {/* Visual panel (`node 8115:352`). */}
                <div className="relative h-[794px] shrink-0 overflow-clip" style={{ width: visualW }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/works/case-aeva/visual.png"
                    alt="Aeva campaign visual"
                    className="absolute inset-0 block h-full w-full max-w-none object-cover"
                  />
                </div>
              </div>

              {/* Problems olive panel (`node 8115:353`). Content spread
                  across the full frame. */}
              <div className="relative h-[794px] shrink-0 bg-[#565448]" style={{ width: probW }}>
                <p
                  className="absolute whitespace-nowrap font-bold capitalize leading-[normal] tracking-[-0.3827px] text-white"
                  style={{ left: 101, top: 88, fontSize: 34.79, fontFamily: "var(--font-display)" }}
                >
                  Major Problems
                </p>
                <p
                  className="absolute font-ruda font-bold leading-[normal] text-white"
                  style={{ left: 101, top: 190, width: Math.min(1150, probW - 300), fontSize: 24 }}
                >
                  Shoppers struggle to judge a lip gloss online. They can’t tell if a shade suits their skin, how
                  it feels, or what to do when it’s sold out, leading to doubt, abandoned carts and returns.
                </p>
                <ul
                  className="absolute grid list-disc font-ruda font-bold leading-[normal] text-white"
                  style={{ left: 101, right: 101, top: 430, fontSize: 20, columnGap: 64, rowGap: 40, paddingLeft: 30, gridTemplateColumns: "1fr 1fr" }}
                >
                  <li>Shoppers can’t compare shades side by side, so they guess.</li>
                  <li>Reviews rarely come from people with similar skin or lips.</li>
                  <li>Gloss feel (sticky, light, cushiony) is described in vague words like “comfortable.”</li>
                  <li>A first purchase from a new brand feels risky, with no easy way to try it.</li>
                  <li>Basic questions like “will it leak in my bag?” are answered only in forums.</li>
                </ul>
              </div>

              {/* Solution cream panel (`node 8115:364`). Cards centered. */}
              <div className="relative h-[794px] shrink-0 overflow-clip border border-solid border-ink bg-cream" style={{ width: solW }}>
                <p className="absolute left-[calc(50%+0.33px)] top-[188px] w-[1356px] -translate-x-1/2 -translate-y-1/2 text-center font-display text-[48px] leading-[48px] text-ink">
                  “Five intentional features that treat shade doubt and online shopping confidence as one connected
                  experience.”
                </p>
                <p className="absolute -translate-y-1/2 font-ruda text-[13px] font-bold uppercase leading-[16px] tracking-[1.2px] text-ink" style={{ left: 83, top: 60, width: 601 }}>
                  The Solution
                </p>
                <div className="absolute bottom-[73px] flex w-[1400px] flex-col items-center gap-[47px]" style={{ left: Math.max(83, (solW - 1400) / 2) }}>
                  <div className="flex w-full items-center gap-[124px]">
                    <SolutionCard
                      title="Skin Tone Swatches"
                      body="Unlike other existing beauty sites that show one model, every shade is shown on many skin and lip tones, and the photos update when a shopper picks their tone"
                    />
                    <SolutionCard
                      title="Feel Scale"
                      body="Unlike other existing sites where feel is hidden in reviews, three simple bars show shine, comfort and stickiness right on the product page"
                      fixedHeight={186}
                    />
                    <SolutionCard
                      title="Before You Buy"
                      body="Basic questions like leaking, shelf life, ingredients and scent are answered upfront on every product, so shoppers don’t have to search forums"
                    />
                  </div>
                  <div className="flex items-center gap-[112px]">
                    <SolutionCard
                      title="Sold-Out Recovery"
                      body="Unlike other existing sites that stop at “Out of stock,” shoppers can get a restock alert or see the closest shade in stock, with a reason"
                    />
                    <SolutionCard
                      title="Mini Set Trusted Cart"
                      body="A small discovery set and a clear cart with delivery, returns and secure payment info make a first purchase from a new brand feel low risk"
                      fixedHeight={168}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Background night panel (`node 8115:390`). */}
            <section
              className="absolute h-[794px] overflow-clip"
              style={{ left: pBg, top: "calc(50% + 0.5px)", transform: "translateY(-50%)", width: bgW, backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, #11120d 0%, #11120d 100%)" }}
              aria-label="Background"
            >
              <div className="absolute left-[81px] top-[62px] flex w-[1258px] flex-col items-start gap-[28px] leading-[0] text-cream">
                <p className="w-full font-ruda text-[13px] font-bold uppercase leading-[16px] tracking-[1.2px]">
                  BACKGROUND
                </p>
                <div className="flex w-full flex-col items-start gap-[50px]">
                  <p className="w-full font-display text-[64px] leading-[48px]">
                    From Beautiful Photos to Confident Choices
                  </p>
                  <div className="flex w-full flex-col items-start gap-[127px] font-ruda uppercase tracking-[1.2px]">
                    <div className="flex w-full flex-col items-start gap-[51px]">
                      <div className="flex w-[883px] flex-col items-start gap-[16px] text-[16px]">
                        <p className="w-full leading-[26px]">My first idea for AEVA was simple: a clean online shop where people could browse and buy lip gloss in one place</p>
                        <p className="w-full leading-[26px]">But buying beauty online is not like buying other products. Shoppers can’t test a shade, feel the texture, or know if it will suit their skin before they pay</p>
                        <p className="w-full leading-[26px]">That changed my focus. Instead of only designing a store that looks good, I started designing one that removes doubt at every step</p>
                      </div>
                      <p className="leading-[46px]" style={{ fontSize: 32 }}>
                        How might we help shoppers feel sure about a lip gloss before it ever reaches their hands?
                      </p>
                    </div>
                    <p className="w-full text-[16px] leading-[26px]">
                      This became the foundation for AEVA’s skin tone swatches, feel scale, sold-out recovery, and trusted cart features
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Analysis cream panel (`node 8115:403`). */}
            <section
              className="absolute h-[783px] overflow-clip bg-cream"
              style={{ left: pAna, top: "calc(50% + 0.5px)", transform: "translateY(-50%)", width: anaW }}
              aria-label="Competitive analysis"
            >
              <p className="absolute left-[63px] top-[158px] flex w-[1258px] -translate-y-1/2 flex-col justify-center font-display text-[64px] leading-[0] text-[#565448]">
                <span className="leading-[68px]">Competitive Analysis: Understanding the Beauty Shopping Landscape</span>
              </p>
              <p className="absolute left-[63px] top-[49px] flex w-[1258px] -translate-y-1/2 flex-col justify-center font-ruda text-[13px] font-bold uppercase leading-[0] tracking-[1.2px] text-[#565448]">
                <span className="leading-[16px]">ANALYSIS AND ITS OUTCOME</span>
              </p>
              <p className="absolute left-[63px] top-[285px] flex w-[1070px] -translate-y-1/2 flex-col justify-center font-ruda text-[16px] uppercase leading-[0] tracking-[1.2px] text-[#565448]">
                <span className="leading-[26px]">I reviewed leading beauty and lip gloss brands to see what they do well, where shoppers are still left guessing, and where AEVA could build a more confident buying experience</span>
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/works/case-aeva/competitive-table.svg"
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
                    "Shade confidence built into the page. Skin tone swatches and a feel scale answer the biggest doubts before checkout",
                    "Focused and simple. A small, clear range means shoppers choose faster instead of feeling overwhelmed",
                  ]}
                />
                <SwotCard
                  title="WEAKNESS"
                  titleLeft="calc(50% - 92px)"
                  titleWidth={184}
                  titleTop={44}
                  points={[
                    "Small product range. Fewer shades and products may limit choice for some shoppers",
                    "New brand trust. Without a big reputation or reviews yet, shoppers need extra reassurance before a first purchase",
                  ]}
                />
                <SwotCard
                  title="OPPORTUNITIES"
                  titleLeft="calc(50% - 139px)"
                  titleWidth={277}
                  titleTop={41}
                  points={[
                    "Shoppers want shade help. Many beauty sites still show one model and hide how a gloss feels, so there is room to do it better",
                    "Fix the sold-out moment. Restock alerts and closest-shade suggestions can save sales that other sites lose",
                  ]}
                />
                <SwotCard
                  title="THREATS"
                  titleLeft="calc(50% - 80px)"
                  titleWidth={160}
                  titleTop={41}
                  points={[
                    "Established brands. Big names already have loyal customers and strong social media reach",
                    "Fast-moving trends. Competitors can quickly add try-on tools or similar features once they see them working",
                  ]}
                />
              </div>
            </section>

            {/* Persona sand panel (`node 8115:430`). */}
            <section
              className="absolute h-[794px] overflow-clip bg-sand"
              style={{ left: pPer, top: "calc(50% + 0.5px)", transform: "translateY(-50%)", width: perW }}
              aria-label="User persona"
            >
              <div className="absolute left-[56px] top-[75px] flex w-[1118px] flex-col items-start gap-[30px] leading-[0]">
                <p className="w-full font-display text-[64px] leading-[68px] text-ink">
                  Beyond the Photos, Defining Shopper Needs
                </p>
                <p className="w-full font-ruda text-[16px] uppercase leading-[26px] tracking-[1.2px] text-[#565448]">
                  For AEVA, I looked past individual features to understand what shoppers actually need: choosing a
                  shade that suits them, knowing how a gloss feels, trusting a new brand, and not losing a favorite
                  to “out of stock.”
                </p>
              </div>
              <div className="absolute left-[56px] top-[317px] flex w-[457px] flex-col items-start gap-[25px] leading-[0]">
                <p className="flex h-[60px] min-w-full w-[min-content] flex-col justify-center font-display text-[48px] leading-[25px] text-ink">
                  [Fictional Character]
                </p>
                <div className="flex flex-col justify-center font-ruda text-[16px] text-[#565448]">
                  <p className="leading-[25px]">A user persona is a research-based, semi-fictional profile of a typical shopper, including her habits, goals and frustrations. It helps align design decisions with real needs instead of assumptions</p>
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/works/case-aeva/persona.png"
                alt="Persona portrait"
                className="absolute block max-w-none object-cover"
                style={{ left: 672, top: 256, width: 344, height: 516 }}
              />
              <div
                className="absolute flex -translate-y-1/2 items-center justify-center"
                style={{ left: "calc(50% + 91.5px)", top: 537, width: 152, height: 404 }}
              >
                <div className="-rotate-90 flex-none">
                  <p className="flex h-[152px] w-[404px] flex-col justify-center font-display text-[71.529px] italic leading-[32.726px] tracking-[-2.0908px] text-[#121a32]">
                    SIYA SHARMA
                  </p>
                </div>
              </div>
              <div className="absolute left-[1174px] top-[584px] flex h-[300px] w-[526px] -translate-y-1/2 flex-col justify-center font-ruda text-[16px] leading-[25px] text-[#565448]">
                <p className="mb-0 font-bold">SIYA SHARMA</p>
                <p className="mb-0">26 Years, Marketing Executive</p>
                <p className="mb-0">​</p>
                <p className="mb-0">
                  Mira loves trying new beauty products but shops mostly on her phone during short breaks. She has
                  been let down before by shades that looked different on her skin and glosses that felt sticky.
                  She wants to see products on skin tones like hers, know how a gloss feels before buying, and get
                  quick answers about things like leaking and ingredients. When her favorite shade is sold out, she
                  wants a close alternative or a restock alert, not a dead end.
                </p>
                <p>​</p>
              </div>
            </section>

            {/* Ideation night panel (`node 8115:440`). */}
            <section
              className="absolute h-[794px] overflow-clip"
              style={{ left: pIdea, top: "50%", transform: "translateY(-50%)", width: ideaW, backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, #11120d 0%, #11120d 100%)" }}
              aria-label="Ideation and user flow"
            >
              <div className="absolute left-[94px] top-[68px] flex w-[993px] flex-col items-start gap-[11px] leading-[0] text-cream">
                <p className="w-full font-display text-[64px] leading-[68px]">IDEATION/USERFLOW</p>
                <p className="w-full font-ruda text-[16px] uppercase leading-[26px] tracking-[1.2px]">
                  I explored ideas to make AEVA a simpler, more confident beauty shopping experience—from shade
                  discovery to checkout
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/works/case-aeva/idea-laptop.png"
                alt="Aeva concept mockup"
                className="absolute block max-w-none object-cover"
                style={{ left: 23, top: 339, width: 507, height: 338 }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/works/case-aeva/idea-flow.png"
                alt="Aeva user flow"
                className="absolute block max-w-none object-cover"
                style={{ left: 488, top: 241, width: 723, height: 465 }}
              />
            </section>

            {/* Wireframes white panel (`node 8115:446`). */}
            <section
              className="absolute h-[794px] overflow-clip bg-white"
              style={{ left: pWire, top: "50%", transform: "translateY(-50%)", width: wireW }}
              aria-label="Hifi wireframes"
            >
              <p className="absolute left-1/2 top-[20px] w-[543px] -translate-x-1/2 text-center font-display text-[64px] leading-[68px] text-[#565448]">
                HIFI WIREFRAMES
              </p>
              <div className="absolute flex flex-col items-center gap-[28px]" style={{ left: 51, top: 130, width: 1384 }}>
                <div className="flex items-center gap-[28px]">
                  {[
                    ["/images/works/case-aeva/wire-r1a.png", "Product page with shade selector"],
                    ["/images/works/case-aeva/wire-r1b.png", "Shopping bag page"],
                    ["/images/works/case-aeva/wire-r1c.png", "Sold-out restock page"],
                  ].map(([src, alt]) => (
                    <div key={src as string} className="relative shrink-0" style={{ width: 325, height: 244 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src as string} alt={alt as string} className="absolute inset-0 block max-w-none object-cover" style={{ width: "100%", height: "100%" }} />
                    </div>
                  ))}
                </div>
                <div className="flex w-full items-center gap-[28px]">
                  {[
                    ["/images/works/case-aeva/wire-r2a.png", "Shade finder page"],
                    ["/images/works/case-aeva/wire-r2b.png", "Brand story page"],
                    ["/images/works/case-aeva/wire-r2c.png", "Reviews page"],
                    ["/images/works/case-aeva/wire-r2d.png", "Principles page"],
                  ].map(([src, alt]) => (
                    <div key={src as string} className="relative shrink-0" style={{ width: 325, height: 244 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src as string} alt={alt as string} className="absolute inset-0 block max-w-none object-cover" style={{ width: "100%", height: "100%" }} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testing olive panel (`node 8115:458`). */}
            <section
              className="absolute h-[794px] overflow-clip bg-[#565448]"
              style={{ left: pTest, top: "calc(50% + 0.5px)", transform: "translateY(-50%)", width: testW }}
              aria-label="Testing and iteration"
            >
              <div className="absolute left-[92px] top-[67px] flex w-[993px] flex-col items-start gap-[61px] leading-[0] text-cream">
                <div className="flex w-full flex-col items-start gap-[11px]">
                  <p className="w-full font-display text-[64px] leading-[68px]">TESTING AND ITERATION</p>
                  <p className="w-full font-ruda text-[16px] uppercase leading-[26px] tracking-[1.2px]">
                    I walked through the key shopping flows and refined the interface based on usability issues,
                    focusing on clearer shade selection, simpler interactions, and a smoother path from browsing to
                    checkout
                  </p>
                </div>
                <p className="w-full font-ruda text-[16px] uppercase leading-[26px] tracking-[1.2px]">
                  Through testing and iteration, I improved AEVA by finding places where shoppers could feel unsure
                  or slowed down. I adjusted the product page layout, simplified how shades and skin tones are
                  chosen, and tightened the cart so that choosing a gloss, getting answers, and buying feel easy and
                  confident
                </p>
              </div>
            </section>

            {/* Final thoughts cream panel (`node 8115:464`). */}
            <section
              className="absolute h-[794px] overflow-clip bg-cream"
              style={{ left: pFinal, top: "calc(50% + 0.5px)", transform: "translateY(-50%)", width: finalW }}
              aria-label="Final thoughts"
            >
              <div className="absolute left-[75px] top-[67px] flex w-[993px] flex-col items-start leading-[0] text-[#565448]">
                <div className="flex w-full flex-col items-start gap-[11px]">
                  <p className="w-[549px] font-display text-[64px] leading-[68px]">FINAL THOUGHTS</p>
                  <p className="w-[min-content] min-w-full font-ruda text-[16px] uppercase leading-[26px] tracking-[1.2px]">
                    The problem was never a lack of lip gloss. It was everything standing between a shopper and a
                    shade she feels sure about
                  </p>
                </div>
              </div>
              <div className="absolute left-[calc(50%-32px)] top-[279px] flex -translate-x-1/2 items-center gap-[41px] text-center leading-[0]">
                {[
                  {
                    title: "WHAT I LEARNED",
                    body: "Beauty e-commerce is design for doubt. Shoppers can't test a shade or feel the texture. So I put skin tone swatches and a feel scale on the page, answered questions upfront, and gave sold-out shades a next step.",
                  },
                  {
                    title: "NEXT STEPS",
                    body: "AEVA is a concept, so next is validation. I would test the product page with real shoppers, check if the skin tone selector and feel scale help, and measure if restock alerts save sales.",
                  },
                  {
                    title: "I AM MOST PROUD OF?",
                    body: "Small details remove big doubts. Every feature answers one real shopper question, from will it suit me to what if it's sold out. Calm and premium, yet quietly confident.",
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

            {/* Finale (`node 8115:479`). Own full-viewport black frame. */}
            <section
              className="absolute flex flex-col items-center justify-center overflow-clip bg-black"
              style={{
                left: pConn,
                top: "50%",
                transform: "translateY(-50%)",
                width: connW,
                height: 794,
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
