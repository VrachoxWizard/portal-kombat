import React from "react";
import { SkeletonHero, SkeletonCard } from "@/components/ui/SkeletonCard";

export default function Loading() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12"
      aria-busy="true"
      aria-live="polite"
      aria-label="Učitavanje sadržaja"
    >
      <div className="w-full" aria-hidden="true">
        <SkeletonHero />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8" aria-hidden="true">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="h-8 w-48 rounded bg-white/5 skeleton-shimmer" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 h-[260px] rounded-[var(--radius-card)] surface-card skeleton-shimmer" />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8" aria-hidden="true">
          <div className="h-12 w-full rounded-[var(--radius-card)] surface-card skeleton-shimmer" />
          <div className="h-80 w-full rounded-[var(--radius-card)] surface-card skeleton-shimmer" />
          <div className="h-64 w-full rounded-[var(--radius-card)] surface-card skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
