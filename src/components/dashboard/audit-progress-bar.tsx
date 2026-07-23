"use client";

import { useAppSelector } from "@/store";
import { Loader2, CheckCircle2, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function AuditProgressBar() {
  const { isAuditing, progressStage, progressPercentage, error } = useAppSelector(
    (state) => state.audit
  );

  if (!isAuditing && !error) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full mb-6 rounded-2xl border border-blue-200/80 bg-blue-50/60 p-4 shadow-sm backdrop-blur-sm"
      >
        {isAuditing ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Running Website Audit
                  </h4>
                  <p className="text-[11px] font-semibold text-blue-700 animate-pulse mt-0.5">
                    {progressStage || "Scanning target website..."}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-blue-600 bg-white px-2.5 py-1 rounded-lg border border-blue-100 shadow-xs">
                {progressPercentage}%
              </span>
            </div>

            {/* Animated Progress Track */}
            <div className="w-full h-2 bg-blue-200/60 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-between text-xs font-bold text-red-700">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
