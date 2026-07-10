import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrendingTicker from "@/components/layout/TrendingTicker";
import ScrollToTop from "@/components/ui/ScrollToTop";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { SITE_URL } from "@/lib/env";
import Analytics from "@/components/ui/Analytics";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://combatportal.hr"),
  title: {
    default: "CombatPortal HR - Borilačke vijesti, analize i predikcije",
    template: "%s | CombatPortal HR",
  },
  description:
    "Vodeći regionalni portal za MMA, boks i kickboks. Najnovije vijesti, stručni blogovi i predikcije borbi.",
  openGraph: {
    type: "website",
    locale: "hr_HR",
    siteName: "CombatPortal HR",
    title: "CombatPortal HR - Borilačke vijesti, analize i predikcije",
    description:
      "Vodeći regionalni portal za MMA, boks i kickboks. Najnovije vijesti, stručni blogovi i predikcije borbi.",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CombatPortal HR",
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
    description:
      "Vodeći regionalni portal za MMA, boks i kickboks. Najnovije vijesti, stručni blogovi i predikcije borbi.",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CombatPortal HR",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/pretraga?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="hr"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground relative overflow-x-hidden pb-16 md:pb-0 site-scanlines">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Analytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-none focus:text-sm focus:font-bold border-2 border-primary shadow-[var(--shadow-brutalist)]"
        >
          Preskoči na sadržaj
        </a>

        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-[8%] left-[-12%] w-[42vw] h-[42vw] rounded-full arena-glow-red blur-[100px] opacity-80" />
          <div className="absolute top-[42%] right-[-12%] w-[38vw] h-[38vw] rounded-full arena-glow-red blur-[110px] opacity-50" />
          <div className="absolute bottom-[8%] left-[8%] w-[32vw] h-[32vw] rounded-full arena-glow-indigo blur-[90px] opacity-60" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Suspense fallback={<div className="h-16 bg-slate-950 border-b border-white/5" />}>
            <Header />
          </Suspense>
          <Suspense fallback={<div className="h-9 bg-primary/20 animate-pulse border-b-2 border-black" />}>
            <TrendingTicker />
          </Suspense>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <Suspense fallback={null}>
            <MobileBottomNav />
          </Suspense>
        </div>
      </body>
    </html>
  );
}
