"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface TrendingItem {
  label: string;
  href: string;
}

const trendingItems: TrendingItem[] = [
  { label: "UFC 330: Makhachev vs. Garry — 15. kolovoza", href: "/novosti" },
  { label: "Filip Hrgovič spreman za napad na titulu", href: "/novosti" },
  { label: "#StipeMiočić povratak u oktagonu?", href: "/tag/stipe-miocic" },
  { label: "FNC 33 Zagreb — karte u prodaji!", href: "/novosti" },
  { label: "Boks: Riyadh Season najave", href: "/novosti" },
];

export const TrendingTicker: React.FC = () => {
  // Duplicate items for seamless loop
  const items = [...trendingItems, ...trendingItems];

  return (
    <div className="relative w-full overflow-hidden border-b border-white/5 bg-[#0a0c18]/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl flex items-center">
        {/* UŽIVO badge */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 border-r border-white/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
            <Zap size={10} />
            Trending
          </span>
        </div>

        {/* Scrolling marquee */}
        <div className="flex-1 overflow-hidden py-2">
          <motion.div
            className="flex whitespace-nowrap gap-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {items.map((item, i) => (
              <Link
                key={`${item.label}-${i}`}
                href={item.href}
                className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-primary transition-colors duration-200 uppercase tracking-wide"
              >
                <span className="text-primary/50">▸</span>
                {item.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrendingTicker;
