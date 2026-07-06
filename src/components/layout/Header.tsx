"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Swords, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { springNav, duration, EASE_OUT } from "@/lib/motion";
import { CATEGORIES } from "@/lib/constants";

const navigation = [
  { name: "Naslovnica", href: "/" },
  { name: "Novosti", href: "/novosti" },
  { name: "Blog", href: "/blog" },
  { name: "Predikcije", href: "/predikcije" },
  { name: "Borci", href: "/borci" },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeMenu]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <>
      <header
      className={`sticky top-0 z-50 w-full border-b transition-premium ${
        scrolled
          ? "border-white/8 bg-background/90 backdrop-blur-xl shadow-[var(--shadow-card)]"
          : "border-white/5 bg-background/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/45 transition-premium">
                <Swords
                  size={18}
                  className="text-primary group-hover:rotate-12 transition-transform duration-300"
                  aria-hidden="true"
                />
              </div>
              <span className="text-2xl font-extrabold italic tracking-tighter font-display">
                <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent text-glow-red">
                  COMBAT
                </span>
                <span className="text-foreground">PORTAL</span>
              </span>
              <span className="rounded-md border border-primary/30 bg-primary/15 px-1.5 py-0.5 text-[10px] font-extrabold tracking-widest text-primary">
                HR
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8" aria-label="Glavna navigacija">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs font-bold tracking-widest uppercase transition-premium hover:text-primary relative pb-1 flex items-center cursor-pointer ${
                    active ? "text-primary text-glow-red font-black" : "text-muted-foreground"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.name}
                  {active && (
                    <motion.div
                      layoutId="activeHeaderNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[var(--shadow-glow-sm)]"
                      transition={springNav}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex md:hidden">
            <button
              ref={menuButtonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              aria-label={isOpen ? "Zatvori izbornik" : "Otvori izbornik"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-panel"
            >
              {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <nav
          className="hidden md:flex items-center gap-2 pb-3 -mt-1 overflow-x-auto"
          aria-label="Kategorije sportova"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className="shrink-0 rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground border border-white/5 bg-white/[0.03] hover:border-primary/25 hover:text-primary transition-premium cursor-pointer"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobilni izbornik"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: duration.drawer, ease: EASE_OUT }}
            className="fixed inset-0 z-[100] bg-surface-overlay backdrop-blur-2xl flex flex-col justify-between p-8 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold italic tracking-tighter font-display">
                <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent text-glow-red">
                  COMBAT
                </span>
                <span className="text-white">PORTAL</span>
              </span>
              <button
                ref={closeButtonRef}
                onClick={closeMenu}
                className="rounded-full bg-white/5 border border-white/10 p-2.5 text-slate-400 hover:text-white transition-premium cursor-pointer"
                aria-label="Zatvori izbornik"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 my-auto text-center" aria-label="Mobilna navigacija">
              {navigation.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.1, duration: 0.35, ease: EASE_OUT }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={`font-display text-3xl font-extrabold italic uppercase tracking-wider transition-premium block py-2 ${
                        active ? "text-primary text-glow-red" : "text-slate-400 hover:text-white"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="border-t border-white/5 pt-6 text-center space-y-4">
              <p className="text-xs text-slate-500 font-medium">Pratite nas na društvenim mrežama</p>
              <div className="flex justify-center gap-4 text-xs font-bold uppercase tracking-wider">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-primary transition-premium"
                >
                  Instagram
                </a>
                <span className="text-white/10" aria-hidden="true">
                  •
                </span>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-primary transition-premium"
                >
                  Facebook
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
