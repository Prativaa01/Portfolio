"use client";

import type { ReactNode } from "react";

/**
 * Shared vertical (mobile) presentation for the case-study overlays and
 * static study pages.
 *
 * The desktop views are scaled horizontal frames; below 768px those become
 * unreadable, so each study renders this document instead — the same copy,
 * imagery and section order stacked vertically with mobile-native type.
 * Both trees are server-rendered and CSS-toggled (`hidden md:block`), so
 * crawlers see the full content and there is no layout flash.
 */

/* ── Tones ──────────────────────────────────────────────────────────────── */

export type MobileTone =
  | "cream"
  | "sand"
  | "night"
  | "olive"
  | "white"
  | "black"
  | "blue";

type ToneStyle = {
  bg: string;
  text: string;
  muted: string;
  rule: string;
};

const TONES: Record<MobileTone, ToneStyle> = {
  cream: { bg: "#FFFAF4", text: "#0E0E0A", muted: "#565448", rule: "rgba(86,84,72,0.4)" },
  sand: { bg: "#D8D0BD", text: "#0E0E0A", muted: "#565448", rule: "rgba(86,84,72,0.4)" },
  night: {
    bg: "#11120D",
    text: "#FFFAF4",
    muted: "rgba(255,250,244,0.65)",
    rule: "rgba(255,250,244,0.25)",
  },
  olive: { bg: "#565448", text: "#FFFAF4", muted: "rgba(255,250,244,0.75)", rule: "rgba(255,250,244,0.3)" },
  white: { bg: "#FFFFFF", text: "#0E0E0A", muted: "#565448", rule: "rgba(86,84,72,0.4)" },
  black: { bg: "#000000", text: "#FFFAF4", muted: "rgba(255,250,244,0.65)", rule: "rgba(255,250,244,0.25)" },
  blue: { bg: "#003566", text: "#D9DDE4", muted: "rgba(217,221,228,0.7)", rule: "rgba(217,221,228,0.3)" },
};

/* ── Blocks ─────────────────────────────────────────────────────────────── */

export type MobileBlock =
  | { kind: "eyebrow"; text: string }
  | { kind: "heading"; text: string; size?: "sm" | "md" | "lg" | "xl" }
  | { kind: "text"; text: string; size?: "sm" | "md" | "lg"; uppercase?: boolean; bold?: boolean }
  | { kind: "quote"; text: string }
  | { kind: "list"; items: readonly string[] }
  | { kind: "meta"; rows: readonly (readonly [string, string])[] }
  | { kind: "stats"; stats: readonly { value: string; label: string }[] }
  | { kind: "image"; src: string; alt: string; contain?: boolean; maxWidth?: number }
  | { kind: "video"; src: string; poster?: string; label?: string }
  | {
      kind: "cards";
      cards: readonly { title: string; body: string }[];
      variant: "solution" | "thought" | "swot";
    }
  | { kind: "flow"; groups: readonly { pill: string; subs?: readonly string[] }[] }
  | { kind: "custom"; render: ReactNode };

export type MobileSection = {
  tone: MobileTone;
  blocks: readonly MobileBlock[];
};

const HEADING_SIZES = {
  sm: "text-[24px] leading-[1.15]",
  md: "text-[30px] leading-[1.12]",
  lg: "text-[38px] leading-[1.08]",
  xl: "text-[46px] leading-[1.05]",
} as const;

function Block({ block, tone }: { block: MobileBlock; tone: MobileTone }) {
  const t = TONES[tone];

  switch (block.kind) {
    case "eyebrow":
      return (
        <p
          className="font-ruda text-[11px] font-bold uppercase leading-[16px] tracking-[1.4px]"
          style={{ color: t.muted }}
        >
          {block.text}
        </p>
      );

    case "heading":
      return (
        <h3
          className={`font-display font-semibold uppercase ${HEADING_SIZES[block.size ?? "md"]}`}
          style={{ color: t.text }}
        >
          {block.text}
        </h3>
      );

    case "text":
      return (
        <p
          className={`font-ruda ${
            block.uppercase ? "uppercase tracking-[1.2px]" : ""
          } ${
            block.size === "lg"
              ? "text-[19px] leading-[1.5]"
              : block.size === "sm"
                ? "text-[13px] leading-[1.6]"
                : "text-[15px] leading-[1.65]"
          } ${block.bold ? "font-bold" : ""}`}
          style={{ color: t.muted }}
        >
          {block.text}
        </p>
      );

    case "quote":
      return (
        <p
          className="font-display text-[24px] leading-[1.35]"
          style={{ color: t.text }}
        >
          {block.text}
        </p>
      );

    case "list":
      return (
        <ul
          className="list-disc space-y-3 pl-5 font-ruda text-[15px] leading-[1.6]"
          style={{ color: t.text }}
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );

    case "meta":
      return (
        <div className="w-full">
          {block.rows.map(([label, value], i) => (
            <div key={label} className="py-3">
              {i > 0 && <div className="mb-3 h-px w-full" style={{ backgroundColor: t.rule }} />}
              <div className="flex items-baseline justify-between gap-4">
                <span
                  className="shrink-0 font-ruda text-[11px] uppercase leading-[16px] tracking-[1.2px]"
                  style={{ color: t.muted }}
                >
                  {label}
                </span>
                <span
                  className="text-right font-ruda text-[14px] leading-[20px]"
                  style={{ color: t.text }}
                >
                  {value}
                </span>
              </div>
            </div>
          ))}
          <div className="h-px w-full" style={{ backgroundColor: t.rule }} />
        </div>
      );

    case "stats":
      return (
        <div className="grid w-full grid-cols-2 gap-x-5 gap-y-6">
          {block.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1.5">
              <p
                className="font-display text-[38px] leading-none"
                style={{ color: t.text }}
              >
                {stat.value}
              </p>
              <p
                className="font-ruda text-[12px] uppercase leading-[17px] tracking-[0.8px]"
                style={{ color: t.muted }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      );

    case "image":
      return (
        <div
          className="relative w-full overflow-hidden"
          style={{ backgroundColor: "rgba(127,127,127,0.08)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            className={`block mx-auto h-auto w-full ${
              block.contain ? "object-contain" : "object-cover"
            }`}
            style={{ maxWidth: block.maxWidth ?? "100%" }}
            loading="lazy"
          />
        </div>
      );

    case "video":
      return (
        <div className="relative w-full overflow-hidden bg-black/90">
          <video
            className="block h-auto w-full object-contain"
            src={block.src}
            poster={block.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={block.label ?? "Project motion reel"}
          />
        </div>
      );

    case "cards": {
      if (block.variant === "swot") {
        return (
          <div className="grid w-full gap-4">
            {block.cards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-4 px-5 py-6 text-center"
                style={{ backgroundColor: TONES.olive.bg, color: TONES.olive.text }}
              >
                <p className="font-display text-[22px] uppercase leading-none">
                  {card.title}
                </p>
                <p className="font-ruda text-[13px] lowercase leading-[1.55] tracking-[0.6px] opacity-90">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        );
      }
      if (block.variant === "thought") {
        return (
          <div className="grid w-full gap-4">
            {block.cards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-3 px-5 pb-8 pt-6 text-center"
                style={{ backgroundColor: TONES.sand.bg, color: "#4E4949" }}
              >
                <p
                  className="font-display text-[20px] font-semibold uppercase leading-none"
                  style={{ color: "#0E0E0A" }}
                >
                  {card.title}
                </p>
                <p className="font-ruda text-[13px] uppercase leading-[1.6] tracking-[1px]">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        );
      }
      // solution — board blue, like the desktop cards.
      return (
        <div className="grid w-full gap-4">
          {block.cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-2.5 bg-[#7AA5DC] px-5 py-6 text-center"
              style={{ color: "#FFFAF4" }}
            >
              <p className="font-ruda text-[21px] capitalize leading-[1.2] tracking-[-0.2px]">
                {card.title}
              </p>
              <p className="font-ruda text-[14px] leading-[1.35] tracking-[-0.1px] opacity-95">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      );
    }

    case "flow":
      return (
        <div className="flex w-full flex-col gap-4">
          {block.groups.map((group) => (
            <div key={group.pill} className="flex flex-col gap-2">
              <span
                className="w-fit rounded-full border px-4 py-2 font-ruda text-[12.5px] font-semibold uppercase leading-none tracking-[0.6px]"
                style={{ borderColor: t.rule, color: t.text }}
              >
                {group.pill}
              </span>
              {group.subs && (
                <div className="flex flex-col gap-1.5 pl-5">
                  {group.subs.map((sub) => (
                    <span
                      key={sub}
                      className="font-ruda text-[12px] uppercase leading-[1.45] tracking-[0.6px]"
                      style={{ color: t.muted }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );

    case "custom":
      return <>{block.render}</>;
  }
}

/* ── Document ───────────────────────────────────────────────────────────── */

/**
 * Back arrow, rotated to point left like the desktop studies' Back button
 * (ant-design:arrow-down-outlined, rotated 90deg).
 */
function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 18.75 18.75" fill="none" aria-hidden="true">
      <path d="M15.7835 8.5199H14.3003C14.2161 8.5199 14.1355 8.55652 14.0787 8.62061L10.0706 13.2404V2.92969C10.0706 2.84912 10.0047 2.7832 9.92408 2.7832H8.82545C8.74488 2.7832 8.67897 2.84912 8.67897 2.92969V13.2404L4.67079 8.62061C4.61586 8.55652 4.53529 8.5199 4.44923 8.5199H2.96607C2.84156 8.66821 2.85621 8.7616 2.93872 8.7616L8.93348 15.7654C8.98842 15.8288 9.05633 15.8796 9.13263 15.9144C9.20892 15.9493 9.29181 15.9673 9.37568 15.9673C9.45955 15.9673 9.54244 15.9493 9.61874 15.9144C9.69503 15.8796 9.76295 15.8288 9.81788 15.7654L15.8933 8.7616C15.9757 8.66638 15.908 8.5199 15.7835 8.5199Z" fill="currentColor" />
    </svg>
  );
}

export type StudyMobileDocProps = {
  /** Big display heading for the top of the document. */
  title: ReactNode;
  /** Sticky bar label, e.g. "Back". */
  onBack: () => void;
  backLabel?: string;
  /** Tone of the sticky bar; defaults to the first section's tone. */
  chromeTone?: MobileTone;
  /** Optional hero block under the title: intro paragraph + tag pills. */
  intro?: { text: string; pills?: readonly string[]; meta?: string };
  /** Sections rendered in order. */
  sections: readonly MobileSection[];
  /** Optional next-project footer. */
  footer?: { label: string; title: string; onClick?: () => void; href?: string };
  ariaLabel: string;
};

export function StudyMobileDoc({
  title,
  onBack,
  backLabel = "Back",
  chromeTone,
  intro,
  sections,
  footer,
  ariaLabel,
}: StudyMobileDocProps) {
  const tone = TONES[chromeTone ?? sections[0]?.tone ?? "cream"];

  return (
    <div aria-label={ariaLabel} className="min-h-screen w-full" style={{ backgroundColor: tone.bg }}>
      {/* Sticky chrome bar */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 backdrop-blur-sm"
        style={{
          backgroundColor: `${tone.bg}E6`,
          borderColor: tone.rule,
          color: tone.text,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="-ml-1 flex cursor-pointer items-center gap-2 font-ruda text-[14px] leading-none"
        >
          <span className="flex size-5 items-center justify-center">
            <span className="flex-none rotate-90">
              <BackArrow />
            </span>
          </span>
          <span>{backLabel}</span>
        </button>
        <span className="font-ruda text-[11px] uppercase tracking-[1.6px]" style={{ color: tone.muted }}>
          PRATIVA DAHAL
        </span>
      </div>

      {/* Title + intro */}
      <header className="flex flex-col gap-6 px-6 pb-10 pt-10">
        <h2 className="font-display text-[44px] font-semibold uppercase leading-[1.02] tracking-[-1px]" style={{ color: tone.text }}>
          {title}
        </h2>
        {intro && (
          <div className="flex flex-col gap-5">
            <p className="font-ruda text-[15px] leading-[1.7]" style={{ color: tone.muted }}>
              {intro.text}
            </p>
            {intro.pills && (
              <div className="flex flex-wrap gap-2">
                {intro.pills.map((pill) => (
                  <span
                    key={pill}
                    className="border px-3 py-1.5 font-ruda text-[11px] uppercase leading-none tracking-[0.6px]"
                    style={{ borderColor: tone.rule, color: tone.text }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            )}
            {intro.meta && (
              <p
                className="font-ruda text-[11px] uppercase leading-[16px] tracking-[1.2px]"
                style={{ color: tone.muted }}
              >
                {intro.meta}
              </p>
            )}
          </div>
        )}
      </header>

      {/* Sections */}
      {sections.map((section, i) => (
        <section
          key={i}
          aria-label={sectionLabel(section.blocks)}
          className="flex flex-col gap-6 border-t px-6 py-10"
          style={{
            backgroundColor: TONES[section.tone].bg,
            borderColor: TONES[section.tone].rule,
          }}
        >
          {section.blocks.map((block, j) => (
            <Block key={j} block={block} tone={section.tone} />
          ))}
        </section>
      ))}

      {/* Next project footer */}
      {footer && footer.href !== undefined ? (
        <a
          href={footer.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={footer.label}
          className="flex items-center justify-between gap-4 border-t px-6 py-8"
          style={{
            backgroundColor: TONES.black.bg,
            borderColor: TONES.black.rule,
          }}
        >
          <FooterContent footer={footer} />
        </a>
      ) : footer ? (
        <button
          type="button"
          onClick={footer.onClick}
          aria-label={footer.label}
          className="flex w-full cursor-pointer items-center justify-between gap-4 border-t px-6 py-8 text-left"
          style={{
            backgroundColor: TONES.black.bg,
            borderColor: TONES.black.rule,
          }}
        >
          <FooterContent footer={footer} />
        </button>
      ) : null}
    </div>
  );
}

function FooterContent({ footer }: { footer: NonNullable<StudyMobileDocProps["footer"]> }) {
  return (
    <>
      <span className="font-ruda text-[13px] uppercase tracking-[1.2px] text-[#FFFAF4]/70">
        {footer.label}
      </span>
      <span className="text-right font-display text-[30px] font-semibold uppercase leading-none text-[#FFFAF4]">
        {footer.title}
        <span aria-hidden="true" className="ml-2 inline-block">
          →
        </span>
      </span>
    </>
  );
}

/** First heading/eyebrow text in a section, for its aria-label. */
function sectionLabel(blocks: readonly MobileBlock[]): string | undefined {
  for (const block of blocks) {
    if (block.kind === "heading") return block.text;
    if (block.kind === "eyebrow") return block.text;
  }
  return undefined;
}

/* ── Overview-study wrapper ─────────────────────────────────────────────── */

export type OverviewMobileProps = {
  title: string;
  overview: string;
  /** Rows under DETAILS, e.g. Type / Year / Scope. */
  details: readonly (readonly [string, string])[];
  /** The Preview row action, if the study has one. */
  previewAction?: { label: string; onClick?: () => void; href?: string };
  /** Visual panel content. */
  visual: ReactNode;
  next: { name: string; onClick?: () => void };
  onBack: () => void;
  ariaLabel: string;
};

/**
 * The four overview studies share one chrome (sidebar / Back / title /
 * overview / details / visual / next project), so their mobile versions
 * share one document builder too.
 */
export function OverviewMobile({
  title,
  overview,
  details,
  previewAction,
  visual,
  next,
  onBack,
  ariaLabel,
}: OverviewMobileProps) {
  return (
    <StudyMobileDoc
      title={title}
      onBack={onBack}
      chromeTone="cream"
      ariaLabel={ariaLabel}
      intro={{ text: overview }}
      sections={[
        {
          tone: "cream",
          blocks: [
            { kind: "eyebrow", text: "DETAILS" },
            {
              kind: "custom",
              render: (
                <div className="w-full">
                  {details.map(([label, value], i) => (
                    <div key={label} className="py-3">
                      {i > 0 && <div className="mb-3 h-px w-full bg-[#565448]/40" />}
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="shrink-0 font-ruda text-[11px] uppercase leading-[16px] tracking-[1.2px] text-[#565448]">
                          {label}
                        </span>
                        {label === "Preview" && previewAction ? (
                          previewAction.href ? (
                            <a
                              href={previewAction.href}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="flex items-center gap-2 font-ruda text-[14px] font-bold leading-[20px] text-[#0E0E0A] underline underline-offset-4"
                            >
                              {previewAction.label}
                              <span aria-hidden="true">↗</span>
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={previewAction.onClick}
                              className="flex cursor-pointer items-center gap-2 font-ruda text-[14px] font-bold leading-[20px] text-[#0E0E0A] underline underline-offset-4"
                            >
                              {previewAction.label}
                              <span aria-hidden="true">↗</span>
                            </button>
                          )
                        ) : (
                          <span className="text-right font-ruda text-[14px] leading-[20px] text-[#0E0E0A]">
                            {value}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="h-px w-full bg-[#565448]/40" />
                </div>
              ),
            },
            { kind: "custom", render: visual },
          ],
        },
      ]}
      footer={{ label: "Next project", title: next.name, onClick: next.onClick }}
    />
  );
}
