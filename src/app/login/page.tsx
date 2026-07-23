"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth-slice";
import { LoginInput } from "@/validators/auth.validator";
import { useSocialLogin } from "@/hooks/useSocialLogin";
import { Brain } from "lucide-react";
import { toast } from "sonner";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { handleSocialLogin, isLoading: isSocialLoading } = useSocialLogin();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Listen for OAuth callback errors in searchParams
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      let message = "OAuth sign-in failed. Please try again.";
      if (oauthError === "AccessDenied" || oauthError === "Callback") {
        message = "Login was cancelled or access was denied.";
      } else if (oauthError === "OAuthSignin" || oauthError === "OAuthCallback") {
        message = "Failed to communicate with authentication provider.";
      }
      setServerError(message);
      toast.error("Authentication Error", { description: message });
    }
  }, [searchParams]);

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
        const errorMsg = result.message || "Failed to sign in. Please try again.";
        setServerError(errorMsg);
        setIsLoading(false);

        if (result.emailUnverified) {
          toast.warning("Account Unverified", {
            description: errorMsg,
          });
        } else {
          toast.error("Login Failed", {
            description: errorMsg,
          });
        }
        return;
      }

      toast.success("Login Successful", {
        description: `Welcome back, ${result.user.firstName || result.user.name || "User"}!`,
      });

      // Update Redux state with user credentials
      dispatch(setCredentials({ user: result.user }));

      // Redirect to return url or Dashboard (/dashboard)
      const redirectUrl = searchParams.get("from") || "/dashboard";
      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      const netMsg = "Network error. Please check your connection and try again.";
      setServerError(netMsg);
      toast.error("Network Error", { description: netMsg });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <div className="w-full max-w-[480px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700 select-none">
      {/* Brand Logo Header */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
            <Brain className="h-6 w-6" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-slate-800">
            Site Pilot
          </span>
        </div>
      </div>

      {/* Central Login Card */}
      <AuthCard
        onSignIn={handleSignIn}
        onSocialLogin={handleSocialLogin}
        onForgotPassword={handleForgotPassword}
        onSignUp={handleSignUp}
        serverError={serverError}
        isLoading={isLoading || isSocialLoading}
      />
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
