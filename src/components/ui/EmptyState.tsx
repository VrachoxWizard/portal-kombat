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
    <div className="surface-card p-12 text-center space-y-6 border-dashed">
      <p className="text-muted-foreground font-medium">{message}</p>
      <div className="space-y-3">
        <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
          Pregledajte popularne kategorije
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`${basePath}?category=${cat.slug}`}
              className="rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-premium"
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
