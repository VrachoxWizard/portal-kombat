import React from "react";
import type { Metadata } from "next";
import { getPostListing, parsePageParam } from "@/lib/posts";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import FilterBar from "@/components/ui/FilterBar";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import SectionHeading from "@/components/ui/SectionHeading";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { Swords, Trophy } from "lucide-react";
import PredictionStatsBanner from "@/components/prediction/PredictionStatsBanner";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Predikcije i Prognoze Borbi",
  description:
    "Stručne analize predstojećih mečeva, predviđanja pobjednika, metode završetka i postotci pouzdanosti — MMA, boks i kickboks predikcije.",
  openGraph: {
    title: "Predikcije i Prognoze Borbi",
    description:
      "Stručne analize predstojećih mečeva, predviđanja pobjednika, metode završetka i postotci pouzdanosti.",
  },
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
    page?: string;
  }>;
}

export default async function PredictionsPage({ searchParams }: PageProps) {
  const { q, category, tag, page } = await searchParams;
  const currentPage = parsePageParam(page);

  const paginated = await getPostListing({
    type: "PREDICTION",
    search: q,
    category,
    tag,
    page: currentPage,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ScrollAnimationWrapper>
            <SectionHeading
              title="Predikcije i Prognoze Borbi"
              description="Pogledajte stručne analize predstojećih mečeva, predviđanja pobjednika, runde i metode završetka te postotke pouzdanosti."
              icon={Swords}
              as="h1"
            />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper delay={0.05}>
            <Link
              href="/liga"
              className="group block border border-primary/30 bg-slate-950/60 p-4 font-condensed hover:border-primary transition-premium shadow-[var(--shadow-glow-sm)] cursor-pointer"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                    <Trophy size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-black italic text-sm text-white uppercase tracking-wider group-hover:text-primary transition-colors">
                      Liga Analitičara & Šampionski Pojasevi
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Glasaj na mečeve, skupljaj pobjede i osvoji šampionski pojas. Provjeri svoj ranking →
                    </p>
                  </div>
                </div>
                <div className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                  OTVORI LIGU &rarr;
                </div>
              </div>
            </Link>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper delay={0.1}>
            <PredictionStatsBanner />
          </ScrollAnimationWrapper>

          <FilterBar
            basePath="/predikcije"
            activeCategory={category}
            activeTag={tag}
            activeQuery={q}
            resultCount={paginated.total}
          />

          {paginated.items.length === 0 ? (
            <EmptyState
              message="Nisu pronađene predikcije koje odgovaraju vašim kriterijima."
              basePath="/predikcije"
            />
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paginated.items.map((post, index) => (
                  <StaggerItem key={post.id} className={index === 0 ? "col-span-2" : ""}>
                    <ArticleCard
                      title={post.title}
                      slug={post.slug}
                      excerpt={post.excerpt}
                      featuredImage={post.featuredImage}
                      type={post.type}
                      publishedAt={post.publishedAt}
                      category={post.category}
                      author={post.author}
                      variant={index === 0 ? "horizontal" : "vertical"}
                      predictionTeaser={
                        post.prediction
                          ? {
                              fighterA: post.prediction.fighterA,
                              fighterB: post.prediction.fighterB,
                              winner: post.prediction.winner,
                              method: post.prediction.method,
                              confidenceScore: post.prediction.confidenceScore,
                              isCorrect: post.prediction.isCorrect,
                            }
                          : null
                      }
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <Pagination
                basePath="/predikcije"
                currentPage={paginated.currentPage}
                totalPages={paginated.totalPages}
                params={{ q, category, tag }}
              />
            </>
          )}
        </div>

        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1">
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
