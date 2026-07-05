import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getMockPosts } from "@/lib/mockData";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { Swords, X } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
  }>;
}

async function getPredictions(filters: { search?: string; category?: string; tag?: string }) {
  try {
    const whereClause: Prisma.PostWhereInput = {
      type: "PREDICTION",
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

    const predictions = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    if (predictions.length === 0) {
      return getMockPosts({
        type: "PREDICTION",
        search: filters.search,
        category: filters.category,
        tag: filters.tag,
      });
    }

    return predictions;
  } catch (error) {
    console.warn("Using fallback predictions due to DB availability:", error);
    return getMockPosts({
      type: "PREDICTION",
      search: filters.search,
      category: filters.category,
      tag: filters.tag,
    });
  }
}

export default async function PredictionsPage({ searchParams }: PageProps) {
  const { q, category, tag } = await searchParams;
  const predictions = await getPredictions({ search: q, category, tag });
  const isFiltered = !!(q || category || tag);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ScrollAnimationWrapper>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-6 gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-black italic tracking-tight uppercase border-l-4 border-primary pl-3 flex items-center gap-2 font-display">
                  <Swords size={24} className="text-primary animate-pulse" />
                  Predikcije i Prognoze Borbi
                </h1>
                <p className="text-muted-foreground text-xs pl-4 font-medium">
                  Pogledajte stručne analize predstojećih mečeva, predviđanja pobjednika, runde i metode završetka te postotke pouzdanosti.
                </p>
              </div>
              
              {isFiltered && (
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <Link
                    href="/predikcije"
                    className="text-xs font-bold text-primary hover:text-red-400 flex items-center gap-1 transition-colors uppercase tracking-wider bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20"
                  >
                    <X size={14} />
                    Očisti filtere
                  </Link>
                </div>
              )}
            </div>
          </ScrollAnimationWrapper>

          {predictions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-card/30 p-12 text-center text-muted-foreground">
              Nisu pronađene predikcije koje odgovaraju vašim kriterijima.
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {predictions.map((post, index) => (
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

        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1">
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
