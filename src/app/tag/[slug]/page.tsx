import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMockPosts } from "@/lib/mockData";
import { parsePageParam } from "@/lib/posts";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { PAGE_SIZE } from "@/lib/constants";
import type { ListingPost } from "@/lib/post-types";
import { Hash } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getTagData(
  slug: string,
  page: number
): Promise<{ items: ListingPost[]; total: number; totalPages: number; currentPage: number; tagName: string }> {
  try {
    const dbTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (dbTag) {
      const [total, posts] = await Promise.all([
        prisma.post.count({
          where: { status: "PUBLISHED", tags: { some: { slug } } },
        }),
        prisma.post.findMany({
          where: { status: "PUBLISHED", tags: { some: { slug } } },
          include: { author: true, category: true },
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
        }),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      const currentPage = Math.min(Math.max(1, page), totalPages);

      return {
        items: posts as ListingPost[],
        total,
        totalPages,
        currentPage,
        tagName: dbTag.name,
      };
    }

    // Fall through to mock data
    return getTagMockData(slug, page);
  } catch (error) {
    console.warn("DB not accessible. Using fallback for tag:", slug, error instanceof Error ? error.message : error);
    return getTagMockData(slug, page);
  }
}

function getTagMockData(
  slug: string,
  page: number
): { items: ListingPost[]; total: number; totalPages: number; currentPage: number; tagName: string } {
  const rawMockPosts = getMockPosts({ tag: slug });

  if (rawMockPosts.length === 0) {
    return { items: [], total: 0, totalPages: 1, currentPage: 1, tagName: "" };
  }

  // Extract tag name from mock data (which includes tags) before casting
  const foundTag = rawMockPosts[0].tags.find((t) => t.slug === slug);
  const tagName = foundTag ? foundTag.name : slug.toUpperCase();

  const mockPosts = rawMockPosts as ListingPost[];
  const total = mockPosts.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;

  return {
    items: mockPosts.slice(start, start + PAGE_SIZE),
    total,
    totalPages,
    currentPage,
    tagName,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { tagName } = await getTagData(slug, 1);

  if (!tagName) {
    return {
      title: "Oznaka nije pronađena | CombatPortal HR",
    };
  }

  return {
    title: `Objave označene s #${tagName} | CombatPortal HR`,
    description: `Pregled svih vijesti, kolumni i analiza označenih s ${tagName}.`,
  };
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parsePageParam(page);
  const data = await getTagData(slug, currentPage);

  if (!data.tagName) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Breadcrumbs items={[{ label: `Oznaka #${data.tagName}` }]} />

          <ScrollAnimationWrapper>
            <div className="flex items-center gap-2 border-l-4 border-primary pl-3 py-1 surface-card pr-4 rounded-r-[var(--radius-card)]">
              <Hash size={24} className="text-primary" aria-hidden="true" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground uppercase font-display">
                Oznaka: <span className="text-primary">#{data.tagName}</span>
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-3 pl-4 font-medium">
              {data.total} {data.total === 1 ? "objava" : "objava"} s ovom oznakom
            </p>
          </ScrollAnimationWrapper>

          {data.items.length === 0 ? (
            <EmptyState message="Nema objavljenih članaka s ovom oznakom." basePath="/" />
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.items.map((post) => (
                  <StaggerItem key={post.id}>
                    <ArticleCard
                      title={post.title}
                      slug={post.slug}
                      excerpt={post.excerpt}
                      featuredImage={post.featuredImage}
                      type={post.type}
                      publishedAt={post.publishedAt}
                      category={post.category}
                      author={post.author}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <Pagination
                basePath={`/tag/${slug}`}
                currentPage={data.currentPage}
                totalPages={data.totalPages}
              />
            </>
          )}

          <div className="pt-4">
            <Link
              href="/"
              className="text-xs font-bold text-primary hover:text-red-400 transition-premium uppercase tracking-wider"
            >
              ← Povratak na naslovnicu
            </Link>
          </div>
        </div>

        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1">
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
