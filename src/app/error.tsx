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
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 text-center space-y-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 mx-auto">
        <AlertTriangle size={28} className="text-destructive" aria-hidden="true" />
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold italic uppercase tracking-tight font-display text-foreground">
          Nešto je pošlo po zlu
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          Došlo je do greške pri učitavanju sadržaja. Pokušajte ponovno ili se vratite na naslovnicu.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-red-400/80 font-mono break-all max-w-lg mx-auto">
            {error.message}
          </p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white border border-red-400/30 transition-premium cursor-pointer"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Pokušaj ponovno
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground border border-white/10 hover:border-primary/30 hover:text-primary transition-premium"
        >
          Naslovnica
        </Link>
      </div>
    </div>
  );
}
