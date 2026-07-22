"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ArrowRight, ArrowLeft, CheckCircle2, Loader2, Brain } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordInput } from "@/validators/auth.validator";
import { AuthTextField } from "@/components/auth/auth-text-field";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
      password: "",
      confirmPassword: "",
    },
  });

  const passwordVal = watch("password");
  const confirmPasswordVal = watch("confirmPassword");

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token: token || data.token }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setServerError(result.message || "Password reset failed");
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setServerError("Network error. Please try again.");
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
              <h1 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Set New Password</h1>
              <p className="text-xs font-semibold text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                Please enter and confirm your new password
              </p>
            </div>

            {serverError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {!token && (
              <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-4 py-3 rounded-xl">
                Warning: No reset token detected in URL. Please use the link sent to your email.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AuthTextField
                id="password"
                label="New Password"
                placeholder="••••••••"
                type="password"
                icon={Lock}
                value={passwordVal}
                onChange={(val) => setValue("password", val, { shouldValidate: true })}
                error={errors.password?.message}
                disabled={isLoading}
              />

              <AuthTextField
                id="confirmPassword"
                label="Confirm New Password"
                placeholder="••••••••"
                type="password"
                icon={Lock}
                value={confirmPasswordVal}
                onChange={(val) => setValue("confirmPassword", val, { shouldValidate: true })}
                error={errors.confirmPassword?.message}
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl shadow-md shadow-blue-600/10 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm New Password</span>
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
            <h3 className="text-lg font-bold text-slate-800 mb-2">Password Reset Complete!</h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-[300px] mx-auto mb-4">
              Your password has been updated successfully. Redirecting you to login...
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-xs font-bold p-8">Loading reset page...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
