import React from "react";

export default function ArticleLoading() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-live="polite"
      aria-label="Učitavanje članka"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-4 w-48 rounded-none bg-white/5 skeleton-shimmer" aria-hidden="true" />
          <div className="h-12 w-full rounded-none bg-white/5 skeleton-shimmer" aria-hidden="true" />
          <div className="h-16 w-full rounded-none bg-white/5 skeleton-shimmer" aria-hidden="true" />
          
          <div className="bezel-outer w-full" aria-hidden="true">
            <div className="bezel-inner aspect-video w-full overflow-hidden bg-slate-950 skeleton-shimmer" />
          </div>

          <div className="space-y-3" aria-hidden="true">
            <div className="h-4 w-full rounded-none bg-white/5 skeleton-shimmer" />
            <div className="h-4 w-full rounded-none bg-white/5 skeleton-shimmer" />
            <div className="h-4 w-5/6 rounded-none bg-white/5 skeleton-shimmer" />
            <div className="h-4 w-4/6 rounded-none bg-white/5 skeleton-shimmer" />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6" aria-hidden="true">
          <div className="bezel-outer w-full">
            <div className="bezel-inner h-12 w-full bg-slate-950 skeleton-shimmer" />
          </div>
          <div className="bezel-outer w-full">
            <div className="bezel-inner h-64 w-full bg-slate-950 skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
