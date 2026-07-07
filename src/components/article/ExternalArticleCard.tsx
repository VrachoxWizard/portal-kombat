import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Calendar } from "lucide-react";

interface ExternalArticleCardProps {
  title: string;
  link: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  source: string;
}

const sourceColors: Record<string, string> = {
  "MMA Junkie": "bg-blue-600/90 text-white border border-blue-500/30",
  "Boxing News 24": "bg-amber-600/90 text-white border border-amber-500/30",
};

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

  const interstitialHref = `/novosti/vanjska?url=${encodeURIComponent(link)}` +
    `&title=${encodeURIComponent(title)}` +
    `&excerpt=${encodeURIComponent(excerpt)}` +
    `&image=${encodeURIComponent(featuredImage)}` +
    `&source=${encodeURIComponent(source)}` +
    `&date=${encodeURIComponent(publishedAt)}`;

  return (
    <article className="group flex flex-col overflow-hidden surface-card hover-glow h-full cursor-pointer">
      <Link
        href={interstitialHref}
        className="flex flex-col h-full"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
          <Image
            src={featuredImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] group-hover:opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 z-10">
            <span
              className={`rounded px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest ${
                sourceColors[source] || "bg-primary text-white"
              }`}
            >
              {source}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 justify-between">
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold italic tracking-tight text-foreground transition-premium group-hover:text-primary line-clamp-2 leading-tight uppercase font-display flex items-start gap-1.5">
              <span className="flex-1">{title}</span>
              <ExternalLink
                size={12}
                className="text-slate-500 mt-0.5 group-hover:text-primary transition-premium shrink-0"
                aria-hidden="true"
              />
            </h4>
            {excerpt && (
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{excerpt}</p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-slate-500">
            <span className="font-bold uppercase tracking-wider text-primary">Vijesti uživo</span>
            <time
              dateTime={publishedAt}
              className="flex items-center gap-1 font-medium"
            >
              <Calendar size={10} aria-hidden="true" />
              {formattedDate}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ExternalArticleCard;
