import React from "react";
import Link from "next/link";
import { Swords, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 text-center space-y-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-none bg-primary/10 border-2 border-primary/30 mx-auto shadow-[var(--shadow-card)]">
        <Swords size={28} className="text-primary" aria-hidden="true" />
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold italic uppercase tracking-tight font-display text-foreground text-glow-red">
          404 — Stranica nije pronađena
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto font-medium">
          Tražena stranica ne postoji ili je uklonjena. Vratite se na naslovnicu ili pregledajte najnovije objave.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-none bg-primary text-white border-2 border-primary hover:bg-primary/95 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#ffffff] active:scale-[0.97] active:translate-x-0 active:translate-y-0 active:shadow-none px-6 py-3 text-xs font-black uppercase tracking-widest transition-premium shadow-[var(--shadow-brutalist)] cursor-pointer"
        >
          <Home size={14} aria-hidden="true" />
          Naslovnica
        </Link>
        <Link
          href="/novosti"
          className="inline-flex items-center justify-center gap-2 rounded-none bg-white/5 border-2 border-white/10 text-slate-300 hover:border-primary hover:text-primary hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--primary)] active:scale-[0.97] active:translate-x-0 active:translate-y-0 active:shadow-none px-6 py-3 text-xs font-black uppercase tracking-widest transition-premium shadow-[var(--shadow-brutalist)] cursor-pointer"
        >
          Novosti
        </Link>
      </div>
    </div>
  );
}
