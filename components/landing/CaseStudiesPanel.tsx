"use client";

import { useState } from "react";
import { HOME, CASE_STUDIES } from "@/lib/home";
import { useStudy } from "../StudyContext";
import type { StudyKey } from "../WorksMenu";
import { Arrow } from "./Arrow";

/**
 * Arrow-up-right glyph for the hover state, matching Figma
 * `akar-icons:arrow-up-right` (`node 8066:620`, 48x48).
 */
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

export function CaseStudiesPanel() {
  const c = HOME.cases;
  const { list } = c;
  // Hovered row index, or null. States come straight from the Figma
  // `Active` / `hover` components (`node 8066:618` / `8066:622`): every row
  // rests in the hover grey #888383 with no arrow, and the row under the
  // pointer turns Active — black text with the 48px arrow-up-right at
  // a 17px gap.
  const [hovered, setHovered] = useState<number | null>(null);
  const { openStudy } = useStudy();
  // Which rows open a case study (PRO REPAIR GURU has none yet).
  const STUDY_FOR_CASE: Record<string, StudyKey | undefined> = {
    CAREMATE: "caremate",
    PROLEAP: "proleap",
    "PRO REPAIR GURU": undefined,
    AEVA: "aeva",
  };
  // Hover preview images per row. CAREMATE reuses the local
  // `/images/projects/03-caremate.png` asset (the Figma `8066:575` card
  // image); PROLEAP and AEVA point at designer-supplied files saved under
  // `public/images/projects/`. PRO REPAIR GURU has no preview yet, so the
  // frame stays empty for it.
  const PREVIEWS: Record<string, string> = {
    CAREMATE: "/images/projects/03-caremate.png",
    PROLEAP: "/images/projects/proleap.png",
    AEVA: "/images/projects/aeva.png",
  };

  // Rows are laid out by spacing rather than by absolute tops, matching the
  // column in Figma: each of the first three rows is text + rule, the last is
  // text alone, and every row advances by its own height plus the row gap.
  const rows = CASE_STUDIES.map((name, i) => {
    const top =
      list.top +
      i * (list.rowHeight + list.ruleGap + list.rowGap);
    return { name, top, ruled: i < CASE_STUDIES.length - 1 };
  });
  // Preview image for the hovered row, if it has one.
  const hoveredPreview =
    hovered !== null ? (PREVIEWS[rows[hovered].name] ?? null) : null;
  // Tracks preview files that failed to load (missing file in
  // `public/images/projects/`) so a broken-image icon never renders —
  // the frame simply stays empty until the file is added.
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  return (
    <section
      className="relative shrink-0 bg-sand text-ink"
      style={{ width: 1566, height: HOME.frameHeight }}
      aria-label="Case studies"
    >
      <h2
        className="absolute whitespace-nowrap"
        style={{
          left: c.heading.left,
          top: c.heading.boxTop,
          fontSize: c.heading.fontSize,
          lineHeight: `${c.heading.fontSize}px`,
        }}
      >
        CASE STUDIES
      </h2>

      {rows.map(({ name, top, ruled }, i) => {
        // Rows with a case study open it on click.
        const studyKey = STUDY_FOR_CASE[name];
        const clickable = studyKey !== undefined;
        const RowTag = clickable ? "button" : "div";
        return (
        <RowTag
          key={name}
          {...(clickable
            ? {
                type: "button" as const,
                onClick: () => openStudy(studyKey as StudyKey),
                "aria-label": `Open ${name} case study`,
              }
            : {})}
          className="absolute cursor-pointer text-left"
          // The row needs an explicit width: an absolutely positioned box
          // shrinks to its content, which would pull the rule in to the width
          // of the word instead of the full 657px column Figma draws.
          style={{ left: list.left, top, width: list.width }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered((cur) => (cur === i ? null : cur))}
        >
          <span
            className="flex items-center whitespace-nowrap font-ruda transition-colors duration-200 ease-out"
            style={{
              fontSize: list.fontSize,
              lineHeight: `${list.rowHeight}px`,
              gap: 17,
              color: hovered === i ? "#000000" : "#888383",
            }}
          >
            <span className="block whitespace-nowrap">{name}</span>
            <span
              className="inline-flex shrink-0 items-center transition-opacity duration-200 ease-out"
              style={{ opacity: hovered === i ? 1 : 0 }}
              aria-hidden="true"
            >
              <ArrowUpRight size={list.rowHeight} />
            </span>
          </span>
          {ruled && (
            <div
              className="absolute left-0 w-full bg-rule"
              style={{ top: list.rowHeight + list.ruleGap, height: 1 }}
            />
          )}
        </RowTag>
        );
      })}

      <div
        className="absolute overflow-hidden border transition-colors duration-300 ease-out"
        style={{
          left: c.placeholder.left,
          top: c.placeholder.top,
          width: c.placeholder.width,
          height: c.placeholder.height,
          borderColor:
            hoveredPreview !== null ? "transparent" : "var(--color-rule)",
        }}
      >
        <svg
          className="absolute left-0 top-0"
          width={c.placeholder.width}
          height={c.placeholder.height}
          viewBox={`0 0 ${c.placeholder.width} ${c.placeholder.height}`}
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="0"
            x2={c.placeholder.width}
            y2={c.placeholder.height}
            stroke="var(--color-rule)"
            strokeWidth="1"
          />
        </svg>
        {/* Hover preview, revealed inside the frame while hovering a row
            that has one (CAREMATE / PROLEAP / AEVA). One stacked layer per
            row so switching rows cross-fades instead of flashing. */}
        {Object.entries(PREVIEWS).map(([name, src]) =>
          failed[name] ? null : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={name}
              src={src}
              alt={`${name} project preview`}
              className="absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-300 ease-out"
              style={{
                opacity:
                  hovered !== null && rows[hovered].name === name ? 1 : 0,
              }}
              onError={() =>
                setFailed((f) => (f[name] ? f : { ...f, [name]: true }))
              }
            />
          ),
        )}
      </div>

      <p
        className="absolute m-0"
        style={{
          left: c.footnote.left,
          top: c.footnote.boxTop,
          width: list.width,
          fontSize: c.footnote.fontSize,
          lineHeight: `${c.footnote.lineHeight}px`,
        }}
      >
        *LIVESITE UNAVAILABLE FOR SOME INACTIVE
        <br />
        OR INCOMPLETE PROJECT
      </p>

      <span
        className="absolute whitespace-nowrap font-ruda font-extrabold"
        style={{
          left: c.viewAll.left,
          top: c.viewAll.boxTop,
          fontSize: c.viewAll.fontSize,
          lineHeight: `${c.viewAll.fontSize}px`,
        }}
      >
        View all work
      </span>
      <span
        className="absolute flex items-center"
        style={{
          left: c.viewAll.arrow.left,
          top: c.viewAll.boxTop,
          height: c.viewAll.arrow.size,
        }}
      >
        <Arrow width={c.viewAll.arrow.size} stroke={2.5} />
      </span>
    </section>
  );
}