import React from "react";

type BroadcastVariant = "live" | "breaking" | "replay" | "poll-active" | "fight-week";

interface BroadcastBadgeProps {
  variant: BroadcastVariant;
  label?: string;
  className?: string;
}

const VARIANT_CONFIG: Record<BroadcastVariant, {
  defaultLabel: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  glowClass: string;
  pulse: boolean;
}> = {
  live: {
    defaultLabel: "LIVE",
    bgClass: "bg-primary/15",
    textClass: "text-primary",
    borderClass: "border-primary/40",
    glowClass: "shadow-[0_0_10px_rgba(225,29,72,0.4)]",
    pulse: true,
  },
  breaking: {
    defaultLabel: "BREAKING",
    bgClass: "bg-broadcast-amber/15",
    textClass: "text-broadcast-amber",
    borderClass: "border-broadcast-amber/40",
    glowClass: "broadcast-glow-amber",
    pulse: true,
  },
  replay: {
    defaultLabel: "REPLAY",
    bgClass: "bg-white/5",
    textClass: "text-slate-400",
    borderClass: "border-white/10",
    glowClass: "",
    pulse: false,
  },
  "poll-active": {
    defaultLabel: "POLL ACTIVE",
    bgClass: "bg-broadcast-cyan/15",
    textClass: "text-broadcast-cyan",
    borderClass: "border-broadcast-cyan/40",
    glowClass: "broadcast-glow-cyan",
    pulse: true,
  },
  "fight-week": {
    defaultLabel: "FIGHT WEEK",
    bgClass: "bg-primary/20",
    textClass: "text-primary",
    borderClass: "border-primary/50",
    glowClass: "shadow-[0_0_14px_rgba(225,29,72,0.5)]",
    pulse: true,
  },
};

export const BroadcastBadge: React.FC<BroadcastBadgeProps> = ({
  variant,
  label,
  className = "",
}) => {
  const config = VARIANT_CONFIG[variant];
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black font-condensed tracking-[0.2em] uppercase border ${config.bgClass} ${config.textClass} ${config.borderClass} ${config.glowClass} ${config.pulse ? "animate-broadcast-pulse" : ""} select-none ${className}`}
    >
      {config.pulse && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {displayLabel}
    </span>
  );
};

export default BroadcastBadge;
