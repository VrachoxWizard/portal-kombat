import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/layout/Sidebar";
import SectionHeading from "@/components/ui/SectionHeading";
import ArticleCard from "@/components/article/ArticleCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { Shield, MapPin, Award, Calendar, ArrowLeft, Swords } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getFighterData(slug: string) {
  const fighter = await prisma.fighter.findUnique({
    where: { slug },
  });

  if (!fighter) return null;

  const predictions = await prisma.prediction.findMany({
    where: {
      OR: [{ fighterAId: fighter.id }, { fighterBId: fighter.id }],
    },
    include: {
      post: {
        include: {
          author: true,
          category: true,
          prediction: true,
        },
      },
    },
    orderBy: {
      post: {
        publishedAt: "desc",
      },
    },
  });

  const events = await prisma.event.findMany({
    where: {
      OR: [{ fighterAId: fighter.id }, { fighterBId: fighter.id }],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { fighter, predictions, events };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getFighterData(slug);
  if (!data) {
    return {
      title: "Borac nije pronađen",
    };
  }

  return {
    title: `${data.fighter.name} - Statistike i Profil Borca | CombatPortal HR`,
    description: `Statistike, profesionalni omjer borbi (${data.fighter.record}), biografija i najnovije vijesti za borca ${data.fighter.name}.`,
  };
}

export default async function FighterDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getFighterData(slug);

  if (!data) {
    notFound();
  }

  const { fighter, predictions, events } = data;

  const breadcrumbItems = [
    { label: "Borci", href: "/borci" },
    { label: fighter.name },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Back Button */}
          <Link
            href="/borci"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-400 hover:text-primary transition-premium"
          >
            <ArrowLeft size={14} />
            Povratak na bazu boraca
          </Link>

          {/* Fighter Hero Info Card */}
          <ScrollAnimationWrapper>
            <div className="relative rounded-[var(--radius-card)] overflow-hidden bg-surface-card border border-white/5 p-6 sm:p-8 shadow-2xl">
              {/* Premium Glow Decoration */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-red-950/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                {/* Image */}
                <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-xl overflow-hidden border-2 border-white/10 bg-slate-900 shadow-xl shrink-0">
                  {fighter.imageUrl ? (
                    <Image
                      src={fighter.imageUrl}
                      alt={fighter.name}
                      fill
                      priority
                      sizes="(max-width: 640px) 128px, 160px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/15 text-primary">
                      <Shield size={48} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left space-y-4">
                  <div>
                    <h1 className="text-2xl sm:text-3.5xl font-extrabold italic uppercase tracking-tight text-white font-display leading-none mb-2">
                      {fighter.name}
                    </h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {fighter.weightClass}
                    </p>
                  </div>

                  {/* Badges Grid */}
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto sm:mx-0">
                    <div className="bg-black/45 border border-white/5 rounded-lg p-3 text-center sm:text-left">
                      <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider mb-1">
                        Profesionalni Omjer
                      </p>
                      <p className="text-sm font-black text-glow-red text-primary">
                        {fighter.record}
                      </p>
                    </div>
                    {fighter.stance && (
                      <div className="bg-black/45 border border-white/5 rounded-lg p-3 text-center sm:text-left">
                        <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider mb-1">
                          Stav Borca
                        </p>
                        <p className="text-xs font-bold text-white uppercase">
                          {fighter.stance}
                        </p>
                      </div>
                    )}
                    {fighter.team && (
                      <div className="bg-black/45 border border-white/5 rounded-lg p-3 col-span-2 text-center sm:text-left flex items-center gap-2">
                        <MapPin size={14} className="text-primary shrink-0" />
                        <div>
                          <p className="text-[8px] text-slate-500 font-extrabold uppercase tracking-wider">
                            Klub / Tim
                          </p>
                          <p className="text-xs font-semibold text-white truncate">
                            {fighter.team}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Biography */}
          {fighter.bio && (
            <ScrollAnimationWrapper delay={0.05}>
              <div className="surface-card p-6 sm:p-8 space-y-4">
                <h2 className="font-display font-black text-base uppercase text-white border-l-4 border-primary pl-3 flex items-center gap-2">
                  <Award size={18} className="text-primary" />
                  Biografija i Pozadina
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                  {fighter.bio}
                </p>
              </div>
            </ScrollAnimationWrapper>
          )}

          {/* Predictions / Analyses Section */}
          <div className="space-y-6">
            <ScrollAnimationWrapper>
              <SectionHeading
                title="Prognoze i Analize"
                description={`Najnovije stručne analize i predikcije borbi u kojima sudjeluje ${fighter.name}.`}
                icon={Swords}
                as="h2"
              />
            </ScrollAnimationWrapper>

            {predictions.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4">
                Trenutno nema objavljenih stručnih predikcija za ovog borca.
              </p>
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {predictions.map((p) => (
                  <StaggerItem key={p.id}>
                    <ArticleCard
                      title={p.post.title}
                      slug={p.post.slug}
                      excerpt={p.post.excerpt}
                      featuredImage={p.post.featuredImage}
                      type={p.post.type}
                      publishedAt={p.post.publishedAt}
                      category={p.post.category}
                      author={p.post.author}
                      predictionTeaser={{
                        fighterA: p.fighterA,
                        fighterB: p.fighterB,
                        winner: p.winner,
                      }}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>

          {/* Upcoming Fights */}
          <div className="space-y-6">
            <ScrollAnimationWrapper>
              <SectionHeading
                title="Nadolazeće Borbe"
                description={`Raspored zakazanih mečeva za borca ${fighter.name}.`}
                icon={Calendar}
                as="h2"
              />
            </ScrollAnimationWrapper>

            {events.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4">
                Trenutno nema zakazanih borbi za ovog borca.
              </p>
            ) : (
              <div className="space-y-4">
                {events.map((e) => (
                  <ScrollAnimationWrapper key={e.id}>
                    <div className="group relative rounded-lg bg-surface-card border border-white/5 p-5 transition-premium hover:bg-black/60 hover:border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="font-extrabold text-xs text-primary tracking-widest uppercase mb-1 block">
                          {e.event}
                        </span>
                        <div className="font-bold text-base text-white uppercase font-display">
                          <span>{e.fighterA}</span>
                          <span className="mx-2 text-red-500 text-xs font-black">VS</span>
                          <span>{e.fighterB}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-black/45 border border-white/5 px-3 py-2 rounded-lg self-start sm:self-auto shrink-0 shadow-inner">
                        <Calendar size={13} className="text-slate-500" />
                        <span>{e.date}</span>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1">
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
