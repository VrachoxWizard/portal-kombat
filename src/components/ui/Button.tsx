import React from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm transition-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-primary text-white hover:bg-red-600 px-6 py-3 shadow-[var(--shadow-glow-sm)]",
  secondary:
    "bg-white/5 border border-white/10 text-white hover:border-primary/30 hover:text-primary px-6 py-3",
  ghost: "text-muted-foreground hover:text-primary px-3 py-2",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
