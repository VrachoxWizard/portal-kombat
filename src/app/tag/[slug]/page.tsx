import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMockPosts } from "@/lib/mockData";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { paginate, parsePageParam } from "@/lib/pagination";
import type { ListingPost } from "@/lib/post-types";
import { Hash } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getTagData(slug: string): Promise<{ posts: ListingPost[]; tagName: string }> {
  let posts: ListingPost[] = [];
  let tagName = "";

  try {
    const dbTag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { status: "PUBLISHED" },
          include: {
            author: true,
            category: true,
          },
          orderBy: { publishedAt: "desc" },
        },
      },
    });

    if (dbTag) {
      tagName = dbTag.name;
      posts = dbTag.posts as ListingPost[];
    } else {
      const mockPosts = getMockPosts({ tag: slug });
      if (mockPosts.length > 0) {
        const foundTag = mockPosts[0].tags.find((t) => t.slug === slug);
        tagName = foundTag ? foundTag.name : slug.toUpperCase();
        posts = mockPosts as ListingPost[];
      }
    }
  } catch (error) {
    console.warn("DB not accessible. Using fallback for tag:", slug, error);
    const mockPosts = getMockPosts({ tag: slug });
    if (mockPosts.length > 0) {
      const foundTag = mockPosts[0].tags.find((t) => t.slug === slug);
      tagName = foundTag ? foundTag.name : slug.toUpperCase();
      posts = mockPosts as ListingPost[];
    }
  }

  return { posts, tagName };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { tagName } = await getTagData(slug);

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
  const { posts, tagName } = await getTagData(slug);

  if (!tagName) {
    notFound();
  }

  const paginated = paginate(posts, parsePageParam(page));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Breadcrumbs items={[{ label: `Oznaka #${tagName}` }]} />

          <ScrollAnimationWrapper>
            <div className="flex items-center gap-2 border-l-4 border-primary pl-3 py-1 surface-card pr-4 rounded-r-[var(--radius-card)]">
              <Hash size={24} className="text-primary" aria-hidden="true" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground uppercase font-display">
                Oznaka: <span className="text-primary">#{tagName}</span>
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-3 pl-4 font-medium">
              {paginated.total} {paginated.total === 1 ? "objava" : "objava"} s ovom oznakom
            </p>
          </ScrollAnimationWrapper>

          {paginated.items.length === 0 ? (
            <EmptyState message="Nema objavljenih članaka s ovom oznakom." basePath="/" />
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paginated.items.map((post) => (
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
                currentPage={paginated.currentPage}
                totalPages={paginated.totalPages}
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
