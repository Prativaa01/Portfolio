import { HOME } from "@/lib/home";
import { displayTop } from "@/lib/typography";
import { WorkMarquee } from "./WorkMarquee";

export function WorkPanel() {
  const { left, fontSize, inkTop, scaleX, topAdjust } = HOME.work;

  return (
    <section
      className="relative shrink-0 bg-cream text-ink"
      style={{ width: 1566, height: HOME.frameHeight }}
      aria-label="The work"
    >
      <WorkMarquee />
      <h2
        className="absolute z-10 whitespace-nowrap"
        style={{
          left,
          top: displayTop(inkTop, fontSize) + topAdjust,
          fontSize,
          lineHeight: `${fontSize}px`,
          transform: `scaleX(${scaleX})`,
          transformOrigin: "left center",
        }}
      >
        THE WORK
      </h2>
    </section>
  );
}