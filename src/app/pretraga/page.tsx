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
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Pretraga",
  description: "Pretražite sve objave, novosti, blogove i predikcije na CombatPortal HR portalu.",
  robots: { index: false, follow: true },
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, category, tag, page } = await searchParams;
  const currentPage = parsePageParam(page);
  const searchQuery = q || "";

  const paginated = await getPostListing({
    search: searchQuery,
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
              title="Pretraživanje Portala"
              description={
                searchQuery
                  ? `Rezultati za pojam pretrage: "${searchQuery}"`
                  : "Unesite pojam za pretragu kako biste pretražili objave."
              }
              icon={Search}
              as="h1"
            />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper delay={0.05}>
            <div className="surface-card p-6 border-2 border-white/10 rounded-none bg-surface-card shadow-[var(--shadow-brutalist)]">
              <form method="GET" action="/pretraga" className="relative flex items-center">
                <label htmlFor="pretraga-search" className="sr-only">
                  Pretraži portal
                </label>
                <input
                  id="pretraga-search"
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Upišite pojam za pretraživanje (npr. boks, kolumna, borac)..."
                  className="w-full rounded-none bg-black/60 border-2 border-white/10 pl-10 pr-12 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-premium font-bold"
                />
                <div className="absolute left-3.5 text-slate-500 pointer-events-none" aria-hidden="true">
                  <Search size={14} />
                </div>
                <button
                  type="submit"
                  className="absolute right-2 text-slate-400 hover:text-primary transition-premium p-1.5 rounded-none hover:bg-white/5 cursor-pointer"
                  aria-label="Pretraži"
                >
                  <Search size={14} className="text-primary" />
                </button>
              </form>
            </div>
          </ScrollAnimationWrapper>

          <FilterBar
            basePath="/pretraga"
            activeCategory={category}
            activeTag={tag}
            activeQuery={searchQuery}
            resultCount={paginated.total}
          />

          {paginated.items.length === 0 ? (
            <EmptyState
              message={
                searchQuery
                  ? "Nismo pronašli niti jednu objavu koja odgovara vašem pojmu."
                  : "Upišite pojam za pretraživanje u tražilicu iznad."
              }
              basePath="/pretraga"
            />
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paginated.items.map((post) => (
                  <StaggerItem key={post.id}>
                    <ArticleCard
                      title={post.title}
                      slug={post.slug}
                      excerpt={post.excerpt}
                      featuredImage={post.featuredImage}
                      type={post.type}
                      publishedAt={post.publishedAt}
                      category={post.category}
                      author={post.author}
                      predictionTeaser={
                        post.type === "PREDICTION" && post.prediction
                          ? {
                              fighterA: post.prediction.fighterA,
                              fighterB: post.prediction.fighterB,
                              winner: post.prediction.winner,
                            }
                          : null
                      }
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <Pagination
                basePath="/pretraga"
                currentPage={paginated.currentPage}
                totalPages={paginated.totalPages}
                params={{ q: searchQuery, category, tag }}
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
