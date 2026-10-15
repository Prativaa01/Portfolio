import { COPY, DESIGN } from "@/lib/content";

/**
 * Panel geometry from the live "Myself" frame (`node 8066:534`): night
 * (`#11120D` + 20% black gradient) panel, `#e6e1d5` statement block
 * (786px), and the 1660px philosophy row at left 1040 / top 100 with an
 * 804px gap, centred ((1660 − 142 − 804 − 546) / 2 = 84px sides).
 */
export function PanelTwo() {
  return (
    <section
      style={{ width: DESIGN.panelTwoWidth }}
      className="relative h-full shrink-0 bg-ink text-cream"
      aria-label="About and philosophy"
    >
      {/* Dark overlay over night, as the component root specifies. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%)",
        }}
      />

      {/* Light block from `node 8066:535`: 786px, #e6e1d5, full height. */}
      <div className="absolute left-0 top-0 h-full w-[786px] bg-[#e6e1d5]">
        <p
          className="absolute font-thin-figma text-night"
          style={{
            left: 48,
            top: 100,
            width: 532,
            fontSize: 30,
            lineHeight: 1.185,
          }}
        >
          {COPY.statement}
        </p>

        <div
          className="absolute flex items-center text-black"
          style={{ left: 48, top: 570, width: 605, gap: 202, fontSize: 16 }}
        >
          <p className="w-[215px] shrink-0 font-thin-figma">
            {COPY.columns[0]}
          </p>
          <p className="w-[197px] shrink-0 font-thin-figma">
            {COPY.columns[1]}
          </p>
        </div>
      </div>

      {/* Philosophy row from `node 8066:540`. */}
      <div
        className="absolute flex h-[84px] items-center px-[84px] text-white"
        style={{
          left: 1040,
          top: 100,
          width: 1660,
          gap: 804,
          fontSize: 24,
          lineHeight: 1.185,
        }}
      >
        <span className="w-[142px] shrink-0 font-thin-figma">
          {COPY.philosophyLabel}
        </span>
        <span className="w-[546px] shrink-0 font-thin-figma">
          {COPY.philosophyNote}
        </span>
      </div>
    </section>
  );
}
