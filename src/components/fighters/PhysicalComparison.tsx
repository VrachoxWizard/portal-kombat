"use client";

import React from "react";
import { Shield } from "lucide-react";

interface FighterData {
  name: string;
  record: string;
  weightClass: string;
  stance?: string | null;
  team?: string | null;
  height?: string | null;
  reach?: string | null;
}

interface PhysicalComparisonProps {
  fighterA: FighterData;
  fighterB: FighterData;
}

export const PhysicalComparison: React.FC<PhysicalComparisonProps> = ({
  fighterA,
  fighterB,
}) => {
  // Parsing helpers to calculate numerical values for advantages
  const parseNumber = (val?: string | null): number => {
    if (!val) return 0;
    const match = val.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const parseWins = (record: string): number => {
    const parts = record.split("-");
    if (parts.length > 0) {
      const wins = parseInt(parts[0], 10);
      return isNaN(wins) ? 0 : wins;
    }
    return 0;
  };

  const hA = parseNumber(fighterA.height);
  const hB = parseNumber(fighterB.height);
  const rA = parseNumber(fighterA.reach);
  const rB = parseNumber(fighterB.reach);
  const wA = parseWins(fighterA.record);
  const wB = parseWins(fighterB.record);

  const getAdvantage = (valA: number, valB: number): "A" | "B" | "NONE" => {
    if (valA > valB) return "A";
    if (valB > valA) return "B";
    return "NONE";
  };

  const heightAdv = getAdvantage(hA, hB);
  const reachAdv = getAdvantage(rA, rB);
  const winsAdv = getAdvantage(wA, wB);

  const comparisonRows = [
    {
      label: "VISINA",
      valA: fighterA.height || "—",
      valB: fighterB.height || "—",
      adv: heightAdv,
    },
    {
      label: "RASPON RUKU",
      valA: fighterA.reach || "—",
      valB: fighterB.reach || "—",
      adv: reachAdv,
    },
    {
      label: "OMJER (POBJEDE)",
      valA: fighterA.record,
      valB: fighterB.record,
      adv: winsAdv,
    },
    {
      label: "STAV",
      valA: fighterA.stance || "—",
      valB: fighterB.stance || "—",
      adv: "NONE",
    },
    {
      label: "KATEGORIJA",
      valA: fighterA.weightClass.split(" (")[0],
      valB: fighterB.weightClass.split(" (")[0],
      adv: "NONE",
    },
    {
      label: "TIM / KAMP",
      valA: fighterA.team || "—",
      valB: fighterB.team || "—",
      adv: "NONE",
    },
  ];

  return (
    <div className="w-full bg-black/40 border border-white/5 p-4 sm:p-6 relative overflow-hidden select-none">
      {/* HUD Header */}
      <div className="absolute top-2 left-3 flex items-center gap-1.5">
        <Shield size={10} className="text-primary animate-pulse" />
        <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">
          TELESNA TELEMETRIJA & USPOREDBA
        </span>
      </div>

      <div className="mt-4 space-y-3 font-condensed">
        {comparisonRows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-white/5 pb-2.5 last:border-0 last:pb-0 group"
          >
            {/* Fighter A (Blue Corner) */}
            <div
              className={`w-5/12 text-left text-sm sm:text-base font-bold transition-all duration-300 ${
                row.adv === "A"
                  ? "text-fighter-blue text-shadow-[0_0_8px_rgba(59,130,246,0.5)] font-black"
                  : "text-slate-300"
              }`}
            >
              {row.valA}
              {row.adv === "A" && (
                <span className="ml-1.5 text-[8px] font-mono font-black bg-fighter-blue/15 text-fighter-blue px-1 py-0.5 border border-fighter-blue/20">
                  ADV
                </span>
              )}
            </div>

            {/* Metric Label */}
            <div className="w-2/12 text-center flex flex-col items-center">
              <span className="text-[9px] sm:text-[10px] font-mono font-black text-slate-500 tracking-wider group-hover:text-primary transition-colors duration-200">
                {row.label}
              </span>
            </div>

            {/* Fighter B (Red Corner) */}
            <div
              className={`w-5/12 text-right text-sm sm:text-base font-bold transition-all duration-300 ${
                row.adv === "B"
                  ? "text-fighter-red text-shadow-[0_0_8px_rgba(239,68,68,0.5)] font-black"
                  : "text-slate-300"
              }`}
            >
              {row.adv === "B" && (
                <span className="mr-1.5 text-[8px] font-mono font-black bg-fighter-red/15 text-fighter-red px-1 py-0.5 border border-fighter-red/20">
                  ADV
                </span>
              )}
              {row.valB}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
