"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatRevealProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  duration?: number;
  className?: string;
}

export const StatReveal: React.FC<StatRevealProps> = ({
  value,
  prefix,
  suffix,
  label,
  duration = 600,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          if (prefersReduced) {
            setDisplayValue(value);
            return;
          }

          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(eased * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  const ariaLabel = label ? `${label}: ${value}` : undefined;

  return (
    <span
      ref={ref}
      className={`inline-flex items-baseline gap-0.5 font-condensed font-black tabular-nums ${className}`}
      aria-label={ariaLabel}
      role={label ? "img" : undefined}
    >
      {prefix && <span className="text-[0.6em] opacity-70">{prefix}</span>}
      <span>{hasAnimated ? displayValue : value}</span>
      {suffix && <span className="text-[0.6em] opacity-70">{suffix}</span>}
    </span>
  );
};

export default StatReveal;
