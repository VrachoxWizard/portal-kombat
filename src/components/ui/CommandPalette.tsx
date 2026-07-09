"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, User, Calendar, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SearchResultPost {
  id: string;
  title: string;
  slug: string;
  type: string;
}

interface SearchResultFighter {
  id: string;
  name: string;
  slug: string;
  weightClass: string;
}

interface SearchResultEvent {
  id: string;
  event: string;
  fighterA: string;
  fighterB: string;
  date: string;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    posts: SearchResultPost[];
    fighters: SearchResultFighter[];
    events: SearchResultEvent[];
  }>({ posts: [], fighters: [], events: [] });

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle palette open/close with keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      } else if (e.key === "/" && !isOpen && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        setQuery("");
        setResults({ posts: [], fighters: [], events: [] });
      }, 50);
    }
  }, [isOpen]);

  // Fetch results as query changes
  useEffect(() => {
    if (!query.trim()) {
      setTimeout(() => {
        setResults({ posts: [], fighters: [], events: [] });
      }, 0);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Failed to fetch search results", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating command helper banner */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-primary text-slate-400 hover:text-white transition-premium text-[10px] font-black uppercase tracking-wider cursor-pointer"
        title="Otvori pretragu (Ctrl+K)"
      >
        <Search size={12} />
        <span>Pretraži</span>
        <kbd className="bg-slate-900 border-2 border-white/20 px-1.5 py-0.5 rounded-none text-[9px] font-mono text-slate-500 font-normal">
          Ctrl+K
        </kbd>
      </button>

      {/* Mobile search helper button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center justify-center w-8 h-8 rounded-none bg-white/5 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
        aria-label="Pretraži"
      >
        <Search size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-[10vh]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-slate-950 border-2 border-primary shadow-[0_0_50px_rgba(239,68,68,0.15)] rounded-none overflow-hidden flex flex-col font-sans"
            >
              {/* Search input bar */}
              <div className="flex items-center border-b-2 border-white/10 px-4 py-3 bg-black">
                <Search size={18} className="text-primary mr-3 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Pretraži članke, borce ili događaje... (npr. Stipe)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none outline-none"
                />
                {loading && <Loader2 size={16} className="animate-spin text-slate-400 mr-2 shrink-0" />}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white shrink-0 p-1 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search results body */}
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
                {!query.trim() && (
                  <div className="text-center py-6 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Upišite pojam za pretraživanje. Pritisnite <kbd className="bg-slate-900 px-1.5 py-0.5 border-2 border-white/20 rounded-none">Esc</kbd> za izlaz.
                  </div>
                )}

                {query.trim() && !loading && results.posts.length === 0 && results.fighters.length === 0 && results.events.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Nema rezultata za pojam &ldquo;{query}&rdquo;
                  </div>
                )}

                {/* Fighters Results */}
                {results.fighters.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-white/5 pb-1">
                      Borci ({results.fighters.length})
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {results.fighters.map((fighter) => (
                        <button
                          key={fighter.id}
                          onClick={() => handleNavigate(`/borci/${fighter.slug}`)}
                          className="w-full flex items-center justify-between text-left p-2.5 bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/30 transition-premium cursor-pointer text-sm text-slate-200"
                        >
                          <span className="font-extrabold flex items-center gap-2">
                            <User size={14} className="text-primary shrink-0" />
                            {fighter.name}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-bold">
                            {fighter.weightClass}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events Results */}
                {results.events.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-white/5 pb-1">
                      Nadolazeće borbe ({results.events.length})
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {results.events.map((event) => (
                        <div
                          key={event.id}
                          className="w-full flex items-center justify-between text-left p-2.5 bg-white/5 border border-white/5 text-sm text-slate-200"
                        >
                          <span className="font-extrabold flex items-center gap-2">
                            <Calendar size={14} className="text-primary shrink-0" />
                            <span>{event.fighterA} vs {event.fighterB}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">
                            {event.event} • {event.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posts Results */}
                {results.posts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-white/5 pb-1">
                      Članci i Novosti ({results.posts.length})
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {results.posts.map((post) => (
                        <button
                          key={post.id}
                          onClick={() => handleNavigate(`/clanak/${post.slug}`)}
                          className="w-full flex items-center justify-between text-left p-2.5 bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/30 transition-premium cursor-pointer text-sm text-slate-200"
                        >
                          <span className="font-extrabold flex items-center gap-2 truncate pr-4">
                            <FileText size={14} className="text-primary shrink-0" />
                            <span className="truncate">{post.title}</span>
                          </span>
                          <span className="text-[9px] text-white bg-primary/20 border border-primary/25 px-1.5 py-0.5 uppercase tracking-widest font-black shrink-0">
                            {post.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandPalette;
