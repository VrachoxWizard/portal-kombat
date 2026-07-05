import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getMockPosts } from "@/lib/mockData";
import ArticleCard from "@/components/article/ArticleCard";
import ExternalArticleCard from "@/components/article/ExternalArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import { fetchExternalNews } from "@/lib/externalNews";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { Newspaper, X } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
  }>;
}

async function getNews(filters: { search?: string; category?: string; tag?: string }) {
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
        { content: { contains: filters.search, mode: "insensitive" } },
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
      });
    }

    return news;
  } catch (error) {
    console.warn("Using fallback news due to DB availability:", error);
    return getMockPosts({
      type: "NEWS",
      search: filters.search,
      category: filters.category,
      tag: filters.tag,
    });
  }
}

export default async function NewsPage({ searchParams }: PageProps) {
  const { q, category, tag } = await searchParams;
  const newsList = await getNews({ search: q, category, tag });
  const externalArticles = await fetchExternalNews();
  const isFiltered = !!(q || category || tag);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <ScrollAnimationWrapper>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-6 gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black italic tracking-tight uppercase border-l-4 border-primary pl-3 flex items-center gap-2 font-display">
                    <Newspaper size={24} className="text-primary" />
                    Borilačke Novosti
                  </h1>
                  <p className="text-muted-foreground text-xs pl-4 font-medium">
                    Pratite najnovija zbivanja, najave turnira i vijesti iz ringa i oktogona.
                  </p>
                </div>
                
                {isFiltered && (
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <Link
                      href="/novosti"
                      className="text-xs font-bold text-primary hover:text-red-400 flex items-center gap-1 transition-colors uppercase tracking-wider bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20"
                    >
                      <X size={14} />
                      Očisti filtere
                    </Link>
                  </div>
                )}
              </div>
            </ScrollAnimationWrapper>

            {newsList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 bg-card/30 p-12 text-center text-muted-foreground">
                Nisu pronađene vijesti koje odgovaraju vašim kriterijima.
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {newsList.map((post, index) => (
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
            )}
          </div>

          {/* Section: Live vijesti iz svijeta */}
          {!isFiltered && externalArticles.length > 0 && (
            <div className="pt-8 border-t border-white/5 space-y-6">
              <ScrollAnimationWrapper>
                <div className="space-y-1">
                  <h2 className="text-xl font-black italic tracking-tight uppercase border-l-4 border-primary pl-3 flex items-center gap-2 font-display">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                    </span>
                    Vijesti iz Svijeta (Uživo)
                  </h2>
                  <p className="text-muted-foreground text-xs pl-5 font-medium">
                    Najnoviji članci preneseni u realnom vremenu s vodećih stranih borilačkih portala.
                  </p>
                </div>
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
