import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface TrendingItem {
  label: string;
  href: string;
}

const fallbackItems: TrendingItem[] = [
  { label: "UFC 330: Makhachev vs. Garry — 15. kolovoza", href: "/novosti" },
  { label: "Filip Hrgović spreman za napad na titulu", href: "/novosti" },
  { label: "#StipeMiočić povratak u oktagonu?", href: "/tag/stipe-miocic" },
  { label: "FNC 33 Zagreb — karte u prodaji!", href: "/novosti" },
  { label: "Boks: Riyadh Season najave", href: "/novosti" },
];

async function getTrendingItems(): Promise<TrendingItem[]> {
  try {
    const latestPosts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: { title: true, slug: true },
    });

    if (latestPosts.length > 0) {
      return latestPosts.map((post) => ({
        label: post.title,
        href: `/clanak/${post.slug}`,
      }));
    }
  } catch (error) {
    console.warn("DB not accessible. Using fallback for trending ticker:", error);
  }
  return fallbackItems;
}

export const TrendingTicker = async () => {
  const itemsList = await getTrendingItems();
  // Duplicate list to ensure seamless marquee looping
  const items = [...itemsList, ...itemsList];

  return (
    <div
      className="relative w-full overflow-hidden border-b border-white/5 bg-[var(--bg-canvas-raised)]/90 backdrop-blur-sm"
      role="region"
      aria-label="Trending vijesti"
    >
      <div className="mx-auto max-w-7xl flex items-center">
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 border-r border-white/5">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="motion-reduce:hidden animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 flex items-center gap-1">
            <Zap size={10} aria-hidden="true" />
            Trending
          </span>
        </div>

        <div className="flex-1 overflow-hidden py-2">
          <div className="ticker-track gap-8 motion-reduce:transform-none">
            {items.map((item, i) => (
              <Link
                key={`${item.label}-${i}`}
                href={item.href}
                className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-primary transition-premium uppercase tracking-wide shrink-0"
              >
                <span className="text-primary/50" aria-hidden="true">
                  ▸
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="sr-only">
        {itemsList.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingTicker;
