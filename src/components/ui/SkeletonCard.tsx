import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col overflow-hidden surface-card h-full" aria-hidden="true">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950 skeleton-shimmer" />
      <div className="flex flex-1 flex-col p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-white/5 skeleton-shimmer" />
          <div className="h-5 w-1/2 rounded bg-white/5 skeleton-shimmer" />
        </div>
        <div className="space-y-1.5 pt-2">
          <div className="h-3 w-full rounded bg-white/5 skeleton-shimmer" />
          <div className="h-3 w-full rounded bg-white/5 skeleton-shimmer" />
          <div className="h-3 w-2/3 rounded bg-white/5 skeleton-shimmer" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-[22px] w-[22px] rounded-full bg-white/5 skeleton-shimmer" />
            <div className="h-3.5 w-16 rounded bg-white/5 skeleton-shimmer" />
          </div>
          <div className="h-3.5 w-20 rounded bg-white/5 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonHero: React.FC = () => {
  return (
    <div
      className="relative overflow-hidden rounded-[var(--radius-hero)] surface-card min-h-[540px] flex items-end p-8 sm:p-12 w-full"
      aria-hidden="true"
    >
      <div className="absolute inset-0 skeleton-shimmer opacity-40" />
      <div className="relative z-10 w-full max-w-4xl space-y-6">
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded bg-white/5 skeleton-shimmer" />
          <div className="h-6 w-16 rounded bg-white/5 skeleton-shimmer" />
        </div>
        <div className="space-y-3">
          <div className="h-10 w-full rounded bg-white/5 skeleton-shimmer" />
          <div className="h-10 w-2/3 rounded bg-white/5 skeleton-shimmer" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-white/5 skeleton-shimmer" />
          <div className="h-4 w-5/6 rounded bg-white/5 skeleton-shimmer" />
        </div>
        <div className="h-px bg-white/5 w-full pt-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-white/5 skeleton-shimmer" />
            <div className="h-4 w-24 rounded bg-white/5 skeleton-shimmer" />
          </div>
          <div className="h-10 w-28 rounded-lg bg-white/5 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
