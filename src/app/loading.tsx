import React from "react";

function SkeletonCard({ isHorizontal = false }: { isHorizontal?: boolean }) {
  return (
    <div className="bezel-outer h-full">
      <div className={`bezel-inner h-full border-l-[3px] border-primary/10 flex flex-col ${isHorizontal ? "sm:flex-row" : ""} overflow-hidden`}>
        <div className={`relative bg-slate-950 shrink-0 skeleton-broadcast ${isHorizontal ? "aspect-video sm:w-[45%] sm:min-h-[220px]" : "aspect-video w-full"}`} />
        <div className="flex flex-1 flex-col p-6 space-y-4 justify-between bg-card">
          <div className="space-y-3">
            <div className="h-5 w-3/4 bg-white/5 skeleton-broadcast" />
            <div className="h-4 w-full bg-white/5 skeleton-broadcast" />
            <div className="h-4 w-2/3 bg-white/5 skeleton-broadcast" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t-2 border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-[22px] w-[22px] bg-white/5 skeleton-broadcast" />
              <div className="h-3 w-16 bg-white/5 skeleton-broadcast" />
            </div>
            <div className="h-3 w-20 bg-white/5 skeleton-broadcast" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonHero() {
  return (
    <div className="bezel-outer w-screen max-w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[500px] flex flex-col">
      <div className="bezel-inner h-full flex-1 flex flex-col md:grid md:grid-cols-12 border-l-[3px] border-primary/20 accent-edge-glow overflow-hidden">
        {/* Left col */}
        <div className="md:col-span-7 p-8 sm:p-10 md:p-12 flex flex-col justify-between relative z-10 bg-[#06080e] w-full min-h-[300px]">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-white/5 skeleton-broadcast" />
              <div className="h-5 w-24 bg-white/5 skeleton-broadcast" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-8 w-full bg-white/5 skeleton-broadcast" />
              <div className="h-8 w-3/4 bg-white/5 skeleton-broadcast" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-white/5 skeleton-broadcast" />
              <div className="h-4 w-5/6 bg-white/5 skeleton-broadcast" />
            </div>
          </div>
          <div className="flex items-center justify-between border-t-2 border-white/10 pt-5 mt-6">
            <div className="flex items-center gap-4">
              <div className="h-6 w-20 bg-white/5 skeleton-broadcast" />
              <div className="h-6 w-28 bg-white/5 skeleton-broadcast" />
            </div>
            <div className="h-9 w-28 bg-white/5 skeleton-broadcast" />
          </div>
        </div>
        {/* Right col */}
        <div className="md:col-span-5 relative min-h-[250px] md:min-h-full bg-slate-950 w-full skeleton-broadcast" />
      </div>
      <div className="h-[5px] bg-primary/20 w-full" />
    </div>
  );
}

export default function Loading() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12"
      aria-busy="true"
      aria-live="polite"
      aria-label="Učitavanje sadržaja"
    >
      {/* Broadcast signal acquisition indicator */}
      <div className="flex items-center justify-center gap-3 py-2">
        <div className="flex gap-1" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 bg-broadcast-cyan/60"
              style={{
                height: `${8 + i * 3}px`,
                animation: `broadcast-pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
        <span className="text-[9px] font-mono font-bold text-broadcast-cyan tracking-widest uppercase animate-broadcast-pulse">
          ACQUIRING SIGNAL...
        </span>
      </div>
      <div className="w-full" aria-hidden="true">
        <SkeletonHero />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8" aria-hidden="true">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="h-8 w-48 bg-white/5 skeleton-broadcast" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Item 1 (index 0) - col-span-2, row-span-2, horizontal */}
            <div className="h-full md:col-span-2 md:row-span-2">
              <SkeletonCard isHorizontal={true} />
            </div>
            {/* Item 2 (index 1) */}
            <div className="h-full col-span-1 row-span-1">
              <SkeletonCard isHorizontal={false} />
            </div>
            {/* Item 3 (index 2) */}
            <div className="h-full col-span-1 row-span-1">
              <SkeletonCard isHorizontal={false} />
            </div>
            {/* Item 4 (index 3) - col-span-1, row-span-2 */}
            <div className="h-full md:col-span-1 md:row-span-2">
              <SkeletonCard isHorizontal={false} />
            </div>
            {/* Items 5 to 14 (indexes 4 to 13) */}
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="h-full col-span-1 row-span-1">
                <SkeletonCard isHorizontal={false} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8" aria-hidden="true">
          {/* Search widget skeleton */}
          <div className="bezel-outer w-full">
            <div className="bezel-inner p-6 h-[120px] skeleton-broadcast" />
          </div>
          {/* Upcoming fights widget skeleton */}
          <div className="bezel-outer w-full">
            <div className="bezel-inner p-6 h-[320px] skeleton-broadcast" />
          </div>
          {/* Popular tags widget skeleton */}
          <div className="bezel-outer w-full">
            <div className="bezel-inner p-6 h-[240px] skeleton-broadcast" />
          </div>
        </div>
      </div>
    </div>
  );
}
