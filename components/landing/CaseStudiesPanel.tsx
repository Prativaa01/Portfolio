import { HOME, CASE_STUDIES } from "@/lib/home";
import { Arrow } from "./Arrow";

export function CaseStudiesPanel() {
  const c = HOME.cases;
  const { list } = c;

  // Rows are laid out by spacing rather than by absolute tops, matching the
  // column in Figma: each of the first three rows is text + rule, the last is
  // text alone, and every row advances by its own height plus the row gap.
  const rows = CASE_STUDIES.map((name, i) => {
    const top =
      list.top +
      i * (list.rowHeight + list.ruleGap + list.rowGap);
    return { name, top, ruled: i < CASE_STUDIES.length - 1 };
  });

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

      {rows.map(({ name, top, ruled }) => (
        <div
          key={name}
          className="absolute"
          // The row needs an explicit width: an absolutely positioned box
          // shrinks to its content, which would pull the rule in to the width
          // of the word instead of the full 657px column Figma draws.
          style={{ left: list.left, top, width: list.width }}
        >
          <span
            className="block whitespace-nowrap font-ruda"
            style={{
              fontSize: list.fontSize,
              lineHeight: `${list.rowHeight}px`,
            }}
          >
            {name}
          </span>
          {ruled && (
            <div
              className="absolute left-0 w-full bg-rule"
              style={{ top: list.rowHeight + list.ruleGap, height: 1 }}
            />
          )}
        </div>
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