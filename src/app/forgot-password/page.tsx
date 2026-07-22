"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, Loader2, Brain } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validators/auth.validator";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setServerError(result.message || "Failed to process request");
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setServerError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700 select-none">
      {/* Logo Anchor */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
            <Brain className="h-6 w-6" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-blue-600">
            AuditAI
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-8 shadow-xl shadow-slate-200/50">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Reset Password</h1>
              <p className="text-xs font-semibold text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                Enter your email to receive a password reset link
              </p>
            </div>

            {serverError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@company.com"
                    disabled={isLoading}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] font-bold text-red-500 mt-1 ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl shadow-md shadow-blue-600/10 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-4 animate-in fade-in">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Check your email</h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-[300px] mx-auto mb-4">
              If an account with that email exists, we've sent a password reset link to your inbox.
            </p>
          </div>
        )}

        {/* Footer Link */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col items-center">
          <Link
            href="/login"
            className="group flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] font-medium text-slate-400">
        © 2026 AuditAI Platforms Inc. All rights reserved.
      </p>
    </main>
  );
}
