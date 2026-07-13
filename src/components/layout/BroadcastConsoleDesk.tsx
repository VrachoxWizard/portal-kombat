"use client";

import React, { useState, useEffect } from "react";
import { useBroadcastTheme, GridMode } from "./BroadcastThemeContext";
import { Settings, RefreshCw, X, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks";

export const BroadcastConsoleDesk: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scanlines, grid, telemetry, setScanlines, setGrid, setTelemetry } = useBroadcastTheme();
  const prefersReducedMotion = useSafeReducedMotion();

  // Mock telemetry scrolling log stream
  const [logText, setLogText] = useState("LINK SECURE...");

  useEffect(() => {
    const logs = [
      "ACQUIRING SIGNAL [CH.04]...",
      "ANTENNA AZIMUTH: 194.25°...",
      "PORTAL CONNECTED: PUBLIC_ACCESS...",
      "CRT DIAGNOSTICS: NOMINAL...",
      "TELEMETRY SYNC: ONLINE...",
      "BEZEL CALIBRATION: COMPLETE...",
      "NEON POWER INTAKE: 98.4%...",
      "GRID FREQUENCY: 60.00 Hz...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % logs.length;
      setLogText(logs[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleResetAll = () => {
    setScanlines(false);
    setGrid("dim");
    setTelemetry(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-condensed select-none">
      <AnimatePresence>
        {!isOpen ? (
          /* Collapsed Pill Badge Button */
          <motion.button
            key="collapsed"
            initial={prefersReducedMotion ? {} : { scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? {} : { scale: 0.85, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-primary/40 text-primary text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(225,29,72,0.25)] hover:border-primary transition-all duration-200 btn-press"
          >
            <Radio size={12} className="animate-pulse text-primary" />
            <span>SYS CONFIG</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </motion.button>
        ) : (
          /* Expanded Tuner Deck Panel */
          <motion.div
            key="expanded"
            initial={prefersReducedMotion ? {} : { y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={prefersReducedMotion ? {} : { y: 25, opacity: 0 }}
            className="w-[280px] bg-slate-950/95 border-2 border-primary/30 p-4 shadow-[0_0_25px_rgba(0,0,0,0.85)] relative"
          >
            {/* Header controls */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3.5">
              <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Settings size={12} className="animate-spin-slow text-primary" />
                SYS TELEMETRY CONSOLE
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Scanlines Controls */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                  <span>1. CRT SCANLINES</span>
                  <span className={scanlines ? "text-emerald-400" : "text-slate-600"}>
                    {scanlines ? "[ACTIVE]" : "[OFF]"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setScanlines(true)}
                    className={`py-1 text-[9px] font-bold uppercase tracking-wider border cursor-pointer transition-all duration-200 ${
                      scanlines
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-black"
                        : "border-white/5 bg-black/40 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    ON (CRT)
                  </button>
                  <button
                    onClick={() => setScanlines(false)}
                    className={`py-1 text-[9px] font-bold uppercase tracking-wider border cursor-pointer transition-all duration-200 ${
                      !scanlines
                        ? "border-slate-500/40 bg-slate-500/10 text-slate-300 font-black"
                        : "border-white/5 bg-black/40 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    OFF
                  </button>
                </div>
              </div>

              {/* Grid Mode Controls */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                  <span>2. CYBERNETIC GRID</span>
                  <span className="text-primary uppercase">[{grid}]</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["neon", "dim", "off"] as GridMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setGrid(mode)}
                      className={`py-1 text-[9px] font-bold uppercase tracking-wider border cursor-pointer transition-all duration-200 ${
                        grid === mode
                          ? "border-primary/50 bg-primary/10 text-primary font-black"
                          : "border-white/5 bg-black/40 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Telemetry Corner Brackets */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                  <span>3. CORNER BEZELS</span>
                  <span className={telemetry ? "text-primary animate-pulse" : "text-slate-600"}>
                    {telemetry ? "[ACTIVE]" : "[OFF]"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTelemetry(true)}
                    className={`py-1 text-[9px] font-bold uppercase tracking-wider border cursor-pointer transition-all duration-200 ${
                      telemetry
                        ? "border-primary/50 bg-primary/10 text-primary font-black"
                        : "border-white/5 bg-black/40 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    GLOW BORDER
                  </button>
                  <button
                    onClick={() => setTelemetry(false)}
                    className={`py-1 text-[9px] font-bold uppercase tracking-wider border cursor-pointer transition-all duration-200 ${
                      !telemetry
                        ? "border-slate-500/40 bg-slate-500/10 text-slate-300 font-black"
                        : "border-white/5 bg-black/40 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    FLAT
                  </button>
                </div>
              </div>
            </div>

            {/* Diagnostic Ticker & Reset */}
            <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
              {/* Scrolling ticker */}
              <div className="w-[180px] h-[18px] bg-slate-950 border border-white/5 overflow-hidden px-1.5 flex items-center relative">
                <span className="font-mono text-[8px] font-bold text-slate-500 uppercase animate-pulse truncate block w-full whitespace-nowrap">
                  {logText}
                </span>
              </div>

              {/* Reset button */}
              <button
                onClick={handleResetAll}
                className="text-slate-500 hover:text-primary transition-colors p-1 border border-white/5 hover:border-primary/20 bg-white/[0.01] cursor-pointer"
                title="Reset to default"
              >
                <RefreshCw size={11} className="btn-press" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
