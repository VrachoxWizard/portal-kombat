import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPredictionStats } from "@/lib/predictions";
import {
  FileText,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Target,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CmsDashboardPage() {
  let stats = {
    postsCount: 0,
    predictionsCount: 0,
    eventsCount: 0,
    subscribersCount: 0,
  };

  let recentPosts: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    publishedAt: Date | null;
  }> = [];

  let predictionAccuracy: number | null = null;

  try {
    const [postsCount, predictionsCount, eventsCount, subscribersCount, posts, predStats] =
      await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { type: "PREDICTION" } }),
        prisma.event.count(),
        prisma.subscriber.count(),
        prisma.post.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, title: true, type: true, status: true, publishedAt: true },
        }),
        getPredictionStats(),
      ]);

    stats = { postsCount, predictionsCount, eventsCount, subscribersCount };
    recentPosts = posts;
    predictionAccuracy = predStats.accuracy;
  } catch (error) {
    console.error("Dashboard database query error:", error);
  }

  const statCards = [
    {
      name: "Ukupno Članaka",
      value: stats.postsCount,
      icon: FileText,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      name: "Predikcije Borbi",
      value: stats.predictionsCount,
      icon: TrendingUp,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      name: "Nadolazeće Borbe",
      value: stats.eventsCount,
      icon: Calendar,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      name: "Pretplatnici",
      value: stats.subscribersCount,
      icon: Users,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold italic uppercase tracking-tight text-white font-display">
            Nadzorna Ploča
          </h1>
          <p className="text-sm text-slate-400 font-medium">Dobrodošli u urednički centar CombatPortal HR.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/cms/clanci/novi"
            className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-red-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white border border-red-500/20 transition-premium shadow-[var(--shadow-glow-sm)] cursor-pointer"
          >
            <Plus size={14} />
            Novi članak
          </Link>
        </div>
      </div>

      {/* Grid of stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.name} className="surface-card p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{card.name}</p>
              <p className="text-3xl font-extrabold text-white font-display leading-tight">{card.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.color}`}>
              <card.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {predictionAccuracy != null && (
        <div className="surface-card p-5 flex items-center gap-4 border-emerald-500/20">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Target className="text-emerald-400" size={22} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Točnost predikcija (sve riješene)
            </p>
            <p className="text-2xl font-extrabold text-white font-display">{predictionAccuracy}%</p>
          </div>
        </div>
      )}

      {/* Main section: Recent articles and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Articles Listing */}
        <div className="lg:col-span-2 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="font-display font-extrabold italic text-lg text-white uppercase tracking-tight">
              Nedavno dodani članci
            </h2>
            <Link
              href="/cms/clanci"
              className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-primary hover:text-red-400 transition-premium"
            >
              Vidi sve
              <ArrowUpRight size={12} />
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-4">Nema nedavno dodanih članaka.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {recentPosts.map((post) => (
                <div key={post.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="truncate space-y-1">
                    <Link
                      href={`/cms/clanci/${post.id}/uredi`}
                      className="text-sm font-bold text-white hover:text-primary transition-premium truncate block"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <span className="text-primary">{post.type}</span>
                      <span>•</span>
                      <span
                        className={
                          post.status === "PUBLISHED"
                            ? "text-emerald-400"
                            : post.status === "DRAFT"
                            ? "text-amber-400"
                            : "text-slate-400"
                        }
                      >
                        {post.status}
                      </span>
                    </div>
                  </div>
                  {post.publishedAt && (
                    <time className="text-[10px] text-slate-500 font-bold tracking-wider shrink-0 uppercase">
                      {new Date(post.publishedAt).toLocaleDateString("hr-HR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </time>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick action widgets */}
        <div className="space-y-6">
          <div className="surface-card p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-white uppercase border-l-4 border-primary pl-3">
              Brze Akcije
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/cms/clanci/novi"
                className="w-full flex items-center justify-between p-3.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary/20 hover:text-primary text-xs font-bold uppercase tracking-wider text-slate-300 transition-premium"
              >
                Dodaj novost / Vijest
                <ArrowUpRight size={14} className="text-slate-500" />
              </Link>
              <Link
                href="/cms/clanci/novi?type=PREDICTION"
                className="w-full flex items-center justify-between p-3.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary/20 hover:text-primary text-xs font-bold uppercase tracking-wider text-slate-300 transition-premium"
              >
                Kreiraj predikciju borbe
                <ArrowUpRight size={14} className="text-slate-500" />
              </Link>
              <Link
                href="/cms/dogadaji"
                className="w-full flex items-center justify-between p-3.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary/20 hover:text-primary text-xs font-bold uppercase tracking-wider text-slate-300 transition-premium"
              >
                Dodaj borbu u sidebar
                <ArrowUpRight size={14} className="text-slate-500" />
              </Link>
            </div>
          </div>

          <div className="surface-card p-6 flex gap-4 bg-amber-950/10 border-amber-500/10">
            <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">Sigurnosna obavijest</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Pristupate administrativnoj ploči CombatPortal HR. Sve radnje se bilježe. Molimo nemojte dijeliti uredničke pristupne podatke.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
