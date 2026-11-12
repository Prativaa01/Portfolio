import type { Metadata } from "next";
import { HorizontalPortfolio } from "@/components/HorizontalPortfolio";
import { FaqSection } from "@/components/seo/FaqSection";
import {
  ABOUT_DESCRIPTION,
  ABOUT_PROFILE_JSON_LD,
  ABOUT_TITLE,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about-me` },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: `${SITE_URL}/about-me`,
    title: `${ABOUT_TITLE} | Prativa Dahal`,
    description: ABOUT_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${ABOUT_TITLE} | Prativa Dahal`,
    description: ABOUT_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function AboutMePage() {
  return (
    <>
      <HorizontalPortfolio />
      {/* Server-rendered introduction + FAQ for crawlers/AI engines —
          visible below the interactive scroller so it does not alter the
          horizontal design. Description mirrors the page metadata. */}
      <section aria-labelledby="about-heading" className="w-full bg-cream px-6 py-16 text-ink md:px-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 id="about-heading" className="font-ruda text-3xl font-extrabold tracking-tight md:text-4xl">
            About Prativa Dahal, product designer in Kathmandu, Nepal
          </h1>
          <p className="mt-4 font-ruda text-base leading-relaxed text-ink/80">
            {ABOUT_DESCRIPTION} Prativa designs digital products that solve
            real problems through clear systems and considered motion. Good
            design should feel calm and easy to follow: she starts by working
            out what is getting in people&rsquo;s way, then shapes the details
            so the solution feels obvious.
          </p>
        </div>
      </section>
      <FaqSection headingId="faq-heading" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_PROFILE_JSON_LD) }}
      />
    </>
  );
}
