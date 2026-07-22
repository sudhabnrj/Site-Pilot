"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSocialButton } from "./auth-social-button";
import { AuthTextField } from "./auth-text-field";
import { Mail, Lock, User, Shield, ArrowRight, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { registerSchema, type RegisterInput } from "@/validators/auth.validator";

interface SignUpCardProps {
  onSignUp?: (data: RegisterInput) => Promise<void> | void;
  onSocialLogin?: (provider: string) => void;
  onLogIn?: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
  serverError?: string | null;
  isLoading?: boolean;
}

export function SignUpCard({
  onSignUp,
  onSocialLogin,
  onLogIn,
  onTermsClick,
  onPrivacyClick,
  serverError,
  isLoading = false,
}: SignUpCardProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const firstNameVal = watch("firstName");
  const lastNameVal = watch("lastName");
  const emailVal = watch("email");
  const passwordVal = watch("password");
  const confirmPasswordVal = watch("confirmPassword");

  const onSubmit = async (data: RegisterInput) => {
    if (onSignUp) {
      await onSignUp(data);
    }
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

      {/* Global Server Error */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in">
          <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <AuthTextField
            id="firstName"
            label="First Name"
            placeholder="John"
            type="text"
            icon={User}
            value={firstNameVal}
            onChange={(val) => setValue("firstName", val, { shouldValidate: true })}
            error={errors.firstName?.message}
            disabled={isLoading}
          />
          <AuthTextField
            id="lastName"
            label="Last Name"
            placeholder="Doe"
            type="text"
            icon={User}
            value={lastNameVal}
            onChange={(val) => setValue("lastName", val, { shouldValidate: true })}
            error={errors.lastName?.message}
            disabled={isLoading}
          />
        </div>

        <AuthTextField
          id="email"
          label="Work Email"
          placeholder="name@company.com"
          type="email"
          icon={Mail}
          value={emailVal}
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
          value={passwordVal}
          onChange={(val) => setValue("password", val, { shouldValidate: true })}
          error={errors.password?.message}
          disabled={isLoading}
        />

        <AuthTextField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="••••••••"
          type="password"
          icon={Lock}
          value={confirmPasswordVal}
          onChange={(val) => setValue("confirmPassword", val, { shouldValidate: true })}
          error={errors.confirmPassword?.message}
          disabled={isLoading}
        />

        {/* Terms and conditions checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group mt-1 select-none">
          <input
            type="checkbox"
            required
            disabled={isLoading}
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
          disabled={isLoading}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 select-none border border-blue-600 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-white/90" />
            </>
          )}
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
            type="button"
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
