import React from "react";
import { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  as?: "h1" | "h2";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
  icon: Icon,
  as: Tag = "h2",
  className = "",
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <Tag className="text-2xl sm:text-3xl font-extrabold italic tracking-tight uppercase border-l-4 border-primary pl-3 flex items-center gap-2 font-display text-foreground">
        {Icon && <Icon size={22} className="text-primary shrink-0" aria-hidden="true" />}
        {title}
      </Tag>
      {description && (
        <p className="text-muted-foreground text-xs sm:text-sm pl-4 font-medium max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
