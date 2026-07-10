import React, { Suspense } from "react";
import Link from "next/link";
import SearchWidget from "./SearchWidget";
import { getMockPopularTags, getMockUpcomingFights } from "@/lib/mockData";
import { shouldUseMockData } from "@/lib/env";
import { getCachedSidebarTags, getCachedUpcomingEvents } from "@/lib/cached-data";
import { Calendar, Hash, Trophy } from "lucide-react";

async function getSidebarData() {
  let popularTags: { name: string; slug: string; count: number }[] = [];
  let upcomingFights: Array<{
    id: string;
    fighterA: string;
    fighterB: string;
    fighterASlug?: string | null;
    fighterBSlug?: string | null;
    event: string;
    date: string;
  }> = [];

  try {
    popularTags = await getCachedSidebarTags();
    const eventsFromDb = await getCachedUpcomingEvents();
    upcomingFights = eventsFromDb.map((e) => ({
      id: e.id,
      fighterA: e.fighterA,
      fighterB: e.fighterB,
      fighterASlug: e.fighterARel?.slug || null,
      fighterBSlug: e.fighterBRel?.slug || null,
      event: e.event,
      date: e.date,
    }));
  } catch (error) {
    console.warn("Sidebar data error:", error);
  }

  if (popularTags.length === 0 && shouldUseMockData()) {
    popularTags = getMockPopularTags();
  }

  if (upcomingFights.length === 0 && shouldUseMockData()) {
    upcomingFights = getMockUpcomingFights().map((f) => ({
      ...f,
      fighterASlug: null,
      fighterBSlug: null,
    }));
  }

  return { popularTags, upcomingFights };
}

function SearchSkeleton() {
  return (
    <div className="bezel-outer w-full">
      <div className="bezel-inner p-6 h-[120px] skeleton-shimmer" aria-hidden="true" />
    </div>
  );
}

export const Sidebar: React.FC = async () => {
  const { popularTags, upcomingFights } = await getSidebarData();

  return (
    <aside className="space-y-8">
      <Suspense fallback={<SearchSkeleton />}>
        <SearchWidget />
      </Suspense>

      <div className="bezel-outer">
        <div className="bezel-inner p-6">
          <h3 className="text-xs font-black tracking-widest text-slate-300 uppercase border-b-2 border-primary pb-2 flex items-center gap-2 mb-6 rounded-none">
            <Trophy size={14} className="text-primary" aria-hidden="true" />
            <span className="stencil-label text-primary">Nadolazeće borbe</span>
          </h3>
          <div className="space-y-4">
            {upcomingFights.map((fight) => (
              <div
                key={fight.id}
                className="group relative rounded-none bg-black/65 border-2 border-white/10 p-4 pl-5 pr-5 transition-premium hover:border-primary shadow-[var(--shadow-card)] hover:shadow-[4px_4px_0px_0px_rgba(225,29,72,0.45)] cursor-pointer overflow-hidden"
              >
                {/* Visual Blue Corner vs Red Corner edge guides */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-fighter-blue" />
                <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-fighter-red" />

                <div className="flex items-center justify-between text-[9px] text-slate-500 mb-2 relative z-10">
                  <span className="font-black text-primary tracking-widest uppercase">{fight.event}</span>
                  <span className="flex items-center gap-1 font-bold font-mono">
                    <Calendar size={11} className="text-slate-500" aria-hidden="true" />
                    {fight.date}
                  </span>
                </div>
                <div className="font-black text-xs text-white/90 flex items-center justify-between gap-2 transition-premium uppercase font-display relative z-10">
                  {fight.fighterASlug ? (
                    <Link href={`/borci/${fight.fighterASlug}`} className="truncate max-w-[90px] hover:text-primary transition-colors duration-200">
                      {fight.fighterA}
                    </Link>
                  ) : (
                    <span className="truncate max-w-[90px]">{fight.fighterA}</span>
                  )}
                  <span className="animate-pulse text-[9px] text-red-500 font-extrabold px-1.5 py-0.5 rounded-none bg-red-950/20 border border-red-500/10 shadow-[var(--shadow-glow-sm)]">
                    VS
                  </span>
                  {fight.fighterBSlug ? (
                    <Link href={`/borci/${fight.fighterBSlug}`} className="truncate max-w-[90px] hover:text-primary transition-colors duration-200 text-right">
                      {fight.fighterB}
                    </Link>
                  ) : (
                    <span className="truncate max-w-[90px] text-right">{fight.fighterB}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bezel-outer">
        <div className="bezel-inner p-6">
          <h3 className="text-xs font-black tracking-widest text-slate-300 uppercase border-b-2 border-primary pb-2 flex items-center gap-2 mb-6 rounded-none">
            <Hash size={14} className="text-primary" aria-hidden="true" />
            <span className="stencil-label text-primary">Popularne oznake</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="inline-flex items-center rounded-none bg-black/40 border border-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:bg-primary/10 hover:text-white hover:border-primary hover:shadow-[0_0_8px_rgba(225,29,72,0.3)] transition-premium"
              >
                #{tag.name}
                <span className="ml-2 text-[9px] text-primary font-mono font-bold">({tag.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bezel-outer">
        <div className="bezel-inner p-6 bg-slate-950 relative overflow-hidden text-white border-t-[3px] border-primary">
          <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-primary/10 blur-xl" aria-hidden="true" />
          
          <div className="mb-4">
            <span className="stencil-label text-primary mb-1">Borilačka zajednica</span>
            <h4 className="font-black text-lg italic tracking-tight uppercase font-display text-white">
              Pratite nas na mrežama!
            </h4>
          </div>

          <p className="text-xs text-slate-400 mb-5 leading-relaxed font-bold">
            Budite dio najbrže rastuće borilačke zajednice u regiji. Objave uživo, analize i ekskluzivni intervjui.
          </p>
          <div className="flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-none bg-white/5 border-2 border-white/10 p-2.5 hover:bg-primary/20 hover:border-primary/30 transition-premium cursor-pointer"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-none bg-white/5 border-2 border-white/10 p-2.5 hover:bg-primary/20 hover:border-primary/30 transition-premium cursor-pointer"
              aria-label="Facebook"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
