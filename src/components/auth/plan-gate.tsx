"use client";

import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { Lock, Sparkles } from "lucide-react";

interface PlanGateProps {
  requiredPlan: "starter" | "pro" | "enterprise";
  children: React.ReactNode;
  featureName?: string;
  fallbackMode?: "mask" | "hide" | "disable";
}

export function PlanGate({
  requiredPlan,
  children,
  featureName = "this feature",
  fallbackMode = "mask",
}: PlanGateProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const userPlan = isAdmin
    ? "enterprise"
    : user?.plan || (typeof window !== "undefined" ? (localStorage.getItem("user_plan") as any) : null) || "starter";

  const planRanks: Record<string, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    enterprise: 3,
    admin: 99,
  };

  const hasAccess = isAdmin || (planRanks[userPlan] ?? 1) >= (planRanks[requiredPlan] ?? 2);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallbackMode === "hide") {
    return null;
  }

  if (fallbackMode === "disable") {
    return (
      <div className="opacity-50 pointer-events-none select-none relative">
        {children}
      </div>
    );
  }

  // fallbackMode === "mask"
  return (
    <div className="relative overflow-hidden rounded-[24px]">
      <div className="filter blur-[5px] pointer-events-none select-none opacity-40">
        {children}
      </div>
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-950/70 backdrop-blur-md rounded-[24px] border border-white/20 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
          <Lock className="h-6 w-6" />
        </div>
        <h4 className="text-lg font-black text-white tracking-tight">
          Unlock {featureName}
        </h4>
        <p className="text-xs text-slate-300 max-w-sm mt-1 mb-4 leading-relaxed">
          Access to {featureName} is reserved for <span className="text-blue-300 font-bold uppercase">{requiredPlan}</span> tier subscribers. Upgrade your plan to gain full access.
        </p>
        <button
          onClick={() => router.push("/upgrade")}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Upgrade to {requiredPlan.toUpperCase()} Plan</span>
        </button>
      </div>
    </div>
  );
}
