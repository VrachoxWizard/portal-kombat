"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 text-center space-y-8 relative overflow-hidden">
      <div className="relative select-none pointer-events-none mb-4 flex justify-center">
        <span className="text-8xl sm:text-9xl font-black italic text-slate-900/30 tracking-tighter uppercase font-display text-stroke-red text-glow-red select-none">
          GREŠKA TKO
        </span>
      </div>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-none bg-destructive/10 border-2 border-destructive/30 mx-auto shadow-[var(--shadow-card)]">
        <AlertTriangle size={28} className="text-destructive" aria-hidden="true" />
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold italic uppercase tracking-tight font-display text-foreground">
          Nešto je pošlo po zlu
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-bold uppercase tracking-wider">
          Sudac je prekinuo borbu. Došlo je do greške pri učitavanju sadržaja. Pokušajte ponovno.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-red-400/80 font-mono break-all max-w-lg mx-auto bg-black/80 border-2 border-red-500/20 p-4 rounded-none shadow-[var(--shadow-card)]">
            {error.message}
          </p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-none bg-primary text-white border-2 border-primary hover:bg-primary/95 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#ffffff] active:scale-[0.97] active:translate-x-0 active:translate-y-0 active:shadow-none px-6 py-3 text-xs font-black uppercase tracking-widest transition-premium shadow-[var(--shadow-brutalist)] cursor-pointer"
        >
          <RefreshCw size={14} aria-hidden="true" className="animate-spin-slow" />
          Pokušaj ponovno
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-none bg-white/5 border-2 border-white/10 text-slate-300 hover:border-primary hover:text-primary hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--primary)] active:scale-[0.97] active:translate-x-0 active:translate-y-0 active:shadow-none px-6 py-3 text-xs font-black uppercase tracking-widest transition-premium shadow-[var(--shadow-brutalist)] cursor-pointer"
        >
          Naslovnica
        </Link>
      </div>
    </div>
  );
}
