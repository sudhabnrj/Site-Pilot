"use client";

import { NavItem } from "@/components/ui/nav-item";
import { BRAND, SIDEBAR_NAV_ITEMS, SIDEBAR_BOTTOM_ITEMS } from "@/constants/navigation";
import { Brain, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-[80] flex h-screen w-72 flex-col border-r border-slate-200 bg-white p-4 shadow-2xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                  <Brain className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-black leading-tight tracking-tight text-blue-700">
                    {BRAND.name}
                  </h2>
                  <p className="text-xs font-medium text-muted-foreground">{BRAND.plan}</p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Mobile navigation">
              {SIDEBAR_NAV_ITEMS.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}

              <div className="pt-8">
                {SIDEBAR_BOTTOM_ITEMS.map((item) => (
                  <NavItem key={item.href} item={item} />
                ))}
              </div>
            </nav>

            {/* Upgrade CTA */}
            <div className="mt-auto pt-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all">
                <Zap className="h-4 w-4" aria-hidden="true" />
                Upgrade to Pro
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
