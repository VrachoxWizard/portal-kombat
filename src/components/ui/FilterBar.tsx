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
        <div className="flex flex-wrap gap-2" role="group" aria-label="Kategorije">
          <Link
            href={buildHref(basePath, { q: activeQuery, tag: activeTag })}
            className={`rounded-none px-3.5 py-1 text-[9px] font-black uppercase tracking-widest border-2 transition-premium cursor-pointer ${
              !activeCategory
                ? "bg-primary/15 text-primary border-primary/40"
                : "bg-black/40 text-slate-300 border-white/10 hover:border-primary hover:text-white"
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
              className={`rounded-none px-3.5 py-1 text-[9px] font-black uppercase tracking-widest border-2 transition-premium cursor-pointer ${
                activeCategory === cat.slug
                  ? "bg-primary/15 text-primary border-primary/40"
                  : "bg-black/40 text-slate-300 border-white/10 hover:border-primary hover:text-white"
              }`}
              aria-current={activeCategory === cat.slug ? "true" : undefined}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground font-medium" aria-live="polite">
          <span className="text-foreground font-bold">{resultCount}</span>{" "}
          {resultCount === 1 ? "rezultat" : resultCount >= 2 && resultCount <= 4 ? "rezultata" : "rezultata"}
        </p>

        {isFiltered && (
          <div className="flex flex-wrap items-center gap-2">
            {activeQuery && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-black/60 border-2 border-white/10 px-2.5 py-1 rounded-none text-slate-400">
                Pretraga: &ldquo;{activeQuery}&rdquo;
              </span>
            )}
            {activeCategory && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-black/60 border-2 border-white/10 px-2.5 py-1 rounded-none text-slate-400">
                Kategorija: {getCategoryLabel(activeCategory)}
              </span>
            )}
            {activeTag && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-black/60 border-2 border-white/10 px-2.5 py-1 rounded-none text-slate-400">
                Oznaka: #{activeTag}
              </span>
            )}
            <Link
              href={basePath}
              className="text-[9px] font-black text-primary hover:text-red-400 flex items-center gap-1 transition-premium uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-none border-2 border-primary/30"
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
