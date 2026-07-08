import React from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, Clock, ArrowRight } from "lucide-react";
import TypeBadge from "@/components/ui/TypeBadge";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { PostTypeKey } from "@/lib/constants";

interface Author {
  name: string;
}

interface Category {
  name: string;
  slug?: string;
}

interface HeroArticleProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: string | null;
  type: PostTypeKey;
  publishedAt?: Date | string | null;
  category?: Category | null;
  author: Author;
  featured?: boolean;
}

export const HeroArticle: React.FC<HeroArticleProps> = ({
  title,
  slug,
  excerpt,
  content,
  featuredImage,
  type,
  publishedAt,
  category,
  author,
  featured = true,
}) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("hr-HR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const wordCount = content ? content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="relative overflow-hidden rounded-none bg-black text-white min-h-[520px] sm:min-h-[540px] flex items-end group border-2 border-white/10 hover:border-primary transition-premium shadow-[var(--shadow-brutalist)]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={
            featuredImage ||
            "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&h=675&q=80"
          }
          alt={title}
          fill
          preload={true}
          loading="eager"
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover opacity-70 animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-transparent to-transparent opacity-90" />
      </div>

      <div className="relative z-10 p-8 sm:p-12 max-w-4xl space-y-5 w-full">
        <div className="flex flex-wrap gap-2.5 items-center">
          {featured && (
            <span className="badge-type badge-featured text-[10px] px-3 py-1">Izdvojeno</span>
          )}
          <TypeBadge type={type} variant="hero" className="text-[10px] px-3 py-1" />
          {category && category.slug && (
            <CategoryBadge
              name={category.name}
              slug={category.slug}
              className="text-[10px] px-3 py-1"
            />
          )}
          {category && !category.slug && (
            <span className="rounded-none bg-white/5 border-2 border-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/90">
              {category.name}
            </span>
          )}
          {wordCount > 0 && (
            <span className="flex items-center gap-1 rounded-none bg-white/5 border-2 border-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/70">
              <Clock size={10} className="text-slate-400" aria-hidden="true" />
              {readingTime} min čitanja
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter uppercase leading-[0.95] font-display">
          <Link href={`/clanak/${slug}`} className="hover:text-primary transition-premium">
            {title}
          </Link>
        </h1>

        {excerpt && (
          <p className="text-sm sm:text-base text-slate-300 font-semibold max-w-3xl line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t-2 border-white/10 pt-5">
          <div className="flex items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-400">
            <span className="flex items-center gap-2 font-black text-white/90">
              <span className="w-5 h-5 rounded-none bg-primary/20 border-2 border-primary flex items-center justify-center">
                <User size={12} className="text-primary" aria-hidden="true" />
              </span>
              {author.name}
            </span>
            <span className="hidden sm:inline opacity-30" aria-hidden="true">
              •
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <Calendar size={13} className="text-slate-500" aria-hidden="true" />
              <time dateTime={publishedAt ? new Date(publishedAt).toISOString() : undefined}>
                {formattedDate}
              </time>
            </span>
          </div>

          <Link
            href={`/clanak/${slug}`}
            className="ml-auto inline-flex items-center gap-2 rounded-none bg-primary hover:bg-primary/90 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white border-2 border-primary shadow-[var(--shadow-brutalist)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#ffffff] transition-premium cursor-pointer"
          >
            Pročitaj više
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default HeroArticle;
