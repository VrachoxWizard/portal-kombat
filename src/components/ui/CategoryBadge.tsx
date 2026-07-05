import React from "react";
import Link from "next/link";
import { Tag } from "lucide-react";

interface CategoryBadgeProps {
  name: string;
  slug: string;
  basePath?: string;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  name,
  slug,
  basePath = "/",
  className = "",
}) => {
  return (
    <Link
      href={`${basePath}?category=${slug}`}
      className={`inline-flex items-center gap-1 rounded-md bg-black/60 border border-white/10 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-white/90 hover:border-primary/30 hover:text-primary transition-premium ${className}`}
      aria-label={`Kategorija: ${name}`}
    >
      <Tag size={9} className="text-primary" aria-hidden="true" />
      {name}
    </Link>
  );
};

export default CategoryBadge;
