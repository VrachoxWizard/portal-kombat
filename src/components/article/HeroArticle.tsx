import React from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, Tag, ArrowRight, Clock } from "lucide-react";

interface Author {
  name: string;
}

interface Category {
  name: string;
}

interface HeroArticleProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: string | null;
  type: "NEWS" | "BLOG" | "PREDICTION";
  publishedAt?: Date | string | null;
  category?: Category | null;
  author: Author;
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
}) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("hr-HR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Estimated reading time
  const wordCount = content ? content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const typeLabels = {
    NEWS: "Vijest dana",
    BLOG: "Izdvojeni Blog",
    PREDICTION: "Prognoza meča",
  };

  const typeColor = {
    NEWS: "bg-gradient-to-r from-red-600 to-rose-700 text-white border border-red-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]",
    BLOG: "bg-gradient-to-r from-amber-500 to-orange-600 text-white border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    PREDICTION: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black text-white min-h-[540px] flex items-end group border border-white/5 hover:border-red-500/20 shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(244,63,94,0.06)]">
      {/* Background Image with Ken Burns animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={featuredImage || "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&h=600&q=80"}
          alt={title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover opacity-65 animate-kenburns"
        />
        {/* Dual tone cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-radial-at-bl from-red-950/25 via-transparent to-transparent opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 sm:p-12 max-w-4xl space-y-5 w-full">
        <div className="flex flex-wrap gap-2.5">
          <span className={`rounded-md px-3.5 py-1 text-[10px] font-black tracking-widest uppercase ${typeColor[type]}`}>
            {typeLabels[type]}
          </span>
          {category && (
            <span className="flex items-center gap-1 rounded-md bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/90">
              <Tag size={10} className="text-primary" />
              {category.name}
            </span>
          )}
          {wordCount > 0 && (
            <span className="flex items-center gap-1 rounded-md bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/70">
              <Clock size={10} className="text-slate-400" />
              {readingTime} min čitanja
            </span>
          )}
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter uppercase leading-none font-display">
          <Link href={`/clanak/${slug}`} className="hover:text-primary transition-colors duration-300">
            {title}
          </Link>
        </h2>

        {excerpt && (
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-3xl line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-5">
          <div className="flex items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-400">
            <span className="flex items-center gap-2 font-bold text-white/90">
              <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/45 flex items-center justify-center">
                <User size={12} className="text-primary" />
              </div>
              {author.name}
            </span>
            <span className="hidden sm:inline opacity-30">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar size={13} className="text-slate-500" />
              {formattedDate}
            </span>
          </div>

          <Link
            href={`/clanak/${slug}`}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-primary/90 hover:bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white border border-red-400/30 shadow-[0_0_20px_rgba(244,63,94,0.25)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Pročitaj više
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default HeroArticle;

