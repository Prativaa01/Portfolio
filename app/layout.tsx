import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Ruda } from "next/font/google";
import { StudyProvider } from "@/components/StudyContext";
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
  title: "Prativa Dahal — Portfolio",
  description:
    "I design digital products that solve real problems through clear systems and considered motion.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${ruda.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas"><StudyProvider>{children}</StudyProvider></body>
    </html>
  );
}