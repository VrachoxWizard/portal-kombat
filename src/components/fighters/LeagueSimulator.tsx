"use client";

import React, { useState } from "react";
import { Sliders, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

export interface SimulatedState {
  wins: number;
  accuracy: number;
  streak: number;
  isSimulated: boolean;
}

interface LeagueSimulatorProps {
  onSimulate: (state: SimulatedState) => void;
  currentState: SimulatedState;
}

export const LeagueSimulator: React.FC<LeagueSimulatorProps> = ({
  onSimulate,
  currentState,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const simulateTiers = [
    {
      label: "AMATER (WHITE BELT)",
      wins: 0,
      accuracy: 0,
      streak: 0,
      desc: "Simuliraj nula glasova.",
    },
    {
      label: "PROSPEKT (BLUE BELT)",
      wins: 4,
      accuracy: 62,
      streak: 2,
      desc: "Simuliraj 4 pobjede.",
    },
    {
      label: "IZAZIVAČ (GOLD BELT)",
      wins: 8,
      accuracy: 71,
      streak: 5,
      desc: "Simuliraj 8 pobjeda.",
    },
    {
      label: "ŠAMPION (RED BELT)",
      wins: 13,
      accuracy: 84,
      streak: 9,
      desc: "Simuliraj 13 pobjeda.",
    },
  ];

  const handleSimulate = (wins: number, accuracy: number, streak: number) => {
    onSimulate({
      wins,
      accuracy,
      streak,
      isSimulated: true,
    });
  };

  const handleReset = () => {
    onSimulate({
      wins: 0,
      accuracy: 0,
      streak: 0,
      isSimulated: false,
    });
  };

  return (
    <div className="w-full border border-primary/20 bg-slate-950/60 font-condensed mb-6 select-none shadow-[var(--shadow-glow-sm)]">
      {/* Collapsible Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 text-xs text-primary font-black uppercase tracking-widest hover:bg-primary/5 transition-colors duration-200 cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Sliders size={13} className="animate-pulse" />
          HUD Simulacija Pojaseva i Telemetrije {currentState.isSimulated && "[AKTIVAN OVERRIDE]"}
        </span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-primary/10 bg-black/40 space-y-4">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
            SIMULIRAJTE RAZLIČITE STANJA PREDIKCIJA KAKO BISTE TESTIRALI NEONSKE EFEKTE, DETALJE SVG ŠAMPIONSKIH POJASEVA TE DINAMIČKO SLAGANJE U POREDAK LIGE.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {simulateTiers.map((tier) => {
              const isActive =
                currentState.isSimulated &&
                currentState.wins === tier.wins &&
                currentState.accuracy === tier.accuracy;

              return (
                <button
                  key={tier.label}
                  onClick={() => handleSimulate(tier.wins, tier.accuracy, tier.streak)}
                  className={`p-3 text-left border rounded-none transition-premium flex flex-col justify-between min-h-[85px] cursor-pointer group ${
                    isActive
                      ? "border-primary bg-primary/10 text-white"
                      : "border-white/5 bg-slate-950/40 text-slate-400 hover:border-white/15 hover:text-slate-200"
                  }`}
                >
                  <span className="font-mono text-[9px] font-black uppercase tracking-wider block text-slate-500 group-hover:text-primary">
                    {tier.label}
                  </span>
                  <div className="my-1.5 font-display font-black text-sm uppercase tracking-tight text-white italic">
                    {tier.wins} Pobjeda ({tier.accuracy}%)
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 block leading-tight">
                    {tier.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleReset}
              disabled={!currentState.isSimulated}
              className={`flex items-center gap-1.5 px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-premium cursor-pointer ${
                currentState.isSimulated
                  ? "border-fighter-red/35 bg-fighter-red/10 text-fighter-red hover:bg-fighter-red/20 hover:border-fighter-red cursor-pointer btn-press"
                  : "border-white/5 bg-transparent text-slate-600 cursor-not-allowed"
              }`}
            >
              <RefreshCw size={12} className={currentState.isSimulated ? "animate-spin-slow" : ""} />
              Poništi Simulaciju (Učitaj Stvarne Podatke)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
