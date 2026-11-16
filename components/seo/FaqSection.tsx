import { FAQS, FAQ_INTRO, HOME_FAQ_JSON_LD } from "@/lib/seo";

/**
 * Answer-first introduction + visible FAQ.
 *
 * Server-rendered so the content is in the initial HTML without JS — this
 * block is the AEO surface crawlers and AI answer engines can quote.
 * The FAQ questions render here and are emitted as FAQPage JSON-LD below;
 * visible content + schema must match (no schema-only FAQ).
 */
export function FaqSection({ headingId }: { headingId: string }) {
  return (
    <section
      aria-labelledby={headingId}
      className="w-full bg-cream px-6 py-16 text-ink md:px-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id={headingId}
          className="font-ruda text-2xl font-extrabold tracking-tight md:text-3xl"
        >
          Frequently asked questions
        </h2>
        <p className="mt-4 font-ruda text-base leading-relaxed text-ink/80">
          {FAQ_INTRO}
        </p>
        <div className="mt-8 divide-y divide-ink/15 border-y border-ink/15">
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_FAQ_JSON_LD) }}
      />
    </section>
  );
}
