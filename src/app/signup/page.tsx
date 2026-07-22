"use client";

import { SignUpCard } from "@/components/auth/sign-up-card";

export default function SignUpPage() {
  const handleSignUp = (name: string, email: string, pass: string, agree: boolean) => {
    if (!agree) {
      alert("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }
    alert(`Creating account for ${name} (${email})...`);
  };

  const handleSocialLogin = (provider: string) => {
    alert(`Redirecting to ${provider} OAuth authentication...`);
  };

  const handleLogIn = () => {
    alert("Navigating to sign in page...");
  };

  const handleTermsClick = () => {
    alert("Loading Terms of Service...");
  };

  const handlePrivacyClick = () => {
    alert("Loading Privacy Policy...");
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
