"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks";

interface FighterStats {
  name: string;
  striking: number;
  grappling: number;
  power: number;
  cardio: number;
  chin: number;
  tdDefense: number;
}

interface RadarChartProps {
  fighterA: FighterStats;
  fighterB?: FighterStats | null;
}

const AXIS_LABELS = [
  "STRIKING",
  "SNAGA (POWER)",
  "BRADA (CHIN)",
  "TD OBRANA",
  "GRAPPLING",
  "KARDIO",
];

export const RadarChart: React.FC<RadarChartProps> = ({ fighterA, fighterB }) => {
  const prefersReducedMotion = useSafeReducedMotion();

  // Dimensions
  const cx = 200;
  const cy = 200;
  const r = 120; // max radius

  const getCoordinates = (index: number, value: number) => {
    const angle = index * (Math.PI / 3) - Math.PI / 2;
    const distance = r * (value / 100);
    const x = cx + distance * Math.cos(angle);
    const y = cy + distance * Math.sin(angle);
    return { x, y };
  };

  const getLabelCoordinates = (index: number, offset = 18) => {
    const angle = index * (Math.PI / 3) - Math.PI / 2;
    const distance = r + offset;
    const x = cx + distance * Math.cos(angle);
    const y = cy + distance * Math.sin(angle);
    return { x, y };
  };

  const getPolygonPath = (fighter: FighterStats) => {
    const stats = [
      fighter.striking,
      fighter.power,
      fighter.chin,
      fighter.tdDefense,
      fighter.grappling,
      fighter.cardio,
    ];
    return stats
      .map((val, idx) => {
        const { x, y } = getCoordinates(idx, val);
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Concentric background lines (hexagons)
  const gridLevels = [20, 40, 60, 80, 100];

  const getHexagonPath = (levelValue: number) => {
    return Array.from({ length: 6 })
      .map((_, idx) => {
        const { x, y } = getCoordinates(idx, levelValue);
        return `${x},${y}`;
      })
      .join(" ") + " z";
  };

  const polyPathA = getPolygonPath(fighterA);
  const polyPathB = fighterB ? getPolygonPath(fighterB) : "";

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-black/40 border border-white/5 relative overflow-hidden select-none">
      <div className="absolute top-2 left-3 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
        <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">
          STATISTIČKI TELEMETRIJSKI RADAR
        </span>
      </div>

      <svg
        viewBox="0 0 400 400"
        className="w-full max-w-[340px] md:max-w-[380px] h-auto drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
      >
        {/* Background Grid Hexagons */}
        {gridLevels.map((lvl) => (
          <path
            key={lvl}
            d={`M ${getHexagonPath(lvl)}`}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray={lvl === 100 ? "none" : "3,3"}
            opacity={lvl === 100 ? "0.6" : "0.3"}
          />
        ))}

        {/* Axis line spikes */}
        {Array.from({ length: 6 }).map((_, idx) => {
          const outer = getCoordinates(idx, 100);
          return (
            <line
              key={idx}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--border)"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}

        {/* Level Markers Text (20, 40, 60, 80, 100) along Striking axis */}
        {gridLevels.map((lvl) => {
          const { y } = getCoordinates(0, lvl);
          return (
            <text
              key={lvl}
              x={cx + 4}
              y={y + 3}
              fill="rgba(148, 163, 184, 0.35)"
              fontSize="8"
              fontWeight="900"
              fontFamily="var(--font-mono)"
            >
              {lvl}
            </text>
          );
        })}

        {/* Fighter A Polygon (Blue Corner) */}
        <g>
          <motion.polygon
            points={polyPathA}
            fill="rgba(59, 130, 246, 0.18)"
            stroke="var(--fighter-blue)"
            strokeWidth="2.5"
            initial={prefersReducedMotion ? {} : { scale: 0.1, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 15,
              delay: 0.1,
            }}
            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
          />
          {/* Scatter points for Fighter A */}
          {Array.from({ length: 6 }).map((_, idx) => {
            const stats = [
              fighterA.striking,
              fighterA.power,
              fighterA.chin,
              fighterA.tdDefense,
              fighterA.grappling,
              fighterA.cardio,
            ];
            const { x, y } = getCoordinates(idx, stats[idx]);
            return (
              <circle
                key={`a-pt-${idx}`}
                cx={x}
                cy={y}
                r="3.5"
                className="fill-fighter-blue stroke-white/20 stroke-2"
              />
            );
          })}
        </g>

        {/* Fighter B Polygon (Red Corner) */}
        {fighterB && (
          <g>
            <motion.polygon
              points={polyPathB}
              fill="rgba(239, 68, 68, 0.18)"
              stroke="var(--fighter-red)"
              strokeWidth="2.5"
              initial={prefersReducedMotion ? {} : { scale: 0.1, opacity: 0 }}
              animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 15,
                delay: 0.25,
              }}
              className="drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]"
            />
            {/* Scatter points for Fighter B */}
            {Array.from({ length: 6 }).map((_, idx) => {
              const stats = [
                fighterB.striking,
                fighterB.power,
                fighterB.chin,
                fighterB.tdDefense,
                fighterB.grappling,
                fighterB.cardio,
              ];
              const { x, y } = getCoordinates(idx, stats[idx]);
              return (
                <circle
                  key={`b-pt-${idx}`}
                  cx={x}
                  cy={y}
                  r="3.5"
                  className="fill-fighter-red stroke-white/20 stroke-2"
                />
              );
            })}
          </g>
        )}

        {/* Axis Labels */}
        {AXIS_LABELS.map((label, idx) => {
          const { x, y } = getLabelCoordinates(idx, 15);
          
          // Align labels correctly depending on their quadrant
          let textAnchor: "start" | "end" | "middle" = "middle";
          if (idx === 1 || idx === 2) textAnchor = "start";
          if (idx === 4 || idx === 5) textAnchor = "end";

          let alignmentBaseline: "middle" | "auto" | "hanging" = "middle";
          if (idx === 0) alignmentBaseline = "auto";
          if (idx === 3) alignmentBaseline = "hanging";

          // Polish label position offsets
          let yOffset = 0;
          if (idx === 0) yOffset = -5;
          if (idx === 3) yOffset = 5;

          return (
            <text
              key={label}
              x={x}
              y={y + yOffset}
              textAnchor={textAnchor}
              dominantBaseline={alignmentBaseline}
              fill="rgba(248, 250, 252, 0.85)"
              fontSize="10"
              fontWeight="900"
              fontFamily="var(--font-condensed)"
              letterSpacing="0.05em"
              className="tracking-wider uppercase"
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-6 mt-2 text-[10px] font-condensed font-extrabold uppercase tracking-widest bg-black/40 border border-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-fighter-blue border border-white/10" />
          <span className="text-slate-300">{fighterA.name}</span>
        </div>
        {fighterB && (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-fighter-red border border-white/10" />
            <span className="text-slate-300">{fighterB.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
