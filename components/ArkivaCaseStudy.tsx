"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { COPY } from "@/lib/content";
import { MailContactCard } from "./MailContactCard";

/**
 * Full Arkiva case study, built from the designer-supplied board
 * (`public/Reference photos/ARKIVA.png`). A horizontal document in the same
 * language as the CareMate / Aeva studies: hero film, role, product visual,
 * problems, solution, background, competitive analysis, persona, ideation,
 * hi-fi wireframes, testing, final thoughts and connect.
 *
 * The board is 32768 x 1287, so the canvas keeps those native proportions
 * and scales to the viewport height. Board imagery is cropped into
 * `public/images/works/case-arkiva/`. The hero motion film is the supplied
 * `public/Reference photos/frame adjusted.mp4`, served from
 * `public/videos/arkiva-animation.mp4`.
 *
 * Opened from the intro's "CASE STUDY" link; Back returns to the intro.
 */

/* Native panel widths from the board (hero 2984 + 2336, role 1192,
   visual 1424, problems 2472, solution 2612, background 2472,
   analysis 2572, persona 2912, ideation 2080, wireframes 2432,
   testing 2016, final 2020, connect 3244). The slides are normalised
   to at least the 16:9 viewport width (2288) so each one reads as a
   single desktop frame. */
const FRAME_HEIGHT = 1287;

const HERO_L = 2984;
const HERO_R = 2336;
const ROLE_W = 1192;
const VISUAL_W = 1424;

function MenuGlyph() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
      <path d="M10 12H38M10 24H38M10 36H38" stroke="#FFFAF4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg width="18.75" height="18.75" viewBox="0 0 18.75 18.75" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M15.7835 8.5199H14.3003C14.2161 8.5199 14.1355 8.55652 14.0787 8.62061L10.0706 13.2404V2.92969C10.0706 2.84912 10.0047 2.7832 9.92408 2.7832H8.82545C8.74488 2.7832 8.67897 2.84912 8.67897 2.92969V13.2404L4.67079 8.62061C4.61586 8.55652 4.53529 8.5199 4.44923 8.5199H2.96607C2.84156 8.5199 2.77381 8.66821 2.85621 8.7616L8.93348 15.7654C8.98842 15.8288 9.05633 15.8796 9.13263 15.9144C9.20892 15.9493 9.29181 15.9673 9.37568 15.9673C9.45955 15.9673 9.54244 15.9493 9.61874 15.9144C9.69503 15.8796 9.76295 15.8288 9.81788 15.7654L15.8933 8.7616C15.9757 8.66638 15.908 8.5199 15.7835 8.5199Z"
        fill="#FFFAF4"
      />
    </svg>
  );
}

/** Section eyebrow: 18px uppercase sans with wide tracking. */
function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-ruda text-[18px] font-bold uppercase leading-[22px] tracking-[1.6px] ${className}`}>
      {children}
    </p>
  );
}

/** Solution feature card — board blue with cream text. */
function SolutionCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex h-[336px] w-[594px] shrink-0 flex-col items-center bg-[#7aa5dc] px-[38px] pt-[34px] text-center text-cream">
      <p className="font-ruda text-[52px] font-light leading-[1.08]">{title}</p>
      <p className="mt-[10px] font-ruda text-[26px] leading-[1.22]">{body}</p>
    </div>
  );
}

/** SWOT card for the competitive analysis. */
function SwotCard({ title, points }: { title: string; points: [string, string] }) {
  return (
    <div className="flex h-[671px] w-[540px] shrink-0 flex-col items-center bg-[#565448] px-[34px] pt-[52px] text-center text-cream">
      <p className="font-display text-[54px] leading-[1.05]">{title}</p>
      <div className="mt-[44px] flex w-full flex-col gap-[36px] font-ruda text-[28px] leading-[1.45]">
        <p>{points[0]}</p>
        <p>{points[1]}</p>
      </div>
    </div>
  );
}

/** Final-thoughts card on sand. */
function ThoughtCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex h-[688px] w-[500px] shrink-0 flex-col items-center bg-sand px-[40px] pt-[55px] text-center">
      <p className="font-display text-[30px] leading-[1.2] text-ink">{title}</p>
      <p className="mt-[56px] font-ruda text-[27px] uppercase leading-[1.55] tracking-[1.3px] text-[#4e4949]">{body}</p>
    </div>
  );
}

export function ArkivaCaseStudy({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [viewportW, setViewportW] = useState(1600);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      setScale(window.innerHeight / FRAME_HEIGHT);
      setViewportW(window.innerWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  useEffect(() => {
    if (open) scrollerRef.current?.scrollTo({ left: 0 });
  }, [open]);

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

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  /* Cover widths: each slide fills the viewport height, and every panel is
     at least one full desktop width so no neighbour peeks in mid-slide. */
  const viewW = viewportW / scale;
  const heroL = Math.max(HERO_L, viewW - HERO_R);
  const pairW = Math.max(ROLE_W + VISUAL_W, viewW);
  const visualW = pairW - ROLE_W;
  const probW = Math.max(2288, viewW);
  const solW = Math.max(2288, viewW);
  const bgW = Math.max(2288, viewW);
  const anaW = Math.max(2288, viewW);
  const perW = Math.max(2288, viewW);
  const ideaW = Math.max(2288, viewW);
  const wireW = Math.max(2288, viewW);
  const testW = Math.max(2288, viewW);
  const finalW = Math.max(2288, viewW);
  const connW = Math.max(2288, viewW);

  const pRole = heroL + HERO_R;
  const pProblems = pRole + pairW;
  const pSolution = pProblems + probW;
  const pBg = pSolution + solW;
  const pAna = pBg + bgW;
  const pPer = pAna + anaW;
  const pIdea = pPer + perW;
  const pWire = pIdea + ideaW;
  const pTest = pWire + wireW;
  const pFinal = pTest + testW;
  const pConn = pFinal + finalW;
  const frameWidth = pConn + connW;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Arkiva full case study"
      className="fixed inset-0 z-[70] bg-ink"
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
            className="absolute left-0 top-0 bg-ink"
            style={{
              width: frameWidth,
              height: FRAME_HEIGHT,
              transform: scale === 1 ? undefined : `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {/* ── Hero / product film ─────────────────────────────────── */}
            <section className="absolute left-0 top-0 h-full overflow-clip bg-ink" style={{ width: heroL }} aria-label="Arkiva hero">
              <div className="absolute left-0 top-0 h-full w-[115px] border-[0.25px] border-cream/60">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Back to Arkiva overview"
                  className="absolute left-[33.75px] top-[19.75px] cursor-pointer"
                >
                  <MenuGlyph />
                </button>
                <div className="absolute left-0 top-[83.75px] h-px w-[115px] bg-cream/60" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-cream">
                  <span className="vertical-rl-upright text-[32px] leading-8 tracking-[0.01em]">{COPY.name}</span>
                </div>
                <div className="pointer-events-none absolute bottom-[48px] left-0 flex w-full justify-center text-cream">
                  <span className="vertical-rl-upright text-center text-[15px] leading-[15px]">{COPY.year}</span>
                </div>
                <div className="absolute left-[45.75px] top-[1180px]" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14" stroke="#FFFAF4" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="absolute flex cursor-pointer items-end gap-[9px] font-ruda text-[20px] leading-none text-cream"
                style={{ left: 148, top: 74 }}
              >
                <span className="flex h-[18.75px] w-[18.75px] shrink-0 items-center justify-center">
                  <span className="flex-none rotate-90">
                    <BackArrow />
                  </span>
                </span>
                <span className="whitespace-nowrap">Back</span>
              </button>

              <div
                className="absolute overflow-clip"
                style={{
                  left: 148,
                  top: 112,
                  width: Math.min(heroL - 196, Math.max(640, viewW - 148)),
                  height: FRAME_HEIGHT - 136,
                }}
              >
                <p className="absolute left-0 top-[18px] font-ruda text-[15px] uppercase tracking-[0.24em] text-cream/55">
                  Arkiva — product film
                </p>
                <div className="absolute inset-x-0 bottom-0 top-[56px] flex items-center justify-center">
                  <video
                    className="h-full w-full object-contain"
                    src="/videos/arkiva-animation.mp4"
                    poster="/images/works/case-arkiva/hero-poster.jpg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label="Arkiva construction website motion reel"
                  />
                </div>
              </div>
            </section>

            {/* ── Hero title panel ─────────────────────────────────────── */}
            <section
              className="absolute top-0 h-full overflow-clip bg-[#565448]"
              style={{ left: heroL, width: HERO_R }}
              aria-label="Arkiva overview"
            >
              <div className="absolute left-[42px] top-[86px] flex flex-col items-start">
                <h1 className="font-display text-[124px] leading-[0.95] text-cream">ARKIVA</h1>
                <p className="mt-[42px] w-[1080px] font-ruda text-[27px] leading-[1.55] text-[#f3ede0]">
                  Arkiva is a SaaS platform for small and mid-size construction companies in Nepal. Each company
                  gets a branded public website and a dashboard to manage services, materials, and client inquiries,
                  all on one monthly subscription.
                </p>
              </div>
              <p className="absolute bottom-[42px] left-[42px] font-ruda text-[24px] leading-none text-cream">
                Product Designer · UI/UX · Design System · 2026
              </p>
            </section>

            {/* ── Role + visual ────────────────────────────────────────── */}
            <div className="absolute top-0 flex h-full items-stretch" style={{ left: pRole }}>
              <section className="relative h-full w-[1192px] shrink-0 overflow-clip bg-cream" aria-label="Role and ownership">
                <div className="absolute left-[52px] top-[96px] w-[1030px]">
                  <Eyebrow className="text-[#565448]">ROLE &amp; OWNERSHIP</Eyebrow>
                  <h2 className="mt-[36px] font-display text-[82px] uppercase leading-[1.02] text-ink">PRODUCT DESIGNER</h2>
                  <p className="mt-[40px] w-[980px] font-ruda text-[31px] leading-[1.42] text-[#8a857a]">
                    Sole end-to-end execution: User Research, Competitive Audits, Persona Development, System
                    Architecture, Interaction Design, Design Systems, High-Fidelity UI, Micro-interactions, and
                    Usability Validation.
                  </p>
                </div>
                <div className="absolute left-[52px] top-[820px] flex w-[420px] flex-col">
                  {[
                    ["INDUSTRY", "Construction / Vertical SaaS"],
                    ["PLATFORM", "Desktop (Web)"],
                    ["CATEGORY", "SaaS, Admin dashboard, website"],
                    ["TOOLS", "Figma, Stitch, Figma motion, Illustrator"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-[8px] pb-[28px]">
                      <p className="font-ruda text-[19px] uppercase leading-[22px] tracking-[1.4px] text-[#a29c8e]">{label}</p>
                      <p className="font-ruda text-[29px] leading-[34px] text-ink">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="relative h-full shrink-0 overflow-clip bg-[#003566]" style={{ width: visualW }} aria-label="Arkiva brand visual">
                <p className="absolute left-[58px] top-[30px] whitespace-nowrap font-display text-[380px] leading-[0.9] tracking-[-0.02em] text-[#d9dde4]">
                  ARKIVA
                </p>
                <p className="absolute left-[50px] top-[352px] w-[330px] font-ruda text-[27px] leading-[1.62] text-[#9fb0c9]">
                  Arkiva is a SaaS platform for small and mid-size construction companies in Nepal. Each company
                  gets a branded public website and a dashboard to manage services, materials, and client
                  inquiries, all on one monthly subscription.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/works/case-arkiva/dashboard.png"
                  alt="Arkiva workspace subscription screen"
                  className="absolute max-w-none"
                  style={{ left: 590, top: 402, width: 575 }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/works/case-arkiva/laptop.png"
                  alt="Arkiva construction website on a laptop"
                  className="absolute bottom-0 max-w-none"
                  style={{ left: 58, width: 586 }}
                />
              </section>
            </div>

            {/* ── Major problems ───────────────────────────────────────── */}
            <section
              className="absolute top-0 h-full overflow-clip bg-[#565448]"
              style={{ left: pProblems, width: probW }}
              aria-label="Major problems"
            >
              <div className="absolute left-[148px] top-[116px] w-[min(1080px,calc(100%-300px))]">
                <h2 className="font-display text-[56px] leading-[1.08] text-cream">Major Problems</h2>
                <p className="mt-[52px] w-[1050px] max-w-full font-ruda text-[33px] leading-[1.34] text-cream">
                  Construction companies in Nepal win work through trust and speed, but their tools are built around
                  phone calls and spreadsheets
                </p>
              </div>
              <ul className="absolute right-[120px] top-[530px] grid w-[900px] max-w-[calc(100%-300px)] list-disc gap-[24px] pl-[28px] font-ruda text-[31px] leading-[1.4] text-cream">
                <li>Client inquiries arrive through calls, Facebook, and WhatsApp, and many are lost or answered late</li>
                <li>Teams can’t see which quotes are pending, accepted, or completed</li>
                <li>Many companies have no professional website to show services and past projects</li>
                <li>Custom websites and booking systems are expensive and slow to build</li>
              </ul>
            </section>

            {/* ── Solution ─────────────────────────────────────────────── */}
            <section
              className="absolute top-0 h-full overflow-clip bg-cream"
              style={{ left: pSolution, width: solW }}
              aria-label="The solution"
            >
              <div className="absolute left-[170px] top-[72px]">
                <Eyebrow className="text-ink">THE SOLUTION</Eyebrow>
              </div>
              <h2 className="absolute left-1/2 top-[118px] w-[2088px] max-w-[calc(100%-160px)] -translate-x-1/2 text-center font-display text-[84px] leading-[1.06] text-ink">
                Five intentional features that make running a construction business feel organized, not overwhelming
              </h2>
              <div className="absolute left-1/2 top-[388px] flex w-[2170px] max-w-full -translate-x-1/2 flex-col items-center gap-[68px]">
                <div className="flex items-center gap-[190px]">
                  <SolutionCard
                    title="Simple Setup"
                    body="Unlike enterprise tools that need training and onboarding calls, a company signs up, adds its details, and picks a plan in three steps, then lands in a working dashboard"
                  />
                  <SolutionCard
                    title="Clear Pipeline"
                    body="Unlike calls and chat apps where inquiries get buried, every request lands in one dashboard with a clear status: Pending, Accepted, Completed, or Canceled, with pending ones shown first."
                  />
                  <SolutionCard
                    title="Modern Website"
                    body="Unlike tools that only manage projects, each company also gets a public website built from its own services, materials, and past projects, so it looks credible without a developer"
                  />
                </div>
                <div className="flex items-center gap-[190px]">
                  <SolutionCard
                    title="Role-Based Access"
                    body="Unlike shared logins and spreadsheets, admins, estimators, and site managers each get the right level of access, and new members can be invited in a few clicks"
                  />
                  <SolutionCard
                    title="Transparent Pricing"
                    body="Unlike software with hidden costs, three simple plans, live usage meters, and clear invoices show exactly what a company uses and pays for"
                  />
                </div>
              </div>
            </section>

            {/* ── Background ───────────────────────────────────────────── */}
            <section
              className="absolute top-0 h-full overflow-clip bg-ink"
              style={{ left: pBg, width: bgW }}
              aria-label="Background"
            >
              <div className="absolute left-[124px] top-[92px] w-[min(2150px,calc(100%-248px))]">
                <Eyebrow className="text-cream">BACKGROUND</Eyebrow>
                <h2 className="mt-[32px] font-display text-[104px] leading-[1.16] text-cream">
                  From a Company Website to a Product Companies Can Run On
                </h2>
                <div className="mt-[96px] flex flex-col gap-[34px] font-ruda text-[30px] uppercase leading-[1.7] tracking-[1.4px] text-cream">
                  <p>
                    My first idea for Arkiva was simple: a clean website and admin panel where a construction company
                    could list its services and receive client inquiries in one place
                  </p>
                  <p>
                    But a construction business doesn’t run on a website alone. Inquiries arrive through calls,
                    Facebook, and WhatsApp, quotes get lost, and no one can see what is pending, accepted, or completed
                  </p>
                  <p>
                    That changed my focus. Instead of only designing a site that looks good, I started designing a
                    system that removes confusion at every step, and turned it into a platform any construction company
                    can subscribe to
                  </p>
                </div>
                <p className="mt-[94px] w-[1850px] max-w-full font-ruda text-[49px] uppercase leading-[1.52] tracking-[1.2px] text-cream">
                  How might we help a small construction company stop losing inquiries and look professional online,
                  without hiring a developer?
                </p>
              </div>
            </section>

            {/* ── Competitive analysis ─────────────────────────────────── */}
            <section
              className="absolute top-0 h-full overflow-clip bg-cream"
              style={{ left: pAna, width: anaW }}
              aria-label="Competitive analysis"
            >
              <div className="absolute left-[105px] top-[68px] w-[calc(100%-120px)]">
                <Eyebrow className="text-[#565448]">ANALYSIS AND ITS OUTCOME</Eyebrow>
                <h2 className="mt-[40px] font-display text-[88px] leading-[1.06] text-[#565448]">
                  Competitive Analysis: Understanding the Construction Software Landscape
                </h2>
                <p className="mt-[62px] font-ruda text-[26px] uppercase leading-[1.32] tracking-[1.5px] text-[#565448]">
                  I reviewed Procore, Buildertrend, and JobTread to see what they do well, where small contractors are
                  still left behind, and where Arkiva could offer a simpler, more affordable way to work.
                </p>
              </div>
              <div className="absolute left-1/2 top-[566px] flex w-[2214px] max-w-[calc(100%-44px)] -translate-x-1/2 items-stretch justify-center gap-[18px]">
                <SwotCard
                  title="STRENGTH"
                  points={[
                    "website and pipeline in one product. each company gets a branded site and a booking dashboard together, so inquiries flow straight into one clear list",
                    "simple and quick to start. a three-step setup and a focused set of pages mean a small team can start working without training",
                  ]}
                />
                <SwotCard
                  title="WEAKNESS"
                  points={[
                    "narrow feature set. arkiva doesn’t yet cover scheduling, document storage, or site reports, so larger firms may find it limited",
                    "new product trust. without a track record or reviews, companies need extra reassurance before moving their client data to a new platform",
                  ]}
                />
                <SwotCard
                  title="OPPORTUNITIES"
                  points={[
                    "local focus. global tools are priced and built for larger firms, so a simple, affordable platform for nepali contractors can win trust quickly",
                    "fix the missed-inquiry moment. notifications, reminders, and pending alerts can save leads that calls and chat apps lose",
                  ]}
                />
                <SwotCard
                  title="THREATS"
                  points={[
                    "established platforms. procore and buildertrend have strong brands and could launch simpler plans for small companies",
                    "free habits are hard to replace. whatsapp, facebook, and excel are already familiar, so arkiva must feel clearly easier to earn the switch",
                  ]}
                />
              </div>
            </section>

            {/* ── Persona ──────────────────────────────────────────────── */}
            <section
              className="absolute top-0 h-full overflow-clip bg-sand"
              style={{ left: pPer, width: perW }}
              aria-label="User persona"
            >
              <div className="absolute left-[96px] top-[82px] w-[calc(100%-192px)]">
                <h2 className="max-w-[2450px] font-display text-[94px] leading-[1.04] text-ink">
                  Beyond the Photos, Defining Owner Needs
                </h2>
                <p className="mt-[42px] max-w-[2500px] font-ruda text-[29px] uppercase leading-[1.36] tracking-[1.5px] text-[#565448]">
                  For Arkiva, I looked past individual features to understand what construction companies actually
                  need: answering every inquiry on time, seeing what is pending, looking professional online, and
                  keeping the team on the same page.
                </p>
              </div>

              <div className="absolute left-[96px] top-[448px] w-[640px]">
                <h3 className="font-display text-[60px] leading-[1.05] text-ink">[Fictional Character]</h3>
                <p className="mt-[40px] font-ruda text-[24px] leading-[1.62] text-[#565448]">
                  A user persona is a research-based, semi-fictional profile of a typical user, including his habits,
                  goals and frustrations. It helps align design decisions with real needs instead of assumptions.
                </p>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/works/case-arkiva/persona.png"
                alt="Ramesh KC, construction company owner"
                className="absolute bottom-0 max-w-none"
                style={{ left: "calc(50% - 310px)", width: 620 }}
              />
              <div className="absolute" style={{ left: "calc(50% + 210px)", top: 680 }}>
                <p className="vertical-rl-upright whitespace-nowrap font-display text-[74px] leading-none tracking-[-1.5px] text-[#121a32]">
                  RAMESH KC
                </p>
              </div>
              <div className="absolute right-[56px] top-[592px] w-[760px] font-ruda text-[25px] leading-[1.68] text-[#565448]">
                <p className="font-bold text-ink">RAMESH KC</p>
                <p>42 Years, Owner, Construction Company</p>
                <p className="mt-[24px]">
                  Ramesh runs a mid-size construction company in Biratnagar with a team of eight. Clients reach him
                  through phone calls, Facebook messages, and WhatsApp, and he tracks quotes in a notebook and a
                  spreadsheet. When site visits keep him busy, replies slip by a day or two, and some clients go to
                  another contractor.
                </p>
                <p className="mt-[24px]">
                  He wants one place to see every inquiry and its status, a professional website to show his past
                  projects, and a simple way to let his estimator handle quotes. He doesn’t have the budget or time
                  for a custom website or heavy software.
                </p>
              </div>
            </section>

            {/* ── Ideation / user flow ─────────────────────────────────── */}
            <section
              className="absolute top-0 h-full overflow-clip bg-ink"
              style={{ left: pIdea, width: ideaW }}
              aria-label="Ideation and user flow"
            >
              <div className="absolute left-[125px] top-[92px]">
                <h2 className="font-display text-[96px] uppercase leading-none text-cream">IDEATION/USERFLOW</h2>
                <p className="mt-[42px] w-[1150px] max-w-[calc(100%-250px)] font-ruda text-[26px] uppercase leading-[1.5] tracking-[1.4px] text-cream">
                  I mapped how a company moves from signing up to running its inquiries, services, team and billing
                  from one dashboard.
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/works/case-arkiva/tablet.png"
                alt="Arkiva dashboard on a tablet"
                className="absolute max-w-none"
                style={{ left: 130, top: 372, width: 560 }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/works/case-arkiva/flow.png"
                alt="Arkiva onboarding and dashboard user flow"
                className="absolute max-w-none"
                style={{ left: 690, top: 320, width: 1390 }}
              />
            </section>

            {/* ── Hi-fi wireframes ─────────────────────────────────────── */}
            <section
              className="absolute top-0 h-full overflow-clip bg-white"
              style={{ left: pWire, width: wireW }}
              aria-label="Hifi wireframes"
            >
              <h2 className="absolute left-1/2 top-[96px] -translate-x-1/2 whitespace-nowrap font-display text-[92px] leading-none text-[#565448]">
                HIFI WIREFRAMES
              </h2>
              <div className="absolute left-1/2 top-[392px] flex -translate-x-1/2 flex-col gap-[26px]">
                {[0, 1].map((row) => (
                  <div key={row} className="flex gap-[28px]">
                    {[1, 2, 3, 4].map((col) => {
                      const n = row * 4 + col;
                      return (
                        <div key={col} className="relative h-[352px] w-[501px] shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/images/works/case-arkiva/wire-${n}.png`}
                            alt={`Arkiva hi-fi screen ${n}`}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>

            {/* ── Testing & iteration ──────────────────────────────────── */}
            <section
              className="absolute top-0 h-full overflow-clip bg-[#565448]"
              style={{ left: pTest, width: testW }}
              aria-label="Testing and iteration"
            >
              <div className="absolute left-[151px] top-[98px] w-[min(1750px,calc(100%-300px))]">
                <h2 className="font-display text-[100px] uppercase leading-none text-cream">TESTING AND ITERATION</h2>
                <p className="mt-[62px] font-ruda text-[26px] uppercase leading-[1.55] tracking-[1.5px] text-cream">
                  I walked through the key company flows and refined the interface based on usability and accessibility
                  issues, focusing on clearer inquiry status, consistent components, and a smoother path from signing up
                  to a working dashboard.
                </p>
                <p className="mt-[74px] font-ruda text-[26px] uppercase leading-[1.55] tracking-[1.5px] text-cream">
                  Through testing and iteration, I improved Arkiva by finding places where a company owner could feel
                  lost or slowed down. I simplified the dashboard so pending inquiries come first, rebuilt the cards and
                  tables from one design system, raised text contrast to meet accessibility standards, and shortened
                  onboarding to three steps, so setting up, tracking inquiries, and managing the team feel easy and clear
                </p>
                <ul className="mt-[66px] grid list-disc gap-[16px] pl-[30px] font-ruda text-[25px] uppercase leading-[1.55] tracking-[1.5px] text-cream">
                  <li>Dashboard: replaced the large banner with a compact header, and moved pending inquiries to the first card</li>
                  <li>Data: fixed mismatched booking numbers so completed is never higher than total</li>
                  <li>Contrast: replaced low-contrast stat cards and gray text on dark surfaces with AA-compliant pairings</li>
                  <li>Components: swapped heavy shadows for flat, bordered cards, with one table and status badge style on every page</li>
                  <li>Onboarding: reduced setup to three steps with a visible step indicator</li>
                </ul>
              </div>
            </section>

            {/* ── Final thoughts ───────────────────────────────────────── */}
            <section
              className="absolute top-0 h-full overflow-clip bg-cream"
              style={{ left: pFinal, width: finalW }}
              aria-label="Final thoughts"
            >
              <div className="absolute left-[130px] top-[96px] w-[calc(100%-260px)]">
                <h2 className="font-display text-[112px] uppercase leading-none text-[#565448]">FINAL THOUGHTS</h2>
                <p className="mt-[46px] max-w-[1900px] font-ruda text-[31px] uppercase leading-[1.55] tracking-[1.5px] text-[#565448]">
                  The problem was never a lack of tools. It was everything standing between a construction company and
                  an inquiry it can answer with confidence.
                </p>
              </div>
              <div className="absolute left-1/2 top-[467px] flex w-[1700px] max-w-[calc(100%-120px)] -translate-x-1/2 items-stretch justify-center gap-[70px]">
                <ThoughtCard
                  title="WHAT I LEARNED"
                  body="A product is more than good-looking screens. Turning Arkiva from a single company site into a SaaS meant designing onboarding, roles, pricing, and billing too. Building the design system first kept every screen consistent."
                />
                <ThoughtCard
                  title="NEXT STEPS"
                  body="Arkiva is a concept, so the next phase is validation. I would test the sign-up flow and dashboard with real contractors and measure whether they respond to inquiries faster. Notifications and a mobile version would follow."
                />
                <ThoughtCard
                  title="I AM MOST PROUD OF?"
                  body="The way one system holds everything together. Every screen answers a real question an owner has, and ten-plus pages come from five templates, so the product stays calm, clear, and consistent."
                />
              </div>
            </section>

            {/* ── Connect ──────────────────────────────────────────────── */}
            <section
              className="absolute top-0 flex h-full flex-col items-center justify-center overflow-clip bg-ink"
              style={{ left: pConn, width: connW, gap: 42 }}
              aria-label="Let's connect"
            >
              <h2
                className="whitespace-nowrap text-center font-display leading-[1.04] text-cream"
                style={{ fontSize: Math.min(230, (connW - 200) / 5.5) }}
              >
                LET’S CONNECT
              </h2>
              <MailContactCard />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
