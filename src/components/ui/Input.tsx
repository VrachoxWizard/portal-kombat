import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="text-xs font-bold uppercase tracking-wider text-slate-400"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-none bg-black/60 border-2 border-white/10 px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-premium font-bold ${className}`}
        {...props}
      />
    </div>
  );
}
