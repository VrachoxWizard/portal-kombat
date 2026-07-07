import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import SectionHeading from "@/components/ui/SectionHeading";
import { Info, Swords, Users, Target, ShieldCheck } from "lucide-react";
import { ScrollAnimationWrapper } from "@/components/ui/ScrollAnimationWrapper";

export const metadata: Metadata = {
  title: "O nama",
  description:
    "Saznajte više o CombatPortal HR timu, našoj viziji, novinarima i standardima kojima se vodimo.",
};

const team = [
  {
    name: "Mislav Vukušić",
    role: "Osnivač & Glavni Urednik",
    bio: "Pokretačka snaga CombatPortala HR. Bavi se organizacijom rada i strateškim smjerom portala.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Marko Horvat",
    role: "MMA Analitičar & Novinar",
    bio: "Dugogodišnji borilački novinar i analitičar, bivši amaterski kickboksač. Specijaliziran za MMA i UFC analize.",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Ivan Kovačević",
    role: "Boksački Kolumnist",
    bio: "Stručnjak za boks i povijest plemenite vještine. Piše kolumne i tjedne preglede zbivanja u teškoj kategoriji.",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <ScrollAnimationWrapper>
            <SectionHeading
              title="O nama"
              description="Saznajte tko stoji iza najbrže rastućeg borilačkog medija u regiji."
              icon={Info}
              as="h1"
            />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper delay={0.1}>
            <div className="relative overflow-hidden rounded-2xl bg-black border border-white/5 p-8 sm:p-10 shadow-[var(--shadow-card)] transition-premium hover:border-red-500/10">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
              <h2 className="font-display font-extrabold italic text-xl sm:text-2xl text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                <Swords className="text-primary" size={20} />
                Naša Misija
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                CombatPortal HR je osnovan s ciljem da ljubiteljima borilačkih sportova pruži vrhunski sadržaj na jednom mjestu. Vjerujemo da borilački sportovi zaslužuju detaljne, stručne i objektivne analize, a ne samo senzacionalističke naslove. 
                <br /><br />
                Naš tim sastoji se od iskusnih analitičara, zaljubljenika u sport i bivših boraca, što nam daje jedinstvenu perspektivu i stručnost prilikom pisanja članaka i kreiranja borilačkih predikcija.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScrollAnimationWrapper delay={0.15} className="surface-card p-5 space-y-2 text-center md:text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary mx-auto md:mx-0">
                <Users size={18} />
              </div>
              <h3 className="font-display font-bold text-white text-sm uppercase">Zajednica</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Povezujemo borilačke navijače iz cijele regije kroz interaktivne rasprave i analize.
              </p>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={0.2} className="surface-card p-5 space-y-2 text-center md:text-left">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto md:mx-0">
                <Target size={18} />
              </div>
              <h3 className="font-display font-bold text-white text-sm uppercase">Stručnost</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Naše predikcije temelje se na dubinskim statistikama, stilskim uparivanjima i povijesnim podacima.
              </p>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={0.25} className="surface-card p-5 space-y-2 text-center md:text-left">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto md:mx-0">
                <ShieldCheck size={18} />
              </div>
              <h3 className="font-display font-bold text-white text-sm uppercase">Integritet</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Cijenimo novinarsku etiku. Sadržaj provjeravamo iz više neovisnih i provjerenih izvora.
              </p>
            </ScrollAnimationWrapper>
          </div>

          <div className="space-y-6 pt-4">
            <ScrollAnimationWrapper>
              <h2 className="font-display font-extrabold italic text-2xl text-white uppercase tracking-tight border-l-4 border-primary pl-4">
                Uredništvo i Autori
              </h2>
            </ScrollAnimationWrapper>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <ScrollAnimationWrapper key={member.name} delay={0.1 * i} className="surface-card p-6 flex flex-col justify-between h-full hover-glow">
                  <div className="space-y-4">
                    <div className="relative w-20 h-20 rounded-full border-2 border-primary/20 overflow-hidden mx-auto">
                      <Image
                        src={member.avatarUrl}
                        alt={member.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-display font-bold text-white text-base">{member.name}</h3>
                      <p className="text-primary text-[10px] uppercase tracking-widest font-extrabold mt-0.5">{member.role}</p>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed text-center italic">
                      &ldquo;{member.bio}&rdquo;
                    </p>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </div>

        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1">
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
