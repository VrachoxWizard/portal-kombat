"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, BookOpen, Swords, Users } from "lucide-react";
import { motion } from "framer-motion";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        setIsVisible(false); // Scrolling down
      } else if (currentScrollY < lastScrollY.current - 8) {
        setIsVisible(true); // Scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Naslovnica", href: "/", icon: Home },
    { name: "Novosti", href: "/novosti", icon: Newspaper },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Predikcije", href: "/predikcije", icon: Swords },
    { name: "Borci", href: "/borci", icon: Users },
  ];

  return (
    <motion.nav
      variants={{
        visible: { y: 0, x: "-50%", opacity: 1 },
        hidden: { y: 100, x: "-50%", opacity: 0 },
      }}
      animate={isVisible ? "visible" : "hidden"}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="fixed bottom-6 left-1/2 z-40 bg-card/85 backdrop-blur-lg border border-white/10 rounded-none px-5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex gap-4 sm:gap-6 items-center md:hidden max-w-[95vw]"
      aria-label="Mobilna navigacija"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href + "/"));

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-premium cursor-pointer relative ${
              isActive ? "text-primary text-glow-red" : "text-slate-400 hover:text-white"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <Icon size={18} className={`transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`} aria-hidden="true" />
              <span className="text-[8px] font-black tracking-widest uppercase font-display">
                {item.name}
              </span>
            </div>
            {isActive && (
              <motion.div
                layoutId="activeMobileBottomNav"
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-none shadow-[0_0_6px_rgba(225,29,72,0.9)]"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
          </Link>
        );
      })}
    </motion.nav>
  );
};

export default MobileBottomNav;
