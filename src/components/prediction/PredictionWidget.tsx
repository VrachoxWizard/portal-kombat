"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks";
import { Swords, Award, Percent, Lightbulb } from "lucide-react";

interface PredictionProps {
  fighterA: string;
  fighterB: string;
  winner: string;
  method: string;
  predictedRound?: string | null;
  confidenceScore: number;
  keyReasoning: string;
  actualWinner?: string | null;
  actualMethod?: string | null;
  actualRound?: string | null;
  isCorrect?: boolean | null;
  resolvedAt?: Date | string | null;
}

export const PredictionWidget: React.FC<PredictionProps> = ({
  fighterA,
  fighterB,
  winner,
  method,
  predictedRound,
  confidenceScore,
  keyReasoning,
  actualWinner,
  actualMethod,
  actualRound,
  isCorrect,
  resolvedAt,
}) => {
  const prefersReducedMotion = useSafeReducedMotion();

  return (
    <div className="surface-card text-white rounded-none p-6 md:p-8 my-8 shadow-[var(--shadow-brutalist)] border-2 border-primary relative overflow-hidden bg-scanlines">
      {/* Heavy brutalist top stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-3.5 bg-primary"
        aria-hidden="true"
      />

      <div className="text-center mb-8 mt-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-widest text-slate-300 font-black mb-4 bg-black/60 border-2 border-white/10 px-3.5 py-1.5 rounded-none">
          <Swords size={12} className="text-primary" aria-hidden="true" />
          Službena prognoza portala
        </span>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 max-w-2xl mx-auto border-2 border-white/10 bg-black/40 p-4">
          <div className="flex-1 text-center py-2">
            <span className="font-black text-lg sm:text-2xl block text-white uppercase tracking-tight font-display">{fighterA}</span>
          </div>
          <span className="shrink-0 bg-primary border-2 border-primary px-3 py-1.5 text-xs text-white font-black tracking-widest uppercase font-display italic">
            VS
          </span>
          <div className="flex-1 text-center py-2">
            <span className="font-black text-lg sm:text-2xl block text-white uppercase tracking-tight font-display sm:text-center">{fighterB}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-black/50 border-2 border-emerald-500/25 p-4 flex flex-col justify-center rounded-none shadow-[4px_4px_0px_0px_rgba(16,185,129,0.1)]">
          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest block mb-1.5 flex items-center gap-1">
            <Award size={12} aria-hidden="true" />
            Predviđeni pobjednik
          </span>
          <span className="font-black text-emerald-400 text-lg sm:text-xl uppercase font-display italic">{winner}</span>
        </div>
        <div className="bg-black/50 border-2 border-white/10 p-4 flex flex-col justify-center rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1.5 flex items-center gap-1">
            <Swords size={12} className="text-primary" aria-hidden="true" />
            Metoda i runda
          </span>
          <span className="font-extrabold text-slate-200 text-sm sm:text-base uppercase font-display">
            {method} {predictedRound ? `(${predictedRound})` : ""}
          </span>
        </div>
      </div>

      <div className="mb-6 bg-black/50 border-2 border-white/10 p-4 rounded-none">
        <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">
          <span className="flex items-center gap-1">
            <Percent size={12} className="text-primary" aria-hidden="true" />
            Pouzdanost prognoze
          </span>
          <span className="text-white font-black">{confidenceScore}%</span>
        </div>
        <div className="w-full bg-slate-950 border-2 border-white/10 rounded-none h-4 overflow-hidden p-0.5" role="progressbar" aria-valuenow={confidenceScore} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            initial={prefersReducedMotion ? false : { width: 0 }}
            whileInView={{ width: `${confidenceScore}%` }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 1, ease: "easeOut" }}
            className="bg-primary h-full rounded-none"
          />
        </div>
      </div>

      <div className="border-t-2 border-white/10 pt-6">
        <h4 className="text-xs uppercase tracking-widest text-slate-400 font-black mb-2.5 flex items-center gap-1.5">
          <Lightbulb size={12} className="text-amber-400" aria-hidden="true" />
          Ključna analiza
        </h4>
        <p className="text-slate-300 italic text-sm leading-relaxed border-l-4 border-primary pl-4 py-1">
          &ldquo;{keyReasoning}&rdquo;
        </p>
      </div>

      {resolvedAt && actualWinner && (
        <div
          className={`mt-6 rounded-none border-2 p-4 ${
            isCorrect
              ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)]"
              : "border-red-500 bg-red-950/20 text-red-300 shadow-[4px_4px_0px_0px_rgba(239,68,68,0.2)]"
          }`}
        >
          <p className="text-[9px] uppercase tracking-widest font-black text-slate-400 mb-2">
            Stvarni ishod borbe
          </p>
          <p className="font-black text-lg uppercase font-display italic">
            {actualWinner} — {actualMethod}
            {actualRound ? ` (${actualRound})` : ""}
          </p>
          <p className="text-xs mt-1 font-bold">
            {isCorrect ? "✓ TOČNA PROGNOZA" : "✗ NETOČNA PROGNOZA"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionWidget;
