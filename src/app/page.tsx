import React from "react";
import { getPostListing, parsePageParam } from "@/lib/posts";
import type { Metadata } from "next";
import HeroArticle from "@/components/article/HeroArticle";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import FilterBar from "@/components/ui/FilterBar";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import SectionHeading from "@/components/ui/SectionHeading";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { Flame } from "lucide-react";
import { after } from "next/server";
import { triggerAutoSync } from "@/lib/sync";
import { getCachedUpcomingEvents } from "@/lib/cached-data";
import CombatArena3D from "@/components/ui/CombatArena3DWrapper";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
    page?: string;
    abTest?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q, category, tag } = await searchParams;
  const isFiltered = !!(q || category || tag);

  return {
    title: "Naslovnica",
    description:
      "Vodeći hrvatski portal za MMA, boks i kickboks. Najnovije vijesti, stručni blogovi i predikcije borbi.",
    alternates: {
      canonical: "/",
    },
    ...(isFiltered
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const { q, category, tag, page, abTest = "variantA" } = await searchParams;
  const currentPage = parsePageParam(page);
  const isFiltered = !!(q || category || tag);

  // Background sync triggered asynchronously after sending the response to the user
  after(() => {
    triggerAutoSync("homepage");
  });

  const upcomingEvents = await getCachedUpcomingEvents();

  // For the hero and bento grid, we need 15 items on page 1 when unfiltered
  const isBento = !isFiltered && currentPage === 1;
  const pageSize = isBento ? 15 : 12;

  const paginated = await getPostListing({
    search: q,
    category,
    tag,
    page: currentPage,
    pageSize,
  });

  const heroPost = isBento && paginated.items.length > 0
    ? paginated.items[0]
    : null;

  const listItems = heroPost ? paginated.items.slice(1) : paginated.items;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {!isFiltered && currentPage === 1 && (
        <ScrollAnimationWrapper className="mb-12">
          <CombatArena3D upcomingEvents={upcomingEvents} />
        </ScrollAnimationWrapper>
      )}

      {heroPost && (
        <ScrollAnimationWrapper className="mb-12">
          <HeroArticle
            title={heroPost.title}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
            content={heroPost.content}
            featuredImage={heroPost.featuredImage}
            type={heroPost.type}
            publishedAt={heroPost.publishedAt}
            category={heroPost.category}
            author={heroPost.author}
          />
        </ScrollAnimationWrapper>
      )}

      {/* Massive Off-screen Typographic Divider (Kinetic Telemetry HUD) */}
      {!isFiltered && (
        <div className="relative w-screen max-w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden select-none pointer-events-none mb-12 h-24 sm:h-32 md:h-40 flex items-center bg-gradient-to-r from-black via-primary/[0.03] to-black border-y border-dashed border-white/10">
          
          {/* HUD Grid Overlay Marks */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Top-left tick corner */}
            <div className="absolute top-2 left-6 w-3 h-3 border-l border-t border-primary/30" />
            {/* Bottom-right tick corner */}
            <div className="absolute bottom-2 right-6 w-3 h-3 border-r border-b border-primary/30" />
            
            {/* GPS coordinates telemetry */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col text-[8px] font-mono font-black text-slate-500 tracking-wider text-right">
              <span>LOC: ZAGREB, CROATIA</span>
              <span className="text-primary/75">SYS: 45.8153° N, 15.9879° E</span>
              <span>DEV: MATCH_PORTAL_V2</span>
            </div>
          </div>

          {/* Live Status indicator with fading backdrop mask */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-black via-black/85 to-transparent flex items-center pl-6 z-20 pointer-events-auto">
            <div className="flex items-center gap-2.5">
              <span className="text-[9px] font-black font-mono tracking-widest text-primary uppercase border border-primary/30 px-2 py-1 bg-primary/5">
                PRIJENOS UŽIVO
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            </div>
          </div>

          {/* Infinite Marquee Text Loop */}
          <div className="ticker-track ticker-track-no-pause flex gap-8 whitespace-nowrap z-0">
            <h2 className="text-6xl sm:text-8xl md:text-9xl font-black italic tracking-tighter text-slate-800/15 uppercase font-display select-none text-stroke-red text-glow-red leading-none">
              NAJNOVIJE OBJAVE • LATEST FIGHTS • NASLOVNICA • NAJNOVIJE OBJAVE • LATEST FIGHTS • NASLOVNICA
            </h2>
            <h2 className="text-6xl sm:text-8xl md:text-9xl font-black italic tracking-tighter text-slate-800/15 uppercase font-display select-none text-stroke-red text-glow-red leading-none">
              NAJNOVIJE OBJAVE • LATEST FIGHTS • NASLOVNICA • NAJNOVIJE OBJAVE • LATEST FIGHTS • NASLOVNICA
            </h2>
          </div>

        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ScrollAnimationWrapper>
            <SectionHeading
              title={isFiltered ? "Rezultati pretraživanja" : "Najnovije objave"}
              icon={Flame}
              as={heroPost ? "h2" : "h1"}
            />
          </ScrollAnimationWrapper>

          <FilterBar
            basePath="/"
            activeCategory={category}
            activeTag={tag}
            activeQuery={q}
            resultCount={paginated.total}
          />

          {listItems.length === 0 ? (
            <EmptyState
              message="Nisu pronađene objave koje odgovaraju vašim kriterijima."
              basePath="/"
            />
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {listItems.map((post, index) => {
                  const itemSpanClass = isBento
                    ? index === 0
                      ? "md:col-span-2 md:row-span-2"
                      : index === 3
                      ? "md:col-span-1 md:row-span-2"
                      : ""
                    : "";
                  return (
                    <StaggerItem
                      key={post.id}
                      className={`h-full ${itemSpanClass}`}
                    >
                      <ArticleCard
                        title={post.title}
                        slug={post.slug}
                        excerpt={post.excerpt}
                        featuredImage={post.featuredImage}
                        type={post.type}
                        publishedAt={post.publishedAt}
                        category={post.category}
                        author={post.author}
                        variant={isBento && index === 0 ? "horizontal" : "vertical"}
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
                  );
                })}
              </StaggerContainer>

              <Pagination
                basePath="/"
                currentPage={paginated.currentPage}
                totalPages={paginated.totalPages}
                params={{ q, category, tag }}
              />
            </>
          )}
        </div>

        <ScrollAnimationWrapper
          direction={abTest === "variantB" ? "left" : "right"}
          delay={0.2}
          className={`lg:col-span-1 ${abTest === "variantB" ? "lg:order-first" : "lg:order-last"}`}
        >
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
