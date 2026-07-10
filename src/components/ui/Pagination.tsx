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
    <div className="flex justify-center mt-10">
      <nav
        className="bezel-outer p-[3px] bg-white/[0.02] border border-white/[0.06] shadow-[var(--shadow-brutalist)]"
        aria-label="Straničenje"
      >
        <div className="bezel-inner bg-card border border-white/[0.03] p-1.5 flex items-center justify-center gap-1.5 font-display">
          {currentPage > 1 ? (
            <Link
              href={buildPageHref(basePath, currentPage - 1, params)}
              className="group inline-flex items-center gap-1 rounded-none border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:border-primary/40 hover:text-primary transition-premium cursor-pointer"
              aria-label="Prethodna stranica"
            >
              <ChevronLeft size={13} className="transition-transform duration-150 group-hover:-translate-x-0.5" aria-hidden="true" />
              Prethodna
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-none border border-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white/20 cursor-not-allowed">
              <ChevronLeft size={13} aria-hidden="true" />
              Prethodna
            </span>
          )}

          <div className="flex items-center gap-1 mx-1.5">
            {pages.map((page, index) => {
              const prev = pages[index - 1];
              const showEllipsis = prev !== undefined && page - prev > 1;

              return (
                <React.Fragment key={page}>
                  {showEllipsis && (
                    <span className="px-2 text-xs text-muted-foreground font-mono" aria-hidden="true">
                      …
                    </span>
                  )}
                  <Link
                    href={buildPageHref(basePath, page, params)}
                    className={`min-w-[2.25rem] text-center rounded-none px-2.5 py-2 text-[10px] font-black uppercase tracking-wider transition-premium font-mono hover:scale-105 active:scale-95 ${
                      page === currentPage
                        ? "bg-primary text-white border border-primary/50 shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                        : "bg-white/5 text-slate-400 border border-white/10 hover:border-primary hover:text-primary cursor-pointer"
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
              className="group inline-flex items-center gap-1 rounded-none border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:border-primary/40 hover:text-primary transition-premium cursor-pointer"
              aria-label="Sljedeća stranica"
            >
              Sljedeća
              <ChevronRight size={13} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-none border border-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white/20 cursor-not-allowed">
              Sljedeća
              <ChevronRight size={13} aria-hidden="true" />
            </span>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Pagination;
