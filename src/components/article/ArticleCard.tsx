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
      className="bezel-outer hover:translate-y-[-3px] hover:shadow-[var(--shadow-brutalist-hover)] group h-full cursor-pointer transition-premium"
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
              <div className="mb-4 bezel-outer overflow-hidden">
                <div className="bezel-inner grid grid-cols-12 gap-0 relative bg-black/40 text-[10px] uppercase font-mono font-bold tracking-wider">
                  {/* Fighter A (Left, blue tint) */}
                  <div className={`col-span-5 bg-fighter-blue/10 p-2.5 text-left border-r border-white/5 flex flex-col justify-between min-h-[50px] ${predictionTeaser.winner === predictionTeaser.fighterA ? 'ring-1 ring-inset ring-emerald-500/20' : ''}`}>
                    <span className="text-white truncate font-display font-semibold italic text-xs block leading-tight">{predictionTeaser.fighterA}</span>
                    <span className="text-fighter-blue/70 text-[8px] mt-1 block">PLAVI KUT</span>
                  </div>
                  
                  {/* VS Badge */}
                  <div className="col-span-2 flex items-center justify-center font-display font-black text-[10px] text-primary bg-background border-r border-white/5 py-2 shrink-0 italic select-none">
                    VS
                  </div>
                  
                  {/* Fighter B (Right, red tint) */}
                  <div className={`col-span-5 bg-fighter-red/10 p-2.5 text-right flex flex-col justify-between min-h-[50px] ${predictionTeaser.winner === predictionTeaser.fighterB ? 'ring-1 ring-inset ring-emerald-500/20' : ''}`}>
                    <span className="text-white truncate font-display font-semibold italic text-xs block leading-tight">{predictionTeaser.fighterB}</span>
                    <span className="text-fighter-red/70 text-[8px] mt-1 block">CRVENI KUT</span>
                  </div>
                </div>

                {/* Info and confidence bar */}
                <div className="bg-black/60 border-t border-white/5 p-2.5 space-y-2 text-[10px] font-mono">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-slate-400">
                      PROGNOZA: <span className="text-emerald-400 font-bold">{predictionTeaser.winner}</span>
                    </span>
                    {predictionTeaser.method && (
                      <span className="px-1.5 py-0.5 rounded-none border border-white/10 bg-white/5 text-[8px] text-slate-300">
                        {predictionTeaser.method}
                      </span>
                    )}
                  </div>

                  {predictionTeaser.confidenceScore != null && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] text-slate-400 uppercase tracking-wider">
                        <span>Pouzdanost</span>
                        <span className="text-white font-bold">{predictionTeaser.confidenceScore}%</span>
                      </div>
                      <div className="w-full bg-slate-950 border border-white/10 h-1.5 overflow-hidden p-0.5">
                        <div
                          className={`h-full transition-all duration-500 ${
                            predictionTeaser.winner === predictionTeaser.fighterA
                              ? "bg-fighter-blue"
                              : "bg-fighter-red"
                          }`}
                          style={{ width: `${predictionTeaser.confidenceScore}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {predictionTeaser.isCorrect != null && (
                    <div className={`text-[8px] font-black tracking-wider uppercase flex items-center gap-1 mt-1`}>
                      {predictionTeaser.isCorrect ? (
                        <span className="inline-block bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20 text-emerald-400">
                          ✓ TOČNA PROGNOZA
                        </span>
                      ) : (
                        <span className="inline-block bg-red-500/10 px-1.5 py-0.5 border border-red-500/20 text-red-400">
                          ✗ NETOČNA PROGNOZA
                        </span>
                      )}
                    </div>
                  )}
                </div>
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
              className="flex items-center gap-1 font-bold font-mono text-slate-500"
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
