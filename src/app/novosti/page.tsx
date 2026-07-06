import React from "react";
import type { Metadata } from "next";
import { getPostListing, parsePageParam } from "@/lib/posts";
import ArticleCard from "@/components/article/ArticleCard";
import ExternalArticleCard from "@/components/article/ExternalArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import FilterBar from "@/components/ui/FilterBar";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import SectionHeading from "@/components/ui/SectionHeading";
import { fetchExternalNews } from "@/lib/externalNews";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { Newspaper } from "lucide-react";
import { after } from "next/server";
import { syncUfcEvents } from "@/lib/sync";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Borilačke Novosti",
  description:
    "Pratite najnovija zbivanja u borilačkim sportovima — vijesti iz UFC-a, boksa, kickboksa, najave turnira i rezultati borbi.",
  openGraph: {
    title: "Borilačke Novosti",
    description:
      "Pratite najnovija zbivanja u borilačkim sportovima — vijesti iz UFC-a, boksa, kickboksa, najave turnira i rezultati borbi.",
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

export default async function NewsPage({ searchParams }: PageProps) {
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
        console.log("Auto-triggering background UFC events sync from news page...");
        await syncUfcEvents();
      }
    } catch (err) {
      console.error("Background sync error on news page:", err);
    }
  });

  const [paginated, externalArticles] = await Promise.all([
    getPostListing({
      type: "NEWS",
      search: q,
      category,
      tag,
      page: currentPage,
    }),
    fetchExternalNews(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <ScrollAnimationWrapper>
              <SectionHeading
                title="Borilačke Novosti"
                description="Pratite najnovija zbivanja, najave turnira i vijesti iz ringa i oktogona."
                icon={Newspaper}
                as="h1"
              />
            </ScrollAnimationWrapper>

            <FilterBar
              basePath="/novosti"
              activeCategory={category}
              activeTag={tag}
              activeQuery={q}
              resultCount={paginated.total}
            />

            {paginated.items.length === 0 ? (
              <EmptyState
                message="Nisu pronađene vijesti koje odgovaraju vašim kriterijima."
                basePath="/novosti"
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
                      />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                <Pagination
                  basePath="/novosti"
                  currentPage={paginated.currentPage}
                  totalPages={paginated.totalPages}
                  params={{ q, category, tag }}
                />
              </>
            )}
          </div>

          {!isFiltered && paginated.currentPage === 1 && externalArticles.length > 0 && (
            <div className="pt-8 border-t border-white/5 space-y-6">
              <ScrollAnimationWrapper>
                <SectionHeading
                  title="Vijesti iz Svijeta (Uživo)"
                  description="Najnoviji članci preneseni u realnom vremenu s vodećih stranih borilačkih portala."
                />
              </ScrollAnimationWrapper>

              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {externalArticles.map((article) => (
                  <StaggerItem key={article.id}>
                    <ExternalArticleCard
                      title={article.title}
                      link={article.link}
                      excerpt={article.excerpt}
                      featuredImage={article.featuredImage}
                      publishedAt={article.publishedAt}
                      source={article.source}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}
        </div>

        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1">
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
