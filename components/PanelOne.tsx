import { COPY, DESIGN } from "@/lib/content";
import { PhotoSlot } from "./PhotoSlot";

function MenuGlyph() {
  return (
    <svg
      width="28"
      height="24"
      viewBox="0 0 28 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1 4h26M1 12h26M1 20h26" stroke="#11120D" strokeWidth="2" />
    </svg>
  );
}

export function PanelOne() {
  return (
    <section
      style={{ width: DESIGN.panelOneWidth }}
      className="relative h-full shrink-0 bg-cream"
      aria-label="Introduction"
    >
      <div className="absolute left-0 top-0 h-full w-[115px]">
        <div className="absolute left-[34px] top-4">
          <MenuGlyph />
        </div>
        <div className="absolute left-0 top-[84px] h-px w-[115px] bg-ink/15" />

        <div className="vertical-rl-upright absolute left-[49px] top-[300px] flex h-[446px] w-6 flex-col justify-between">
          <span className="text-[24px] leading-6 tracking-[0.01em]">
            {COPY.name}
          </span>
          <span className="text-center text-[15px] leading-[15px]">
            {COPY.year}
          </span>
        </div>
      </div>

      <div className="absolute left-[115px] top-0 h-full w-[514px] photo-slot" />
      <PhotoSlot
        src="/photos/portrait.png"
        alt="Portrait of Prativa Dahal"
        width={429}
        height={567}
        priority
        className="absolute left-[115px] top-[203px] w-[429px] h-[567px]"
      />
    </section>
  );
}