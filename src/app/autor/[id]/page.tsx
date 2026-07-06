import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMockPosts, MOCK_AUTHORS } from "@/lib/mockData";
import { parsePageParam } from "@/lib/posts";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { PAGE_SIZE } from "@/lib/constants";
import type { ListingPost } from "@/lib/post-types";
import { User, BookOpen } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

interface AuthorData {
  id: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
}

async function getAuthorData(id: string): Promise<AuthorData | null> {
  try {
    const author = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, bio: true, avatarUrl: true },
    });

    if (author) return author;

    // Fall back to mock authors
    const mockMatch = Object.values(MOCK_AUTHORS).find((a) => a.id === id);
    if (mockMatch) return mockMatch;

    return null;
  } catch (error) {
    console.warn("DB not accessible. Using fallback for author:", id, error);
    const mockMatch = Object.values(MOCK_AUTHORS).find((a) => a.id === id);
    if (mockMatch) return mockMatch;
    return null;
  }
}

async function getAuthorPosts(
  authorId: string,
  page: number
): Promise<{ items: ListingPost[]; total: number; totalPages: number }> {
  try {
    const isMock = authorId.startsWith("author-");

    if (!isMock) {
      const [total, posts] = await Promise.all([
        prisma.post.count({
          where: { authorId, status: "PUBLISHED" },
        }),
        prisma.post.findMany({
          where: { authorId, status: "PUBLISHED" },
          include: { author: true, category: true },
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
        }),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

      if (total > 0) {
        return {
          items: posts as ListingPost[],
          total,
          totalPages,
        };
      }
    }

    // Fall back to mock data
    const mockPosts = getMockPosts().filter((p) => p.authorId === authorId) as ListingPost[];
    const total = mockPosts.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const resolvedPage = Math.min(Math.max(1, page), totalPages);
    const start = (resolvedPage - 1) * PAGE_SIZE;

    return {
      items: mockPosts.slice(start, start + PAGE_SIZE),
      total,
      totalPages,
    };
  } catch (error) {
    console.warn("DB not accessible. Fallback posts for author:", authorId, error);
    const mockPosts = getMockPosts().filter((p) => p.authorId === authorId) as ListingPost[];
    const total = mockPosts.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const start = (currentPage: number) => (currentPage - 1) * PAGE_SIZE;

    return {
      items: mockPosts.slice(start(page), start(page) + PAGE_SIZE),
      total,
      totalPages,
    };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const author = await getAuthorData(id);

  if (!author) {
    return {
      title: "Autor nije pronađen",
    };
  }

  return {
    title: `Autor: ${author.name} | CombatPortal HR`,
    description: author.bio || `Pregled svih članaka koje je napisao ${author.name}.`,
  };
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = parsePageParam(page);

  const author = await getAuthorData(id);

  if (!author) {
    notFound();
  }

  const { items, total, totalPages } = await getAuthorPosts(id, currentPage);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Breadcrumbs items={[{ label: `Autor: ${author.name}` }]} />

          <ScrollAnimationWrapper>
            <div className="surface-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative w-20 h-20 rounded-full border-2 border-primary/20 overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center">
                {author.avatarUrl ? (
                  <Image
                    src={author.avatarUrl}
                    alt={author.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <User size={36} className="text-slate-500" />
                )}
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-2xl font-extrabold text-white font-display uppercase tracking-tight">
                  {author.name}
                </h1>
                <p className="text-xs uppercase tracking-widest text-primary font-bold">Autorski profil</p>
                {author.bio && (
                  <p className="text-slate-300 text-sm leading-relaxed italic max-w-xl">
                    &ldquo;{author.bio}&rdquo;
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium justify-center sm:justify-start pt-1">
                  <BookOpen size={12} className="text-slate-500" />
                  <span>Ukupno objavljeno: {total} {total === 1 ? "članak" : "članaka"}</span>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>

          <div className="space-y-6">
            <ScrollAnimationWrapper>
              <h2 className="font-display font-extrabold italic text-lg text-white uppercase tracking-tight border-l-4 border-primary pl-3">
                Objavljeni Članci Autora
              </h2>
            </ScrollAnimationWrapper>

            {items.length === 0 ? (
              <EmptyState message="Nema objavljenih članaka ovog autora." basePath="/" />
            ) : (
              <>
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {items.map((post) => (
                    <StaggerItem key={post.id}>
                      <ArticleCard
                        title={post.title}
                        slug={post.slug}
                        excerpt={post.excerpt}
                        featuredImage={post.featuredImage}
                        type={post.type}
                        publishedAt={post.publishedAt}
                        category={post.category}
                        author={author}
                      />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                <Pagination
                  basePath={`/autor/${id}`}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </>
            )}
          </div>
        </div>

        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1">
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
