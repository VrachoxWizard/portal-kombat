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
import { syncUfcEvents } from "@/lib/sync";
import { prisma } from "@/lib/prisma";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
    page?: string;
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
      canonical: isFiltered ? "/" : undefined,
    },
    ...(isFiltered
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const { q, category, tag, page } = await searchParams;
  const currentPage = parsePageParam(page);
  const isFiltered = !!(q || category || tag);

  // Background sync triggered asynchronously after sending the response to the user
  after(async () => {
    try {
      const lastEvent = await prisma.event.findFirst({
        orderBy: { createdAt: "desc" },
      });
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (!lastEvent || lastEvent.createdAt < oneHourAgo) {
        console.log("Auto-triggering background UFC events sync...");
        await syncUfcEvents();
      }
    } catch (err) {
      console.error("Background sync error on homepage:", err);
    }
  });

  // For the hero, we need an extra item on page 1 when unfiltered
  const pageSize = !isFiltered && currentPage === 1 ? 13 : 12;

  const paginated = await getPostListing({
    search: q,
    category,
    tag,
    page: currentPage,
    pageSize,
  });

  const heroPost = !isFiltered && currentPage === 1 && paginated.items.length > 0
    ? paginated.items[0]
    : null;

  const listItems = heroPost ? paginated.items.slice(1) : paginated.items;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {listItems.map((post, index) => (
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
                basePath="/"
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
