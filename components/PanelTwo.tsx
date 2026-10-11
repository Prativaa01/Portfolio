import { COPY, DESIGN } from "@/lib/content";

export function PanelTwo() {
  return (
    <section
      style={{ width: DESIGN.panelTwoWidth }}
      className="relative h-full shrink-0 bg-ink text-cream"
      aria-label="About and philosophy"
    >
      <div className="absolute left-12 top-[100px] h-[570px] w-[786px] bg-sand text-ink">
        <p className="absolute left-[364px] top-0 w-[532px] text-[30px] leading-[35.5px] font-thin-figma">
          {COPY.statement}
        </p>

        <div className="absolute left-[364px] top-[470px] flex gap-[202px]">
          {COPY.columns.map((column) => (
            <p
              key={column}
              className="w-[197px] text-[16px] leading-[18.95px] font-thin-figma"
            >
              {column}
            </p>
          ))}
        </div>
      </div>

      <div className="absolute left-[1040px] top-[100px] flex h-[84px] w-[1660px] items-start gap-[790px] bg-black/90 px-[84px]">
        <span className="shrink-0 text-[24px] leading-[28.4px] font-thin-figma">
          {COPY.philosophyLabel}
        </span>
        <span className="w-[546px] text-[24px] leading-[28.4px] font-thin-figma">
          {COPY.philosophyNote}
        </span>
      </div>
    </section>
  );
}