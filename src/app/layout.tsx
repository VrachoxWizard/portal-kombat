import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrendingTicker from "@/components/layout/TrendingTicker";
import ScrollToTop from "@/components/ui/ScrollToTop";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://combatportal.hr"),
  title: {
    default: "CombatPortal HR - Borilačke Vijesti, Analize i Predikcije",
    template: "%s | CombatPortal HR",
  },
  description:
    "Vodeći regionalni portal za MMA, boks i kickboks. Najnovije vijesti, stručni blogovi i predikcije borbi.",
  openGraph: {
    type: "website",
    locale: "hr_HR",
    siteName: "CombatPortal HR",
    title: "CombatPortal HR - Borilačke Vijesti, Analize i Predikcije",
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
  return (
    <html
      lang="hr"
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground relative overflow-x-hidden pb-16 md:pb-0">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-bold"
        >
          Preskoči na sadržaj
        </a>

        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-[8%] left-[-12%] w-[42vw] h-[42vw] rounded-full arena-glow-red blur-[100px] opacity-80" />
          <div className="absolute top-[42%] right-[-12%] w-[38vw] h-[38vw] rounded-full arena-glow-red blur-[110px] opacity-50" />
          <div className="absolute bottom-[8%] left-[8%] w-[32vw] h-[32vw] rounded-full arena-glow-indigo blur-[90px] opacity-60" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <TrendingTicker />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <MobileBottomNav />
        </div>
      </body>
    </html>
  );
}
