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
      className="bezel-outer hover:translate-y-[-3px] hover:shadow-[var(--shadow-brutalist-hover)] hover:shadow-brutalist-hover group h-full cursor-pointer transition-premium"
    >
      <div
        className={`bezel-inner h-full border-l-2 border-transparent group-hover:border-primary group-hover:shadow-[inset_3px_0_8px_var(--primary-glow)] transition-premium flex overflow-hidden ${
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />
          <div className="absolute left-3.5 top-3.5 flex flex-wrap gap-1.5 z-20">
            <TypeBadge type={type} />
            {category && (
              <CategoryBadge name={category.name} slug={category.slug} />
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 justify-between">
          <div className="flex-1">
            <h3
              className={`font-display font-black italic tracking-tight text-white transition-premium group-hover:text-primary leading-snug uppercase ${
                isHorizontal ? "text-xl sm:text-2xl mb-3" : "text-lg mb-2"
              }`}
            >
              <Link href={`/clanak/${slug}`}>{title}</Link>
            </h3>

            {predictionTeaser && (
              <div className="mb-3 rounded-none border-2 border-emerald-500/35 bg-emerald-950/45 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-300 shadow-[var(--shadow-card)]">
                <span className="text-white">{predictionTeaser.fighterA}</span>
                <span className="mx-2 text-red-500">VS</span>
                <span className="text-white">{predictionTeaser.fighterB}</span>
                <span className="block mt-1 text-emerald-400 normal-case tracking-normal text-xs font-bold">
                  Prognoza: {predictionTeaser.winner}
                  {predictionTeaser.method ? ` (${predictionTeaser.method})` : ""}
                  {predictionTeaser.confidenceScore != null
                    ? ` · ${predictionTeaser.confidenceScore}%`
                    : ""}
                </span>
                {predictionTeaser.isCorrect != null && (
                  <span
                    className={`block mt-0.5 text-xs normal-case font-bold ${
                      predictionTeaser.isCorrect ? "text-emerald-400" : "text-red-500"
                    }`}
                  >
                    {predictionTeaser.isCorrect ? "✓ Točno" : "✗ Netočno"}
                  </span>
                )}
              </div>
            )}

            {excerpt && (
              <p
                className={`text-slate-400 leading-relaxed font-semibold ${
                  isHorizontal
                    ? "text-sm sm:text-base line-clamp-4 mb-4"
                    : "text-xs sm:text-sm line-clamp-3 mb-2"
                }`}
              >
                {excerpt}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t-2 border-white/10 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {author.avatarUrl ? (
                <Image
                  src={author.avatarUrl}
                  alt=""
                  width={22}
                  height={22}
                  sizes="22px"
                  className="rounded-none object-cover border-2 border-white/20 shadow-sm"
                />
              ) : (
                <div
                  className="h-[22px] w-[22px] rounded-none bg-primary/20 border-2 border-primary flex items-center justify-center text-[10px] text-primary font-black"
                  aria-hidden="true"
                >
                  {author.name.charAt(0)}
                </div>
              )}
              <span className="font-black text-white/90">{author.name}</span>
            </div>
            <time
              dateTime={publishedAt ? new Date(publishedAt).toISOString() : undefined}
              className="flex items-center gap-1 font-bold text-slate-500"
            >
              <Calendar size={12} aria-hidden="true" />
              {formattedDate}
            </time>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
