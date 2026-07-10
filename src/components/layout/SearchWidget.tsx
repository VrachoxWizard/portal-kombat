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
    <div className="bezel-outer">
      <div className="bezel-inner p-6">
        <h3 className="text-sm font-black tracking-widest text-white uppercase border-b-2 border-primary pb-1 inline-block mb-1.5 rounded-none">
          Pretraži portal
        </h3>
        <p className="text-[9px] text-slate-500 mb-4 font-black uppercase tracking-widest">
          Pretraživanje u: <span className="text-white bg-white/10 px-1.5 py-0.5">{scopeLabel}</span>
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
            className="w-full rounded-none bg-black/60 border-2 border-white/10 pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-premium font-bold"
          />
          <div className="absolute left-3.5 text-slate-500 pointer-events-none" aria-hidden="true">
            <Search size={14} />
          </div>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 text-slate-500 hover:text-white transition-premium p-1 rounded-none hover:bg-white/5 cursor-pointer"
              aria-label="Očisti pretragu"
            >
              <X size={12} />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 text-slate-400 hover:text-primary transition-premium p-1.5 rounded-none hover:bg-white/5 cursor-pointer"
            aria-label="Pretraži"
          >
            <Search size={14} className="text-primary" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchWidget;
