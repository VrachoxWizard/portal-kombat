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
            <div className="surface-card p-6 shadow-[var(--shadow-brutalist)] border-2 border-white/10 rounded-none bg-surface-card">
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
          </ScrollAnimationWrapper>

          {fighters.length === 0 ? (
            <EmptyState
              message="Nisu pronađeni borci koji odgovaraju vašem upitu."
              basePath="/borci"
            />
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {fighters.map((fighter) => (
                <StaggerItem key={fighter.id}>
                  <Link
                    href={`/borci/${fighter.slug}`}
                    className="group flex flex-col h-full rounded-none bg-surface-card hover-glow border-2 border-white/10 relative cursor-pointer"
                  >
                    <div className="flex gap-4 p-4 items-center relative z-10">
                      {/* Fighter Image */}
                      <div className="relative h-20 w-20 rounded-none overflow-hidden border-2 border-white/20 shrink-0 bg-slate-900">
                        {fighter.imageUrl ? (
                          <Image
                            src={fighter.imageUrl}
                            alt={fighter.name}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/15 text-primary">
                            <Shield size={28} />
                          </div>
                        )}
                      </div>

                      {/* Fighter Meta */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="font-display font-black text-sm uppercase text-white group-hover:text-primary transition-premium truncate leading-tight">
                            {fighter.name}
                          </h2>
                          <span className="shrink-0 text-[10px] font-black px-2.5 py-0.5 rounded-none bg-primary text-white border-2 border-primary shadow-sm uppercase tracking-wide">
                            {fighter.record}
                          </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                          {fighter.weightClass}
                        </p>
                        {fighter.team && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold truncate uppercase tracking-wide">
                            <MapPin size={11} className="text-slate-500" />
                            <span>{fighter.team}</span>
                          </div>
                        )}
                        {fighter.stance && (
                          <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase tracking-wide">
                            <Activity size={10} className="text-slate-500" />
                            <span>Stav: <span className="text-slate-400 font-black">{fighter.stance}</span></span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom visual decoration */}
                    <div className="mt-auto border-t-2 border-white/10 px-4 py-2.5 bg-black/40 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-premium">
                      <span>Pogledaj profil</span>
                      <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                        &rarr;
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
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
