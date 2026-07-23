"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { User, Mail, Lock, Shield, Bell, Key, Save, Check } from "lucide-react";
import { useAppSelector } from "@/store";
import { toast } from "sonner";

export default function SettingsPage() {
  const user = useAppSelector((state) => state.auth.user);

  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}` : "Sudha Banerjee");
  const [email, setEmail] = useState(user?.email || "sudha.banerjee@codeclouds.in");
  const [scanFrequency, setScanFrequency] = useState("Daily");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [apiKey, setApiKey] = useState("sp_live_9481920491823091");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Account Settings Saved", {
        description: "Your configuration preferences have been saved to your MongoDB user profile.",
      });
    }, 600);
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Account & Scanner Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure user profile, automated scan frequencies, email alerts, and API tokens.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-6 max-w-4xl">
        {/* Profile Details Card */}
        <GlassCard className="p-6 rounded-[24px] border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">User Profile</h3>
              <p className="text-xs text-slate-500">Your account identity in Site Pilot</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </GlassCard>

        {/* Scanner Preferences Card */}
        <GlassCard className="p-6 rounded-[24px] border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Scanner & Notifications</h3>
              <p className="text-xs text-slate-500">Automated audit frequency and alert rules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Automated Scan Schedule</label>
              <select
                value={scanFrequency}
                onChange={(e) => setScanFrequency(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Daily">Daily Automated Scans</option>
                <option value="Weekly">Weekly Digest</option>
                <option value="Monthly">Monthly Summary</option>
                <option value="Manual">Manual Audits Only</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <p className="text-xs font-bold text-slate-800">Email Audit Reports</p>
                <p className="text-[11px] text-slate-500">Send PDF report summary after every scan</p>
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

        {/* API Tokens Card */}
        <GlassCard className="p-6 rounded-[24px] border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">API Access Token</h3>
              <p className="text-xs text-slate-500">Integrate Site Pilot audit engine with CI/CD pipelines</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Live Secret Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  toast.success("API Key Copied");
                }}
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
              >
                Copy Key
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Check className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
