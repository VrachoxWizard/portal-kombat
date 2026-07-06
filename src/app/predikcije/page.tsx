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
import { Swords } from "lucide-react";
import PredictionStatsBanner from "@/components/prediction/PredictionStatsBanner";

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

          <PredictionStatsBanner />

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
                  <StaggerItem key={post.id} className={index === 0 ? "sm:col-span-2" : ""}>
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
