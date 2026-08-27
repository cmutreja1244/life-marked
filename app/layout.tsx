import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = "https://lifemarked.alba-nova.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "LifeMarked — Every Life Leaves More Than a Name",
  description:
    "LifeMarked connects physical memorials with the stories, photographs, voices and memories behind them.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "LifeMarked — Every Life Leaves More Than a Name",
    description:
      "LifeMarked connects physical memorials with the stories, photographs, voices and memories behind them.",
    url: siteUrl,
    siteName: "LifeMarked",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/images/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeMarked — Every Life Leaves More Than a Name",
    description:
      "LifeMarked connects physical memorials with the stories, photographs, voices and memories behind them.",
    images: ["/images/og-image.webp"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ivory text-charcoal">
        {children}
        <AnalyticsProvider />
      </body>
    </html>
  );
}
