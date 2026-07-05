import React from "react";
import { PostTypeKey } from "@/lib/constants";

interface TypeBadgeProps {
  type: PostTypeKey;
  variant?: "card" | "hero";
  className?: string;
}

const badgeClass: Record<PostTypeKey, string> = {
  NEWS: "badge-news",
  BLOG: "badge-blog",
  PREDICTION: "badge-prediction",
};

const labels: Record<PostTypeKey, { card: string; hero: string }> = {
  NEWS: { card: "Vijest", hero: "Vijest dana" },
  BLOG: { card: "Blog", hero: "Izdvojeni Blog" },
  PREDICTION: { card: "Predikcija", hero: "Prognoza meča" },
};

export const TypeBadge: React.FC<TypeBadgeProps> = ({
  type,
  variant = "card",
  className = "",
}) => {
  return (
    <span className={`badge-type ${badgeClass[type]} ${className}`}>
      {labels[type][variant]}
    </span>
  );
};

export default TypeBadge;
