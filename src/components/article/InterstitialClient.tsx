"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Play, Pause, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { springSnappy } from "@/lib/motion";
import type { ListingPost } from "@/lib/post-types";
import ArticleCard from "@/components/article/ArticleCard";

interface InterstitialClientProps {
  url: string;
  title: string;
  excerpt: string;
  image: string;
  source: string;
  date: string;
  relatedArticles: ListingPost[];
}

const sourceColors: Record<string, string> = {
  "MMA Junkie": "bg-blue-600/90 text-white border border-blue-500/30",
  "Boxing News 24": "bg-amber-600/90 text-white border border-amber-500/30",
};

export const InterstitialClient: React.FC<InterstitialClientProps> = ({
  url,
  title,
  excerpt,
  image,
  source,
  date,
  relatedArticles,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Decoded values for safety
  const decodedTitle = title ? decodeURIComponent(title) : "Vanjska vijest";
  const decodedExcerpt = excerpt ? decodeURIComponent(excerpt) : "";
  const decodedImage = image ? decodeURIComponent(image) : "";
  const decodedSource = source ? decodeURIComponent(source) : "Vanjski izvor";
  const decodedUrl = url ? decodeURIComponent(url) : "";

  const formattedDate = date
    ? new Date(decodeURIComponent(date)).toLocaleDateString("hr-HR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    if (!decodedUrl) return;

    if (countdown <= 0) {
      // Use replace so it doesn't pollute history when going back
      window.location.replace(decodedUrl);
      return;
    }

    if (!isPaused) {
      timerRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [countdown, isPaused, decodedUrl]);

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev);
  };

  const handleProceedImmediately = () => {
    window.location.replace(decodedUrl);
  };

  // SVG parameters for circular countdown
  const radius = 24;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  // Progress from 0 (done) to 1 (full time remaining)
  const progress = countdown / 5;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/novosti"
          className="inline-flex items-center gap-2 rounded-none border-2 border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:border-primary hover:text-primary active:scale-[0.97] transition-premium shadow-[var(--shadow-card)]"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Natrag na Novosti
        </Link>
      </div>

      {/* Main Bridge Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSnappy}
        className="relative overflow-hidden surface-card border border-white/5 shadow-2xl p-6 sm:p-10 mb-12"
      >
        {/* Top visual accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-rose-500 to-red-600" />

        {/* Dynamic ambient backdrop glow inside the card */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Left Column: Image preview */}
          {decodedImage && (
            <div className="relative aspect-[16/10] w-full md:w-[350px] overflow-hidden rounded-[var(--radius-card)] bg-slate-900 border border-white/5 shrink-0 group">
              <Image
                src={decodedImage}
                alt={decodedTitle}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 350px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute left-3 top-3">
                <span
                  className={`rounded px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest ${
                    sourceColors[decodedSource] || "bg-primary text-white"
                  }`}
                >
                  {decodedSource}
                </span>
              </div>
            </div>
          )}

          {/* Right Column: Information & Controls */}
          <div className="flex-1 space-y-5 w-full">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
                <AlertTriangle size={14} className="animate-pulse" aria-hidden="true" />
                <span>Napuštate CombatPortal HR</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground leading-tight font-display italic uppercase">
                {decodedTitle}
              </h1>
              {formattedDate && (
                <p className="text-xs text-slate-500 font-medium">
                  Objavljeno: <time dateTime={new Date(decodeURIComponent(date)).toISOString()}>{formattedDate}</time>
                </p>
              )}
            </div>

            {decodedExcerpt && (
              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl line-clamp-3">
                {decodedExcerpt}
              </p>
            )}

            <div className="border-t border-white/5 pt-5 space-y-4">
              {/* Countdown Indicator */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 border-2 border-white/10 rounded-none p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3">
                  {/* Circular timer indicator */}
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="28"
                        cy="28"
                        r={radius}
                        className="stroke-white/10"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                      />
                      {/* Active countdown circle */}
                      <circle
                        cx="28"
                        cy="28"
                        r={radius}
                        className="stroke-primary"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{
                          transition: "stroke-dashoffset 1s linear",
                        }}
                      />
                    </svg>
                    {/* Countdown text */}
                    <span className="absolute text-sm font-extrabold font-display text-white">
                      {countdown}s
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                      Automatsko otvaranje
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {isPaused ? "Preusmjeravanje je pauzirano" : `Preusmjeravanje na ${decodedSource}...`}
                    </p>
                  </div>
                </div>

                {/* Pause/Resume button */}
                <button
                  onClick={handlePauseToggle}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none border-2 border-white/10 bg-white/5 hover:border-primary hover:text-primary hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--primary)] active:scale-[0.97] active:translate-x-0 active:translate-y-0 active:shadow-none px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-premium cursor-pointer"
                  aria-label={isPaused ? "Pokreni odbrojavanje" : "Pauziraj odbrojavanje"}
                >
                  {isPaused ? (
                    <>
                      <Play size={12} fill="currentColor" aria-hidden="true" />
                      Nastavi odbrojavanje
                    </>
                  ) : (
                    <>
                      <Pause size={12} fill="currentColor" aria-hidden="true" />
                      Pauziraj
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleProceedImmediately}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-none bg-primary text-white border-2 border-primary hover:bg-primary/95 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#ffffff] active:scale-[0.97] active:translate-x-0 active:translate-y-0 active:shadow-none px-5 py-3.5 text-xs font-black uppercase tracking-widest transition-premium shadow-[var(--shadow-brutalist)] cursor-pointer"
                >
                  Nastavi na {decodedSource}
                  <ExternalLink size={14} aria-hidden="true" />
                </button>

                <Link
                  href="/novosti"
                  className="inline-flex items-center justify-center gap-2 rounded-none bg-white/5 border-2 border-white/10 text-slate-300 hover:border-primary hover:text-primary hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--primary)] active:scale-[0.97] active:translate-x-0 active:translate-y-0 active:shadow-none px-5 py-3.5 text-xs font-black uppercase tracking-widest transition-premium shadow-[var(--shadow-brutalist)] cursor-pointer"
                >
                  Ostani na Portalu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Related Portal Articles */}
      {relatedArticles.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <h2 className="text-lg font-extrabold uppercase tracking-wider text-white font-display">
              Preporučujemo s našeg portala
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((article) => (
              <div key={article.id} className="h-full">
                <ArticleCard
                  title={article.title}
                  slug={article.slug}
                  excerpt={article.excerpt}
                  featuredImage={article.featuredImage}
                  type={article.type}
                  publishedAt={article.publishedAt}
                  category={article.category}
                  author={article.author}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterstitialClient;
