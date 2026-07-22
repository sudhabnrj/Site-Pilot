"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSocialButton } from "./auth-social-button";
import { AuthTextField } from "./auth-text-field";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { loginSchema, type LoginInput } from "@/validators/auth.validator";

interface AuthCardProps {
  onSignIn?: (data: LoginInput) => Promise<void> | void;
  onSocialLogin?: (provider: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  serverError?: string | null;
  isLoading?: boolean;
}

export function AuthCard({
  onSignIn,
  onSocialLogin,
  onForgotPassword,
  onSignUp,
  serverError,
  isLoading = false,
}: AuthCardProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  const onSubmit = async (data: LoginInput) => {
    if (onSignIn) {
      await onSignIn(data);
    }
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

      {/* Global Server Error Banner */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in">
          <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <AuthTextField
          id="email"
          label="Email Address"
          placeholder="name@company.com"
          type="email"
          icon={Mail}
          value={emailValue}
          onChange={(val) => setValue("email", val, { shouldValidate: true })}
          error={errors.email?.message}
          disabled={isLoading}
        />
        
        <AuthTextField
          id="password"
          label="Password"
          placeholder="••••••••"
          type="password"
          icon={Lock}
          value={passwordValue}
          onChange={(val) => setValue("password", val, { shouldValidate: true })}
          error={errors.password?.message}
          disabled={isLoading}
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
          disabled={isLoading}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 select-none border border-blue-600 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <LogIn className="h-4 w-4 shrink-0 text-white/90" />
            </>
          )}
        </button>
      </form>

      {/* Footer Toggle */}
      <div className="text-center pt-2 select-none">
        <p className="text-xs font-semibold text-slate-400">
          Don't have an account?{" "}
          <button
            type="button"
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
