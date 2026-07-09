"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Swords } from "lucide-react";

const CombatArena3DWrapper = dynamic(() => import("./CombatArena3D"), {
  ssr: false,
  loading: () => (
    <div className="surface-card min-h-[460px] flex flex-col items-center justify-center bg-[#04050a] border-2 border-border text-xs uppercase font-black tracking-widest relative overflow-hidden bg-scanlines select-none">
      {/* Absolute background glow */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_70%)]" aria-hidden="true" />
      
      {/* Outer Shell/Bezel and Inner Core containing Swords */}
      <div className="relative z-10 w-16 h-16 bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary mb-4 animate-pulse shadow-[var(--shadow-glow-sm)]">
        <Swords size={22} className="animate-spin-slow text-primary" aria-hidden="true" />
      </div>

      <span className="relative z-10 text-white font-display font-black text-xs uppercase tracking-widest text-glow-red animate-pulse">
        Učitavanje 3D Arene...
      </span>
      <span className="relative z-10 text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 font-sans">
        Priprema kaveza i rasvjete
      </span>
    </div>
  )
});

export default CombatArena3DWrapper;
