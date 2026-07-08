"use client";

import React, { useState, useEffect } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks";

interface ShareButtonsProps {
  title: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const prefersReducedMotion = useSafeReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShareUrl(window.location.href);
    }, 0);
    return () => clearTimeout(timer);
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

  const buttonClass =
    "flex items-center gap-1.5 rounded-none border-2 border-white/10 surface-elevated hover:border-primary/45 text-xs text-slate-300 px-3.5 py-2 hover:text-white transition-premium cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(225,29,72,0.25)]";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y-2 border-white/10 py-4 my-8 gap-4">
      <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase">
        <Share2 size={14} className="text-primary" aria-hidden="true" />
        Podijeli ovaj članak
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="Podijeli na Facebooku"
        >
          <svg className="h-3.5 w-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
          <span className="font-semibold">Facebook</span>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="Podijeli na X-u"
        >
          <svg className="h-3 w-3 text-slate-100" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="font-semibold">X</span>
        </a>

        <div className="relative">
          <button
            type="button"
            onClick={handleCopyLink}
            className={buttonClass}
            aria-label="Kopiraj poveznicu"
          >
            {copied ? (
              <Check size={14} className="text-green-500" aria-hidden="true" />
            ) : (
              <Link2 size={14} className="text-slate-400" aria-hidden="true" />
            )}
            <span className="font-semibold">{copied ? "Kopirano!" : "Kopiraj link"}</span>
          </button>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: -35, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-1/2 -translate-x-1/2 bg-slate-950 border-2 border-slate-800 text-[10px] text-green-400 font-extrabold px-2.5 py-1 rounded-none shadow-xl whitespace-nowrap z-50 pointer-events-none"
                role="status"
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
