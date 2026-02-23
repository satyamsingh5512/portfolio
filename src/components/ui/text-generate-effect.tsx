"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate } from "motion/react";
import { useEffect } from "react";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.4,
  onAnimationComplete,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  onAnimationComplete?: () => void;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ?? 1,
        delay: stagger(0.06),
      },
    ).then(() => onAnimationComplete?.());
    // `animate` and `stagger` are stable references; `scope.current` intentionally
    // omitted — we want this to run once on mount per component instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn(className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="opacity-0"
            style={{
              filter: filter ? "blur(10px)" : "none",
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};
