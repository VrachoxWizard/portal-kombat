import React from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-none font-black text-xs uppercase tracking-widest transition-premium focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

const variants = {
  primary:
    "bg-primary text-white border-2 border-primary hover:bg-primary/95 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#ffffff] px-6 py-3 shadow-[var(--shadow-brutalist)]",
  secondary:
    "bg-white/5 border-2 border-white/10 text-white hover:border-primary hover:text-primary hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--primary)] px-6 py-3 shadow-[var(--shadow-brutalist)]",
  ghost: "text-muted-foreground hover:text-primary px-3 py-2 hover:bg-white/5",
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
