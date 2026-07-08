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
      className={`inline-flex items-center gap-1 rounded-none bg-black/85 border-2 border-white/20 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/90 hover:border-primary hover:text-primary transition-premium ${className}`}
      aria-label={`Kategorija: ${name}`}
    >
      <Tag size={9} className="text-primary" aria-hidden="true" />
      {name}
    </Link>
  );
};

export default CategoryBadge;
