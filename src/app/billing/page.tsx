"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import {
  CreditCard,
  CheckCircle2,
  Download,
  Zap,
  Globe,
  Calendar,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAppSelector } from "@/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: "Paid" | "Pending" | "Failed";
}

const INVOICES_HISTORY: Invoice[] = [
  {
    id: "INV-2026-0701",
    date: "Jul 24, 2026",
    amount: "$19.00",
    plan: "Starter Plan (Monthly)",
    status: "Paid",
  },
  {
    id: "INV-2026-0601",
    date: "Jun 24, 2026",
    amount: "$19.00",
    plan: "Starter Plan (Monthly)",
    status: "Paid",
  },
  {
    id: "INV-2026-0501",
    date: "May 24, 2026",
    amount: "$19.00",
    plan: "Starter Plan (Monthly)",
    status: "Paid",
  },
];

export default function BillingPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const reportsHistory = useAppSelector((state) => state.audit.reportsHistory);
  const isAdmin = user?.role === "admin";

  const userPlan = isAdmin
    ? "enterprise"
    : user?.plan || (typeof window !== "undefined" ? (localStorage.getItem("user_plan") as any) : null) || "free";

  const maxSites = isAdmin ? 999 : userPlan === "enterprise" ? 999 : userPlan === "pro" ? 15 : userPlan === "starter" ? 3 : 1;
  const sitesCount = reportsHistory.length;

  const [invoices] = useState<Invoice[]>(INVOICES_HISTORY);

  const planPriceMap: Record<string, string> = {
    free: "$0 / month",
    starter: "$19 / month",
    pro: "$49 / month",
    enterprise: "$99 / month",
  };

  const handleDownloadReceipt = (invoice: Invoice) => {
    toast.info(`Downloading Receipt ${invoice.id}`, {
      description: `Preparing PDF receipt for ${invoice.plan} (${invoice.amount})...`,
    });

    const receiptContent = `
==============================================
           SITE PILOT AUDIT RECEIPT           
==============================================
Invoice ID   : ${invoice.id}
Date         : ${invoice.date}
Plan         : ${invoice.plan}
Amount Paid  : ${invoice.amount}
Status       : ${invoice.status}
Account Email: ${user?.email || "user@example.com"}
==============================================
Thank you for using Site Pilot!
`;

    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt_${invoice.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUpdatePaymentMethod = () => {
    toast.success("Update Payment Method", {
      description: "Payment details update modal initialized.",
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Billing & Subscription
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your active plan, payment method, usage quotas, and download payment receipts.
          </p>
        </div>

        <button
          onClick={() => router.push("/upgrade")}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold shadow-md active:scale-95 transition-all w-fit cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Change / Upgrade Plan</span>
        </button>
      </div>

      {/* Grid: Current Plan Summary & Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Active Subscription Overview Card */}
        <div className="lg:col-span-7 flex flex-col">
          <GlassCard className="p-6 md:p-8 rounded-[28px] border-slate-200/80 dark:border-slate-800 shadow-md bg-white/80 dark:bg-slate-900/80 h-full flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Current Subscription
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {userPlan} Plan
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900">
                  Active Status
                </span>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Pricing</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {planPriceMap[userPlan] || "$19 / month"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400 font-semibold">Renewal Date</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mt-1">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    <span>August 24, 2026</span>
                  </p>
                </div>
              </div>

              {/* Usage Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-blue-600" /> Monitored Websites Quota
                  </span>
                  <span>
                    {sitesCount} / {isAdmin ? "∞" : maxSites} Sites Used
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      sitesCount >= maxSites ? "bg-amber-500" : "bg-blue-600"
                    )}
                    style={{
                      width: `${Math.min(100, (sitesCount / (isAdmin ? 10 : maxSites)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 font-semibold">
                Auto-renewal enabled. Cancel anytime.
              </p>
              <button
                onClick={() => router.push("/upgrade")}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Manage Plan Features</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Payment Method Card */}
        <div className="lg:col-span-5 flex flex-col">
          <GlassCard className="p-6 md:p-8 rounded-[28px] border-slate-200/80 dark:border-slate-800 shadow-md bg-white/80 dark:bg-slate-900/80 h-full flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Payment Method
                    </h3>
                    <p className="text-xs text-slate-400">Primary billing card on file</p>
                  </div>
                </div>
              </div>

              {/* Card visual mockup */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg space-y-4 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <CreditCard className="h-24 w-24" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                    VISA CARD
                  </span>
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-lg font-mono tracking-widest font-bold">
                  •••• •••• •••• 4242
                </p>
                <div className="flex justify-between items-end text-[10px] font-semibold text-slate-300">
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-slate-400">Cardholder</p>
                    <p className="font-bold text-white text-xs">{user?.firstName ? `${user.firstName} ${user.lastName}` : "Sudha Banerjee"}</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-slate-400">Expires</p>
                    <p className="font-bold text-white text-xs">12 / 28</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleUpdatePaymentMethod}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-sm"
            >
              Update Payment Method
            </button>
          </GlassCard>
        </div>
      </div>

      {/* Invoices & Billing History */}
      <GlassCard className="p-6 md:p-8 rounded-[28px] border-slate-200/80 dark:border-slate-800 shadow-md bg-white/80 dark:bg-slate-900/80 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Billing History & Invoices
              </h3>
              <p className="text-xs text-slate-400">Download PDF receipts for past monthly statements</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-4">Invoice</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 font-mono font-bold text-xs text-slate-800 dark:text-slate-200 pl-4">
                    {inv.id}
                  </td>
                  <td className="py-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {inv.date}
                  </td>
                  <td className="py-4 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {inv.plan}
                  </td>
                  <td className="py-4 text-xs font-black text-slate-900 dark:text-white">
                    {inv.amount}
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900">
                      <CheckCircle2 className="h-3 w-3" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button
                      onClick={() => handleDownloadReceipt(inv)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
