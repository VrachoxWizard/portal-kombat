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
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Urednički Blogovi i Kolumne",
  description:
    "Pročitajte stručna mišljenja, dubinske rasprave i analize borilačkih sportova — MMA, boks, kickboks kolumne naših urednika.",
  openGraph: {
    title: "Urednički Blogovi i Kolumne",
    description:
      "Pročitajte stručna mišljenja, dubinske rasprave i analize borilačkih sportova — MMA, boks, kickboks kolumne naših urednika.",
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

export default async function BlogPage({ searchParams }: PageProps) {
  const { q, category, tag, page } = await searchParams;
  const currentPage = parsePageParam(page);

  const paginated = await getPostListing({
    type: "BLOG",
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
              title="Urednički Blogovi i Kolumne"
              description="Pročitajte stručna mišljenja, dubinske rasprave i analize povijesti borilačkih sportova."
              icon={BookOpen}
              as="h1"
            />
          </ScrollAnimationWrapper>

          <FilterBar
            basePath="/blog"
            activeCategory={category}
            activeTag={tag}
            activeQuery={q}
            resultCount={paginated.total}
          />

          {paginated.items.length === 0 ? (
            <EmptyState
              message="Nisu pronađeni blogovi koji odgovaraju vašim kriterijima."
              basePath="/blog"
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
                basePath="/blog"
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
