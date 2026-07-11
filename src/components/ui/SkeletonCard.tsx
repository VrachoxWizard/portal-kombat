import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bezel-outer h-full" aria-hidden="true">
      <div className="bezel-inner flex flex-col overflow-hidden h-full">
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950 skeleton-broadcast" />
        <div className="flex flex-1 flex-col p-6 space-y-4 bg-card">
          <div className="space-y-2">
            <div className="h-5 w-3/4 rounded-none bg-white/5 skeleton-broadcast" />
            <div className="h-5 w-1/2 rounded-none bg-white/5 skeleton-broadcast" />
          </div>
          <div className="space-y-1.5 pt-2">
            <div className="h-3 w-full rounded-none bg-white/5 skeleton-broadcast" />
            <div className="h-3 w-full rounded-none bg-white/5 skeleton-broadcast" />
            <div className="h-3 w-2/3 rounded-none bg-white/5 skeleton-broadcast" />
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-[22px] w-[22px] rounded-none bg-white/5 skeleton-broadcast" />
              <div className="h-3.5 w-16 rounded-none bg-white/5 skeleton-broadcast" />
            </div>
            <div className="h-3.5 w-20 rounded-none bg-white/5 skeleton-broadcast" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonHero: React.FC = () => {
  return (
    <div className="bezel-outer w-full" aria-hidden="true">
      <div className="bezel-inner relative overflow-hidden min-h-[540px] flex items-end p-8 sm:p-12 w-full">
        <div className="absolute inset-0 skeleton-broadcast opacity-40" />
        <div className="relative z-10 w-full max-w-4xl space-y-6">
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-none bg-white/5 skeleton-broadcast" />
            <div className="h-6 w-16 rounded-none bg-white/5 skeleton-broadcast" />
          </div>
          <div className="space-y-3">
            <div className="h-10 w-full rounded-none bg-white/5 skeleton-broadcast" />
            <div className="h-10 w-2/3 rounded-none bg-white/5 skeleton-broadcast" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded-none bg-white/5 skeleton-broadcast" />
            <div className="h-4 w-5/6 rounded-none bg-white/5 skeleton-broadcast" />
          </div>
          <div className="h-px bg-white/5 w-full pt-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-none bg-white/5 skeleton-broadcast" />
              <div className="h-4 w-24 rounded-none bg-white/5 skeleton-broadcast" />
            </div>
            <div className="h-10 w-28 rounded-none bg-white/5 skeleton-broadcast" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
