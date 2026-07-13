"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type GridMode = "neon" | "dim" | "off";

interface BroadcastThemeContextType {
  scanlines: boolean;
  grid: GridMode;
  telemetry: boolean;
  setScanlines: (val: boolean) => void;
  setGrid: (val: GridMode) => void;
  setTelemetry: (val: boolean) => void;
}

const BroadcastThemeContext = createContext<BroadcastThemeContextType | undefined>(undefined);

export const BroadcastThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scanlines, setScanlinesState] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem("cp-hud-scanlines");
      return stored === "true";
    } catch {
      return false;
    }
  });

  const [grid, setGridState] = useState<GridMode>(() => {
    if (typeof window === "undefined") return "dim";
    try {
      const stored = localStorage.getItem("cp-hud-grid");
      return ["neon", "dim", "off"].includes(stored || "") ? (stored as GridMode) : "dim";
    } catch {
      return "dim";
    }
  });

  const [telemetry, setTelemetryState] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const stored = localStorage.getItem("cp-hud-telemetry");
      return stored !== "false";
    } catch {
      return true;
    }
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const setScanlines = (val: boolean) => {
    setScanlinesState(val);
    try {
      localStorage.setItem("cp-hud-scanlines", String(val));
    } catch {}
  };

  const setGrid = (val: GridMode) => {
    setGridState(val);
    try {
      localStorage.setItem("cp-hud-grid", val);
    } catch {}
  };

  const setTelemetry = (val: boolean) => {
    setTelemetryState(val);
    try {
      localStorage.setItem("cp-hud-telemetry", String(val));
    } catch {}
  };

  // Compile classes based on current theme configuration
  const classes = [
    mounted && scanlines ? "hud-scanlines" : "",
    mounted && grid === "neon" ? "hud-grid-neon" : "",
    mounted && grid === "dim" ? "hud-grid-dim" : "",
    mounted && telemetry ? "hud-telemetry" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <BroadcastThemeContext.Provider
      value={{
        scanlines,
        grid,
        telemetry,
        setScanlines,
        setGrid,
        setTelemetry,
      }}
    >
      <div className={`min-h-screen transition-all duration-300 ${classes}`}>
        {children}
      </div>
    </BroadcastThemeContext.Provider>
  );
};

export const useBroadcastTheme = () => {
  const context = useContext(BroadcastThemeContext);
  if (context === undefined) {
    throw new Error("useBroadcastTheme must be used within a BroadcastThemeProvider");
  }
  return context;
};
