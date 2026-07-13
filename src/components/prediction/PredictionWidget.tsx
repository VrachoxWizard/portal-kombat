"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks";
import { Swords, Award, Percent, Lightbulb } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

interface PredictionProps {
  fighterA: string;
  fighterB: string;
  winner: string;
  method: string;
  predictedRound?: string | null;
  confidenceScore: number;
  keyReasoning: string;
  actualWinner?: string | null;
  actualMethod?: string | null;
  actualRound?: string | null;
  isCorrect?: boolean | null;
  resolvedAt?: Date | string | null;

  // NEW fields
  predictionId?: string;
  postId?: string;
  initialVotesA?: number;
  initialVotesB?: number;
}

export const PredictionWidget: React.FC<PredictionProps> = ({
  fighterA,
  fighterB,
  winner,
  method,
  predictedRound,
  confidenceScore,
  keyReasoning,
  actualWinner,
  actualMethod,
  actualRound,
  isCorrect,
  resolvedAt,
  predictionId,
  postId,
  initialVotesA = 0,
  initialVotesB = 0,
}) => {
  const prefersReducedMotion = useSafeReducedMotion();

  const [hasVoted, setHasVoted] = useState(false);
  const [votesA, setVotesA] = useState(initialVotesA);
  const [votesB, setVotesB] = useState(initialVotesB);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (!predictionId) return;
    const stored = localStorage.getItem(`cp-vote-${predictionId}`);
    if (stored === "A" || stored === "B") {
      setTimeout(() => {
        setHasVoted(true);
      }, 0);
    }
  }, [predictionId]);

  const handleVote = async (choice: "A" | "B") => {
    if (!predictionId || !postId || hasVoted || isVoting) return;
    setIsVoting(true);

    if (choice === "A") setVotesA((prev) => prev + 1);
    if (choice === "B") setVotesB((prev) => prev + 1);
    setHasVoted(true);
    localStorage.setItem(`cp-vote-${predictionId}`, choice);

    try {
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fighter: choice }),
      });
      if (res.ok) {
        const data = await res.json();
        setVotesA(data.votesFighterA);
        setVotesB(data.votesFighterB);
      }
    } catch (e) {
      console.error("Greška pri glasanju:", e);
    } finally {
      setIsVoting(false);
    }
  };

  const totalVotes = votesA + votesB;
  const pctA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
  const pctB = totalVotes > 0 ? 100 - pctA : 50;
  const communityWinner = pctA > pctB ? fighterA : pctA < pctB ? fighterB : "Izjednačeno";

  const showVoting = predictionId && postId && !resolvedAt;

  const isWinnerA = winner === fighterA;
  const barColorClass = isWinnerA ? "bg-fighter-blue" : "bg-fighter-red";
  const glowColorClass = isWinnerA ? "shadow-[0_0_10px_rgba(59,130,246,0.4)]" : "shadow-[0_0_10px_rgba(239,68,68,0.4)]";

  const methodLower = method.toLowerCase();
  let methodColorClass = "bg-white/5 border-white/10 text-slate-300";
  let methodLabel = "METODA";
  if (methodLower.includes("ko") || methodLower.includes("tko") || methodLower.includes("nokaut")) {
    methodColorClass = "bg-red-500/10 border-red-500/20 text-red-400";
    methodLabel = "KO/TKO";
  } else if (methodLower.includes("sub") || methodLower.includes("gušenje") || methodLower.includes("poluga") || methodLower.includes("prisila")) {
    methodColorClass = "bg-blue-500/10 border-blue-500/20 text-blue-400";
    methodLabel = "PREDAJA";
  } else if (methodLower.includes("dec") || methodLower.includes("odluka") || methodLower.includes("bodov")) {
    methodColorClass = "bg-amber-500/10 border-amber-500/20 text-amber-400";
    methodLabel = "ODLUKA";
  }

  return (
    <div className="bezel-outer my-8 overflow-hidden">
      <div className="bezel-inner p-6 md:p-8 bg-scanlines text-white relative">
        {/* Top split corner indicator stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex" aria-hidden="true">
          <div className="w-1/2 bg-fighter-blue shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
          <div className="w-1/2 bg-fighter-red shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
        </div>

        <div className="text-center mb-8 mt-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-widest text-slate-300 font-black mb-4 bg-black/60 border border-white/10 px-3.5 py-1.5 rounded-none">
            <Swords size={12} className="text-primary" aria-hidden="true" />
            Službena prognoza portala
          </span>

          <div className="grid grid-cols-12 gap-0 bezel-outer max-w-2xl mx-auto overflow-hidden">
            {/* Fighter A - Blue corner */}
            {showVoting && !hasVoted ? (
              <button
                onClick={() => handleVote("A")}
                disabled={isVoting}
                className="col-span-5 bg-fighter-blue/10 hover:bg-fighter-blue/20 p-4 text-left border-r border-white/5 flex flex-col justify-center min-h-[80px] group/btn cursor-pointer transition-premium relative overflow-hidden"
              >
                <span className="font-display font-bold italic text-base sm:text-2xl text-white uppercase tracking-tight leading-none truncate block group-hover/btn:text-blue-400">{fighterA}</span>
                <span className="text-[9px] text-fighter-blue/80 font-mono font-bold uppercase tracking-widest mt-1.5 block">Glasaj &uarr;</span>
              </button>
            ) : (
              <div className="col-span-5 bg-fighter-blue/15 p-4 text-left border-r border-white/5 flex flex-col justify-center min-h-[80px]">
                <span className="font-display font-bold italic text-base sm:text-2xl text-white uppercase tracking-tight leading-none truncate block">{fighterA}</span>
                <span className="text-[9px] text-fighter-blue/80 font-mono font-bold uppercase tracking-widest mt-1.5 block">Plavi kut</span>
              </div>
            )}
            
            {/* VS Divider */}
            <div className="col-span-2 flex items-center justify-center font-display font-black text-sm sm:text-lg text-primary bg-background border-r border-white/5 py-4 shrink-0 italic select-none">
              VS
            </div>
            
            {/* Fighter B - Red corner */}
            {showVoting && !hasVoted ? (
              <button
                onClick={() => handleVote("B")}
                disabled={isVoting}
                className="col-span-5 bg-fighter-red/10 hover:bg-fighter-red/20 p-4 text-right flex flex-col justify-center min-h-[80px] group/btn cursor-pointer transition-premium relative overflow-hidden"
              >
                <span className="font-display font-bold italic text-base sm:text-2xl text-white uppercase tracking-tight leading-none truncate block group-hover/btn:text-red-400">{fighterB}</span>
                <span className="text-[9px] text-fighter-red/80 font-mono font-bold uppercase tracking-widest mt-1.5 block">Glasaj &uarr;</span>
              </button>
            ) : (
              <div className="col-span-5 bg-fighter-red/15 p-4 text-right flex flex-col justify-center min-h-[80px]">
                <span className="font-display font-bold italic text-base sm:text-2xl text-white uppercase tracking-tight leading-none truncate block">{fighterB}</span>
                <span className="text-[9px] text-fighter-red/80 font-mono font-bold uppercase tracking-widest mt-1.5 block">Crveni kut</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className={`bg-black/50 border p-4 flex flex-col justify-center rounded-none shadow-[var(--shadow-card)] ${isWinnerA ? 'border-fighter-blue/30' : 'border-fighter-red/30'}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest block mb-1.5 flex items-center gap-1 ${isWinnerA ? 'text-fighter-blue' : 'text-fighter-red'}`}>
              <Award size={12} aria-hidden="true" />
              Predviđeni pobjednik
            </span>
            <span className={`font-black text-lg sm:text-xl uppercase font-display italic ${isWinnerA ? 'text-fighter-blue' : 'text-fighter-red'}`}>{winner}</span>
          </div>
          <div className="bg-black/50 border border-white/10 p-4 flex flex-col justify-center rounded-none shadow-[var(--shadow-card)]">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1.5 flex items-center gap-1">
              <Swords size={12} className="text-primary" aria-hidden="true" />
              Metoda i runda
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-slate-200 text-sm sm:text-base uppercase font-display">
                {method} {predictedRound ? `(${predictedRound})` : ""}
              </span>
              <span className={`px-2 py-0.5 rounded-none border text-[8px] font-mono font-bold uppercase tracking-wider ${methodColorClass}`}>
                {methodLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-black/50 border border-white/10 p-4 rounded-none">
          <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">
            <span className="flex items-center gap-1">
              <Percent size={12} className="text-primary" aria-hidden="true" />
              Pouzdanost prognoze
            </span>
            <span className={`font-mono font-bold ${isWinnerA ? 'text-fighter-blue' : 'text-fighter-red'}`}>{confidenceScore}%</span>
          </div>
          <div className="w-full bg-slate-950 border border-white/10 rounded-none h-4 overflow-hidden p-0.5" role="progressbar" aria-valuenow={confidenceScore} aria-valuemin={0} aria-valuemax={100}>
            <motion.div
              initial={prefersReducedMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: prefersReducedMotion ? 0 : 1, ease: "easeOut" }}
              className={`h-full w-full rounded-none origin-left ${barColorClass} ${glowColorClass}`}
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </div>

        {/* Community split poll results */}
        {predictionId && (
          <div className="mb-6 bg-black/50 border border-white/10 p-4 rounded-none space-y-3">
            <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                ⚡ Glas Naroda (Mišljenje čitatelja)
              </span>
              <span className="font-mono font-bold text-white">
                {hasVoted ? `${pctA}% vs ${pctB}%` : "Aktivno glasanje"}
              </span>
            </div>
            
            {hasVoted ? (
              <div className="space-y-2">
                <div className="relative w-full h-5 bg-slate-950 border border-white/10 overflow-hidden flex">
                  {pctA > 0 && (
                    <div className="h-full bg-fighter-blue flex items-center pl-3 text-white font-mono text-[9px] font-black shrink-0" style={{ width: `${pctA}%` }}>
                      {pctA}%
                    </div>
                  )}
                  {pctB > 0 && (
                    <div className="h-full bg-fighter-red flex items-center justify-end pr-3 text-white font-mono text-[9px] font-black ml-auto shrink-0" style={{ width: `${pctB}%` }}>
                      {pctB}%
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-bold leading-normal">
                  Čitatelji predviđaju pobjedu borca <span className={pctA > pctB ? "text-fighter-blue" : pctB > pctA ? "text-fighter-red" : "text-white"}>{communityWinner}</span> (Ukupno glasova: <span className="font-mono text-white">{totalVotes}</span>).
                  {!resolvedAt && ` Portal prognozira pobjedu borca ${winner}.`}
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 font-bold italic">
                Kliknite na plavi ili crveni kut iznad kako biste dali svoj glas i vidjeli rezultate ostalih čitatelja.
              </p>
            )}
          </div>
        )}

        <div className="border-t border-white/10 pt-6">
          <h4 className="text-xs uppercase tracking-widest text-slate-400 font-black mb-2.5 flex items-center gap-1.5">
            <Lightbulb size={12} className="text-amber-400" aria-hidden="true" />
            Ključna analiza
          </h4>
          <p className="text-slate-300 italic text-sm leading-relaxed border-l-4 border-primary pl-4 py-1">
            &ldquo;{keyReasoning}&rdquo;
          </p>
        </div>

        {/* Comparison HUD Link */}
        <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
          <Link
            href={`/borci/vs?fighterA=${slugify(fighterA)}&fighterB=${slugify(fighterB)}`}
            className="inline-flex items-center gap-2 bg-slate-900 border border-white/10 hover:border-primary/30 text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-white px-4 py-2.5 transition-premium cursor-pointer btn-press"
          >
            <Swords size={12} className="text-primary" />
            Taktička usporedba boraca (VS HUD)
          </Link>
        </div>

        {resolvedAt && actualWinner && (
          <div
            className={`mt-6 rounded-none border p-4 ${
              isCorrect
                ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)]"
                : "border-red-500 bg-red-950/20 text-red-300 shadow-[4px_4px_0px_0px_rgba(239,68,68,0.2)]"
            }`}
          >
            <p className="text-[9px] uppercase tracking-widest font-black text-slate-400 mb-2">
              Stvarni ishod borbe
            </p>
            <p className="font-black text-lg uppercase font-display italic">
              {actualWinner} — {actualMethod}
              {actualRound ? ` (${actualRound})` : ""}
            </p>
            <p className="text-xs mt-1 font-bold">
              {isCorrect ? "✓ TOČNA PROGNOZA" : "✗ NETOČNA PROGNOZA"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionWidget;
