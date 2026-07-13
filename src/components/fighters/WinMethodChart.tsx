"use client";

import React from "react";
import { motion, Transition } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks";

interface WinMethodChartProps {
  koPct: number;
  subPct: number;
  decPct: number;
  fighterName: string;
}

export const WinMethodChart: React.FC<WinMethodChartProps> = ({
  koPct,
  subPct,
  decPct,
  fighterName,
}) => {
  const prefersReducedMotion = useSafeReducedMotion();

  // Normalize to 100% just in case of rounding errors
  const total = koPct + subPct + decPct;
  const kPct = total > 0 ? Math.round((koPct / total) * 100) : 34;
  const sPct = total > 0 ? Math.round((subPct / total) * 100) : 33;
  const dPct = total > 0 ? 100 - kPct - sPct : 33;

  // SVG parameters
  const size = 160;
  const center = size / 2;
  const strokeWidth = 14;
  const radius = (size - strokeWidth - 20) / 2; // radius ~63
  const circumference = 2 * Math.PI * radius; // ~395.84

  // Segment values
  const koLength = (kPct / 100) * circumference;
  const subLength = (sPct / 100) * circumference;
  const decLength = (dPct / 100) * circumference;

  // Offsets (starting from top, i.e., -90deg rotation)
  const koOffset = 0;
  const subOffset = -koLength;
  const decOffset = -(koLength + subLength);

  const transition: Transition = prefersReducedMotion
    ? {}
    : { duration: 1, ease: "easeOut" };

  return (
    <div className="w-full flex flex-col items-center p-5 bg-black/40 border border-white/5 relative overflow-hidden select-none">
      <div className="absolute top-2 left-3 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-accent animate-pulse" />
        <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">
          METODE ZAVRŠETKA MEČA
        </span>
      </div>

      <div className="relative w-[160px] h-[160px] flex items-center justify-center mt-3">
        {/* Animated donut segments */}
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
          />

          {/* KO/TKO segment (Red) */}
          {kPct > 0 && (
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--fighter-red)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${koLength} ${circumference}`}
              strokeDashoffset={koOffset}
              strokeLinecap={kPct === 100 ? "butt" : "round"}
              initial={prefersReducedMotion ? {} : { strokeDasharray: `0 ${circumference}` }}
              animate={prefersReducedMotion ? {} : { strokeDasharray: `${koLength} ${circumference}` }}
              transition={transition}
              className="drop-shadow-[0_0_5px_rgba(239,68,68,0.25)]"
            />
          )}

          {/* Submission segment (Blue) */}
          {sPct > 0 && (
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--fighter-blue)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${subLength} ${circumference}`}
              strokeDashoffset={subOffset}
              strokeLinecap={sPct === 100 ? "butt" : "round"}
              initial={prefersReducedMotion ? {} : { strokeDasharray: `0 ${circumference}` }}
              animate={prefersReducedMotion ? {} : { strokeDasharray: `${subLength} ${circumference}` }}
              transition={transition}
              className="drop-shadow-[0_0_5px_rgba(59,130,246,0.25)]"
            />
          )}

          {/* Decision segment (Gold) */}
          {dPct > 0 && (
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${decLength} ${circumference}`}
              strokeDashoffset={decOffset}
              strokeLinecap={dPct === 100 ? "butt" : "round"}
              initial={prefersReducedMotion ? {} : { strokeDasharray: `0 ${circumference}` }}
              animate={prefersReducedMotion ? {} : { strokeDasharray: `${decLength} ${circumference}` }}
              transition={transition}
              className="drop-shadow-[0_0_5px_rgba(212,168,83,0.25)]"
            />
          )}
        </svg>

        {/* Center label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            NAČIN
          </span>
          <span className="text-xl font-display font-black text-white italic uppercase">
            POBJEDA
          </span>
          <span className="text-[7px] font-mono text-slate-400 mt-0.5 truncate max-w-[80px]">
            {fighterName.split(" ").pop()}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-3 gap-2 w-full mt-4 border-t border-white/5 pt-3">
        {/* KO */}
        <div className="flex flex-col items-center p-1 bg-white/[0.01] border border-white/5">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-fighter-red" />
            <span className="text-[8px] font-mono font-bold text-slate-500">KO/TKO</span>
          </div>
          <span className="text-xs font-display font-black text-white">{kPct}%</span>
        </div>
        {/* Submission */}
        <div className="flex flex-col items-center p-1 bg-white/[0.01] border border-white/5">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-fighter-blue" />
            <span className="text-[8px] font-mono font-bold text-slate-500">PREDAJA</span>
          </div>
          <span className="text-xs font-display font-black text-white">{sPct}%</span>
        </div>
        {/* Decision */}
        <div className="flex flex-col items-center p-1 bg-white/[0.01] border border-white/5">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
            <span className="text-[8px] font-mono font-bold text-slate-500">ODLUKA</span>
          </div>
          <span className="text-xs font-display font-black text-white">{dPct}%</span>
        </div>
      </div>
    </div>
  );
};
