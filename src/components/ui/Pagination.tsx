import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  params?: Record<string, string | undefined>;
}

function buildPageHref(
  basePath: string,
  page: number,
  params?: Record<string, string | undefined>
) {
  const search = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
  }
  if (page > 1) search.set("page", String(page));
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export const Pagination: React.FC<PaginationProps> = ({
  basePath,
  currentPage,
  totalPages,
  params,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      Math.abs(p - currentPage) <= 1
  );

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-10"
      aria-label="Straničenje"
    >
      {currentPage > 1 ? (
        <Link
          href={buildPageHref(basePath, currentPage - 1, params)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-muted-foreground hover:border-primary/30 hover:text-primary transition-premium"
          aria-label="Prethodna stranica"
        >
          <ChevronLeft size={14} aria-hidden="true" />
          Prethodna
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-white/5 px-3 py-2 text-xs font-bold text-white/20 cursor-not-allowed">
          <ChevronLeft size={14} aria-hidden="true" />
          Prethodna
        </span>
      )}

      <div className="flex items-center gap-1 mx-2">
        {pages.map((page, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && page - prev > 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <span className="px-2 text-xs text-muted-foreground" aria-hidden="true">
                  …
                </span>
              )}
              <Link
                href={buildPageHref(basePath, page, params)}
                className={`min-w-[2.25rem] text-center rounded-lg px-2.5 py-2 text-xs font-extrabold transition-premium ${
                  page === currentPage
                    ? "bg-primary text-white border border-primary/40 shadow-[var(--shadow-glow-sm)]"
                    : "bg-white/5 text-muted-foreground border border-white/10 hover:border-primary/30 hover:text-primary"
                }`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Link>
            </React.Fragment>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={buildPageHref(basePath, currentPage + 1, params)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-muted-foreground hover:border-primary/30 hover:text-primary transition-premium"
          aria-label="Sljedeća stranica"
        >
          Sljedeća
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-white/5 px-3 py-2 text-xs font-bold text-white/20 cursor-not-allowed">
          Sljedeća
          <ChevronRight size={14} aria-hidden="true" />
        </span>
      )}
    </nav>
  );
};

export default Pagination;
