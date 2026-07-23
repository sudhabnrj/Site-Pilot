"use client";

import { useState } from "react";
import { type LucideIcon, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthTextFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  icon: LucideIcon;
  value?: string;
  onChange?: (val: string) => void;
  rightElement?: React.ReactNode;
  required?: boolean;
  error?: string;
  [key: string]: any;
}

export function AuthTextField({
  id,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  value,
  onChange,
  rightElement,
  required = false,
  error,
  ...props
}: AuthTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 select-none">
      <div className="flex justify-between items-center select-none">
        <label htmlFor={id} className="text-xs font-medium text-slate-700 select-none">
          {label}
        </label>
        {rightElement}
      </div>
      
      <div className="relative flex items-center group">
        <span className="absolute left-3 text-slate-400 select-none group-focus-within:text-blue-600 transition-colors pointer-events-none">
          <Icon className="h-4.5 w-4.5" />
        </span>
        
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          className={cn(
            "w-full pl-10 pr-10 py-3 rounded-xl border bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-4 text-xs font-semibold tracking-wide text-slate-700 transition-all duration-200 outline-none placeholder:text-slate-400",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-600 focus:ring-blue-100"
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer select-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4.5 w-4.5" />
            ) : (
              <Eye className="h-4.5 w-4.5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-[11px] font-bold text-red-500 mt-0.5 ml-1">{error}</p>}
    </div>
  );
}
