"use client";

import dynamic from "next/dynamic";

const CombatArena3DWrapper = dynamic(() => import("./CombatArena3D"), {
  ssr: false,
  loading: () => (
    <div className="surface-card min-h-[460px] flex items-center justify-center bg-[#04050a] border-2 border-border text-xs text-muted-foreground uppercase font-black tracking-widest">
      Učitavanje 3D arene...
    </div>
  )
});

export default CombatArena3DWrapper;
