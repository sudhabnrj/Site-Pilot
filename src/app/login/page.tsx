"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth-slice";
import { LoginInput } from "@/validators/auth.validator";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSignIn = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setServerError(result.message || "Failed to sign in. Please try again.");
        setIsLoading(false);
        return;
      }

      // Update Redux state with user credentials
      dispatch(setCredentials({ user: result.user }));

      // Redirect to return url or Dashboard (/)
      const redirectUrl = searchParams.get("from") || "/";
      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setServerError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`OAuth login with ${provider} is coming soon!`);
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 select-none">
      {/* Central Login Card */}
      <AuthCard
        onSignIn={handleSignIn}
        onSocialLogin={handleSocialLogin}
        onForgotPassword={handleForgotPassword}
        onSignUp={handleSignUp}
        serverError={serverError}
        isLoading={isLoading}
      />

      {/* Subtle System Status Bar */}
      <div className="flex justify-between items-center px-4 text-[10px] font-black text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="uppercase tracking-wider">System Operational</span>
        </div>
        <div className="flex gap-4 uppercase tracking-wider">
          <button
            onClick={() => alert("Privacy Policy terms: AuditAI protects your data.")}
            className="hover:text-slate-600 transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            onClick={() => alert("Terms of Service: By using AuditAI you agree to system guidelines.")}
            className="hover:text-slate-600 transition-colors cursor-pointer"
          >
            Terms
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-xs font-bold p-8">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
