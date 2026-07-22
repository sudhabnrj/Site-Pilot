"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ExternalLink, ArrowLeft, CheckCircle2, Loader2, Brain } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verifying, setVerifying] = useState(Boolean(token));
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function verifyToken() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();
        if (data.success) {
          setVerified(true);
          setMessage("Your email address has been verified successfully!");
        } else {
          setMessage(data.message || "Invalid or expired verification link.");
        }
      } catch (err) {
        setMessage("Verification failed. Please try again.");
      } finally {
        setVerifying(false);
      }
    }

    verifyToken();
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user@example.com" }),
      });
      const data = await res.json();
      setMessage(data.message || "Verification email sent.");
    } catch {
      setMessage("Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="w-full max-w-[440px] flex flex-col items-center select-none animate-in fade-in duration-700">
      {/* Branding Anchor */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
          <Brain className="h-6 w-6" />
        </div>
        <span className="font-display text-2xl font-bold tracking-tight text-slate-800">
          AuditAI
        </span>
      </div>

      {/* Central Card */}
      <div className="bg-white border border-slate-200/80 p-10 rounded-[24px] shadow-xl shadow-slate-200/50 w-full flex flex-col items-center text-center">
        {verifying ? (
          <div className="py-8 flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="text-xs font-bold text-slate-600">Verifying your email address...</p>
          </div>
        ) : verified ? (
          <div className="py-4 flex flex-col items-center gap-3 animate-in fade-in">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100 shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Email Verified!</h1>
            <p className="text-xs font-semibold text-slate-500 max-w-[300px] leading-relaxed">
              Your email has been confirmed. You can now access all features of AuditAI.
            </p>
            <Link
              href="/login"
              className="w-full mt-4 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md"
            >
              <span>Continue to Login</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Mail Icon Container */}
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
              <Mail className="h-10 w-10" />
            </div>

            {/* Heading & Subtext */}
            <h1 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Check your inbox</h1>
            <p className="text-xs font-semibold text-slate-500 max-w-[320px] mb-6 leading-relaxed">
              We've sent a link to your email address. Please click the link to verify your account.
            </p>

            {message && (
              <div className="mb-4 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl w-full">
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="w-full space-y-3">
              <button
                type="button"
                onClick={() => window.open("https://mail.google.com", "_blank")}
                className="w-full h-12 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Open Gmail</span>
                <ExternalLink className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="w-full h-12 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {resending ? "Sending..." : "Resend Email"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer Link */}
      <div className="mt-8">
        <Link
          href="/login"
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-xs font-bold group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-xs font-bold p-8">Loading verification page...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
