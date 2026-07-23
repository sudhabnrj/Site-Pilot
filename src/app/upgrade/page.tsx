"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Check, Zap, Shield, Crown, Globe, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: any;
  colorClass: string;
  badge?: string;
  isPopular?: boolean;
}

export default function UpgradePage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      price: billingPeriod === "monthly" ? "$19" : "$15",
      period: "/month",
      description: "Essential diagnostics for single site owners.",
      features: [
        "Audit up to 3 websites",
        "Weekly automated scans",
        "Basic SEO & Performance metrics",
        "AI Chat Assistant limits (10 msgs/day)",
        "Email notifications",
      ],
      icon: Shield,
      colorClass: "from-blue-500 to-indigo-500",
    },
    {
      id: "pro",
      name: "Professional",
      price: billingPeriod === "monthly" ? "$49" : "$39",
      period: "/month",
      description: "Advanced performance insights for active web builders.",
      features: [
        "Audit up to 15 websites",
        "Daily automated scans",
        "Full SEO, Speed & Security reports",
        "Unlimited AI Chat Assistant queries",
        "CSV & PDF Report Exporting",
        "Step-by-step AI remediation guide",
      ],
      icon: Zap,
      colorClass: "from-blue-600 to-indigo-600",
      badge: "Most Popular",
      isPopular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: billingPeriod === "monthly" ? "$99" : "$79",
      period: "/month",
      description: "Scale monitoring with dedicated agent execution.",
      features: [
        "Unlimited website properties",
        "Real-time monitoring intervals",
        "Custom CSV/PDF branding templates",
        "Priority AI processing queue",
        "Dedicated API access key",
        "Direct developer Slack support",
      ],
      icon: Crown,
      colorClass: "from-slate-900 to-slate-800",
    },
  ];

  const handleSelectPlan = (planId: string) => {
    router.push(`/payment?plan=${planId}&billing=${billingPeriod}`);
  };

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl font-black tracking-tight text-slate-900">
          Upgrade Your Audit Power
        </h2>
        <p className="text-slate-500 text-sm font-semibold leading-relaxed">
          Unleash Lumina AI recommendations, automated daily scheduling, and high-fidelity PDF reporting to scale your properties.
        </p>

        {/* Toggle Billing Period */}
        <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200/60 rounded-full shadow-inner mt-4">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
              billingPeriod === "monthly"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("annually")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
              billingPeriod === "annually"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            Annually <span className="text-[10px] text-emerald-600 font-extrabold ml-0.5">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto w-full px-4">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          return (
            <GlassCard
              key={plan.id}
              className={cn(
                "rounded-[28px] overflow-hidden p-6 md:p-8 flex flex-col justify-between relative transition-all duration-300 border border-slate-200/80 shadow-md bg-white/70",
                plan.isPopular && "border-blue-500 shadow-lg ring-4 ring-blue-500/10 shadow-blue-500/5 bg-white"
              )}
            >
              {plan.badge && (
                <span className="absolute top-4 right-4 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </span>
              )}

              <div className="space-y-6">
                {/* Icon box */}
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-md",
                  plan.colorClass
                )}>
                  <PlanIcon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                  <p className="text-slate-400 text-xs mt-1.5 font-semibold leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price block */}
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-950 tracking-tight">{plan.price}</span>
                  <span className="text-slate-400 text-sm font-bold">{plan.period}</span>
                </div>

                <div className="w-full h-px bg-slate-100" />

                {/* Feature checklist */}
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-600 leading-normal">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action trigger button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={cn(
                  "w-full mt-8 py-3 rounded-full text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98",
                  plan.isPopular
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-950 hover:bg-slate-800 text-white"
                )}
              >
                <span>Upgrade to {plan.name}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
