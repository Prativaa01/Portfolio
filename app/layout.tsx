import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit, Ruda } from "next/font/google";
import { StudyProvider } from "@/components/StudyContext";
import { ContactModalProvider } from "@/components/ContactModal";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  OG_IMAGE,
  SITE_GRAPH_JSON_LD,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const ruda = Ruda({
  variable: "--font-ruda",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s | Prativa Dahal",
  },
  description: HOME_DESCRIPTION,
  keywords: [
    "Prativa Dahal",
    "Prativa Dahal Product Designer",
    "Product Designer in Nepal",
    "Product Designer in Kathmandu",
    "UI/UX Designer in Nepal",
    "UX Designer in Kathmandu",
    "Remote Product Designer",
    "Freelance Product Designer",
    "Product Designer for Startups",
    "Product Design Portfolio",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Prativa Dahal — Product Designer in Kathmandu, Nepal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#11120d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${ruda.variable} ${outfit.variable} h-full antialiased`}>
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM-friendly summary" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_GRAPH_JSON_LD) }}
        />
      </head>
      <body className="min-h-full bg-canvas">
        <StudyProvider>
          <ContactModalProvider>{children}</ContactModalProvider>
        </StudyProvider>
      </body>
    </html>
  );
}
