"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Activity } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { FighterSelector } from "@/components/fighters/FighterSelector";
import { RadarChart } from "@/components/fighters/RadarChart";
import { WinMethodChart } from "@/components/fighters/WinMethodChart";
import { PhysicalComparison } from "@/components/fighters/PhysicalComparison";
import { ScrollAnimationWrapper } from "@/components/ui/ScrollAnimationWrapper";

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

function ComparisonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSlugA = searchParams.get("fighterA") || "";
  const initialSlugB = searchParams.get("fighterB") || "";

  const [fighterA, setFighterA] = useState<Fighter | null>(null);
  const [fighterB, setFighterB] = useState<Fighter | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch initial fighters if present in URL query
  useEffect(() => {
    const fetchInitials = async () => {
      if (!initialSlugA && !initialSlugB) return;
      setLoading(true);
      try {
        if (initialSlugA) {
          const res = await fetch(`/api/fighters/search?q=${encodeURIComponent(initialSlugA)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.length > 0) setFighterA(data[0]);
          }
        }
        if (initialSlugB) {
          const res = await fetch(`/api/fighters/search?q=${encodeURIComponent(initialSlugB)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.length > 0) setFighterB(data[0]);
          }
        }
      } catch (err) {
        console.error("Greška pri učitavanju inicijalnih boraca:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitials();
  }, [initialSlugA, initialSlugB]);

  // Sync state changes with URL query parameters
  const updateQueryParams = (slugA: string, slugB: string) => {
    const params = new URLSearchParams();
    if (slugA) params.set("fighterA", slugA);
    if (slugB) params.set("fighterB", slugB);
    router.replace(`/borci/vs?${params.toString()}`);
  };

  const handleSelectA = (fighter: Fighter | null) => {
    setFighterA(fighter);
    updateQueryParams(fighter?.slug || "", fighterB?.slug || "");
  };

  const handleSelectB = (fighter: Fighter | null) => {
    setFighterB(fighter);
    updateQueryParams(fighterA?.slug || "", fighter?.slug || "");
  };

  const breadcrumbItems = [
    { label: "Borci", href: "/borci" },
    { label: "Usporedba boraca" },
  ];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Back Button */}
      <Link
        href="/borci"
        className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-400 hover:text-primary transition-premium cursor-pointer"
      >
        <ArrowLeft size={14} />
        Povratak na bazu boraca
      </Link>

      {/* Title HUD */}
      <div>
        <h1 className="text-3xl sm:text-4.5xl font-black italic uppercase tracking-tight text-white font-display leading-none mb-3">
          Taktika & Usporedba Boraca
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          CH.04 INTERAKTIVNA VISUALIZACIJA MEČEVA U REALNOM VREMENU
        </p>
      </div>

      {/* Dropdown selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-white/5 bg-slate-950/40">
        <FighterSelector
          label="PLAVI KUT (BLUE CORNER)"
          cornerColor="blue"
          selectedFighter={fighterA}
          onSelect={handleSelectA}
          excludeSlug={fighterB?.slug}
        />
        <FighterSelector
          label="CRVENI KUT (RED CORNER)"
          cornerColor="red"
          selectedFighter={fighterB}
          onSelect={handleSelectB}
          excludeSlug={fighterA?.slug}
        />
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center border border-white/5 bg-black/20 text-slate-500 font-mono text-xs uppercase tracking-widest gap-3">
          <Activity className="text-primary animate-pulse" size={24} />
          <span>Akvizicija signala u tijeku...</span>
        </div>
      ) : fighterA && fighterB ? (
        /* Symmetrical HUD Display */
        <div className="space-y-8">
          {/* Symmetrical Nameplates */}
          <ScrollAnimationWrapper>
            <div className="grid grid-cols-12 gap-0 bezel-outer overflow-hidden shadow-2xl">
              {/* Fighter A */}
              <div className="col-span-5 bg-fighter-blue/15 border-r border-white/5 p-4 flex flex-col justify-center min-h-[90px] relative">
                <div className="absolute top-1.5 left-2.5 text-[8px] font-mono text-fighter-blue font-bold tracking-widest uppercase">
                  BLUE CORNER
                </div>
                <h2 className="font-display font-black italic text-lg sm:text-3xl text-white uppercase tracking-tight leading-none mt-2 truncate">
                  {fighterA.name}
                </h2>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1 block">
                  {fighterA.record}
                </span>
              </div>

              {/* VS badge */}
              <div className="col-span-2 flex items-center justify-center bg-background border-r border-white/5 font-display font-black italic text-lg sm:text-2xl text-primary select-none">
                VS
              </div>

              {/* Fighter B */}
              <div className="col-span-5 bg-fighter-red/15 p-4 flex flex-col justify-center text-right min-h-[90px] relative">
                <div className="absolute top-1.5 right-2.5 text-[8px] font-mono text-fighter-red font-bold tracking-widest uppercase">
                  RED CORNER
                </div>
                <h2 className="font-display font-black italic text-lg sm:text-3xl text-white uppercase tracking-tight leading-none mt-2 truncate">
                  {fighterB.name}
                </h2>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1 block">
                  {fighterB.record}
                </span>
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Radar Overlay & Physical Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <ScrollAnimationWrapper className="bezel-outer overflow-hidden">
              <div className="bezel-inner">
                <RadarChart fighterA={fighterA} fighterB={fighterB} />
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={0.1}>
              <PhysicalComparison fighterA={fighterA} fighterB={fighterB} />
            </ScrollAnimationWrapper>
          </div>

          {/* Symmetrical Win Method Donut Charts */}
          <ScrollAnimationWrapper>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bezel-outer overflow-hidden">
                <div className="bezel-inner">
                  <WinMethodChart
                    koPct={fighterA.koPct}
                    subPct={fighterA.subPct}
                    decPct={fighterA.decPct}
                    fighterName={fighterA.name}
                  />
                </div>
              </div>

              <div className="bezel-outer overflow-hidden">
                <div className="bezel-inner">
                  <WinMethodChart
                    koPct={fighterB.koPct}
                    subPct={fighterB.subPct}
                    decPct={fighterB.decPct}
                    fighterName={fighterB.name}
                  />
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      ) : (
        /* Empty/Incomplete Selection Slot Placeholder */
        <ScrollAnimationWrapper>
          <div className="border-2 border-dashed border-white/5 bg-black/20 p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
            <HelpCircle className="text-slate-600 mb-4 animate-pulse" size={48} />
            <h3 className="font-display font-bold italic text-lg text-white uppercase tracking-wider mb-2">
              POTREBNA OBA BORCA ZA USPOREDBU
            </h3>
            <p className="text-xs text-slate-500 font-mono max-w-sm uppercase tracking-wide leading-relaxed">
              Odaberite plavog i crvenog borca iz gornjih dropdown izbornika kako biste učitali telemetrijske radarske grafove i tjelesnu usporedbu.
            </p>
          </div>
        </ScrollAnimationWrapper>
      )}
    </div>
  );
}

export default function CompareFightersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="h-64 flex flex-col items-center justify-center border border-white/5 bg-black/20 text-slate-500 font-mono text-xs uppercase tracking-widest gap-3">
            <Activity className="text-primary animate-pulse" size={24} />
            <span>Učitavanje sučelja...</span>
          </div>
        }
      >
        <ComparisonContent />
      </Suspense>
    </div>
  );
}
