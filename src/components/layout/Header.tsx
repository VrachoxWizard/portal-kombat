"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Swords, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { springNav } from "@/lib/motion";
import { CATEGORIES } from "@/lib/constants";
import CommandPalette from "@/components/ui/CommandPalette";
import Magnetic from "@/components/ui/Magnetic";

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

  useEffect(() => {
    if (!isOpen) return;

    const panel = document.getElementById("mobile-nav-panel");
    if (!panel) return;

    const getFocusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <>
      <motion.header
        className="fixed top-4 left-4 right-4 z-50 pointer-events-none"
      >
        <motion.div
          className="bezel-outer max-w-7xl mx-auto pointer-events-auto"
          animate={{
            y: scrolled ? -2 : 0,
            scale: scrolled ? 0.985 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div
            className="bezel-inner flex h-14 items-center justify-between px-6 bg-card/95 backdrop-blur-md border-b border-primary/20 relative overflow-hidden"
          >
            {/* CNC Machined Red Edge Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_-2px_10px_var(--primary)] z-10" />

            <div className="flex-shrink-0 relative z-20">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-none bg-primary/15 border-2 border-primary/40 group-hover:bg-primary group-hover:border-primary transition-premium">
                  <Swords
                    size={18}
                    className="text-primary group-hover:text-white group-hover:rotate-12 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-2xl font-extrabold italic tracking-tighter font-display">
                  <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent text-glow-red">
                    COMBAT
                  </span>
                  <span className="text-foreground">PORTAL</span>
                </span>
                <span className="font-display rounded-none border-2 border-primary bg-primary px-1.5 py-0.5 text-[9px] font-black tracking-widest text-white shadow-[0_0_12px_rgba(225,29,72,0.6)]">
                  HR
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8 relative z-20" aria-label="Glavna navigacija">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Magnetic key={item.name} strength={0.2}>
                    <Link
                      href={item.href}
                      className={`font-display text-xs font-extrabold tracking-widest uppercase transition-premium hover:text-primary relative pb-1 flex items-center cursor-pointer ${
                        active ? "text-primary text-glow-red font-black" : "text-muted-foreground"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.name}
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary ml-1.5 animate-pulse shadow-[0_0_6px_var(--primary)]" />
                      )}
                      {active && (
                        <motion.div
                          layoutId="activeHeaderNav"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary shadow-[0_2px_8px_rgba(225,29,72,0.6)]"
                          transition={springNav}
                        />
                      )}
                    </Link>
                  </Magnetic>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 relative z-20">
              <CommandPalette />
              
              <div className="flex md:hidden">
                <button
                  ref={menuButtonRef}
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center rounded-none border-2 border-white/10 p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                  aria-label={isOpen ? "Zatvori izbornik" : "Otvori izbornik"}
                  aria-expanded={isOpen}
                  aria-controls="mobile-nav-panel"
                >
                  {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category sub-nav (Desktop only) */}
        <motion.div
          animate={{
            opacity: scrolled ? 0 : 1,
            y: scrolled ? -12 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`max-w-7xl mx-auto mt-4 hidden md:flex justify-center overflow-hidden ${
            scrolled ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          <nav className="flex items-center gap-2.5 pb-2 overflow-x-auto" aria-label="Kategorije sportova">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/?category=${cat.slug}`}
                className="shrink-0 rounded-none px-4 py-1.5 text-[10px] font-mono font-black uppercase tracking-widest text-slate-200 border-2 border-white/10 border-l-[4px] border-l-primary bg-black/80 hover:bg-primary/10 hover:text-white hover:border-primary hover:border-l-primary hover:shadow-[0_0_10px_rgba(225,29,72,0.2)] transition-premium cursor-pointer"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobilni izbornik"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-3xl flex flex-col justify-between p-8 md:hidden"
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
                className="rounded-none bg-white/5 border-2 border-white/10 p-2 text-slate-400 hover:text-white hover:border-primary/80 transition-premium cursor-pointer"
                aria-label="Zatvori izbornik"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 my-auto text-center" aria-label="Mobilna navigacija">
              {navigation.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <div key={item.name} className="overflow-hidden py-1">
                    <motion.div
                      initial={{ opacity: 0, y: 48 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 48 }}
                      transition={{
                        delay: index * 0.06 + 0.1,
                        duration: 0.5,
                        ease: [0.32, 0.72, 0, 1]
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`font-display text-4xl font-extrabold italic uppercase tracking-tighter transition-premium block py-2 ${
                          active ? "text-primary text-glow-red" : "text-slate-400 hover:text-white"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ delay: navigation.length * 0.06 + 0.15, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="border-t border-white/5 pt-6 text-center space-y-4"
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
