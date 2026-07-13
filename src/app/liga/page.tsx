"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Zap, Activity, Trophy, ChevronRight } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { ScrollAnimationWrapper } from "@/components/ui/ScrollAnimationWrapper";
import { BeltBadge, BeltTier } from "@/components/fighters/BeltBadge";
import { LeagueLeaderboard } from "@/components/fighters/LeagueLeaderboard";
import { LeagueSimulator, SimulatedState } from "@/components/fighters/LeagueSimulator";

interface ResolvedPrediction {
  id: string;
  fighterA: string;
  fighterB: string;
  winner: string;
  method: string;
  predictedRound: string;
  confidenceScore: number;
  actualWinner: string;
  actualMethod: string;
  actualRound: string;
  isCorrect: boolean;
  resolvedAt: string;
  post: {
    title: string;
    slug: string;
    featuredImage: string;
  };
}

function LeagueContent() {
  const [resolvedList, setResolvedList] = useState<ResolvedPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [voteTrigger, setVoteTrigger] = useState(0);

  // Simulation state
  const [simulationState, setSimulationState] = useState<SimulatedState>({
    wins: 0,
    accuracy: 0,
    streak: 0,
    isSimulated: false,
  });

  // Load resolved predictions using dynamic fetch inside effect
  useEffect(() => {
    let active = true;
    fetch("/api/predictions/resolved")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (active && data) {
          setResolvedList(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Greška pri učitavanju riješenih analiza:", err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Compute real stats directly during render to prevent cascading React state renders
  let realWins = 0;
  let realLosses = 0;
  let realAccuracy = 0;
  let realStreak = 0;

  if (resolvedList.length > 0) {
    let currentStreakCount = 0;
    let maxStreakCount = 0;

    // Sort by resolution date ascending to compute streak correctly
    const sorted = [...resolvedList].sort(
      (a, b) => new Date(a.resolvedAt).getTime() - new Date(b.resolvedAt).getTime()
    );

    sorted.forEach((pred) => {
      const storedVote = typeof window !== "undefined" ? localStorage.getItem(`cp-vote-${pred.id}`) : null;
      if (storedVote) {
        const chosenFighter = storedVote === "A" ? pred.fighterA : pred.fighterB;
        if (chosenFighter === pred.actualWinner) {
          realWins++;
          currentStreakCount++;
          if (currentStreakCount > maxStreakCount) {
            maxStreakCount = currentStreakCount;
          }
        } else {
          realLosses++;
          currentStreakCount = 0;
        }
      }
    });

    const totalVotes = realWins + realLosses;
    realAccuracy = totalVotes > 0 ? Math.round((realWins / totalVotes) * 100) : 0;
    realStreak = maxStreakCount;
  }

  // Handle retroactive vote click (triggers re-render with voteTrigger)
  const handleRetroactiveVote = (predictionId: string, choice: "A" | "B") => {
    localStorage.setItem(`cp-vote-${predictionId}`, choice);
    setVoteTrigger((prev) => prev + 1);
  };

  // Determine active displayed stats (real vs simulated)
  const wins = simulationState.isSimulated ? simulationState.wins : realWins;
  const accuracy = simulationState.isSimulated ? simulationState.accuracy : realAccuracy;
  const streak = simulationState.isSimulated ? simulationState.streak : realStreak;
  const losses = simulationState.isSimulated
    ? Math.round(wins > 0 ? (wins / (accuracy / 100)) - wins : 0)
    : realLosses;

  // Determine Belt Tier
  let beltTier: BeltTier = "AMATEUR";
  if (wins >= 11) {
    beltTier = "CHAMPION";
  } else if (wins >= 6) {
    beltTier = "CONTENDER";
  } else if (wins >= 3) {
    beltTier = "PROSPECT";
  }

  const breadcrumbItems = [
    { label: "Predikcije", href: "/predikcije" },
    { label: "Liga analitičara" },
  ];

  return (
    <div data-vote-trigger={voteTrigger} className="space-y-8 font-condensed">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4.5xl font-black italic uppercase tracking-tight text-white font-display leading-none mb-3">
          Liga Analitičara & Poredak
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Trophy size={14} className="text-primary animate-pulse" />
          TESTIRAJTE SVOJE ZNANJE, ZARADITE ŠAMPIONSKE POJASEVE I POBIJEDITE STRUČNJAKE PORTALA
        </p>
      </div>

      {/* Simulator HUD */}
      <LeagueSimulator currentState={simulationState} onSimulate={setSimulationState} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* User Card & Stats (Left Column) */}
        <div className="lg:col-span-5 space-y-6">
          <ScrollAnimationWrapper className="bezel-outer overflow-hidden shadow-2xl">
            <div className="bezel-inner bg-slate-950 p-5 space-y-5">
              {/* User Identity Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 border border-primary/20 bg-primary/5 flex items-center justify-center text-primary shrink-0 relative overflow-hidden">
                    <Zap size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-display font-black italic text-lg text-white uppercase tracking-tight leading-none mb-1">
                      Korisnik (Vi)
                    </h2>
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      {simulationState.isSimulated ? "SIMULACIJSKI PROFIL" : "LOKALNI KOLAČIĆI / AKTIVAN PROFIL"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Belt rendering */}
              <BeltBadge tier={beltTier} wins={wins} />

              {/* Telemetry Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* Wins */}
                <div className="bg-black/40 border border-white/5 p-3 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                    POGOĐENIH MEČEVA
                  </span>
                  <span className="text-xl font-black text-white font-mono">{wins}</span>
                </div>

                {/* Losses */}
                <div className="bg-black/40 border border-white/5 p-3 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                    PROMAŠENIH MEČEVA
                  </span>
                  <span className="text-xl font-black text-slate-400 font-mono">{losses}</span>
                </div>

                {/* Accuracy */}
                <div className="bg-black/40 border border-white/5 p-3 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                    TOČNOST PROGNOZA
                  </span>
                  <span className="text-xl font-black text-primary font-mono">{accuracy}%</span>
                </div>

                {/* Longest Streak */}
                <div className="bg-black/40 border border-white/5 p-3 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                    POTEZ (STREAK)
                  </span>
                  <span className="text-xl font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                    <Zap size={14} className="fill-amber-400 text-amber-400" />
                    {streak}
                  </span>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>

        {/* Leaderboard (Right Column) */}
        <div className="lg:col-span-7">
          <ScrollAnimationWrapper className="bezel-outer overflow-hidden shadow-2xl">
            <div className="bezel-inner">
              <LeagueLeaderboard userWins={wins} userAccuracy={accuracy} userBelt={beltTier} />
            </div>
          </ScrollAnimationWrapper>
        </div>
      </div>

      {/* Retroactive Voting & History (Full width) */}
      <ScrollAnimationWrapper className="space-y-6 pt-4">
        <div>
          <h2 className="font-display font-black italic text-xl sm:text-2xl uppercase tracking-tight text-white flex items-center gap-2">
            <Activity size={18} className="text-primary" />
            POVIJESNI REZULTATI I TESTNI KUTAK
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            GLASAJTE RETROAKTIVNO NA PROŠLE BORBE KAKO BISTE BRZO POVEĆALI SVOJ ANALITIČKI RANGLISTU
          </p>
        </div>

        {loading ? (
          <div className="border border-white/5 bg-black/20 p-8 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">
            UČITAVANJE RIJEŠENIH ANALIZA...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resolvedList.map((pred) => {
              const userVote = localStorage.getItem(`cp-vote-${pred.id}`);
              const hasVoted = !!userVote;
              const isCorrect = hasVoted && (userVote === "A" ? pred.fighterA : pred.fighterB) === pred.actualWinner;

              return (
                <div
                  key={pred.id}
                  className={`border p-4 bg-slate-950/40 relative overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[160px] ${
                    hasVoted
                      ? isCorrect
                        ? "border-emerald-500/20 bg-emerald-950/5"
                        : "border-red-500/20 bg-red-950/5"
                      : "border-white/5 hover:border-white/10"
                  }`}
                >
                  {/* Status Tag */}
                  <div className="absolute top-2.5 right-3 flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase">
                    {hasVoted ? (
                      isCorrect ? (
                        <span className="text-emerald-400 bg-emerald-500/10 px-1 py-0.5 border border-emerald-500/20">
                          TOČNO +1 POBJEDA
                        </span>
                      ) : (
                        <span className="text-red-400 bg-red-500/10 px-1 py-0.5 border border-red-500/20">
                          NETOČNO
                        </span>
                      )
                    ) : (
                      <span className="text-amber-400 bg-amber-500/10 px-1 py-0.5 border border-amber-500/20 animate-pulse">
                        ČEKA GLAS KORISNIKA
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[8px] text-slate-500 font-mono font-bold tracking-widest block uppercase mb-1">
                      {pred.actualWinner} (SLAVIO KAO POBJEDNIK)
                    </span>
                    <h3 className="font-display font-black text-sm text-slate-100 uppercase tracking-tight leading-snug line-clamp-2">
                      {pred.post.title}
                    </h3>
                  </div>

                  {/* Voting Toggles or Result display */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                    {!hasVoted ? (
                      /* Retroactive Voting Buttons */
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => handleRetroactiveVote(pred.id, "A")}
                          className="flex-1 text-center bg-fighter-blue/15 hover:bg-fighter-blue/25 border border-fighter-blue/20 text-fighter-blue font-bold py-1.5 text-[10px] uppercase tracking-widest cursor-pointer btn-press"
                        >
                          {pred.fighterA}
                        </button>
                        <button
                          onClick={() => handleRetroactiveVote(pred.id, "B")}
                          className="flex-1 text-center bg-fighter-red/15 hover:bg-fighter-red/25 border border-fighter-red/20 text-fighter-red font-bold py-1.5 text-[10px] uppercase tracking-widest cursor-pointer btn-press"
                        >
                          {pred.fighterB}
                        </button>
                      </div>
                    ) : (
                      /* Voted feedback */
                      <div className="flex items-center justify-between w-full text-[10px]">
                        <span className="text-slate-400 font-bold">
                          Vaš glas:{" "}
                          <span className={isCorrect ? "text-emerald-400" : "text-red-400"}>
                            {userVote === "A" ? pred.fighterA : pred.fighterB}
                          </span>
                        </span>
                        <Link
                          href={`/clanak/${pred.post.slug}`}
                          className="text-primary hover:text-red-400 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                          Pročitaj analizu
                          <ChevronRight size={12} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollAnimationWrapper>
    </div>
  );
}

export default function PredictionLeaguePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="h-64 flex flex-col items-center justify-center border border-white/5 bg-black/20 text-slate-500 font-mono text-xs uppercase tracking-widest gap-3">
            <Activity className="text-primary animate-pulse" size={24} />
            <span>Učitavanje sučelja lige...</span>
          </div>
        }
      >
        <LeagueContent />
      </Suspense>
    </div>
  );
}
