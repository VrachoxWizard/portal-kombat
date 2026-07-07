"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export const SearchWidget: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(defaultQuery);
  const inputId = "portal-search";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");

    if (pathname.startsWith("/clanak/")) {
      router.push(`/novosti?${params.toString()}`);
    } else {
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    if (pathname.startsWith("/clanak/")) {
      router.push(`/novosti`);
    } else {
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const scopeLabel =
    pathname === "/"
      ? "cijeli portal"
      : pathname.startsWith("/novosti")
        ? "novosti"
        : pathname.startsWith("/blog")
          ? "blog"
          : pathname.startsWith("/predikcije")
            ? "predikcije"
            : "portal";

  return (
    <div className="surface-card p-6 shadow-sm">
      <h3 className="text-sm font-extrabold tracking-widest text-white/90 uppercase border-l-4 border-primary pl-3 mb-1">
        Pretraži portal
      </h3>
      <p className="text-[10px] text-muted-foreground mb-4 pl-4 font-medium">
        Pretraživanje u: <span className="text-foreground">{scopeLabel}</span>
      </p>
      <form onSubmit={handleSearch} className="relative flex items-center">
        <label htmlFor={inputId} className="sr-only">
          Pretraži sadržaj portala
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Unesite pojam za pretragu..."
          className="w-full rounded-lg bg-black/40 border border-white/5 pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary/45 focus:ring-1 focus:ring-primary/45 transition-premium font-medium"
        />
        <div className="absolute left-3.5 text-slate-500 pointer-events-none" aria-hidden="true">
          <Search size={14} />
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 text-slate-500 hover:text-white transition-premium p-1 rounded-full hover:bg-white/5 cursor-pointer"
            aria-label="Očisti pretragu"
          >
            <X size={12} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 text-slate-400 hover:text-primary transition-premium p-1.5 rounded-md hover:bg-white/5 cursor-pointer"
          aria-label="Pretraži"
        >
          <Search size={14} className="text-primary" />
        </button>
      </form>
    </div>
  );
};

export default SearchWidget;
