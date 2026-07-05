import React from "react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getMockPosts } from "@/lib/mockData";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import FilterBar from "@/components/ui/FilterBar";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import SectionHeading from "@/components/ui/SectionHeading";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { paginate, parsePageParam } from "@/lib/pagination";
import type { ListingPost } from "@/lib/post-types";
import { BookOpen } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
    page?: string;
  }>;
}

async function getBlogs(filters: { search?: string; category?: string; tag?: string }): Promise<ListingPost[]> {
  try {
    const whereClause: Prisma.PostWhereInput = {
      type: "BLOG",
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

    const blogs = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    if (blogs.length === 0) {
      return getMockPosts({
        type: "BLOG",
        search: filters.search,
        category: filters.category,
        tag: filters.tag,
      }) as ListingPost[];
    }

    return blogs as ListingPost[];
  } catch (error) {
    console.warn("Using fallback blogs due to DB availability:", error);
    return getMockPosts({
      type: "BLOG",
      search: filters.search,
      category: filters.category,
      tag: filters.tag,
    }) as ListingPost[];
  }
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { q, category, tag, page } = await searchParams;
  const allBlogs = await getBlogs({ search: q, category, tag });
  const paginated = paginate(allBlogs, parsePageParam(page));

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
