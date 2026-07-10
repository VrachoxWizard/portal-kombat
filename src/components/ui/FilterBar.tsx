import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { CATEGORIES, getCategoryLabel } from "@/lib/constants";

interface FilterBarProps {
  basePath: string;
  activeCategory?: string;
  activeTag?: string;
  activeQuery?: string;
  resultCount: number;
  showCategories?: boolean;
}

function buildHref(
  basePath: string,
  params: { category?: string; tag?: string; q?: string }
) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.tag) search.set("tag", params.tag);
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  basePath,
  activeCategory,
  activeTag,
  activeQuery,
  resultCount,
  showCategories = true,
}) => {
  const isFiltered = !!(activeCategory || activeTag || activeQuery);

  return (
    <div className="space-y-4 mb-6" role="region" aria-label="Filteri sadržaja">
      {showCategories && (
        <div className="bezel-outer p-[3px] bg-white/[0.02] border border-white/[0.06] shadow-[var(--shadow-brutalist)]">
          <div className="bezel-inner bg-card border border-white/[0.03] p-2.5 flex flex-wrap gap-2 font-display" role="group" aria-label="Kategorije">
            <Link
              href={buildHref(basePath, { q: activeQuery, tag: activeTag })}
              className={`rounded-none px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-premium cursor-pointer hover:scale-105 active:scale-95 ${
                !activeCategory
                  ? "bg-primary text-white border-primary/50 shadow-[0_0_8px_rgba(225,29,72,0.4)]"
                  : "bg-white/5 text-slate-300 border-white/10 hover:border-primary hover:text-white"
              }`}
              aria-current={!activeCategory ? "true" : undefined}
            >
              Sve
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={buildHref(basePath, {
                  category: cat.slug,
                  q: activeQuery,
                  tag: activeTag,
                })}
                className={`rounded-none px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-premium cursor-pointer hover:scale-105 active:scale-95 ${
                  activeCategory === cat.slug
                    ? "bg-primary text-white border-primary/50 shadow-[0_0_8px_rgba(225,29,72,0.4)]"
                    : "bg-white/5 text-slate-300 border-white/10 hover:border-primary hover:text-white"
                }`}
                aria-current={activeCategory === cat.slug ? "true" : undefined}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground font-medium" aria-live="polite">
          <span className="text-foreground font-bold font-mono">{resultCount}</span>{" "}
          {resultCount === 1 ? "rezultat" : resultCount >= 2 && resultCount <= 4 ? "rezultata" : "rezultata"}
        </p>

        {isFiltered && (
          <div className="flex flex-wrap items-center gap-2 font-display">
            {activeQuery && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-none text-slate-400">
                Pretraga: &ldquo;{activeQuery}&rdquo;
              </span>
            )}
            {activeCategory && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-none text-slate-400">
                Kategorija: {getCategoryLabel(activeCategory)}
              </span>
            )}
            {activeTag && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-none text-slate-400 font-mono">
                Oznaka: #{activeTag}
              </span>
            )}
            <Link
              href={basePath}
              className="text-[9px] font-black text-primary hover:text-red-400 flex items-center gap-1 transition-premium uppercase tracking-widest bg-primary/10 px-2.5 py-1.5 rounded-none border border-primary/30 hover:scale-105 active:scale-95"
            >
              <X size={12} aria-hidden="true" />
              Očisti filtere
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
