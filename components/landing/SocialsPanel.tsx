import { HOME, SOCIALS, SOCIAL_HREFS } from "@/lib/home";
import { sansTop } from "@/lib/typography";

export function SocialsPanel() {
  const s = HOME.socials;
  const ruleTop = s.ruleTops[0];

  return (
    <section
      className="relative shrink-0 bg-ink text-cream"
      style={{ width: 1258, height: HOME.frameHeight }}
      aria-label="Social links"
    >
      {SOCIALS.map((label, i) => (
        <a
          key={label}
          href={SOCIAL_HREFS[i]}
          target="_blank"
          rel="noreferrer noopener"
          className="absolute flex flex-col whitespace-nowrap font-ruda"
          style={{
            left: s.linksLefts[i],
            // Line box bottom sits on the rule; cap height follows from there.
            top: ruleTop - s.fontSize - 0.5,
            fontSize: s.fontSize,
            lineHeight: `${s.fontSize}px`,
          }}
        >
          {/* Nudged so the caps clear the rule by the same 18px as the Figma
              frame, without disturbing the rule's measured position. */}
          <span className="relative top-[1.5px]">{label}</span>
          <span
            className="block w-full bg-cream"
            style={{ height: s.ruleThickness }}
          />
        </a>
      ))}

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