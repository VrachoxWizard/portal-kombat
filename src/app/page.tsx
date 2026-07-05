import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getMockPosts } from "@/lib/mockData";
import HeroArticle from "@/components/article/HeroArticle";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { X, Flame } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
  }>;
}

async function getPosts(filters: { search?: string; category?: string; tag?: string }) {
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
        { content: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: true,
        category: true,
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
      });
    }

    return posts;
  } catch (error) {
    console.warn("Baza podataka nije dostupna, koriste se mock podaci:", error);
    return getMockPosts({
      search: filters.search,
      category: filters.category,
      tag: filters.tag,
    });
  }
}

export default async function HomePage({ searchParams }: PageProps) {
  const { q, category, tag } = await searchParams;
  const posts = await getPosts({ search: q, category, tag });
  
  const isFiltered = !!(q || category || tag);
  const heroPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section (samo ako nismo pod pretragom/filterom) */}
      {!isFiltered && heroPost && (
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

      {/* Main Grid: Articles + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Articles */}
        <div className="lg:col-span-2 space-y-8">
          <ScrollAnimationWrapper>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-6 gap-4">
              <h2 className="text-2xl font-black italic tracking-tight uppercase border-l-4 border-primary pl-3 flex items-center gap-2 font-display">
                <Flame size={20} className="text-primary animate-pulse" />
                {isFiltered ? "Rezultati pretraživanja" : "Najnovije Objave"}
              </h2>
              
              {isFiltered && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full flex items-center gap-2 font-medium">
                    Aktivni filteri
                    {q && ` (Pretraga: "${q}")`}
                    {category && ` (Kategorija: ${category.toUpperCase()})`}
                    {tag && ` (#${tag})`}
                  </span>
                  <Link
                    href="/"
                    className="text-xs font-bold text-primary hover:text-red-400 flex items-center gap-1 transition-colors uppercase tracking-wider"
                  >
                    <X size={14} />
                    Očisti
                  </Link>
                </div>
              )}
            </div>
          </ScrollAnimationWrapper>
          
          {posts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-card/30 p-12 text-center text-muted-foreground">
              Nisu pronađene objave koje odgovaraju vašim kriterijima.
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Ako smo filtrirani, i prvi post se prikazuje kao kartica umjesto Heroja */}
              {isFiltered
                ? posts.map((post, index) => (
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
                  ))
                : remainingPosts.map((post, index) => (
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

        {/* Right Side: Sidebar */}
        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1">
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}

