"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck, CreditCard, Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { useAppDispatch } from "@/store";
import { updateUserPlan } from "@/store/slices/auth-slice";

function PaymentContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const planId = searchParams.get("plan") || "pro";
  const billing = searchParams.get("billing") || "monthly";

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Map chosen plan details
  const planInfo = {
    starter: { name: "Starter Tier Plan", price: billing === "monthly" ? 19 : 15 },
    pro: { name: "Professional Tier Plan", price: billing === "monthly" ? 49 : 39 },
    enterprise: { name: "Enterprise Tier Plan", price: billing === "monthly" ? 99 : 79 },
  }[planId] || { name: "Professional Tier Plan", price: 49 };

  const totalAmount = billing === "annually" ? planInfo.price * 12 : planInfo.price;

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    const matches = val.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(val);
    }
  };

  // Format Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) {
      setExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
    } else {
      setExpiry(val);
    }
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || cardNumber.length < 19) {
      toast.error("Invalid Credit Card Number");
      return;
    }
    if (!expiry || expiry.length < 5) {
      toast.error("Invalid Expiration Date");
      return;
    }
    if (!cvv || cvv.length < 3) {
      toast.error("Invalid Security Code (CVV)");
      return;
    }
    if (!nameOnCard.trim()) {
      toast.error("Name on Card is required");
      return;
    }

    setIsProcessing(true);

    // Simulate payment authorization processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setIsProcessing(false);
    setPaymentSuccess(true);

    // Update Redux state & localStorage
    dispatch(updateUserPlan(planId as any));
    if (typeof window !== "undefined") {
      localStorage.setItem("user_plan", planId);
    }

    toast.success("Payment Authorized!", {
      description: `Your account has been upgraded to ${planInfo.name}.`,
    });

    // Hold success message before redirect
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-16 px-4">
      {/* Back to upgrade */}
      <button
        onClick={() => router.push("/upgrade")}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors w-fit cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Pricing Plans</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Payment Form Panel */}
        <div className="lg:col-span-3">
          <GlassCard className="p-6 md:p-8 rounded-[28px] border-slate-200 bg-white/70 shadow-lg">
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span>Credit Card Details</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1 font-semibold leading-relaxed">
                Site Pilot transactions are fully encrypted and secured.
              </p>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Name on Card
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs font-mono font-semibold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Security Code (CVV)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="123"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                  />
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isProcessing || paymentSuccess}
                className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Authorization...</span>
                  </>
                ) : paymentSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span>Payment Complete! Upgrade Active</span>
                  </>
                ) : (
                  <span>Authorize Payment of ${totalAmount.toFixed(2)}</span>
                )}
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Order Summary Panel */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 rounded-[28px] border-slate-200 bg-slate-50/80 shadow-md space-y-6">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Order Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-start text-xs font-semibold text-slate-700">
                <div>
                  <p className="font-bold text-slate-900">{planInfo.name}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5 uppercase tracking-wide">
                    Billed {billing === "monthly" ? "monthly" : "annually"}
                  </p>
                </div>
                <span>${planInfo.price}/{billing === "monthly" ? "mo" : "mo"}</span>
              </div>

              {billing === "annually" && (
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                  <span>Billing Period</span>
                  <span>12 Months</span>
                </div>
              )}

              <div className="w-full h-px bg-slate-200" />

              <div className="flex justify-between items-baseline">
                <span className="text-xs font-black text-slate-900">Total Amount Due</span>
                <span className="text-xl font-black text-blue-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-3 items-start select-none">
              <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] font-semibold leading-relaxed text-blue-700">
                You will receive full premium diagnostic capabilities immediately. If you have any issues, contact support.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
