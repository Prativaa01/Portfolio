import { FAQS, FAQ_INTRO } from "@/lib/seo";
import { HOME } from "@/lib/home";

/**
 * Horizontal FAQ panel, appended after the dark socials panel in the landing
 * frame. Same server-rendered Q&A as `FaqSection` (the vertical copy that
 * remains for the mobile stacked layout), re-laid out to fit the 770px-tall
 * design frame: heading + answer-first intro on the left, questions on the
 * right.
 *
 * No JSON-LD here — `FaqSection` already emits the FAQPage schema once and it
 * is present in the HTML on every viewport, so the schema and the visible
 * questions stay in sync without duplication.
 */
export function FaqPanel() {
  return (
    <section
      aria-labelledby="faq-panel-heading"
      className="relative flex shrink-0 flex-col justify-center bg-cream text-ink"
      style={{ width: 1566, height: HOME.frameHeight }}
    >
      <div className="flex items-start gap-[120px] px-[96px]">
        <div className="w-[520px] shrink-0">
          <h2
            id="faq-panel-heading"
            className="font-ruda text-4xl font-extrabold tracking-tight"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 font-ruda text-base leading-relaxed text-ink/80">
            {FAQ_INTRO}
          </p>
        </div>
        <div className="min-w-0 flex-1 divide-y divide-ink/15 border-y border-ink/15">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="cursor-pointer font-ruda text-lg font-bold leading-snug marker:text-ink/50 [&::-webkit-details-marker]:text-ink/50">
                {faq.q}
              </summary>
              <p className="mt-3 font-ruda text-base leading-relaxed text-ink/80">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
