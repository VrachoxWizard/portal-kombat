"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Calendar } from "lucide-react";

interface ExternalArticleCardProps {
  title: string;
  link: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  source: string;
}

export const ExternalArticleCard: React.FC<ExternalArticleCardProps> = ({
  title,
  link,
  excerpt,
  featuredImage,
  publishedAt,
  source,
}) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("hr-HR", {
        day: "numeric",
        month: "long",
      })
    : "";

  const sourceColors: Record<string, string> = {
    "MMA Junkie": "bg-blue-600/90 text-white border border-blue-500/30",
    "Boxing News 24": "bg-amber-600/90 text-white border border-amber-500/30",
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0c0f1c]/30 backdrop-blur-sm hover-glow hover:shadow-md h-full"
    >
      <a href={link} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
        {/* Featured Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
          <Image
            src={featuredImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          <div className="absolute left-3 top-3 flex gap-2 z-10">
            <span className={`rounded px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${sourceColors[source] || "bg-primary text-white"}`}>
              {source}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 justify-between">
          <div className="space-y-2">
            <h4 className="text-sm font-black italic tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-2 leading-tight uppercase font-display flex items-start gap-1.5">
              <span className="flex-1">{title}</span>
              <ExternalLink size={12} className="text-slate-500 mt-0.5 group-hover:text-primary transition-colors flex-shrink-0" />
            </h4>
            {excerpt && (
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {excerpt}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-slate-500">
            <span className="font-bold uppercase tracking-wider text-primary">Live feed</span>
            <span className="flex items-center gap-1 font-medium">
              <Calendar size={10} />
              {formattedDate}
            </span>
          </div>
        </div>
      </a>
    </motion.article>
  );
};

export default ExternalArticleCard;
