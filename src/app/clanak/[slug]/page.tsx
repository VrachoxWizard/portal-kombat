import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMockArticleBySlug, getMockPosts } from "@/lib/mockData";
import PredictionWidget from "@/components/prediction/PredictionWidget";
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

async function getArticle(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        prediction: true,
        tags: true,
      },
    });

    if (!post) {
      return getMockArticleBySlug(slug);
    }

    return post;
  } catch (error) {
    console.warn("DB not accessible. Using fallback for slug: ", slug, error);
    return getMockArticleBySlug(slug);
  }
}

async function getRelatedArticles(
  slug: string,
  categorySlug: string | undefined,
  categoryId: string | null
) {
  try {
    let related: ListingPost[] = [];
    if (categoryId) {
      related = (await prisma.post.findMany({
        where: {
          categoryId,
          slug: { not: slug },
          status: "PUBLISHED",
        },
        include: {
          author: true,
          category: true,
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: 2,
      })) as ListingPost[];
    }

    if (related.length === 0) {
      const allMock = getMockPosts({ category: categorySlug });
      return allMock.filter((p) => p.slug !== slug).slice(0, 2) as ListingPost[];
    }
    return related;
  } catch (error) {
    console.warn("DB not accessible. Using fallback for related articles:", error);
    const allMock = getMockPosts({ category: categorySlug });
    return allMock.filter((p) => p.slug !== slug).slice(0, 2) as ListingPost[];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    return {
      title: "Članak nije pronađen",
    };
  }

  const tags = "tags" in article && Array.isArray(article.tags)
    ? article.tags.map((t: { name: string }) => t.name)
    : [];

  return {
    title: article.title,
    description: article.excerpt || "Borilačke vijesti i analize",
    keywords: tags.length > 0 ? tags : undefined,
    alternates: {
      canonical: `/clanak/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt || "Borilačke vijesti i analize",
      type: "article",
      publishedTime: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : undefined,
      section: article.category?.name,
      authors: [article.author.name],
      images: article.featuredImage ? [article.featuredImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || "Borilačke vijesti i analize",
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(
    slug,
    article.category?.slug,
    article.categoryId
  );

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: article.featuredImage ? [article.featuredImage] : [],
    datePublished: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : new Date().toISOString(),
    author: [
      {
        "@type": "Person",
        name: article.author.name,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 space-y-6">
          <Breadcrumbs items={breadcrumbItems} />

          <ScrollAnimationWrapper>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground uppercase">
              <TypeBadge type={postType} />
              {article.category && (
                <>
                  <span className="opacity-30" aria-hidden="true">
                    •
                  </span>
                  <Link
                    href={`${sectionRoute}?category=${article.category.slug}`}
                    className="text-primary font-extrabold hover:text-red-400 transition-premium"
                  >
                    {article.category.name}
                  </Link>
                </>
              )}
              <span className="opacity-30" aria-hidden="true">
                •
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} aria-hidden="true" />
                <time dateTime={article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined}>
                  {formattedDate}
                </time>
              </span>
              <span className="opacity-30" aria-hidden="true">
                •
              </span>
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
            <div className="flex items-center gap-3 border-y border-white/5 py-4">
              {article.author.avatarUrl ? (
                <Image
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  width={40}
                  height={40}
                  sizes="40px"
                  className="rounded-full object-cover border border-white/10 shadow-sm"
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-full bg-primary/20 border border-primary/45 flex items-center justify-center text-white font-extrabold"
                  aria-hidden="true"
                >
                  {article.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                  <User size={14} className="text-primary" aria-hidden="true" />
                  {article.author.name}
                </p>
                {article.author.bio && (
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{article.author.bio}</p>
                )}
              </div>
            </div>
          </ScrollAnimationWrapper>

          {article.featuredImage && (
            <ScrollAnimationWrapper delay={0.15}>
              <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-card)] bg-slate-900 shadow-[var(--shadow-card)] border border-white/5">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            </ScrollAnimationWrapper>
          )}

          <ShareButtons title={article.title} />

          <ScrollAnimationWrapper delay={0.1}>
            <MarkdownRenderer content={article.content} />
          </ScrollAnimationWrapper>

          {tags.length > 0 && (
            <ScrollAnimationWrapper>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Hash size={14} className="text-primary" aria-hidden="true" />
                {tags.map((tag: { slug: string; name: string }) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-premium"
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
              />
            </ScrollAnimationWrapper>
          )}

          {relatedArticles.length > 0 && (
            <div className="border-t border-white/5 pt-8 mt-12 space-y-6">
              <SectionHeading title="Povezani Članci" as="h2" />
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
