"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export interface UseSocialLoginReturn {
  isLoading: boolean;
  loadingProvider: string | null;
  handleSocialLogin: (provider: "google" | "github" | string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
}

export function useSocialLogin(): UseSocialLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const handleSocialLogin = async (providerName: "google" | "github" | string) => {
    const normalizedProvider = providerName.toLowerCase();

    if (normalizedProvider !== "google" && normalizedProvider !== "github") {
      toast.error("Unsupported Provider", {
        description: `Authentication provider '${providerName}' is not supported.`,
      });
      return;
    }

    try {
      setIsLoading(true);
      setLoadingProvider(normalizedProvider);

      const callbackUrl = searchParams.get("from") || "/dashboard";

      toast.loading(`Connecting to ${normalizedProvider === "google" ? "Google" : "GitHub"}...`, {
        id: "oauth-toast",
      });

      const res = await signIn(normalizedProvider, {
        callbackUrl,
        redirect: true,
      });

      if (res?.error) {
        toast.dismiss("oauth-toast");
        let errorMessage = "Authentication failed. Please try again.";

        if (res.error === "OAuthSignin" || res.error === "OAuthCallback") {
          errorMessage = "Could not connect to provider. Please check your network or try again.";
        } else if (res.error === "AccessDenied") {
          errorMessage = "Login was cancelled or access was denied.";
        } else if (res.error === "Configuration") {
          errorMessage = "OAuth configuration error. Please contact administrator.";
        }

        toast.error("OAuth Sign-in Failed", {
          description: errorMessage,
        });
        setIsLoading(false);
        setLoadingProvider(null);
      }
    } catch (err: any) {
      toast.dismiss("oauth-toast");
      console.error(`OAuth error during ${providerName} sign-in:`, err);
      toast.error("Network Failure", {
        description: "An unexpected network error occurred. Please check your connection.",
      });
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const loginWithGoogle = () => handleSocialLogin("google");
  const loginWithGithub = () => handleSocialLogin("github");

  return {
    isLoading,
    loadingProvider,
    handleSocialLogin,
    loginWithGoogle,
    loginWithGithub,
  };
}
