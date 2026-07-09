"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
}

export default function Magnetic({ children, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values to keep tracking off the React state engine
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics setup for premium weighted elasticity
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const element = ref.current;
    if (!element) return;

    const { left, top, width, height } = element.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate pull offset scaled by strength
    const targetX = (e.clientX - centerX) * strength;
    const targetY = (e.clientY - centerY) * strength;

    x.set(targetX);
    y.set(targetY);
  };

  const handleMouseLeave = () => {
    // Snap back to center
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
