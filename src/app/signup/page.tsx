"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignUpCard } from "@/components/auth/sign-up-card";
import { RegisterInput } from "@/validators/auth.validator";
import { useSocialLogin } from "@/hooks/useSocialLogin";
import { Brain } from "lucide-react";
import { toast } from "sonner";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleSocialLogin, isLoading: isSocialLoading } = useSocialLogin();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Listen for OAuth callback errors in searchParams
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      let message = "OAuth registration failed. Please try again.";
      if (oauthError === "AccessDenied" || oauthError === "Callback") {
        message = "Registration was cancelled or access was denied.";
      } else if (oauthError === "OAuthSignin" || oauthError === "OAuthCallback") {
        message = "Failed to communicate with authentication provider.";
      }
      setServerError(message);
      toast.error("Authentication Error", { description: message });
    }
  }, [searchParams]);

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
        const errorMsg = result.message || "Registration failed. Please try again.";
        setServerError(errorMsg);
        toast.error("Registration Failed", { description: errorMsg });
        setIsLoading(false);
        return;
      }

      toast.success("Account Created Successfully!", {
        description: "A verification email has been sent. Please check your inbox to activate your account.",
        duration: 6000,
      });

      // Redirect to verification instructions page
      router.push("/verify-email");
    } catch (err: any) {
      const netMsg = "Network error. Please check your connection and try again.";
      setServerError(netMsg);
      toast.error("Network Error", { description: netMsg });
      setIsLoading(false);
    }
  };

  const handleLogIn = () => {
    router.push("/login");
  };

  const handleTermsClick = () => {
    toast.info("Terms of Service", {
      description: "By signing up for Site Pilot you agree to our platform guidelines.",
    });
  };

  const handlePrivacyClick = () => {
    toast.info("Privacy Policy", {
      description: "Site Pilot protects your data and privacy.",
    });
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

      {/* Central Sign Up Card */}
      <SignUpCard
        onSignUp={handleSignUp}
        onSocialLogin={handleSocialLogin}
        onLogIn={handleLogIn}
        onTermsClick={handleTermsClick}
        onPrivacyClick={handlePrivacyClick}
        serverError={serverError}
        isLoading={isLoading || isSocialLoading}
      />
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-xs font-bold p-8">Loading signup...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
