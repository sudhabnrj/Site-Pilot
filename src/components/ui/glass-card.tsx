"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverable?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { scale: 1.02 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/85 text-slate-900 dark:text-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-2xl backdrop-blur-xl transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
