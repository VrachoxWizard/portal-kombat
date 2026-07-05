import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Putanja navigacije" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-primary transition-premium"
          >
            <Home size={12} aria-hidden="true" />
            <span>Naslovnica</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-white/20 shrink-0" aria-hidden="true" />
            {item.href ? (
              <Link href={item.href} className="hover:text-primary transition-premium truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground truncate max-w-[220px] sm:max-w-md" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
