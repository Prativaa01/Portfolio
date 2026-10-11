import { HOME, CASE_STUDIES } from "@/lib/home";
import { displayTop, sansTop } from "@/lib/typography";
import { Arrow } from "./Arrow";

export function CaseStudiesPanel() {
  const c = HOME.cases;

  return (
    <section
      className="relative shrink-0 bg-sand text-ink"
      style={{ width: 1566, height: HOME.frameHeight }}
      aria-label="Case studies"
    >
      <h2
        className="absolute whitespace-nowrap"
        style={{
          left: c.headingLeft,
          top: displayTop(c.headingInkTop, c.headingFontSize),
          fontSize: c.headingFontSize,
          lineHeight: `${c.headingFontSize}px`,
          transform: `scaleX(${c.headingScaleX})`,
          transformOrigin: "left center",
        }}
      >
        CASE STUDIES
      </h2>

      {CASE_STUDIES.map((name, i) => (
        <span
          key={name}
          className="absolute whitespace-nowrap font-ruda"
          style={{
            left: c.listLeft,
            top: sansTop(c.itemInkTops[i], c.itemFontSize),
            fontSize: c.itemFontSize,
            lineHeight: `${c.itemFontSize}px`,
          }}
        >
          {name}
        </span>
      ))}

      {c.ruleTops.map((top) => (
        <div
          key={top}
          className="absolute bg-rule"
          style={{
            left: c.ruleLeft,
            top,
            width: c.ruleWidth,
            height: c.ruleThickness,
          }}
        />
      ))}

      <div
        className="absolute border border-rule"
        style={{
          left: c.placeholder.left,
          top: c.placeholder.top,
          width: c.placeholder.width,
          height: c.placeholder.height,
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
      </div>

      <p
        className="absolute m-0"
        style={{
          left: c.noteLeft,
          top: displayTop(c.noteInkTops[0], c.noteFontSize, c.noteLineHeight),
          width: c.ruleWidth,
          fontSize: c.noteFontSize,
          lineHeight: `${c.noteLineHeight}px`,
        }}
      >
        *LIVESITE UNAVAILABLE FOR SOME INACTIVE
        <br />
        OR INCOMPLETE PROJECT
      </p>

      <span
        className="absolute whitespace-nowrap font-ruda font-extrabold"
        style={{
          left: c.viewLeft,
          top: sansTop(c.viewInkTop, c.viewFontSize),
          fontSize: c.viewFontSize,
          lineHeight: `${c.viewFontSize}px`,
        }}
      >
        View all work
      </span>
      <span
        className="absolute flex items-center"
        style={{
          left: c.viewArrowLeft,
          top: sansTop(c.viewInkTop, c.viewFontSize),
          height: c.viewFontSize,
        }}
      >
        <Arrow width={c.viewArrowWidth} stroke={2.5} />
      </span>
    </section>
  );
}