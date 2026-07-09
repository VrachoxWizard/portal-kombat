import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

interface EmptyStateProps {
  message: string;
  basePath?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  basePath = "/",
}) => {
  return (
    <div className="surface-card p-12 text-center space-y-6 border-2 border-dashed border-white/20">
      <p className="text-muted-foreground font-medium">{message}</p>
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Pregledajte popularne kategorije
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`${basePath}?category=${cat.slug}`}
              className="shrink-0 rounded-none px-3.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-300 border-2 border-white/10 bg-black/40 hover:border-primary hover:text-white transition-premium cursor-pointer"
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <Link
          href={basePath}
          className="inline-flex text-xs font-bold text-primary hover:text-red-400 transition-premium uppercase tracking-wider"
        >
          Povratak na sve objave
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;
