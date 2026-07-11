"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  urgency?: "normal" | "approaching" | "fight-week";
  compact?: boolean;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const URGENCY_STYLES: Record<string, string> = {
  normal: "border-white/10",
  approaching: "border-broadcast-amber/40 broadcast-glow-amber",
  "fight-week": "border-primary/50 shadow-[0_0_14px_rgba(225,29,72,0.4)]",
};

const pad = (n: number): string => n.toString().padStart(2, "0");

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  urgency = "normal",
  compact = false,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 text-[9px] font-black font-condensed tracking-[0.15em] uppercase text-slate-500 border border-white/10 bg-white/5 ${className}`}
      >
        ZAVRŠENO
      </span>
    );
  }

  const segments: { value: string; label: string }[] = [
    { value: pad(timeLeft.days), label: "DANA" },
    { value: pad(timeLeft.hours), label: "SATI" },
    { value: pad(timeLeft.minutes), label: "MIN" },
    { value: pad(timeLeft.seconds), label: "SEK" },
  ];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold tracking-wider tabular-nums ${className}`}
      >
        {pad(timeLeft.days)}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 border ${URGENCY_STYLES[urgency]} bg-black/60 p-1 ${className}`}
      aria-label={`Odbrojavanje: ${timeLeft.days} dana, ${timeLeft.hours} sati, ${timeLeft.minutes} minuta`}
    >
      {segments.map((seg, i) => (
        <React.Fragment key={seg.label}>
          <div className="flex flex-col items-center px-1.5 py-0.5 min-w-[28px]">
            <span className="font-condensed font-black text-sm leading-none tabular-nums text-signal-white">
              {seg.value}
            </span>
            <span className="text-[7px] font-mono font-bold text-slate-500 tracking-wider mt-0.5">
              {seg.label}
            </span>
          </div>
          {i < segments.length - 1 && (
            <span className="text-primary/40 font-black text-[10px] self-start mt-0.5" aria-hidden="true">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CountdownTimer;
