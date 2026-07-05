import React from "react";
import Link from "next/link";
import { Swords, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 text-center space-y-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mx-auto">
        <Swords size={28} className="text-primary" aria-hidden="true" />
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold italic uppercase tracking-tight font-display text-foreground">
          404 — Stranica nije pronađena
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          Tražena stranica ne postoji ili je uklonjena. Vratite se na naslovnicu ili pregledajte najnovije objave.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white border border-red-400/30 shadow-[var(--shadow-glow-sm)] hover:shadow-[var(--shadow-glow-md)] transition-premium"
        >
          <Home size={14} aria-hidden="true" />
          Naslovnica
        </Link>
        <Link
          href="/novosti"
          className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground border border-white/10 hover:border-primary/30 hover:text-primary transition-premium"
        >
          Novosti
        </Link>
      </div>
    </div>
  );
}
