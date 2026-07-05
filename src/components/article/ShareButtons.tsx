"use client";

import React, { useState, useEffect } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonsProps {
  title: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleCopyLink = () => {
    if (!shareUrl) return;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-border py-4 my-8 gap-4">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
        <Share2 size={14} className="text-primary animate-pulse" />
        Podijeli ovaj članak
      </div>

      <div className="flex items-center gap-3">
        {/* Facebook Share */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 px-3.5 py-2 hover:bg-slate-850 hover:text-white transition-all duration-200 cursor-pointer"
          aria-label="Podijeli na Facebooku"
        >
          {/* Custom SVG for Facebook logo */}
          <svg className="h-3.5 w-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
          <span className="font-semibold">Facebook</span>
        </a>

        {/* Twitter/X Share */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 px-3.5 py-2 hover:bg-slate-850 hover:text-white transition-all duration-200 cursor-pointer"
          aria-label="Podijeli na Twitteru / X-u"
        >
          {/* Custom SVG for X logo */}
          <svg className="h-3 w-3 text-slate-100" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="font-semibold">X</span>
        </a>

        {/* Copy Link Button */}
        <div className="relative">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 px-3.5 py-2 hover:bg-slate-850 hover:text-white transition-all duration-200 cursor-pointer"
            aria-label="Kopiraj poveznicu"
          >
            {copied ? (
              <Check size={14} className="text-green-500 animate-bounce" />
            ) : (
              <Link2 size={14} className="text-slate-400" />
            )}
            <span className="font-semibold">{copied ? "Kopirano!" : "Kopiraj link"}</span>
          </button>

          {/* Mini popup feedback */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: -35, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-[10px] text-green-400 font-extrabold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none"
              >
                Poveznica spremljena u međuspremnik!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ShareButtons;
