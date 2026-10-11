import { COPY } from "@/lib/content";
import { PhotoSlot } from "./PhotoSlot";

export function PanelThree() {
  return (
    <section
      className="relative h-full shrink-0 bg-cream"
      style={{ width: 1566 }}
      aria-label="Photograph"
    >
      <PhotoSlot
        src="/photos/portrait-wide.jpg"
        alt="Prativa Dahal at work"
        width={741}
        height={770}
        className="absolute left-[479px] top-0 h-full w-[741px]"
      />

      <p className="absolute left-[626px] top-[287px] w-[448px] text-[76px] leading-[90px] font-thin-figma text-ink">
        {COPY.photoCaption}
      </p>

      <svg
        className="absolute left-[1462px] top-[238px]"
        width="215"
        height="295"
        viewBox="0 0 215 295"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M107.5 0C107.5 0 0 82.9 0 185.4C0 245.9 48 295 107.5 295C167 295 215 245.9 215 185.4C215 82.9 107.5 0 107.5 0Z"
          stroke="#11120D"
          strokeWidth="1"
        />
        <path
          d="M107.5 0V295"
          stroke="#11120D"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
      </svg>
    </section>
  );
}