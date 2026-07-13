"use client";

import React from "react";
import { Trophy, Shield } from "lucide-react";

interface LeaderboardUser {
  rank?: number;
  name: string;
  wins: number;
  accuracy: number;
  belt: string;
  isCurrentUser?: boolean;
}

interface LeagueLeaderboardProps {
  userWins: number;
  userAccuracy: number;
  userBelt: string;
}

export const LeagueLeaderboard: React.FC<LeagueLeaderboardProps> = ({
  userWins,
  userAccuracy,
  userBelt,
}) => {
  // Base static ranking roster
  const baseRoster: LeaderboardUser[] = [
    { name: "Marko Horvat (Portal Expert)", wins: 15, accuracy: 82, belt: "CHAMPION" },
    { name: "Mislav Vukušić (Portal Expert)", wins: 12, accuracy: 75, belt: "CHAMPION" },
    { name: "CroCopFan99", wins: 9, accuracy: 69, belt: "CONTENDER" },
    { name: "BadrHariZagreb", wins: 7, accuracy: 64, belt: "CONTENDER" },
    { name: "UfcGuruZg", wins: 4, accuracy: 57, belt: "PROSPECT" },
  ];

  // Insert user and sort roster dynamically
  const currentUser: LeaderboardUser = {
    name: "KORISNIK (VI)",
    wins: userWins,
    accuracy: userAccuracy,
    belt: userBelt,
    isCurrentUser: true,
  };

  const combinedRoster = [...baseRoster, currentUser].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.accuracy - a.accuracy;
  });

  // Assign ranks
  const rankedRoster = combinedRoster.map((item) => {
    const sameScoreIdx = combinedRoster.findIndex(
      (p) => p.wins === item.wins && p.accuracy === item.accuracy
    );
    const rank = sameScoreIdx + 1;
    return { ...item, rank };
  });

  const getBeltTag = (belt: string) => {
    switch (belt) {
      case "CHAMPION":
        return (
          <span className="text-[8px] font-mono font-black bg-red-950/40 text-fighter-red border border-red-850 px-1.5 py-0.5 shadow-[0_0_8px_rgba(239,68,68,0.25)]">
            CHAMPION
          </span>
        );
      case "CONTENDER":
        return (
          <span className="text-[8px] font-mono font-black bg-amber-950/40 text-amber-400 border border-amber-850 px-1.5 py-0.5 shadow-[0_0_6px_rgba(245,158,11,0.2)]">
            CONTENDER
          </span>
        );
      case "PROSPECT":
        return (
          <span className="text-[8px] font-mono font-black bg-blue-950/40 text-blue-400 border border-blue-850 px-1.5 py-0.5">
            PROSPECT
          </span>
        );
      default:
        return (
          <span className="text-[8px] font-mono font-black bg-slate-900 text-slate-500 border border-slate-800 px-1.5 py-0.5">
            AMATEUR
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-black/40 border border-white/5 p-4 sm:p-6 relative overflow-hidden font-condensed select-none">
      {/* HUD Header */}
      <div className="absolute top-2 left-3 flex items-center gap-1.5">
        <Trophy size={10} className="text-primary animate-pulse" />
        <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">
          POREDAK LIGE ANALITIČARA (RANKING LEDGER)
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">
              <th className="py-2.5 pl-2 text-center w-[50px]">RANK</th>
              <th className="py-2.5">ANALITIČAR</th>
              <th className="py-2.5 text-center w-[70px]">POBJEDE</th>
              <th className="py-2.5 text-center w-[80px]">TOČNOST</th>
              <th className="py-2.5 text-right pr-2 w-[110px]">POJAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm font-bold text-slate-300">
            {rankedRoster.map((player) => (
              <tr
                key={player.name}
                className={`transition-colors duration-200 ${
                  player.isCurrentUser
                    ? "bg-primary/10 border-y border-primary/30 text-white font-black"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Rank */}
                <td className="py-3 text-center font-mono">
                  {player.rank === 1 ? (
                    <span className="inline-flex items-center justify-center bg-primary text-black text-[9px] font-black w-4.5 h-4.5 rounded-none rotate-45 select-none">
                      <span className="-rotate-45">1</span>
                    </span>
                  ) : (
                    <span>#{player.rank}</span>
                  )}
                </td>

                {/* Name */}
                <td className="py-3 max-w-[180px] sm:max-w-none truncate pr-2 uppercase tracking-wide">
                  {player.isCurrentUser ? (
                    <span className="flex items-center gap-1.5 text-primary">
                      <Shield size={10} className="fill-primary" />
                      {player.name}
                    </span>
                  ) : (
                    player.name
                  )}
                </td>

                {/* Wins */}
                <td className="py-3 text-center font-mono">{player.wins}</td>

                {/* Accuracy */}
                <td className="py-3 text-center font-mono text-slate-400">
                  <span className={player.isCurrentUser ? "text-white" : ""}>
                    {player.accuracy}%
                  </span>
                </td>

                {/* Belt tag */}
                <td className="py-3 text-right pr-2">{getBeltTag(player.belt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
