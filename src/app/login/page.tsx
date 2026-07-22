"use client";

import { AuthCard } from "@/components/auth/auth-card";

export default function LoginPage() {
  const handleSignIn = (email: string, pass: string) => {
    alert(`Signing in with credentials: ${email} ...`);
  };

  const handleSocialLogin = (provider: string) => {
    alert(`Redirecting to ${provider} OAuth authentication...`);
  };

  const handleForgotPassword = () => {
    alert("Navigating to password reset page...");
  };

  const handleSignUp = () => {
    alert("Navigating to sign up registration page...");
  };

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 select-none">
      {/* Central Login Card */}
      <AuthCard
        onSignIn={handleSignIn}
        onSocialLogin={handleSocialLogin}
        onForgotPassword={handleForgotPassword}
        onSignUp={handleSignUp}
      />

      {/* Subtle System Status Bar */}
      <div className="flex justify-between items-center px-4 text-[10px] font-black text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="uppercase tracking-wider">System Operational</span>
        </div>
        <div className="flex gap-4 uppercase tracking-wider">
          <button
            onClick={() => alert("Loading Privacy Policy terms...")}
            className="hover:text-slate-600 transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            onClick={() => alert("Loading Terms of Service conditions...")}
            className="hover:text-slate-600 transition-colors cursor-pointer"
          >
            Terms
          </button>
        </div>
      </div>
    </div>
  );
}
