import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/layout/Sidebar";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { Users, Shield, MapPin, Search, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Baza boraca i statistike",
  description:
    "Pregledajte detaljne profile, statistike, omjere i povijest borbi najboljih boraca iz svijeta MMA, boksa i kickboksa.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function FightersPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  // Fetch fighters matching search query
  const fighters = await prisma.fighter.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { team: { contains: q, mode: "insensitive" } },
            { weightClass: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <ScrollAnimationWrapper>
            <SectionHeading
              title="Baza boraca"
              description="Pregledajte detaljne profile boraca, njihove omjere pobjeda i poraza te povijesne statistike u ringu i kavezu."
              icon={Users}
              as="h1"
            />
          </ScrollAnimationWrapper>

          {/* Search Box */}
          <ScrollAnimationWrapper delay={0.05}>
            <div className="bezel-outer">
              <div className="bezel-inner p-6">
                <form method="GET" action="/borci" className="relative flex items-center">
                  <label htmlFor="borci-search" className="sr-only">
                    Pretraži borce
                  </label>
                  <input
                    id="borci-search"
                    type="text"
                    name="q"
                    defaultValue={q || ""}
                    placeholder="Pretraži borce po imenu, timu ili kategoriji..."
                    className="w-full rounded-none bg-black/60 border-2 border-white/10 pl-10 pr-12 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-premium font-bold"
                  />
                  <div className="absolute left-3.5 text-slate-500 pointer-events-none" aria-hidden="true">
                    <Search size={14} />
                  </div>
                  {q && (
                    <Link
                      href="/borci"
                      className="absolute right-12 text-[10px] text-primary hover:text-red-400 font-black uppercase transition-premium"
                    >
                      Očisti
                    </Link>
                  )}
                  <button
                    type="submit"
                    className="absolute right-2 text-slate-400 hover:text-primary transition-premium p-1.5 rounded-none hover:bg-white/5 cursor-pointer"
                    aria-label="Pretraži"
                  >
                    <Search size={14} className="text-primary" />
                  </button>
                </form>
                {q && (
                  <p className="text-[9px] text-slate-500 mt-3 font-black uppercase tracking-widest">
                    Rezultati pretrage za: <span className="text-white bg-white/10 px-1.5 py-0.5">&ldquo;{q}&rdquo;</span> ({fighters.length} pronađenih)
                  </p>
                )}
              </div>
            </div>
          </ScrollAnimationWrapper>

          {fighters.length === 0 ? (
            <EmptyState
              message="Nisu pronađeni borci koji odgovaraju vašem upitu."
              basePath="/borci"
            />
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {fighters.map((fighter, index) => {
                const isBlueCorner = index % 2 === 0;
                const recordParts = fighter.record.split("-");
                let formattedRecord = (
                  <span className="font-mono text-xs font-bold tracking-wider">{fighter.record}</span>
                );
                if (recordParts.length >= 3) {
                  const wins = recordParts[0];
                  const losses = recordParts[1];
                  const draws = recordParts[2];
                  const nc = recordParts.slice(3).join("-");
                  formattedRecord = (
                    <span className="font-mono text-xs tracking-wider font-bold">
                      <span className="text-emerald-400">{wins}</span>
                      <span className="text-slate-500 font-sans mx-0.5">-</span>
                      <span className="text-red-400">{losses}</span>
                      <span className="text-slate-500 font-sans mx-0.5">-</span>
                      <span className="text-slate-300">{draws}</span>
                      {nc && (
                        <>
                          <span className="text-slate-500 font-sans mx-0.5">-</span>
                          <span className="text-slate-400">{nc}</span>
                        </>
                      )}
                    </span>
                  );
                }

                return (
                  <StaggerItem key={fighter.id}>
                    <Link
                      href={`/borci/${fighter.slug}`}
                      className="group block h-full cursor-pointer transition-all duration-300"
                    >
                      <div className="bezel-outer h-full hover:shadow-[0_0_15px_rgba(225,29,72,0.15)] transition-all duration-300">
                        <div className="bezel-inner flex flex-col h-full bg-card overflow-hidden">
                          {/* Corner strip */}
                          <div
                            className={`h-1.5 w-full origin-top transition-transform duration-[var(--motion-hover)] ease-out-premium group-hover:scale-y-[1.33] shrink-0 ${
                              isBlueCorner
                                ? "bg-fighter-blue shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                                : "bg-fighter-red shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                            }`}
                          />
                          
                          <div className="flex gap-4 p-4 items-center flex-1">
                            {/* Fighter Image */}
                            <div className="relative h-20 w-20 rounded-none overflow-hidden border border-white/10 shrink-0 bg-slate-950">
                              {fighter.imageUrl ? (
                                <Image
                                  src={fighter.imageUrl}
                                  alt={fighter.name}
                                  fill
                                  sizes="80px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out-premium"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary">
                                  <Shield size={28} />
                                </div>
                              )}
                            </div>

                            {/* Fighter Meta */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                <h2 className="font-display font-bold italic text-base uppercase text-white group-hover:text-primary transition-colors duration-200 truncate leading-tight tracking-tight">
                                  {fighter.name}
                                </h2>
                                <div className="shrink-0 flex items-center">
                                  {formattedRecord}
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="shrink-0 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 uppercase tracking-wider">
                                  {fighter.weightClass}
                                </span>
                                
                                {fighter.stance && (
                                  <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase tracking-wider">
                                    Stav: {fighter.stance}
                                  </span>
                                )}
                              </div>
                              
                              {fighter.team && (
                                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold truncate uppercase tracking-wider pt-1">
                                  <MapPin size={11} className="text-slate-500 shrink-0" />
                                  <span className="truncate">{fighter.team}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Bottom visual decoration */}
                          <div className="mt-auto border-t border-white/5 px-4 py-2 bg-black/40 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors duration-200">
                            <span>Pogledaj profil</span>
                            <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                              &rarr;
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>

        {/* Sidebar */}
        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1">
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
