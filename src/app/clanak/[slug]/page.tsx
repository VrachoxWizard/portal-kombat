import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicPost } from "@/lib/posts";
import { shouldUseMockData } from "@/lib/env";
import { getMockPosts } from "@/lib/mockData";
import { SITE_URL } from "@/lib/env";
import { cacheLife, cacheTag } from "next/cache";
import PredictionWidget from "@/components/prediction/PredictionWidget";
import CommentsWidget from "@/components/article/CommentsWidget";
import Sidebar from "@/components/layout/Sidebar";
import ShareButtons from "@/components/article/ShareButtons";
import ArticleCard from "@/components/article/ArticleCard";
import ReadingProgressBar from "@/components/ui/ReadingProgressBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import TypeBadge from "@/components/ui/TypeBadge";
import SectionHeading from "@/components/ui/SectionHeading";
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { TYPE_ROUTES, TYPE_SECTION_NAMES, PostTypeKey } from "@/lib/constants";
import type { ListingPost } from "@/lib/post-types";
import { Calendar, User, Clock, Hash } from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { TableOfContents } from "@/components/article/TableOfContents";
import TrustIndicator, { TrustLevel, Citation } from "@/components/article/TrustIndicator";

async function getRelatedArticles(
  slug: string,
  categorySlug: string | undefined,
  categoryId: string | null
) {
  try {
    if (categoryId) {
      const related = (await prisma.post.findMany({
        where: {
          categoryId,
          slug: { not: slug },
          status: "PUBLISHED",
        },
        include: { author: true, category: true },
        orderBy: { publishedAt: "desc" },
        take: 2,
      })) as ListingPost[];

      if (related.length > 0) return related;
    }
  } catch (error) {
    console.warn("Related articles DB error:", error);
  }

  if (shouldUseMockData()) {
    const allMock = getMockPosts({ category: categorySlug });
    return allMock.filter((p) => p.slug !== slug).slice(0, 2) as ListingPost[];
  }
  return [];
}

// Cached helper functions for Next.js 16 Cache Components
async function getCachedPublicPost(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`article-${slug}`);
  return getPublicPost(slug);
}

async function getCachedRelatedArticles(
  slug: string,
  categorySlug: string | undefined,
  categoryId: string | null
) {
  "use cache";
  cacheLife("hours");
  cacheTag(`article-${slug}-related`);
  return getRelatedArticles(slug, categorySlug, categoryId);
}

async function getCachedFightersList() {
  "use cache";
  cacheLife("hours");
  cacheTag("fighters-list");
  try {
    return await prisma.fighter.findMany({
      select: { name: true, slug: true },
    });
  } catch (error) {
    console.warn("Fighters DB fetch error:", error);
    return [];
  }
}

function getJsonLdType(type: string): string {
  switch (type) {
    case "BLOG":
      return "BlogPosting";
    case "PREDICTION":
      return "AnalysisNewsArticle";
    default:
      return "NewsArticle";
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const article = preview
    ? await getPublicPost(slug, { previewToken: preview })
    : await getCachedPublicPost(slug);

  if (!article) {
    return { title: "Članak nije pronađen" };
  }

  const tags =
    "tags" in article && Array.isArray(article.tags)
      ? article.tags.map((t: { name: string }) => t.name)
      : [];

  return {
    title: article.title,
    description: article.excerpt || "Borilačke vijesti i analize",
    keywords: tags.length > 0 ? tags : undefined,
    alternates: { canonical: `/clanak/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt || "Borilačke vijesti i analize",
      type: "article",
      publishedTime: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : undefined,
      modifiedTime: article.updatedAt
        ? new Date(article.updatedAt).toISOString()
        : undefined,
      section: article.category?.name,
      authors: [article.author.name],
      images: article.featuredImage
        ? [article.featuredImage]
        : [`${SITE_URL}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || "Borilačke vijesti i analize",
      images: article.featuredImage
        ? [article.featuredImage]
        : [`${SITE_URL}/opengraph-image`],
    },
    ...(preview ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const article = preview
    ? await getPublicPost(slug, { previewToken: preview })
    : await getCachedPublicPost(slug);

  if (!article) {
    notFound();
  }

  const isPreview = article.status !== "PUBLISHED";

  const relatedArticles = preview
    ? await getRelatedArticles(slug, article.category?.slug, article.categoryId)
    : await getCachedRelatedArticles(slug, article.category?.slug, article.categoryId);

  let fighters: { name: string; slug: string }[] = [];
  if (preview) {
    try {
      fighters = await prisma.fighter.findMany({
        select: { name: true, slug: true },
      });
    } catch (error) {
      console.warn("Fighters DB fetch error:", error);
    }
  } else {
    fighters = await getCachedFightersList();
  }

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("hr-HR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const wordCount = article.content ? article.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const postType = article.type as PostTypeKey;
  const sectionRoute = TYPE_ROUTES[postType];
  const sectionName = TYPE_SECTION_NAMES[postType];
  const tags = "tags" in article && Array.isArray(article.tags) ? article.tags : [];

  const breadcrumbItems = [
    { label: sectionName, href: sectionRoute },
    ...(article.category
      ? [{ label: article.category.name, href: `${sectionRoute}?category=${article.category.slug}` }]
      : []),
    { label: article.title },
  ];

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": getJsonLdType(article.type),
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage ? [article.featuredImage] : [`${SITE_URL}/opengraph-image`],
    datePublished: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : new Date().toISOString(),
    dateModified: article.updatedAt
      ? new Date(article.updatedAt).toISOString()
      : undefined,
    url: `${SITE_URL}/clanak/${slug}`,
    mainEntityOfPage: `${SITE_URL}/clanak/${slug}`,
    author: [{ "@type": "Person", name: article.author.name }],
    publisher: {
      "@type": "Organization",
      name: "CombatPortal HR",
      url: SITE_URL,
    },
  };

  if (article.type === "PREDICTION" && article.prediction) {
    jsonLd.about = {
      "@type": "SportsEvent",
      name: `${article.prediction.fighterA} vs ${article.prediction.fighterB}`,
      competitor: [
        { "@type": "Person", name: article.prediction.fighterA },
        { "@type": "Person", name: article.prediction.fighterB },
      ],
    };
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {isPreview && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200 font-semibold">
          Pregled nacrta — ovaj članak nije javno objavljen.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 space-y-6">
          <Breadcrumbs items={breadcrumbItems} />

          <ScrollAnimationWrapper>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground uppercase">
              <TypeBadge type={postType} />
              {article.category && (
                <>
                  <span className="opacity-30" aria-hidden="true">•</span>
                  <Link
                    href={`${sectionRoute}?category=${article.category.slug}`}
                    className="text-primary font-extrabold hover:text-red-400 transition-premium"
                  >
                    {article.category.name}
                  </Link>
                </>
              )}
              <span className="opacity-30" aria-hidden="true">•</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} aria-hidden="true" />
                <time dateTime={article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined}>
                  {formattedDate}
                </time>
              </span>
              <span className="opacity-30" aria-hidden="true">•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Clock size={12} aria-hidden="true" />
                {readingTime} min čitanja
              </span>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper delay={0.05}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight font-display">
              {article.title}
            </h1>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper delay={0.1}>
            <div className="flex items-center gap-4 border-y-2 border-white/10 py-4">
              {article.author.avatarUrl ? (
                <Image
                   src={article.author.avatarUrl}
                   alt={article.author.name}
                   width={40}
                   height={40}
                   sizes="40px"
                   className="rounded-none object-cover border-2 border-white/20 shadow-sm"
                />
              ) : (
                <div
                   className="h-10 w-10 rounded-none bg-primary/20 border-2 border-primary flex items-center justify-center text-white font-black"
                   aria-hidden="true"
                >
                  {article.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
                  <User size={14} className="text-primary" aria-hidden="true" />
                  <Link href={`/autor/${article.author.id}`} className="hover:text-primary transition-premium">
                    {article.author.name}
                  </Link>
                </p>
                {article.author.bio && (
                  <p className="text-xs text-slate-400 font-bold mt-0.5">{article.author.bio}</p>
                )}
              </div>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper delay={0.12}>
            <TrustIndicator
              trustLevel={(article.trustLevel as TrustLevel) || "REPORT"}
              citations={article.citations as string | Citation[] | null}
            />
          </ScrollAnimationWrapper>

          {article.featuredImage && (
            <ScrollAnimationWrapper delay={0.15}>
              <div className="relative aspect-video w-full overflow-hidden rounded-none bg-slate-900 shadow-[var(--shadow-brutalist)] border-2 border-white/10">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  preload={true}
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            </ScrollAnimationWrapper>
          )}

          <ShareButtons title={article.title} />

          <ScrollAnimationWrapper delay={0.1}>
            <MarkdownRenderer content={article.content} fighters={fighters} />
          </ScrollAnimationWrapper>

          {tags.length > 0 && (
            <ScrollAnimationWrapper>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Hash size={14} className="text-primary" aria-hidden="true" />
                {tags.map((tag: { slug: string; name: string }) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="rounded-none px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-white/5 border-2 border-white/10 text-slate-300 hover:border-primary hover:text-primary transition-premium"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </ScrollAnimationWrapper>
          )}

          {article.type === "PREDICTION" && article.prediction && (
            <ScrollAnimationWrapper>
              <PredictionWidget
                fighterA={article.prediction.fighterA}
                fighterB={article.prediction.fighterB}
                winner={article.prediction.winner}
                method={article.prediction.method}
                predictedRound={article.prediction.predictedRound}
                confidenceScore={article.prediction.confidenceScore}
                keyReasoning={article.prediction.keyReasoning}
                actualWinner={article.prediction.actualWinner}
                actualMethod={article.prediction.actualMethod}
                actualRound={article.prediction.actualRound}
                isCorrect={article.prediction.isCorrect}
                resolvedAt={article.prediction.resolvedAt}
              />
            </ScrollAnimationWrapper>
          )}

          <ScrollAnimationWrapper>
            <CommentsWidget postId={article.id} />
          </ScrollAnimationWrapper>

          {relatedArticles.length > 0 && (
            <div className="border-t-2 border-white/10 pt-8 mt-12 space-y-6">
              <SectionHeading title="Povezani članci" as="h2" />
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedArticles.map((item) => (
                  <StaggerItem key={item.id}>
                    <ArticleCard
                      title={item.title}
                      slug={item.slug}
                      excerpt={item.excerpt}
                      featuredImage={item.featuredImage}
                      type={item.type}
                      publishedAt={item.publishedAt}
                      category={item.category}
                      author={item.author}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}
        </article>

        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1 space-y-8">
          <TableOfContents />
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}
