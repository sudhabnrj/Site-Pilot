"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { User, Mail, Lock, Shield, Bell, Key, Save, Check, Moon, Sun, Monitor, Eye, EyeOff } from "lucide-react";
import { useAppSelector } from "@/store";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: session } = useSession();

  const userAvatar = user?.profileImage || user?.image || user?.avatar || session?.user?.image || "";
  const userProvider = user?.provider || (session?.user as any)?.provider || "";

  const [name, setName] = useState(
    user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || (user as any).name || session?.user?.name || "User"
      : session?.user?.name || "Sudha Banerjee"
  );
  const [email] = useState(user?.email || session?.user?.email || "sudha.banerjee@codeclouds.in");
  const [scanFrequency, setScanFrequency] = useState("Daily");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [apiKey, setApiKey] = useState("sp_live_9481920491823091");
  const [isSaving, setIsSaving] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Theme Preference State
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("light");

  useEffect(() => {
    if (user) {
      const computedName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || (user as any).name;
      if (computedName) setName(computedName);
    } else if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [user, session]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setThemeMode("dark");
      } else if (savedTheme === "light") {
        setThemeMode("light");
      } else {
        setThemeMode("system");
      }
    }
  }, []);

  const handleSelectTheme = (mode: "light" | "dark" | "system") => {
    setThemeMode(mode);
    if (typeof window !== "undefined") {
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        toast.success("Dark Mode Active");
      } else if (mode === "light") {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        toast.success("Light Mode Active");
      } else {
        localStorage.removeItem("theme");
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        toast.info("System Theme Active");
      }
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Account Settings Saved", {
        description: "Your configuration preferences have been updated.",
      });
    }, 600);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setIsChangingPass(true);
    setTimeout(() => {
      setIsChangingPass(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password Updated Successfully!", {
        description: "Your account credentials have been updated.",
      });
    }, 800);
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Account & Scanner Settings
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure user profile, change password, theme appearance, and API tokens.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl">
        <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
          {/* Profile Details Card */}
          <GlassCard className="p-6 rounded-[24px] border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 bg-white/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">User Profile</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your account identity in Site Pilot</p>
              </div>
            </div>

            {/* Profile Avatar Banner */}
            <div className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-md shrink-0">
                {userAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={userAvatar} alt="Profile avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
                    {name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "SP"}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{name}</h4>
                  {userProvider === "google" && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                      Google Login
                    </span>
                  )}
                  {userProvider === "github" && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                      GitHub Login
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </GlassCard>

          {/* Theme & Appearance Card */}
          <GlassCard className="p-6 rounded-[24px] border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 bg-white/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-900">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Theme & Appearance</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred visual mode for tables and cards</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handleSelectTheme("light")}
                className={cn(
                  "p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2",
                  themeMode === "light"
                    ? "border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold shadow-sm"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs font-bold">Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTheme("dark")}
                className={cn(
                  "p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2",
                  themeMode === "dark"
                    ? "border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold shadow-sm"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs font-bold">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTheme("system")}
                className={cn(
                  "p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2",
                  themeMode === "system"
                    ? "border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold shadow-sm"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-xs font-bold">System Default</span>
              </button>
            </div>
          </GlassCard>

          {/* Scanner Preferences Card */}
          <GlassCard className="p-6 rounded-[24px] border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 bg-white/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Scanner & Notifications</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automated audit frequency and alert rules</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Automated Scan Schedule</label>
                <select
                  value={scanFrequency}
                  onChange={(e) => setScanFrequency(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Daily">Daily Automated Scans</option>
                  <option value="Weekly">Weekly Digest</option>
                  <option value="Monthly">Monthly Summary</option>
                  <option value="Manual">Manual Audits Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Audit Reports</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Send PDF report summary after every scan</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>

          {/* Save General Preferences Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Check className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Profile Preferences
            </button>
          </div>
        </form>

        {/* Change Password Card */}
        <form onSubmit={handleChangePassword}>
          <GlassCard className="p-6 rounded-[24px] border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 bg-white/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Security & Change Password</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update your account login password</p>
              </div>
            </div>

            <div className="space-y-4 max-w-xl">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full px-4 py-2.5 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters..."
                      className="w-full px-4 py-2.5 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPass}
                className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isChangingPass ? <Check className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                Update Password
              </button>
            </div>
          </GlassCard>
        </form>
      </div>
    </div>
  );
}
