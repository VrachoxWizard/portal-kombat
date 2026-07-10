import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { motion } from "framer-motion";

interface EmptyStateProps {
  message: string;
  basePath?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  basePath = "/",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="bezel-outer w-full"
    >
      <div className="bezel-inner p-12 text-center space-y-6 border border-dashed border-white/20 bg-card">
        <p className="text-muted-foreground font-medium font-sans">{message}</p>
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-display">
            Pregledajte popularne kategorije
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`${basePath}?category=${cat.slug}`}
                className="shrink-0 rounded-none px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-300 border-2 border-white/10 bg-black/40 hover:border-primary hover:text-white transition-premium cursor-pointer font-display"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="pt-2">
            <Link
              href={basePath}
              className="inline-flex text-xs font-black text-primary hover:text-red-400 transition-premium uppercase tracking-wider font-display"
            >
              Povratak na sve objave
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
