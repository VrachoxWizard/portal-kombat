"use client";

import React, { useEffect, useState } from "react";
import { Link2 } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 for h2, 3 for h3
}

export const TableOfContents: React.FC = () => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Select all h2 and h3 elements within the article content container
    const elements = Array.from(document.querySelectorAll("article h2, article h3"))
      .filter((el) => el.id) // Only those with generated ids
      .map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: el.tagName.toLowerCase() === "h2" ? 2 : 3,
      }));

    const timer = setTimeout(() => {
      setHeadings(elements);
    }, 0);

    if (elements.length === 0) {
      return () => clearTimeout(timer);
    }

    // Use IntersectionObserver to track active heading
    const callback = (entries: IntersectionObserverEntry[]) => {
      // Find the first entry that is intersecting
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) {
        setActiveId(visible.target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-100px 0px -40% 0px", // triggers when heading is near the top of the viewport
      threshold: 0.1,
    });

    elements.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="bezel-outer sticky top-24 hidden lg:block max-h-[70vh] overflow-hidden">
      <div className="bezel-inner p-6 bg-card overflow-y-auto max-h-[calc(70vh-8px)]">
        <h3 className="text-sm font-extrabold tracking-widest text-white/95 uppercase border-l-4 border-primary pl-3 mb-6 flex items-center gap-2">
          <Link2 size={16} className="text-primary" aria-hidden="true" />
          Sadržaj članka
        </h3>
        <nav className="space-y-1.5" aria-label="Sadržaj članka">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const reducedMotion = window.matchMedia(
                  "(prefers-reduced-motion: reduce)"
                ).matches;
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: reducedMotion ? "auto" : "smooth",
                });
                setActiveId(heading.id);
              }}
              className={`block text-xs font-semibold tracking-wide uppercase transition-premium py-1 relative border-l-2 pl-3 hover:text-primary ${
                heading.level === 3 ? "ml-4 border-slate-800 text-slate-400 hover:border-primary/50" : "border-slate-700 text-slate-300 hover:border-primary"
              } ${
                activeId === heading.id
                  ? "text-primary border-primary font-extrabold"
                  : "border-transparent"
              }`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TableOfContents;
