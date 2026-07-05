import React from "react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getMockPosts } from "@/lib/mockData";
import HeroArticle from "@/components/article/HeroArticle";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import FilterBar from "@/components/ui/FilterBar";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import SectionHeading from "@/components/ui/SectionHeading";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { paginate, parsePageParam } from "@/lib/pagination";
import type { ListingPost } from "@/lib/post-types";
import { Flame } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
    page?: string;
  }>;
}

async function getPosts(filters: { search?: string; category?: string; tag?: string }): Promise<ListingPost[]> {
  try {
    const whereClause: Prisma.PostWhereInput = {
      status: "PUBLISHED",
    };

    if (filters.category) {
      whereClause.category = { slug: filters.category };
    }

    if (filters.tag) {
      whereClause.tags = { some: { slug: filters.tag } };
    }

    if (filters.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { excerpt: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: true,
        category: true,
        prediction: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    if (posts.length === 0) {
      return getMockPosts({
        search: filters.search,
        category: filters.category,
        tag: filters.tag,
      }) as ListingPost[];
    }

    return posts as ListingPost[];
  } catch (error) {
    console.warn("Baza podataka nije dostupna, koriste se mock podaci:", error);
    return getMockPosts({
      search: filters.search,
      category: filters.category,
      tag: filters.tag,
    }) as ListingPost[];
  }
}

export default async function HomePage({ searchParams }: PageProps) {
  const { q, category, tag, page } = await searchParams;
  const allPosts = await getPosts({ search: q, category, tag });
  const currentPage = parsePageParam(page);

  const isFiltered = !!(q || category || tag);
  const heroPost = !isFiltered && currentPage === 1 ? allPosts[0] : null;
  const listSource = isFiltered ? allPosts : allPosts.slice(1);
  const paginated = paginate(listSource, currentPage);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {!isFiltered && heroPost && currentPage === 1 && (
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
              title={isFiltered ? "Rezultati pretraživanja" : "Najnovije Objave"}
              icon={Flame}
              as="h1"
            />
          </ScrollAnimationWrapper>

          <FilterBar
            basePath="/"
            activeCategory={category}
            activeTag={tag}
            activeQuery={q}
            resultCount={paginated.total}
          />

          {paginated.items.length === 0 ? (
            <EmptyState
              message="Nisu pronađene objave koje odgovaraju vašim kriterijima."
              basePath="/"
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
