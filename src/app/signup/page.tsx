"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpCard } from "@/components/auth/sign-up-card";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth-slice";
import { RegisterInput } from "@/validators/auth.validator";

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSignUp = async (data: RegisterInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setServerError(result.message || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Update Redux state
      dispatch(setCredentials({ user: result.user }));

      // Redirect to Dashboard (/)
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setServerError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`OAuth registration with ${provider} is coming soon!`);
  };

  const handleLogIn = () => {
    router.push("/login");
  };

  const handleTermsClick = () => {
    alert("Terms of Service: By signing up for AuditAI you agree to system guidelines.");
  };

  const handlePrivacyClick = () => {
    alert("Privacy Policy: AuditAI protects your data and privacy.");
  };

  return (
    <div className="w-full max-w-[480px] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 select-none">
      {/* Central Sign Up Card */}
      <SignUpCard
        onSignUp={handleSignUp}
        onSocialLogin={handleSocialLogin}
        onLogIn={handleLogIn}
        onTermsClick={handleTermsClick}
        onPrivacyClick={handlePrivacyClick}
        serverError={serverError}
        isLoading={isLoading}
      />

      {/* Subtle system status bar */}
      <div className="flex justify-between items-center px-4 text-[10px] font-black text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="uppercase tracking-wider">System Operational</span>
        </div>
        <div className="flex gap-4 uppercase tracking-wider">
          <button
            onClick={handlePrivacyClick}
            className="hover:text-slate-600 transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            onClick={handleTermsClick}
            className="hover:text-slate-600 transition-colors cursor-pointer"
          >
            Terms
          </button>
        </div>
      </div>
    </div>
  );
}
