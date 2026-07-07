import { getCachedPredictionStats } from "@/lib/cached-data";
import { Target } from "lucide-react";

export default async function PredictionStatsBanner() {
  const year = new Date().getFullYear();
  let stats = { total: 0, resolved: 0, correct: 0, accuracy: null as number | null };

  try {
    stats = await getCachedPredictionStats(undefined, year);
  } catch {
    // Stats unavailable
  }

  if (stats.resolved === 0) return null;

  return (
    <div className="surface-card p-5 flex items-center gap-4 border-emerald-500/20">
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
        <Target className="text-emerald-400" size={22} aria-hidden="true" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          Naš učinak u {year}. godini
        </p>
        <p className="text-2xl font-extrabold text-white font-display">
          {stats.accuracy}% točnost
          <span className="text-sm font-medium text-slate-400 ml-2">
            ({stats.correct}/{stats.resolved} riješenih prognoza)
          </span>
        </p>
      </div>
    </div>
  );
}
