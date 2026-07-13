"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, Swords } from "lucide-react";
import Image from "next/image";

interface Fighter {
  id: string;
  name: string;
  slug: string;
  weightClass: string;
  record: string;
  imageUrl?: string | null;
  stance?: string | null;
  team?: string | null;
  striking: number;
  grappling: number;
  power: number;
  cardio: number;
  chin: number;
  tdDefense: number;
  koPct: number;
  subPct: number;
  decPct: number;
  height?: string | null;
  reach?: string | null;
}

interface FighterSelectorProps {
  label: string;
  cornerColor: "blue" | "red";
  selectedFighter: Fighter | null;
  onSelect: (fighter: Fighter | null) => void;
  excludeSlug?: string;
}

export const FighterSelector: React.FC<FighterSelectorProps> = ({
  label,
  cornerColor,
  selectedFighter,
  onSelect,
  excludeSlug = "",
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/fighters/search?q=${encodeURIComponent(query)}&exclude=${encodeURIComponent(
            excludeSlug
          )}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Greška pri traženju boraca:", error);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, excludeSlug, isOpen]);

  const handleSelect = (fighter: Fighter) => {
    onSelect(fighter);
    setIsOpen(false);
    setQuery("");
  };

  const cornerBorderColor =
    cornerColor === "blue" ? "border-fighter-blue/30 focus-within:border-fighter-blue" : "border-fighter-red/30 focus-within:border-fighter-red";
  const glowShadow =
    cornerColor === "blue"
      ? "shadow-[0_0_10px_rgba(59,130,246,0.15)]"
      : "shadow-[0_0_10px_rgba(239,68,68,0.15)]";

  const stripColor = cornerColor === "blue" ? "bg-fighter-blue" : "bg-fighter-red";

  return (
    <div ref={dropdownRef} className="w-full relative font-condensed select-none">
      <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${stripColor} animate-pulse`} />
        {label}
      </p>

      {selectedFighter ? (
        /* Selected Fighter display card */
        <div className={`bezel-outer ${glowShadow} overflow-hidden`}>
          <div className="bezel-inner p-3 bg-black/60 flex items-center justify-between gap-3 relative">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 border border-white/15 bg-slate-900 overflow-hidden shrink-0">
                {selectedFighter.imageUrl ? (
                  <Image
                    src={selectedFighter.imageUrl}
                    alt={selectedFighter.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary">
                    <Swords size={18} />
                  </div>
                )}
              </div>
              <div className="truncate">
                <span className="font-display font-extrabold text-sm sm:text-base text-white uppercase italic tracking-tight truncate block leading-none mb-1">
                  {selectedFighter.name}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  {selectedFighter.record} • {selectedFighter.weightClass.split(" (")[0]}
                </span>
              </div>
            </div>
            <button
              onClick={() => onSelect(null)}
              className="text-slate-500 hover:text-primary transition-colors p-1.5 border border-white/5 hover:border-primary/20 bg-white/[0.02] cursor-pointer btn-press"
              aria-label="Remove fighter"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Autocomplete Input Search */
        <div className={`bezel-outer ${cornerBorderColor} overflow-hidden`}>
          <div className="bezel-inner bg-black/60 flex items-center px-3 py-1.5 relative">
            <Search size={14} className="text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="PRETRAŽI BAZU BORACA..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full bg-transparent border-0 outline-none pl-2.5 py-1 text-xs text-white placeholder-slate-600 font-bold tracking-wide focus:ring-0"
            />
            {loading && <Loader2 size={12} className="text-primary animate-spin shrink-0" />}
          </div>
        </div>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && !selectedFighter && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bezel-outer bg-background max-h-60 overflow-y-auto shadow-2xl">
          <div className="bezel-inner bg-slate-950 divide-y divide-white/5">
            {loading && results.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500 font-mono tracking-wider">
                TRAŽENJE SIGNALA...
              </div>
            )}
            {!loading && results.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500 font-mono tracking-wider">
                NEMA REZULTATA [PRAZNA BAZA]
              </div>
            )}
            {results.map((fighter) => (
              <button
                key={fighter.id}
                onClick={() => handleSelect(fighter)}
                className="w-full text-left p-3 hover:bg-white/[0.04] transition-colors flex items-center gap-3 cursor-pointer"
              >
                <div className="relative h-8 w-8 border border-white/10 overflow-hidden bg-slate-900 shrink-0">
                  {fighter.imageUrl ? (
                    <Image
                      src={fighter.imageUrl}
                      alt={fighter.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary">
                      <Swords size={14} />
                    </div>
                  )}
                </div>
                <div className="truncate">
                  <span className="font-display font-extrabold text-xs sm:text-sm text-white uppercase italic tracking-tight block">
                    {fighter.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide block">
                    {fighter.record} • {fighter.weightClass.split(" (")[0]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
