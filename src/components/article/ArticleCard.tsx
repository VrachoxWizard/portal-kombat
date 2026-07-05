"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";

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
  type: "NEWS" | "BLOG" | "PREDICTION";
  publishedAt?: Date | string | null;
  category?: Category | null;
  author: Author;
  variant?: "vertical" | "horizontal";
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
}) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("hr-HR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const typeLabels = {
    NEWS: "Vijest",
    BLOG: "Blog",
    PREDICTION: "Predikcija",
  };

  const typeColor = {
    NEWS: "bg-gradient-to-r from-red-600 to-rose-700 text-white border border-red-500/30",
    BLOG: "bg-gradient-to-r from-amber-500 to-orange-600 text-white border border-amber-500/30",
    PREDICTION: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border border-emerald-500/30",
  };

  const isHorizontal = variant === "horizontal";

  return (
    <motion.article 
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group flex overflow-hidden rounded-xl border border-white/5 bg-[#0c0f1c]/45 backdrop-blur-md hover-glow hover:shadow-md h-full ${
        isHorizontal ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      {/* Featured Image Container */}
      <div className={`relative overflow-hidden bg-slate-950 ${
        isHorizontal ? "aspect-video sm:aspect-auto w-full sm:w-[45%] min-h-[200px] sm:min-h-full" : "aspect-video w-full"
      }`}>
        <Image
          src={featuredImage || "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&h=450&q=80"}
          alt={title}
          fill
          sizes={isHorizontal ? "(max-width: 768px) 100vw, 500px" : "(max-width: 768px) 100vw, 400px"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        <div className="absolute left-4 top-4 flex gap-2 z-10">
          <span className={`rounded-md px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${typeColor[type]}`}>
            {typeLabels[type]}
          </span>
          {category && (
            <span className="flex items-center gap-1 rounded-md bg-black/60 border border-white/10 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/90">
              <Tag size={9} className="text-primary" />
              {category.name}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 justify-between">
        <div className="flex-1">
          <h3 className={`font-display font-black italic tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary leading-snug uppercase ${
            isHorizontal ? "text-xl sm:text-2xl mb-3" : "text-lg mb-2"
          }`}>
            <Link href={`/clanak/${slug}`}>
              {title}
            </Link>
          </h3>
          {excerpt && (
            <p className={`text-slate-400 leading-relaxed ${
              isHorizontal ? "text-sm sm:text-base line-clamp-4 mb-4" : "text-xs sm:text-sm line-clamp-3 mb-2"
            }`}>
              {excerpt}
            </p>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                width={22}
                height={22}
                className="rounded-full object-cover border border-white/10 shadow-sm"
              />
            ) : (
              <div className="h-[22px] w-[22px] rounded-full bg-primary/20 border border-primary/45 flex items-center justify-center text-[10px] text-primary font-black">
                {author.name.charAt(0)}
              </div>
            )}
            <span className="font-bold text-white/90">{author.name}</span>
          </div>
          <span className="flex items-center gap-1 font-medium text-slate-500">
            <Calendar size={12} />
            {formattedDate}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default ArticleCard;
