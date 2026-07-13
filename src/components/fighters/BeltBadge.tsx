"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks";

export type BeltTier = "AMATEUR" | "PROSPECT" | "CONTENDER" | "CHAMPION";

interface BeltBadgeProps {
  tier: BeltTier;
  wins: number;
}

export const BeltBadge: React.FC<BeltBadgeProps> = ({ tier, wins }) => {
  const prefersReducedMotion = useSafeReducedMotion();

  // Tier configuration mappings
  const config = {
    AMATEUR: {
      label: "AMATERSKI STATUS (WHITE BELT)",
      description: "Početak analitičke karijere. Dokažite se točnim prognozama.",
      strapColor: "#e2e8f0", // Light steel/white
      plateBorderColor: "#94a3b8", // Slate
      accentColor: "#64748b",
      glowColor: "rgba(148, 163, 184, 0)",
      beltTitle: "AMATEUR",
      pointsBg: "bg-slate-800 border-slate-700 text-slate-400",
      textColor: "text-slate-400",
    },
    PROSPECT: {
      label: "PERSPEKTIVNI BORAC (BLUE BELT)",
      description: "Pokazali ste taktičko razumijevanje mečeva.",
      strapColor: "#1e3a8a", // Dark blue
      plateBorderColor: "#60a5fa", // Light blue
      accentColor: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.45)",
      beltTitle: "PROSPECT",
      pointsBg: "bg-blue-950/40 border-blue-800/40 text-blue-400",
      textColor: "text-blue-400 text-shadow-[0_0_8px_rgba(59,130,246,0.4)]",
    },
    CONTENDER: {
      label: "IZAZIVAČ KATEGORIJE (GOLD BELT)",
      description: "Elitna točnost prognoza. U krugu ste najboljih.",
      strapColor: "#1e293b", // Slate charcoal
      plateBorderColor: "#fbbf24", // Golden yellow
      accentColor: "#f59e0b",
      glowColor: "rgba(245, 158, 11, 0.55)",
      beltTitle: "CONTENDER",
      pointsBg: "bg-amber-950/40 border-amber-800/40 text-amber-400",
      textColor: "text-amber-400 text-shadow-[0_0_10px_rgba(245,158,11,0.5)]",
    },
    CHAMPION: {
      label: "ŠAMPION PORTALA (RED BELT)",
      description: "Kralj analitike. Vaše prognoze su nepogrešive.",
      strapColor: "#991b1b", // Red/gold trimmed
      plateBorderColor: "#f59e0b", // Gold plate
      accentColor: "#ef4444", // Red rubies
      glowColor: "rgba(239, 68, 68, 0.75)",
      beltTitle: "CHAMPION",
      pointsBg: "bg-red-950/40 border-red-800/40 text-fighter-red",
      textColor: "text-fighter-red text-shadow-[0_0_15px_rgba(239,68,68,0.7)]",
    },
  }[tier];

  // Flashing animation variables for Champion tier
  const pulseScale = prefersReducedMotion ? [1] : [1, 1.015, 1];
  const pulseOpacity = prefersReducedMotion ? [1] : [0.85, 1, 0.85];

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-black/45 border border-white/5 relative overflow-hidden font-condensed select-none">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Header Info */}
      <div className="text-center space-y-1.5 z-10 mb-5">
        <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest block">
          TRIBINA TELEMETRIJE • ANALITIČKI STATUS
        </span>
        <h3 className={`font-display font-black italic text-lg sm:text-2xl uppercase tracking-tight ${config.textColor}`}>
          {config.label}
        </h3>
        <p className="text-xs text-slate-400 font-bold max-w-sm mx-auto leading-relaxed">
          {config.description}
        </p>
      </div>

      {/* Dynamic Champion Belt SVG Container */}
      <motion.div
        animate={
          tier === "CHAMPION"
            ? { scale: pulseScale, filter: `drop-shadow(0 0 15px ${config.glowColor})` }
            : { scale: 1, filter: `drop-shadow(0 0 8px ${config.glowColor})` }
        }
        transition={
          tier === "CHAMPION"
            ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
            : { duration: 0.3 }
        }
        className="w-full max-w-[340px] aspect-[16/7] relative my-2 z-10 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 320 140"
          className="w-full h-full select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)]"
        >
          {/* 1. Main Belt Strap */}
          <path
            d="M 10,70 Q 80,45 160,45 Q 240,45 310,70 L 305,80 Q 240,65 160,65 Q 80,65 15,80 Z"
            fill={config.strapColor}
            stroke="#1e293b"
            strokeWidth="1.5"
            className="transition-colors duration-500"
          />
          <path
            d="M 10,70 Q 80,95 160,95 Q 240,95 310,70 L 305,60 Q 240,75 160,75 Q 80,75 15,60 Z"
            fill={config.strapColor}
            stroke="#1e293b"
            strokeWidth="1.5"
            className="transition-colors duration-500"
          />

          {/* Strap Trim Line (Gold/Silver stitching) */}
          <path
            d="M 15,68 Q 80,49 160,49 Q 240,49 305,68"
            fill="none"
            stroke={tier === "CHAMPION" ? "#f59e0b" : "#475569"}
            strokeDasharray="3,3"
            strokeWidth="1"
          />
          <path
            d="M 15,72 Q 80,91 160,91 Q 240,91 305,72"
            fill="none"
            stroke={tier === "CHAMPION" ? "#f59e0b" : "#475569"}
            strokeDasharray="3,3"
            strokeWidth="1"
          />

          {/* 2. Side Plates (Left & Right) */}
          {/* Left Side Plate */}
          <circle cx="90" cy="70" r="14" fill="#0f172a" stroke={config.plateBorderColor} strokeWidth="1.5" />
          <circle cx="90" cy="70" r="10" fill={config.accentColor} opacity="0.3" />
          <path d="M 86,70 L 94,70 M 90,66 L 90,74" stroke={config.plateBorderColor} strokeWidth="1.5" />

          {/* Right Side Plate */}
          <circle cx="230" cy="70" r="14" fill="#0f172a" stroke={config.plateBorderColor} strokeWidth="1.5" />
          <circle cx="230" cy="70" r="10" fill={config.accentColor} opacity="0.3" />
          <path d="M 226,70 L 234,70 M 230,66 L 230,74" stroke={config.plateBorderColor} strokeWidth="1.5" />

          {/* 3. Central Shield Championship Plate */}
          <g className="transition-all duration-500">
            {/* Outer Gold/Steel Shield */}
            <path
              d="M 125,50 L 195,50 L 205,70 L 195,95 L 125,95 L 115,70 Z"
              fill="#0f172a"
              stroke={config.plateBorderColor}
              strokeWidth="2.5"
            />
            {/* Inner Crest Overlay */}
            <path
              d="M 132,55 L 188,55 L 196,70 L 188,90 L 132,90 L 124,70 Z"
              fill={tier === "CHAMPION" ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.02)"}
              stroke={config.plateBorderColor}
              strokeWidth="1"
            />

            {/* Glowing Center Core */}
            {tier === "CHAMPION" && (
              <motion.circle
                cx="160"
                cy="70"
                r="18"
                fill="none"
                stroke={config.accentColor}
                strokeWidth="2"
                animate={prefersReducedMotion ? {} : { opacity: pulseOpacity, scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}

            {/* Ruby side jewels for Champion/Gold */}
            {(tier === "CHAMPION" || tier === "CONTENDER") && (
              <>
                <circle cx="120" cy="70" r="2.5" fill={config.accentColor} />
                <circle cx="200" cy="70" r="2.5" fill={config.accentColor} />
                <circle cx="160" cy="46" r="2" fill={config.accentColor} />
                <circle cx="160" cy="94" r="2" fill={config.accentColor} />
              </>
            )}

            {/* Rank text in the middle */}
            <text
              x="160"
              y="74"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={tier === "AMATEUR" ? "#94a3b8" : config.plateBorderColor}
              fontSize="9"
              fontWeight="900"
              fontFamily="var(--font-display)"
              letterSpacing="0.12em"
              className="italic tracking-widest"
            >
              {config.beltTitle}
            </text>
          </g>
        </svg>
      </motion.div>

      {/* Stats Quick Footer */}
      <div className={`mt-3 px-4 py-1.5 border font-mono font-bold text-xs uppercase tracking-widest ${config.pointsBg}`}>
        Pogođene Predikcije: <span className="font-black text-white">{wins}</span>
      </div>
    </div>
  );
};
