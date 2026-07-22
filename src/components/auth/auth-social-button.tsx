"use client";

import { cn } from "@/lib/utils";

interface AuthSocialButtonProps {
  label: string;
  iconSrc: string;
  onClick?: () => void;
}

export function AuthSocialButton({
  label,
  iconSrc,
  onClick,
}: AuthSocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 transition-all duration-200 select-none shadow-sm font-bold text-xs text-slate-700"
    >
      <img className="h-5 w-5 object-contain" src={iconSrc} alt={`${label} icon`} />
      <span>{label}</span>
    </button>
  );
}
