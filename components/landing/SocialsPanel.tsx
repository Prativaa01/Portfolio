import { HOME, SOCIALS, SOCIAL_HREFS } from "@/lib/home";
import { sansTop } from "@/lib/typography";

export function SocialsPanel() {
  const s = HOME.socials;

  return (
    <section
      className="relative shrink-0 bg-ink text-cream"
      style={{ width: 1258, height: HOME.frameHeight }}
      aria-label="Social links"
    >
      {/* Right-pinned row: the design's original four links end 77px from the
          panel edge, so the row grows to the left as more are added. */}
      <div
        className="absolute flex font-ruda"
        style={{
          right: s.linksRight,
          // Line box bottom sits on the rule; cap height follows from there.
          top: s.ruleTop - s.fontSize - 0.5,
          gap: s.linksGap,
        }}
      >
        {SOCIALS.map((label, i) => {
          const href = SOCIAL_HREFS[i];
          const opensInBrowsers = !href.startsWith("mailto:");
          return (
            <a
              key={label}
              href={href}
              {...(opensInBrowsers
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
              className="flex flex-col whitespace-nowrap"
              style={{
                fontSize: s.fontSize,
                lineHeight: `${s.fontSize}px`,
                color: "#E8E1D3",
              }}
            >
              {/* Nudged so the caps clear the rule by the same 18px as the Figma
                  frame, without disturbing the rule's measured position. */}
              <span className="relative top-[1.5px]">{label}</span>
              <span
                className="block w-full"
                style={{ height: s.ruleThickness, backgroundColor: "#E8E1D3" }}
              />
            </a>
          );
        })}
      </div>

      <p
        className="absolute m-0 font-ruda"
        style={{
          left: s.taglineLeft,
          top: sansTop(s.taglineInkTop, s.taglineFontSize),
          fontSize: s.taglineFontSize,
          lineHeight: `${s.taglineFontSize}px`,
          letterSpacing: `${s.taglineLetterSpacing}px`,
        }}
      >
        WHERE EVERY PIXEL TELLS A STORY
      </p>
    </section>
  );
}