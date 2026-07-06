import React from "react";
import Link from "next/link";
import { Swords, Home, Newspaper, BookOpen, Target, Trophy, Dumbbell } from "lucide-react";
import NewsletterForm from "./NewsletterForm";
import { CATEGORIES } from "@/lib/constants";

const categoryIcons: Record<string, React.ReactNode> = {
  mma: <Trophy size={13} className="text-slate-600" aria-hidden="true" />,
  boks: <Dumbbell size={13} className="text-slate-600" aria-hidden="true" />,
  kickboks: <Swords size={13} className="text-slate-600" aria-hidden="true" />,
};

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[var(--bg-canvas)] text-slate-300">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden="true" />

      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-[var(--radius-card)] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 p-6 sm:p-8">
            <div className="flex-1">
              <h3 className="text-lg font-extrabold italic uppercase tracking-tight text-white font-display mb-1">
                Pridruži se borilačkoj zajednici
              </h3>
              <p className="text-sm text-slate-400 font-medium max-w-md">
                Prijavite se na naš tjedni newsletter i budite u toku sa svim zbivanjima u oktogonu i ringu.
              </p>
            </div>
            <div className="w-full md:w-auto md:min-w-[320px]">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 border border-primary/20">
                <Swords size={14} className="text-primary" aria-hidden="true" />
              </div>
              <span className="text-xl font-extrabold tracking-tighter font-display">
                <span className="text-primary">COMBAT</span>
                <span className="text-white">PORTAL</span>
              </span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">HR</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Vodeći regionalni portal za borilačke sportove. Pratite najnovije vijesti, stručne blogove i predikcije borbi na jednom mjestu.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" aria-hidden="true" />
              Brzi Linkovi
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/", label: "Naslovnica", icon: Home },
                { href: "/novosti", label: "Novosti", icon: Newspaper },
                { href: "/blog", label: "Blog", icon: BookOpen },
                { href: "/predikcije", label: "Predikcije Borbi", icon: Target },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-premium"
                  >
                    <link.icon size={13} className="text-slate-600" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" aria-hidden="true" />
              Sportovi
            </h3>
            <ul className="space-y-3 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/?category=${cat.slug}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-premium"
                  >
                    {categoryIcons[cat.slug]}
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" aria-hidden="true" />
              Pratite nas
            </h3>
            <div className="flex gap-3">
              {[
                { href: "https://instagram.com", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { href: "https://facebook.com", label: "Facebook", path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
                { href: "https://youtube.com", label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/5 border border-white/10 p-3 hover:bg-primary/20 hover:border-primary/30 transition-premium"
                  aria-label={social.label}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600">
          <p className="flex items-center gap-1.5">
            <Swords size={12} className="text-primary/40" aria-hidden="true" />
            © {new Date().getFullYear()} CombatPortal HR. Sva prava pridržana.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 md:mt-0">
            <Link href="/kontakt" className="hover:text-slate-400 transition-premium">
              Kontakt
            </Link>
            <Link href="/o-nama" className="hover:text-slate-400 transition-premium">
              O nama
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
