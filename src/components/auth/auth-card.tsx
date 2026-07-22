"use client";

import { useState } from "react";
import { AuthSocialButton } from "./auth-social-button";
import { AuthTextField } from "./auth-text-field";
import { Mail, Lock, LogIn } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface AuthCardProps {
  onSignIn?: (email: string, pass: string) => void;
  onSocialLogin?: (provider: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

export function AuthCard({
  onSignIn,
  onSocialLogin,
  onForgotPassword,
  onSignUp,
}: AuthCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn?.(email, password);
  };

  return (
    <GlassCard className="w-full max-w-[440px] p-8 border-slate-200/80 shadow-2xl rounded-2xl flex flex-col gap-6 bg-white/80">
      {/* Header Info */}
      <div className="flex flex-col items-center gap-4 text-center select-none">
        <div className="flex items-center gap-2 text-blue-600">
          <svg
            fill="currentColor"
            viewBox="0 0 48 48"
            className="h-8 w-8 animate-pulse"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
              fillRule="evenodd"
            />
          </svg>
          <span className="text-xl font-black tracking-tight leading-none">AuditAI</span>
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Welcome back</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 select-none">
            Please enter your details to sign in.
          </p>
        </div>
      </div>

      {/* Social Login Integrations */}
      <div className="grid grid-cols-2 gap-3 select-none">
        <AuthSocialButton
          label="Google"
          iconSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBEh54DmF99cDH7YjBz7GQnKreGim6V-Y9Wapoh4XLnJtfPo6Oo-6F5Ukt_NbhDoUvlKJnGhaYrx_cxaLC_Q344PGGEpxrHolccLyzrU7mr2sWOJc6jqY7UwbKVcOaZltFSS9QBD78R-AFw-pxlHCbnJYjQHCZuit_bXXZUD3-JpRe8Jc6_toi-INICN9-L-hLsBW-deKoWMNMWWqWtZ6K3fwTEYKiwc0LPUTGI69vddd7xs8yNxQAgZg"
          onClick={() => onSocialLogin?.("Google")}
        />
        <AuthSocialButton
          label="GitHub"
          iconSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuCax2eR1BeoOD-SnglPc3NxRLPGIvx_nvJK-FH2DN_O4DDIyOzTZt0cTpFLfUAJsPXjHDFJxhn5KhSz5c_5SkZoLxvBZp5FeJCIlaIgjzhWCkDu9RH1jjFAkeVxiit9dU6DRjBzxAehN_DJxTZM2fpXXsg9e57ezqH5gnprMDM_X_vTHRnAGy0Km0s8sxA9podMWKv5nWTDsM21PH8jcLPzCuqxNeyOMBtTX3Aojd3S5AkhdAgyzrnBgA"
          onClick={() => onSocialLogin?.("GitHub")}
        />
      </div>

      {/* Divider */}
      <div className="relative flex items-center py-1 select-none">
        <div className="flex-grow border-t border-slate-100" />
        <span className="flex-shrink mx-3 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
          Or continue with
        </span>
        <div className="flex-grow border-t border-slate-100" />
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthTextField
          id="email"
          label="Email Address"
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
          rightElement={
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[10px] font-bold text-blue-600 hover:underline transition-all cursor-pointer select-none"
            >
              Forgot password?
            </button>
          }
        />

        {/* Submit Action */}
        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 select-none border border-blue-600"
        >
          <span>Sign In</span>
          <LogIn className="h-4 w-4 shrink-0 text-white/90" />
        </button>
      </form>

      {/* Footer Toggle */}
      <div className="text-center pt-2 select-none">
        <p className="text-xs font-semibold text-slate-400">
          Don't have an account?{" "}
          <button
            onClick={onSignUp}
            className="text-blue-600 font-extrabold hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </GlassCard>
  );
}
