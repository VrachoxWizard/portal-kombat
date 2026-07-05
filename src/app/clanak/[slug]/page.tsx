import React from "react";
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
import { ScrollAnimationWrapper, StaggerContainer, StaggerItem } from "@/components/ui/ScrollAnimationWrapper";
import { Calendar, User, Tag, Clock } from "lucide-react";

async function getArticle(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        prediction: true,
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

async function getRelatedArticles(slug: string, categorySlug: string | undefined, categoryId: string | null) {
  try {
    let related: any[] = [];
    if (categoryId) {
      related = await prisma.post.findMany({
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
      });
    }

    if (related.length === 0) {
      const allMock = getMockPosts({ category: categorySlug });
      return allMock.filter(p => p.slug !== slug).slice(0, 2);
    }
    return related;
  } catch (error) {
    console.warn("DB not accessible. Using fallback for related articles:", error);
    const allMock = getMockPosts({ category: categorySlug });
    return allMock.filter(p => p.slug !== slug).slice(0, 2);
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
      title: "Članak nije pronađen | CombatPortal HR",
    };
  }
  return {
    title: `${article.title} | CombatPortal HR`,
    description: article.excerpt || "Borilačke vijesti i analize",
    openGraph: {
      title: article.title,
      description: article.excerpt || "Borilačke vijesti i analize",
      type: "article",
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

  const relatedArticles = await getRelatedArticles(slug, article.category?.slug, article.categoryId);

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("hr-HR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Estimated reading time
  const wordCount = article.content ? article.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Priprema strukturiranih JSON-LD podataka
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": article.featuredImage ? [article.featuredImage] : [],
    "datePublished": article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString(),
    "author": [{
      "@type": "Person",
      "name": article.author.name,
    }]
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Article Body */}
        <article className="lg:col-span-2 space-y-6">
          {/* Category / Date / Reading Time */}
          <ScrollAnimationWrapper>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground uppercase">
              {article.category && (
                <span className="text-primary font-extrabold flex items-center gap-1">
                  <Tag size={12} />
                  {article.category.name}
                </span>
              )}
              <span className="opacity-30">•</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formattedDate}
              </span>
              <span className="opacity-30">•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Clock size={12} />
                {readingTime} min čitanja
              </span>
            </div>
          </ScrollAnimationWrapper>

          {/* Title */}
          <ScrollAnimationWrapper delay={0.05}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight font-display">
              {article.title}
            </h1>
          </ScrollAnimationWrapper>

          {/* Author */}
          <ScrollAnimationWrapper delay={0.1}>
            <div className="flex items-center gap-3 border-y border-white/5 py-4">
              {article.author.avatarUrl ? (
                <Image
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover border border-white/10 shadow-sm"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/45 flex items-center justify-center text-white font-black">
                  {article.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-black text-foreground flex items-center gap-1.5">
                  <User size={14} className="text-primary" />
                  {article.author.name}
                </p>
                {article.author.bio && (
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{article.author.bio}</p>
                )}
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Featured Image */}
          {article.featuredImage && (
            <ScrollAnimationWrapper delay={0.15}>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 shadow-lg border border-white/5">
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

          {/* Share Buttons */}
          <ShareButtons title={article.title} />

          {/* Content with custom prose styling class */}
          <ScrollAnimationWrapper delay={0.1}>
            <div className="prose-custom text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
          </ScrollAnimationWrapper>

          {/* Prediction Widget */}
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

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-white/5 pt-8 mt-12 space-y-6">
              <h3 className="text-xl font-black italic tracking-tight uppercase border-l-4 border-primary pl-3 flex items-center gap-2 font-display text-white">
                Povezani Članci
              </h3>
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

        {/* Sidebar */}
        <ScrollAnimationWrapper direction="right" delay={0.2} className="lg:col-span-1">
          <Sidebar />
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
}


