"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Award, Percent, Lightbulb } from 'lucide-react';

interface PredictionProps {
  fighterA: string;
  fighterB: string;
  winner: string;
  method: string;
  predictedRound?: string | null;
  confidenceScore: number;
  keyReasoning: string;
}

export const PredictionWidget: React.FC<PredictionProps> = ({
  fighterA,
  fighterB,
  winner,
  method,
  predictedRound,
  confidenceScore,
  keyReasoning,
}) => {
  return (
    <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-8 my-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500"></div>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-extrabold mb-4 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
          <Swords size={12} className="text-primary animate-spin" style={{ animationDuration: '4s' }} />
          Službena Prognoza Portala
        </span>

        {/* Matchup Comparison / Tale of the Tape Vibe */}
        <div className="flex flex-row justify-center items-center gap-3 sm:gap-8 max-w-xl mx-auto">
          <div className="flex-1 text-center bg-slate-900/40 rounded-xl p-3 border border-slate-900/80">
            <span className="font-black text-sm sm:text-lg block text-slate-200 truncate">
              {fighterA}
            </span>
          </div>
          <span className="rounded-full bg-red-600/10 border border-red-500/20 px-3 py-2 text-xs text-red-500 font-black tracking-widest">
            VS
          </span>
          <div className="flex-1 text-center bg-slate-900/40 rounded-xl p-3 border border-slate-900/80">
            <span className="font-black text-sm sm:text-lg block text-slate-200 truncate">
              {fighterB}
            </span>
          </div>
        </div>
      </div>

      {/* Prediction Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/50 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Award size={12} className="text-green-400" />
            Predviđeni pobjednik
          </span>
          <span className="font-black text-green-400 text-lg sm:text-xl">
            {winner}
          </span>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/50 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Swords size={12} className="text-primary" />
            Metoda i runda
          </span>
          <span className="font-bold text-slate-200 text-sm sm:text-base">
            {method} {predictedRound ? `(${predictedRound})` : ""}
          </span>
        </div>
      </div>

      {/* Confidence Score Bar */}
      <div className="mb-6 bg-slate-900/40 rounded-xl p-4 border border-slate-900">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          <span className="flex items-center gap-1">
            <Percent size={12} className="text-primary" />
            Pouzdanost prognoze
          </span>
          <span className="text-white font-extrabold">{confidenceScore}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${confidenceScore}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-red-600 to-rose-500 h-full rounded-full"
          ></motion.div>
        </div>
      </div>

      {/* Key Analysis */}
      <div className="border-t border-slate-800/80 pt-6">
        <h4 className="text-xs uppercase tracking-widest text-slate-400 font-extrabold mb-2.5 flex items-center gap-1.5">
          <Lightbulb size={12} className="text-amber-400" />
          Ključna Analiza
        </h4>
        <p className="text-slate-300 italic text-sm leading-relaxed border-l-2 border-primary/40 pl-3">
          &ldquo;{keyReasoning}&rdquo;
        </p>
      </div>
    </div>
  );
};

export default PredictionWidget;
