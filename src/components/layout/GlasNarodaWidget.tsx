"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Swords } from "lucide-react";

interface GlasNarodaProps {
  predictionId: string;
  postId: string;
  fighterA: string;
  fighterB: string;
  initialVotesA: number;
  initialVotesB: number;
  postSlug: string;
  expertWinner: string;
}

export const GlasNarodaWidget: React.FC<GlasNarodaProps> = ({
  predictionId,
  postId,
  fighterA,
  fighterB,
  initialVotesA,
  initialVotesB,
  postSlug,
  expertWinner,
}) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [votesA, setVotesA] = useState(initialVotesA);
  const [votesB, setVotesB] = useState(initialVotesB);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`cp-vote-${predictionId}`);
    if (stored === "A" || stored === "B") {
      setTimeout(() => {
        setHasVoted(true);
      }, 0);
    }
  }, [predictionId]);

  const handleVote = async (choice: "A" | "B") => {
    if (hasVoted || isVoting) return;
    setIsVoting(true);

    // Optimistic UI updates
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

  const peopleWinner = pctA > pctB ? fighterA : pctA < pctB ? fighterB : "Izjednačeno";
  const consensusAligns =
    (pctA > pctB && expertWinner === fighterA) ||
    (pctB > pctA && expertWinner === fighterB);

  return (
    <div className="bezel-outer">
      <div className="bezel-inner p-6 bg-slate-950/90 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
          <h3 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-1.5">
            <Swords size={12} className="text-primary animate-pulse" />
            ⚡ GLAS NARODA
          </h3>
          <span className="font-mono text-[8px] text-slate-500 font-extrabold uppercase tracking-widest">
            Aktivna anketa
          </span>
        </div>

        {/* Matchup names */}
        <div className="text-center mb-6">
          <Link
            href={`/clanak/${postSlug}`}
            className="font-display font-black italic text-base sm:text-lg text-white uppercase hover:text-primary transition-premium leading-tight tracking-tight block"
          >
            {fighterA} vs {fighterB}
          </Link>
          <span className="text-[9px] text-slate-500 font-mono font-semibold uppercase tracking-wider mt-1 block">
            Tko pobjeđuje? Glasajte i saznajte mišljenje javnosti
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!hasVoted ? (
            <motion.div
              key="vote-buttons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 gap-3"
            >
              <button
                onClick={() => handleVote("A")}
                disabled={isVoting}
                className="group relative flex flex-col items-center justify-center p-3 rounded-none border border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-premium cursor-pointer"
              >
                <span className="font-display font-extrabold italic text-[11px] text-white uppercase truncate max-w-full">
                  {fighterA}
                </span>
                <span className="text-[8px] text-fighter-blue font-mono font-black tracking-widest mt-1">
                  PLAVI KUT
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-fighter-blue opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>

              <button
                onClick={() => handleVote("B")}
                disabled={isVoting}
                className="group relative flex flex-col items-center justify-center p-3 rounded-none border border-white/10 bg-white/5 hover:border-red-500/40 hover:bg-red-500/5 transition-premium cursor-pointer"
              >
                <span className="font-display font-extrabold italic text-[11px] text-white uppercase truncate max-w-full">
                  {fighterB}
                </span>
                <span className="text-[8px] text-fighter-red font-mono font-black tracking-widest mt-1">
                  CRVENI KUT
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-fighter-red opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="vote-results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="space-y-4"
            >
              {/* Horizontal split-bar */}
              <div className="relative w-full h-6 bg-slate-900 border border-white/10 overflow-hidden flex">
                {pctA > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pctA}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-fighter-blue flex items-center pl-3 text-white font-mono text-[10px] font-black shrink-0 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                    {pctA}%
                  </motion.div>
                )}
                {pctB > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pctB}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-fighter-red flex items-center justify-end pr-3 text-white font-mono text-[10px] font-black ml-auto shrink-0 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-l from-white/10 to-transparent" />
                    {pctB}%
                  </motion.div>
                )}
              </div>

              {/* Vote stats info */}
              <div className="bg-black/40 border border-white/5 p-3 space-y-1.5 text-[9px] font-mono font-bold tracking-wider text-slate-400">
                <div className="flex justify-between items-center text-white">
                  <span>NAROD BIRA:</span>
                  <span className={pctA > pctB ? "text-fighter-blue" : pctB > pctA ? "text-fighter-red" : "text-slate-300"}>
                    {peopleWinner}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>PORTAL BIRA:</span>
                  <span className={expertWinner === fighterA ? "text-fighter-blue" : "text-fighter-red"}>
                    {expertWinner}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/5">
                  <span>PODUDARANJE:</span>
                  <span className={consensusAligns ? "text-emerald-400" : "text-amber-400"}>
                    {consensusAligns ? "SLAGANJE ✓" : "RAZILAŽENJE ✗"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 font-extrabold uppercase tracking-widest pt-1">
                <span>Ukupno glasova: {totalVotes}</span>
                <Link href={`/clanak/${postSlug}`} className="text-primary hover:text-red-400 transition-premium">
                  Detaljna analiza &rarr;
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GlasNarodaWidget;
