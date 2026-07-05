"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Swords } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Naslovnica", href: "/" },
    { name: "Novosti", href: "/novosti" },
    { name: "Blog", href: "/blog" },
    { name: "Predikcije", href: "/predikcije" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/45 transition-all duration-300">
                <Swords size={18} className="text-primary group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-black italic tracking-tighter">
                <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent text-glow-red">COMBAT</span>
                <span className="text-foreground">PORTAL</span>
              </span>
              <span className="rounded-md border border-primary/30 bg-primary/15 px-1.5 py-0.5 text-[10px] font-black tracking-widest text-primary shadow-sm">
                HR
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs font-bold tracking-widest uppercase transition-colors duration-300 hover:text-primary relative pb-1 flex items-center ${
                    isActive ? "text-primary text-glow-red" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeHeaderNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none cursor-pointer"
              aria-label="Glavni izbornik"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#060810]/98 backdrop-blur-2xl flex flex-col justify-between p-8 md:hidden"
          >
            {/* Top row: Logo + Close Button */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black italic tracking-tighter">
                <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent text-glow-red font-display">COMBAT</span>
                <span className="text-white font-display">PORTAL</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/5 border border-white/10 p-2.5 text-slate-400 hover:text-white transition-all cursor-pointer"
                aria-label="Zatvori izbornik"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Links with Staggered animations */}
            <nav className="flex flex-col gap-6 my-auto text-center">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`font-display text-3xl font-black italic uppercase tracking-wider transition-colors duration-300 block py-2 ${
                        isActive ? "text-primary text-glow-red" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom info */}
            <div className="border-t border-white/5 pt-6 text-center space-y-4">
              <p className="text-xs text-slate-500 font-medium">Pratite nas na društvenim mrežama</p>
              <div className="flex justify-center gap-4 text-xs font-bold uppercase tracking-wider">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">Instagram</a>
                <span className="text-white/10">•</span>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">Facebook</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Header;
