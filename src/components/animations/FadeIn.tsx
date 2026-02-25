"use client";

import { motion, useReducedMotion } from "motion/react";
import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  className?: string;
  viewportOnce?: boolean;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  distance = 20,
  duration = 0.5,
  className = "",
  viewportOnce = true,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, ...directions[direction] };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: viewportOnce, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // expo-out
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
