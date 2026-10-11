import type { Metadata } from "next";
import { Cormorant_Garamond, Ruda } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const ruda = Ruda({
  variable: "--font-ruda",
  subsets: ["latin"],
  weight: ["400", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prativa Dahal — Portfolio",
  description:
    "I design digital products that solve real problems through clear systems and considered motion.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${ruda.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas">{children}</body>
    </html>
  );
}