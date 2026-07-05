import React from "react";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function ListingLoading() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-live="polite"
      aria-label="Učitavanje objava"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6" aria-hidden="true">
          <div className="h-10 w-64 rounded bg-white/5 skeleton-shimmer" />
          <div className="h-8 w-full rounded bg-white/5 skeleton-shimmer" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 h-[260px] rounded-[var(--radius-card)] surface-card skeleton-shimmer" />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6" aria-hidden="true">
          <div className="h-28 w-full rounded-[var(--radius-card)] surface-card skeleton-shimmer" />
          <div className="h-64 w-full rounded-[var(--radius-card)] surface-card skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
