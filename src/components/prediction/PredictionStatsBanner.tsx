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
    <div className="bezel-outer">
      <div className="bezel-inner p-5 flex items-center gap-4 border-l-2 border-l-emerald-500 bg-emerald-950/10">
        <div className="w-12 h-12 rounded-none bg-emerald-500 border-2 border-black flex items-center justify-center shrink-0">
          <Target className="text-black" size={22} aria-hidden="true" />
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-black">
            Naš učinak u {year}. godini
          </p>
          <p className="text-2xl font-black text-white font-display uppercase tracking-tight">
            {stats.accuracy}% točnost
            <span className="text-xs font-bold text-slate-400 ml-2.5 normal-case font-sans">
              ({stats.correct}/{stats.resolved} riješenih prognoza)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
