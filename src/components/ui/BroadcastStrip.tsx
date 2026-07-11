"use client";

import React, { useState, useEffect } from "react";
import BroadcastBadge from "./BroadcastBadge";

export const BroadcastStrip: React.FC = () => {
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("hr-HR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDateStr(
        now.toLocaleDateString("hr-HR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-7 bg-black/95 border-b border-white/5 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 select-none">
      {/* Left: On-Air indicator */}
      <div className="flex items-center gap-3">
        <BroadcastBadge variant="live" label="ON AIR" className="text-[7px] px-1.5 py-0.5" />
        <span className="hidden sm:inline text-[8px] font-mono font-bold text-slate-600 tracking-wider">
          SIGNAL: STABLE
        </span>
      </div>

      {/* Center: Network name */}
      <span className="text-[8px] font-condensed font-black tracking-[0.25em] text-slate-500 uppercase hidden md:inline">
        COMBATPORTAL NETWORK
      </span>

      {/* Right: Date + Time */}
      <div className="flex items-center gap-3">
        <span className="text-[8px] font-mono font-bold text-slate-600 tracking-wider hidden sm:inline">
          {dateStr}
        </span>
        <span className="h-3 w-px bg-white/10 hidden sm:inline" aria-hidden="true" />
        <span className="text-[9px] font-mono font-black text-broadcast-cyan tabular-nums tracking-wider">
          {time}
        </span>
      </div>
    </div>
  );
};

export default BroadcastStrip;
