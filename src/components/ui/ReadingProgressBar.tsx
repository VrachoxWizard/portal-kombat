"use client";

import React, { useEffect, useState } from "react";

export const ReadingProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  if (progress <= 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1.5 w-full bg-slate-950/50 backdrop-blur-xs pointer-events-none border-b border-white/5">
      <div
        style={{ transform: `scaleX(${progress / 100})` }}
        className="h-full w-full bg-primary shadow-[0_0_10px_var(--primary),_0_0_5px_var(--primary)] origin-left transition-transform duration-75 ease-linear"
      />
    </div>
  );
};

export default ReadingProgressBar;
