"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector } from "@/store";
import { GlassCard } from "@/components/ui/glass-card";
import { UserAvatarImage } from "@/components/ui/user-avatar-image";
import {
  ArrowLeft, User, Mail, Calendar, Activity, Globe, Shield,
  CreditCard, CheckCircle, XCircle, Loader2, AlertTriangle,
  ChevronDown, ChevronRight, BarChart3, Zap, Lock, Smartphone,
  Search, FileText, Gauge, Trash2
} from "lucide-react";

interface UserProfile {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role: string;
  plan: string;
  status: string;
  provider: string;
  isEmailVerified: boolean;
  profileImage?: string;
  image?: string;
  createdAt?: string;
  lastLogin?: string;
  auditCount: number;
  latestAudit?: { domain: string; overallScore: number; createdAt: string } | null;
}

interface AuditRecord {
  _id: string;
  domain: string;
  url: string;
  overallScore: number;
  performanceScore: number;
  seoScore: number;
  securityScore: number;
  accessibilityScore: number;
  mobileScore: number;
  issueCount: number;
  criticalCount: number;
  status: string;
  scanDuration: string;
  createdAt: string;
  screenshotUrl?: string;
  issues?: Array<{ priority: string; category: string; issue: string; page: string; impact: string }>;
}

const PLAN_COLORS: Record<string, string> = {
  free: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
  starter: "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900",
  pro: "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900",
  enterprise: "bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900",
};

const PLAN_AMOUNTS: Record<string, string> = {
  free: "$0 / month",
  starter: "$19 / month",
  pro: "$49 / month",
  enterprise: "$199 / month",
};

const CATEGORY_ICONS: Record<string, any> = {
  Performance: Gauge,
  SEO: Search,
  Security: Shield,
  Accessibility: User,
  Mobile: Smartphone,
  PDF: FileText,
  Reports: BarChart3,
};

function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon?: any }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
  const textColor = score >= 80 ? "text-emerald-600 dark:text-emerald-400" : score >= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";
  const IconComp = Icon || BarChart3;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <IconComp className="h-3 w-3" />
          {label}
        </span>
        <span className={`font-black ${textColor}`}>{score}</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatDateShort(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDisplayName(user: UserProfile) {
  if (user.firstName || user.lastName) return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return user.name || user.email.split("@")[0];
}

function getInitials(user: UserProfile) {
  const name = getDisplayName(user);
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const authUser = useAppSelector((state) => state.auth.user);
  const isAdmin = authUser?.role === "admin";

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingAudits, setIsLoadingAudits] = useState(true);
  const [error, setError] = useState("");
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!isAdmin) { router.push("/dashboard"); return; }

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        const data = await res.json();
        if (data.success) setProfile(data.user);
        else setError(data.message || "Failed to load user profile.");
      } catch {
        setError("Network error loading profile.");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    const loadAudits = async () => {
      setIsLoadingAudits(true);
      try {
        const res = await fetch(`/api/admin/users/${userId}/audits`);
        const data = await res.json();
        if (data.success) setAudits(data.audits);
      } catch {
        // silently fail
      } finally {
        setIsLoadingAudits(false);
      }
    };

    loadProfile();
    loadAudits();
  }, [isAdmin, router, userId]);

  const handleDeleteUser = async () => {
    if (!profile) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/users/${profile._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/users");
      } else {
        setDeleteError(data.message || "Failed to delete user.");
      }
    } catch {
      setDeleteError("Network error while deleting user.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAdmin) return null;

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <p className="font-bold text-slate-700 dark:text-slate-300">{error || "User not found."}</p>
        <button onClick={() => router.push("/admin/users")} className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700">
          ← Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Back Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push("/admin/users")}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                User Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{profile.email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setShowDeleteModal(true);
            setDeleteError("");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-600 hover:text-white transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Trash2 className="h-4 w-4" />
          Delete User Permanently
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Profile + Payment */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Profile Card */}
          <GlassCard className="p-6 rounded-2xl">
            <div className="flex flex-col items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
              <UserAvatarImage
                src={profile.profileImage || profile.image || (profile as any).avatar || (profile as any).picture || (profile as any).avatar_url}
                alt={getDisplayName(profile)}
                initials={getInitials(profile)}
                className="h-20 w-20 rounded-full"
                textSize="text-xl font-bold"
              />
              <div className="text-center">
                <h3 className="text-base font-black text-slate-900 dark:text-white">{getDisplayName(profile)}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{profile.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${PLAN_COLORS[(profile.plan || "free").toLowerCase()] || PLAN_COLORS.free}`}>
                    {profile.plan || "free"} Plan
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${profile.status === "active" ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900" : "bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900"}`}>
                    {profile.status || "active"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              {[
                { icon: User, label: "Role", value: (profile.role || "user").charAt(0).toUpperCase() + (profile.role || "user").slice(1) },
                { icon: Globe, label: "Provider", value: (profile.provider || "local").charAt(0).toUpperCase() + (profile.provider || "local").slice(1) },
                { icon: Calendar, label: "Joined", value: formatDate(profile.createdAt) },
                { icon: Activity, label: "Last Login", value: formatDate(profile.lastLogin) },
                { icon: BarChart3, label: "Total Audits", value: String(profile.auditCount) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold">{label}</span>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold">Email Verified</span>
                </div>
                {profile.isEmailVerified
                  ? <CheckCircle className="h-4 w-4 text-emerald-500" />
                  : <XCircle className="h-4 w-4 text-red-500" />}
              </div>
            </div>
          </GlassCard>

          {/* Payment / Plan Card */}
          <GlassCard className="p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900">
                <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white">Plan & Payment</h4>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Current Subscription</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${PLAN_COLORS[(profile.plan || "free").toLowerCase()] || PLAN_COLORS.free}`}>
                    {profile.plan || "free"}
                  </span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                    {PLAN_AMOUNTS[(profile.plan || "free").toLowerCase()] || "$0 / month"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { label: "Plan Status", value: profile.status === "active" ? "Active" : "Inactive", ok: profile.status === "active" },
                  { label: "Plan Activated", value: formatDate(profile.createdAt) },
                  { label: "Billing Cycle", value: !profile.plan || profile.plan === "free" ? "—" : "Monthly" },
                  { label: "Websites Limit", value: !profile.plan || profile.plan === "free" ? "1" : profile.plan === "starter" ? "3" : profile.plan === "pro" ? "15" : "Unlimited" },
                ].map(({ label, value, ok }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="font-bold text-slate-500 dark:text-slate-400">{label}</span>
                    <span className={`font-black ${ok !== undefined ? (ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400") : "text-slate-800 dark:text-slate-200"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {profile.plan !== "free" && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    Paid subscriber — full feature access enabled.
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Audit History */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <GlassCard className="rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900">
                  <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-sm font-black text-slate-800 dark:text-white">
                  Audit History
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                {audits.length} Total Audits
              </span>
            </div>

            {isLoadingAudits ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
              </div>
            ) : audits.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center px-6">
                <Globe className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No audits found for this user.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {audits.map((audit) => {
                  const isExpanded = expandedAuditId === audit._id;
                  return (
                    <div key={audit._id}>
                      {/* Audit Row Header */}
                      <div
                        className="px-6 py-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                        onClick={() => setExpandedAuditId(isExpanded ? null : audit._id)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Screenshot thumbnail or domain icon */}
                            <div className="h-10 w-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              {audit.screenshotUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={audit.screenshotUrl} alt={audit.domain} className="h-full w-full object-cover" />
                              ) : (
                                <Globe className="h-4 w-4 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-900 dark:text-white truncate">{audit.domain}</p>
                              <p className="text-[10px] text-slate-400 truncate">{audit.url}</p>
                            </div>
                          </div>

                          {/* Score + Issues count + Date */}
                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-center hidden sm:block">
                              <p className={`text-lg font-black ${audit.overallScore >= 80 ? "text-emerald-600 dark:text-emerald-400" : audit.overallScore >= 60 ? "text-amber-500" : "text-red-500"}`}>
                                {audit.overallScore}
                              </p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Score</p>
                            </div>
                            {audit.issueCount > 0 && (
                              <div className="text-center hidden sm:block">
                                <p className="text-sm font-black text-red-500">{audit.issueCount}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Issues</p>
                              </div>
                            )}
                            <div className="text-right hidden md:block">
                              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{formatDateShort(audit.createdAt)}</p>
                              <p className="text-[10px] text-slate-400">{audit.scanDuration}</p>
                            </div>
                            {isExpanded
                              ? <ChevronDown className="h-4 w-4 text-blue-500 shrink-0" />
                              : <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Audit Details */}
                      {isExpanded && (
                        <div className="px-6 pb-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
                          {/* Score Breakdown */}
                          <div className="pt-4 mb-5">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">Score Breakdown</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <ScoreBar label="Performance" score={audit.performanceScore} icon={Gauge} />
                              <ScoreBar label="SEO" score={audit.seoScore} icon={Search} />
                              <ScoreBar label="Security" score={audit.securityScore} icon={Lock} />
                              <ScoreBar label="Accessibility" score={audit.accessibilityScore} icon={User} />
                              <ScoreBar label="Mobile" score={audit.mobileScore} icon={Smartphone} />
                            </div>
                          </div>

                          {/* Issues Table */}
                          {audit.issues && audit.issues.length > 0 ? (
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                                Found Issues ({audit.issues.length})
                              </p>
                              <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800">
                                      <th className="text-left font-black text-[9px] uppercase tracking-wider text-slate-500 px-4 py-2.5">Priority</th>
                                      <th className="text-left font-black text-[9px] uppercase tracking-wider text-slate-500 px-4 py-2.5">Category</th>
                                      <th className="text-left font-black text-[9px] uppercase tracking-wider text-slate-500 px-4 py-2.5">Issue</th>
                                      <th className="text-left font-black text-[9px] uppercase tracking-wider text-slate-500 px-4 py-2.5">Impact</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                    {audit.issues.map((issue, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="px-4 py-2.5">
                                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                            issue.priority === "critical" ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400" :
                                            issue.priority === "high" ? "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400" :
                                            issue.priority === "medium" ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400" :
                                            "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                          }`}>
                                            {issue.priority}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400 font-bold">{issue.category}</td>
                                        <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300 font-medium max-w-[280px]">{issue.issue}</td>
                                        <td className="px-4 py-2.5">
                                          <span className="font-black text-red-500">{issue.impact}</span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">No issues found — this site passed all checks!</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete User Permanently</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {getDisplayName(profile)}
              </p>
              <p className="text-slate-500 dark:text-slate-400">{profile.email}</p>
              <p className="text-[11px] text-red-600 dark:text-red-400 pt-2 font-semibold">
                Deleting will permanently erase this user account and all associated audit reports from the database.
              </p>
            </div>

            {deleteError && (
              <p className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 p-3 rounded-xl border border-red-200 dark:border-red-900">
                {deleteError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError("");
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteUser}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 cursor-pointer shadow-lg shadow-red-500/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Permanently Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
