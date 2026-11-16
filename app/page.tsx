import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { FaqSection } from "@/components/seo/FaqSection";
import { HOME_DESCRIPTION, HOME_TITLE, OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <>
      <LandingPage />
      {/* Desktop shows the FAQ as a horizontal panel inside the frame
          (FaqPanel, right after the socials panel). This vertical copy stays
          only for the mobile stacked layout. */}
      <div className="md:hidden">
        <FaqSection headingId="faq-heading" />
      </div>
    </>
  );
}
