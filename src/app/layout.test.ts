import { vi, describe, it, expect } from "vitest";
import { Plus_Jakarta_Sans, JetBrains_Mono, Barlow_Condensed } from "next/font/google";

// Mock next/font/google
vi.mock("next/font/google", () => {
  return {
    Plus_Jakarta_Sans: vi.fn().mockReturnValue({
      variable: "--font-plus-jakarta-sans",
      className: "class-plus-jakarta-sans",
    }),
    JetBrains_Mono: vi.fn().mockReturnValue({
      variable: "--font-jetbrains-mono",
      className: "class-jetbrains-mono",
    }),
    Barlow_Condensed: vi.fn().mockReturnValue({
      variable: "--font-barlow-condensed",
      className: "class-barlow-condensed",
    }),
  };
});

// Mock other components and assets to avoid side effects during layout import
vi.mock("@/components/layout/Header", () => ({ default: () => null }));
vi.mock("@/components/layout/Footer", () => ({ default: () => null }));
vi.mock("@/components/layout/TrendingTicker", () => ({ default: () => null }));
vi.mock("@/components/ui/ScrollToTop", () => ({ default: () => null }));
vi.mock("@/components/layout/MobileBottomNav", () => ({ default: () => null }));
vi.mock("@/components/ui/Analytics", () => ({ default: () => null }));
vi.mock("@/components/ui/BroadcastStrip", () => ({ default: () => null }));
vi.mock("@/lib/env", () => ({ SITE_URL: "https://combatportal.hr" }));

describe("Typography Fonts Setup", () => {
  it("verifies next/font/google configurations are defined", async () => {
    // Import layout dynamically to trigger the mock execution
    await import("./layout");

    expect(Plus_Jakarta_Sans).toHaveBeenCalledWith(
      expect.objectContaining({
        variable: "--font-plus-jakarta-sans",
        subsets: ["latin"],
        weight: ["400", "500", "600", "700"],
      })
    );

    expect(JetBrains_Mono).toHaveBeenCalledWith(
      expect.objectContaining({
        variable: "--font-jetbrains-mono",
        subsets: ["latin"],
        weight: ["400", "700"],
      })
    );

    expect(Barlow_Condensed).toHaveBeenCalledWith(
      expect.objectContaining({
        variable: "--font-barlow-condensed",
        subsets: ["latin"],
        weight: ["700", "900"],
      })
    );
  });
});
