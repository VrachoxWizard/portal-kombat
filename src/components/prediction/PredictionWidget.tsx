"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="surface-card text-white rounded-[var(--radius-hero)] p-6 md:p-8 my-8 shadow-[var(--shadow-card)] relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500"
        aria-hidden="true"
      />

      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-extrabold mb-4 surface-elevated px-3 py-1.5 rounded-full">
          <Swords size={12} className="text-primary" aria-hidden="true" />
          Službena Prognoza Portala
        </span>

        <div className="flex flex-row justify-center items-center gap-3 sm:gap-8 max-w-xl mx-auto">
          <div className="flex-1 text-center surface-elevated rounded-xl p-3">
            <span className="font-extrabold text-sm sm:text-lg block text-slate-200 truncate">{fighterA}</span>
          </div>
          <span className="rounded-full bg-red-600/10 border border-red-500/20 px-3 py-2 text-xs text-red-500 font-extrabold tracking-widest">
            VS
          </span>
          <div className="flex-1 text-center surface-elevated rounded-xl p-3">
            <span className="font-extrabold text-sm sm:text-lg block text-slate-200 truncate">{fighterB}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="surface-elevated rounded-xl p-4 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Award size={12} className="text-green-400" aria-hidden="true" />
            Predviđeni pobjednik
          </span>
          <span className="font-extrabold text-green-400 text-lg sm:text-xl">{winner}</span>
        </div>
        <div className="surface-elevated rounded-xl p-4 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Swords size={12} className="text-primary" aria-hidden="true" />
            Metoda i runda
          </span>
          <span className="font-bold text-slate-200 text-sm sm:text-base">
            {method} {predictedRound ? `(${predictedRound})` : ""}
          </span>
        </div>
      </div>

      <div className="mb-6 surface-elevated rounded-xl p-4">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          <span className="flex items-center gap-1">
            <Percent size={12} className="text-primary" aria-hidden="true" />
            Pouzdanost prognoze
          </span>
          <span className="text-white font-extrabold">{confidenceScore}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden" role="progressbar" aria-valuenow={confidenceScore} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            initial={prefersReducedMotion ? false : { width: 0 }}
            whileInView={{ width: `${confidenceScore}%` }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-red-600 to-rose-500 h-full rounded-full"
          />
        </div>
      </div>

      <div className="border-t border-white/5 pt-6">
        <h4 className="text-xs uppercase tracking-widest text-slate-400 font-extrabold mb-2.5 flex items-center gap-1.5">
          <Lightbulb size={12} className="text-amber-400" aria-hidden="true" />
          Ključna Analiza
        </h4>
        <p className="text-slate-300 italic text-sm leading-relaxed border-l-2 border-primary/40 pl-3">
          &ldquo;{keyReasoning}&rdquo;
        </p>
      </div>

      {resolvedAt && actualWinner && (
        <div
          className={`mt-6 rounded-xl border p-4 ${
            isCorrect
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <p className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 mb-2">
            Stvarni ishod
          </p>
          <p className={`font-extrabold text-lg ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
            {actualWinner} — {actualMethod}
            {actualRound ? ` (${actualRound})` : ""}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {isCorrect ? "✓ Točna prognoza" : "✗ Netočna prognoza"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionWidget;
