import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import TypeBadge from "@/components/ui/TypeBadge";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { PostTypeKey } from "@/lib/constants";

interface Author {
  name: string;
  avatarUrl?: string | null;
}

interface Category {
  name: string;
  slug: string;
}

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  type: PostTypeKey;
  publishedAt?: Date | string | null;
  category?: Category | null;
  author: Author;
  variant?: "vertical" | "horizontal";
  predictionTeaser?: {
    fighterA: string;
    fighterB: string;
    winner: string;
    method?: string;
    confidenceScore?: number;
    isCorrect?: boolean | null;
  } | null;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  slug,
  excerpt,
  featuredImage,
  type,
  publishedAt,
  category,
  author,
  variant = "vertical",
  predictionTeaser,
}) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("hr-HR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const isHorizontal = variant === "horizontal";

  return (
    <article
      className={`group flex overflow-hidden surface-card hover-glow h-full cursor-pointer ${
        isHorizontal ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-slate-950 shrink-0 ${
          isHorizontal
            ? "aspect-video sm:aspect-[16/10] w-full sm:w-[45%] sm:min-h-[220px]"
            : "aspect-video w-full"
        }`}
      >
        <Link href={`/clanak/${slug}`} className="block absolute inset-0 z-0" tabIndex={-1} aria-hidden="true">
          <Image
            src={
              featuredImage ||
              "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&h=450&q=80"
            }
            alt=""
            fill
            sizes={isHorizontal ? "(max-width: 768px) 100vw, 500px" : "(max-width: 768px) 100vw, 400px"}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] group-hover:opacity-90"
            loading="lazy"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2 z-10 pointer-events-none">
          <TypeBadge type={type} />
        </div>
        {category && (
          <div className="absolute left-4 top-12 z-20">
            <CategoryBadge name={category.name} slug={category.slug} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 justify-between">
        <div className="flex-1">
          <h3
            className={`font-display font-extrabold italic tracking-tight text-foreground transition-premium group-hover:text-primary leading-snug uppercase ${
              isHorizontal ? "text-xl sm:text-2xl mb-3" : "text-lg mb-2"
            }`}
          >
            <Link href={`/clanak/${slug}`}>{title}</Link>
          </h3>

          {predictionTeaser && (
            <div className="mb-3 rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              <span className="text-white/70">{predictionTeaser.fighterA}</span>
              <span className="mx-2 text-red-400">VS</span>
              <span className="text-white/70">{predictionTeaser.fighterB}</span>
              <span className="block mt-1 text-emerald-400 normal-case tracking-normal text-xs">
                Prognoza: {predictionTeaser.winner}
                {predictionTeaser.method ? ` (${predictionTeaser.method})` : ""}
                {predictionTeaser.confidenceScore != null
                  ? ` · ${predictionTeaser.confidenceScore}%`
                  : ""}
              </span>
              {predictionTeaser.isCorrect != null && (
                <span
                  className={`block mt-0.5 text-xs normal-case ${
                    predictionTeaser.isCorrect ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {predictionTeaser.isCorrect ? "✓ Točno" : "✗ Netočno"}
                </span>
              )}
            </div>
          )}

          {excerpt && (
            <p
              className={`text-slate-400 leading-relaxed ${
                isHorizontal
                  ? "text-sm sm:text-base line-clamp-4 mb-4"
                  : "text-xs sm:text-sm line-clamp-3 mb-2"
              }`}
            >
              {excerpt}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt=""
                width={22}
                height={22}
                sizes="22px"
                className="rounded-full object-cover border border-white/10 shadow-sm"
              />
            ) : (
              <div
                className="h-[22px] w-[22px] rounded-full bg-primary/20 border border-primary/45 flex items-center justify-center text-[10px] text-primary font-extrabold"
                aria-hidden="true"
              >
                {author.name.charAt(0)}
              </div>
            )}
            <span className="font-bold text-white/90">{author.name}</span>
          </div>
          <time
            dateTime={publishedAt ? new Date(publishedAt).toISOString() : undefined}
            className="flex items-center gap-1 font-medium text-slate-500"
          >
            <Calendar size={12} aria-hidden="true" />
            {formattedDate}
          </time>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
