"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, Clock, ArrowRight } from "lucide-react";
import TypeBadge from "@/components/ui/TypeBadge";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { PostTypeKey } from "@/lib/constants";
import Magnetic from "@/components/ui/Magnetic";

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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <article className="bezel-outer w-screen max-w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[500px] flex flex-col">
      <div className="bezel-inner h-full flex-1 flex flex-col md:grid md:grid-cols-12 border-l-2 border-primary accent-edge-glow overflow-hidden">
        {/* Left text column: spans 7 columns on desktop layout */}
        <div className="md:col-span-7 p-8 sm:p-10 md:p-12 flex flex-col justify-between relative z-10 bg-[#080a12] w-full">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              {featured && (
                <span className="badge-type badge-featured text-[9px] px-2.5 py-0.5 border border-amber-400 bg-amber-400/10 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.35)] font-display uppercase tracking-widest font-black italic">
                  Izdvojeno
                </span>
              )}
              <TypeBadge type={type} variant="hero" className="text-[9px] px-2.5 py-0.5" />
              {category && category.slug && (
                <CategoryBadge
                  name={category.name}
                  slug={category.slug}
                  className="text-[9px] px-2.5 py-0.5 border border-white/10"
                />
              )}
              {category && !category.slug && (
                <span className="rounded-none bg-white/5 border border-white/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/90">
                  {category.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3.5xl lg:text-5xl font-black italic tracking-tighter uppercase leading-[0.95] font-display text-white">
              <Link href={`/clanak/${slug}`} className="hover:text-primary transition-premium">
                {title}
              </Link>
            </h1>

            {excerpt && (
              <p className="text-xs sm:text-sm text-slate-400 font-semibold max-w-2xl leading-relaxed first-letter:font-display first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-primary">
                {excerpt}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t-2 border-white/10 pt-5 mt-6">
            <div className="flex items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <span className="flex items-center gap-2 font-black text-white/90">
                <span className="w-5 h-5 rounded-none bg-primary/20 border border-primary flex items-center justify-center">
                  <User size={10} className="text-primary" aria-hidden="true" />
                </span>
                {author.name}
              </span>
              <span className="hidden sm:inline opacity-30" aria-hidden="true">
                •
              </span>
              <span className="flex items-center gap-1.5 font-bold font-mono text-[11px] text-slate-400">
                <Calendar size={12} className="text-slate-500" aria-hidden="true" />
                <time dateTime={publishedAt ? new Date(publishedAt).toISOString() : undefined}>
                  {formattedDate}
                </time>
              </span>
              {wordCount > 0 && (
                <>
                  <span className="hidden sm:inline opacity-30" aria-hidden="true">
                    •
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                    <Clock size={11} className="text-slate-500" aria-hidden="true" />
                    {readingTime} MIN ČITANJA
                  </span>
                </>
              )}
            </div>

            <div className="ml-auto">
              <Magnetic strength={0.25}>
                <Link
                  href={`/clanak/${slug}`}
                  className="inline-flex items-center gap-2 rounded-none bg-primary hover:bg-primary/90 px-4 py-2 text-xs font-black uppercase tracking-widest text-white border-2 border-primary shadow-[var(--shadow-brutalist)] hover:shadow-[3px_3px_0px_0px_#ffffff] transition-premium cursor-pointer"
                >
                  Pročitaj više
                  <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Right photo column: spans 5 columns on desktop layout */}
        <div className="md:col-span-5 relative min-h-[250px] md:min-h-full overflow-hidden bg-slate-950 w-full">
          <div
            className="absolute inset-0 w-full h-[120%] -top-[10%] transition-transform duration-100 ease-out"
            style={{
              transform: `translateY(${scrollY * 0.08}px)`,
            }}
          >
            <Image
              src={
                featuredImage ||
                "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&h=675&q=80"
              }
              alt={title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 500px"
              className="object-cover opacity-85 group-hover:scale-[1.03] transition-transform duration-[6s] ease-out animate-kenburns"
            />
          </div>
          {/* Asymmetric gradient overlays: fade out to dark background on the left */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a12] via-slate-950/20 to-transparent md:hidden pointer-events-none z-10" />
          <div className="hidden md:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#080a12] to-transparent pointer-events-none z-10" />
        </div>
      </div>
      <div className="h-1 bg-primary w-full" />
    </article>
  );
};

export default HeroArticle;
