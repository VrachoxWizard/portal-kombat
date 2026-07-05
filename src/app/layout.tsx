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
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CombatPortal HR - Borilačke Vijesti, Analize i Predikcije",
  description: "Vodeći regionalni portal za MMA, boks i kickboks. Najnovije vijesti, stručni blogovi i predikcije borbi.",
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
        {/* Skip to content - accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-bold"
        >
          Preskoči na sadržaj
        </a>

        {/* Ambient background glows */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-red-600/10 blur-[130px] opacity-75" />
          <div className="absolute top-[45%] right-[-15%] w-[40vw] h-[40vw] rounded-full bg-red-900/10 blur-[150px] opacity-60" />
          <div className="absolute bottom-[5%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-indigo-900/5 blur-[120px] opacity-50" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <TrendingTicker />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <ScrollToTop />
        <MobileBottomNav />
      </body>
    </html>
  );
}

