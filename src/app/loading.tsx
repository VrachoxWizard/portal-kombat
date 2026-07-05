import React from "react";
import { SkeletonHero, SkeletonCard } from "@/components/ui/SkeletonCard";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero skeleton */}
      <div className="w-full">
        <SkeletonHero />
      </div>

      {/* Main Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Articles list skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header skeleton */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="h-8 w-48 rounded bg-white/5 skeleton-shimmer" />
          </div>

          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 h-[260px] rounded-xl border border-white/5 bg-[#0c0f1c]/45 backdrop-blur-md skeleton-shimmer" />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="lg:col-span-1 space-y-8">
          <div className="h-12 w-full rounded-xl border border-white/5 bg-[#0c0f1c]/45 skeleton-shimmer" />
          <div className="h-80 w-full rounded-xl border border-white/5 bg-[#0c0f1c]/45 skeleton-shimmer" />
          <div className="h-64 w-full rounded-xl border border-white/5 bg-[#0c0f1c]/45 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
