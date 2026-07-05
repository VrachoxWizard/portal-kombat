import React from "react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getMockPosts } from "@/lib/mockData";
import ArticleCard from "@/components/article/ArticleCard";
import ExternalArticleCard from "@/components/article/ExternalArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import FilterBar from "@/components/ui/FilterBar";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import SectionHeading from "@/components/ui/SectionHeading";
import { fetchExternalNews } from "@/lib/externalNews";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { paginate, parsePageParam } from "@/lib/pagination";
import type { ListingPost } from "@/lib/post-types";
import { Newspaper } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
    page?: string;
  }>;
}

async function getNews(filters: { search?: string; category?: string; tag?: string }): Promise<ListingPost[]> {
  try {
    const whereClause: Prisma.PostWhereInput = {
      type: "NEWS",
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

    const news = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    if (news.length === 0) {
      return getMockPosts({
        type: "NEWS",
        search: filters.search,
        category: filters.category,
        tag: filters.tag,
      }) as ListingPost[];
    }

    return news as ListingPost[];
  } catch (error) {
    console.warn("Using fallback news due to DB availability:", error);
    return getMockPosts({
      type: "NEWS",
      search: filters.search,
      category: filters.category,
      tag: filters.tag,
    }) as ListingPost[];
  }
}

export default async function NewsPage({ searchParams }: PageProps) {
  const { q, category, tag, page } = await searchParams;
  const allNews = await getNews({ search: q, category, tag });
  const externalArticles = await fetchExternalNews();
  const isFiltered = !!(q || category || tag);
  const paginated = paginate(allNews, parsePageParam(page));

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
