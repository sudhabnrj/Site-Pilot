"use client";

import { useState } from "react";
import { AuthSocialButton } from "./auth-social-button";
import { AuthTextField } from "./auth-text-field";
import { Mail, Lock, User, Shield, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface SignUpCardProps {
  onSignUp?: (name: string, email: string, pass: string, agree: boolean) => void;
  onSocialLogin?: (provider: string) => void;
  onLogIn?: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
}

export function SignUpCard({
  onSignUp,
  onSocialLogin,
  onLogIn,
  onTermsClick,
  onPrivacyClick,
}: SignUpCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp?.(name, email, password, agree);
  };

  return (
    <GlassCard className="w-full max-w-[480px] p-8 border-slate-200/80 shadow-2xl rounded-2xl flex flex-col gap-6 bg-white/80">
      {/* Header section */}
      <div className="flex flex-col gap-2 select-none">
        <div className="flex items-center gap-2 select-none">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100/50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
            <Shield className="h-6 w-6" />
          </div>
          <span className="font-display text-xl font-black text-slate-800 tracking-tight leading-none">
            AuditAI
          </span>
        </div>
        <div className="mt-4">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Create your account</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 select-none">
            Start auditing with precision and AI-driven insights.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthTextField
          id="name"
          label="Full Name"
          placeholder="John Doe"
          type="text"
          icon={User}
          value={name}
          onChange={setName}
          required
        />
        
        <AuthTextField
          id="email"
          label="Work Email"
          placeholder="name@company.com"
          type="email"
          icon={Mail}
          value={email}
          onChange={setEmail}
          required
        />
        
        <AuthTextField
          id="password"
          label="Password"
          placeholder="••••••••"
          type="password"
          icon={Lock}
          value={password}
          onChange={setPassword}
          required
        />

        {/* Terms and conditions checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group mt-2 select-none">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            required
            className="mt-0.5 peer h-4 w-4 rounded border-slate-200 bg-slate-50 text-blue-600 focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
          />
          <span className="text-[11px] font-semibold text-slate-400 leading-tight">
            I agree to the{" "}
            <button
              type="button"
              onClick={onTermsClick}
              className="text-blue-600 font-extrabold hover:underline"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={onPrivacyClick}
              className="text-blue-600 font-extrabold hover:underline"
            >
              Privacy Policy
            </button>
            .
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 select-none border border-blue-600"
        >
          <span>Create Account</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-white/90" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center py-1 select-none">
        <div className="flex-grow border-t border-slate-100" />
        <span className="flex-shrink mx-3 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
          Or continue with
        </span>
        <div className="flex-grow border-t border-slate-100" />
      </div>

      {/* Social login oauth buttons */}
      <div className="grid grid-cols-2 gap-3 select-none">
        <AuthSocialButton
          label="Google"
          iconSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuB8-Znmxt8QQEI2g9xJD2CyzP8kWX6ZVcd9ICs1wu2G6VIrOKQl1Con_osQpydPxh-TOodQISYi25KjRHVYFMHKl-IaxcGNdzeACcaiZuSr85QC1k2RdeIYUMvTnWJ9FUJEEyYHIpHlJk9qUFNe5lfMqLfm7BaGidXzNAIWQcoya0bRBaMlRvXIKw6wgqpGymH1O7vHkPCo3kvdyzkEDe10Zp0qJcRFMf8XB_5MIUjxa4kN8e6rCUP9jg"
          onClick={() => onSocialLogin?.("Google")}
        />
        <AuthSocialButton
          label="GitHub"
          iconSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuB_OXzZ5s2m7y4kG4Lu5ogUqDpxa-oLy7cSfmRf1HKh2cpJ4pT3SppjKx2PPm8sUnvQ7Jx83T1r6KPSXl4P3IB9dshfV_ESTH5kzSfuYfKD2t6dPffDHrKStQ3cqLZZDYUtCSkYl4EgVKsZHInr48GIvWqDqHV1ANtMBgtDMxmC9lg_uTZbQ8D5YGRzm6HTqE_PHYCo3EXcUZmTZXtUdwfPkkjcSEx_pv2TJIa7Isqgaj6DkNGV6y_UuQ"
          onClick={() => onSocialLogin?.("GitHub")}
        />
      </div>

      {/* Footer login toggle */}
      <div className="text-center pt-2 select-none">
        <p className="text-xs font-semibold text-slate-400">
          Already have an account?{" "}
          <button
            onClick={onLogIn}
            className="text-blue-600 font-extrabold hover:underline cursor-pointer"
          >
            Log In
          </button>
        </p>
      </div>
    </GlassCard>
  );
}
