"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, BookOpen, Swords } from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Naslovnica", href: "/", icon: Home },
    { name: "Novosti", href: "/novosti", icon: Newspaper },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Predikcije", href: "/predikcije", icon: Swords },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-lg border-t border-white/5 pb-safe"
      aria-label="Mobilna navigacija"
    >
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 gap-1 transition-premium ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? "scale-110" : "scale-100"} aria-hidden="true" />
                {isActive && (
                  <div
                    className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full shadow-[var(--shadow-glow-sm)]"
                    aria-hidden="true"
                  />
                )}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase font-display">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
