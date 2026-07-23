"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialAuth } from "./SocialAuth";
import { AuthTextField } from "./auth-text-field";
import { Mail, Lock, LogIn, Loader2, ArrowRight } from "lucide-react";
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
    <GlassCard className="w-full max-w-[480px] p-8 border-slate-200/80 shadow-2xl rounded-2xl flex flex-col gap-6 bg-white/80">
      {/* Header Info */}
      <div className="flex flex-col items-center gap-1 text-center select-none">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome back</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1 select-none">
          Please enter your details to sign in.
        </p>
      </div>

      {/* Global Server Error Banner */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in">
          <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Social Login Integrations */}
      <SocialAuth
        onSocialLogin={onSocialLogin}
        isLoading={isLoading}
      />

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
            <div className="flex items-center justify-center gap-2">
              <span className="leading-[1px]">Sign In</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-white/90" />
            </div>
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
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </GlassCard>
  );
}
