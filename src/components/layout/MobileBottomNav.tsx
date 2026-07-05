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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/80 backdrop-blur-lg border-t border-white/5 pb-safe">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 gap-1 transition-colors duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? "scale-110" : "scale-100"} />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                )}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase font-display">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileBottomNav;
