"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { GlassCard } from "@/components/ui/glass-card";
import { UserAvatarImage } from "@/components/ui/user-avatar-image";
import {
  Users, Search, Filter, ChevronRight, Shield, RefreshCw,
  TrendingUp, UserCheck, CreditCard, Calendar, Activity,
  Globe, Loader2, AlertTriangle, Trash2
} from "lucide-react";

interface UserRecord {
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
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  paidUsers: number;
  newThisMonth: number;
}

const PLAN_COLORS: Record<string, string> = {
  free: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
  starter: "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900",
  pro: "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900",
  enterprise: "bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900",
};

const PROVIDER_COLORS: Record<string, string> = {
  google: "bg-orange-50 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900",
  github: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700",
  local: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900",
};

function getInitials(user: UserRecord) {
  const name = user.firstName || user.name || user.email;
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getDisplayName(user: UserRecord) {
  if (user.firstName || user.lastName) return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return user.name || user.email.split("@")[0];
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminUsersPage() {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const isAdmin = authUser?.role === "admin";

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activeUsers: 0, paidUsers: 0, newThisMonth: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Delete state
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        search,
        plan: planFilter,
        status: statusFilter,
        page: String(page),
        limit: "20",
      });
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setStats(data.stats);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.total);
      } else {
        setError(data.message || "Failed to load users.");
      }
    } catch {
      setError("Network error. Could not fetch users.");
    } finally {
      setIsLoading(false);
    }
  }, [search, planFilter, statusFilter, page]);

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }
    fetchUsers();
  }, [isAdmin, router, fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, planFilter, statusFilter]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/users/${userToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const deletedId = userToDelete._id;
        setUsers((prev) => prev.filter((u) => u._id !== deletedId));
        setTotalCount((prev) => Math.max(0, prev - 1));
        setStats((prev) => ({
          ...prev,
          totalUsers: Math.max(0, prev.totalUsers - 1),
          activeUsers: userToDelete.status === "active" ? Math.max(0, prev.activeUsers - 1) : prev.activeUsers,
          paidUsers: ["starter", "pro", "enterprise"].includes(userToDelete.plan?.toLowerCase())
            ? Math.max(0, prev.paidUsers - 1)
            : prev.paidUsers,
        }));
        setUserToDelete(null);
      } else {
        setDeleteError(data.message || "Failed to delete user.");
      }
    } catch {
      setDeleteError("Network error while deleting user.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <p className="font-bold text-slate-800 dark:text-white">Admin access required.</p>
        </div>
      </div>
    );
  }

  // Filter out currently logged in admin user as safeguard
  const displayUsers = users.filter(
    (u) =>
      u._id !== authUser?.id &&
      u._id !== (authUser as any)?._id &&
      u.email.toLowerCase() !== authUser?.email.toLowerCase()
  );

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900">
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">User Management</h2>
        </div>
        <p className="ml-14 text-sm text-slate-500 dark:text-slate-400">
          View and manage all registered Site Pilot users, their plans, and audit activity.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900" },
          { label: "Active Users", value: stats.activeUsers, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900" },
          { label: "Paid Users", value: stats.paidUsers, icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900" },
          { label: "New This Month", value: stats.newThisMonth, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <GlassCard key={label} className={`p-5 flex items-center gap-4 rounded-2xl border ${bg}`}>
            <div className={`p-2.5 rounded-xl border ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</p>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <GlassCard className="p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard className="rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {isLoading ? "Loading..." : `${totalCount} User${totalCount !== 1 ? "s" : ""} Found`}
            </span>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Prev
              </button>
              <span className="text-xs text-slate-500">{page} / {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center px-6">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
            <p className="font-bold text-slate-700 dark:text-slate-300">{error}</p>
            <button onClick={fetchUsers} className="mt-2 px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700">
              Try Again
            </button>
          </div>
        ) : displayUsers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center px-6">
            <Users className="h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="font-bold text-slate-600 dark:text-slate-400">No users match your filters.</p>
            <p className="text-xs text-slate-400">Try adjusting search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/50">
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-6 py-3">User</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-4 py-3">Plan</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-4 py-3">Status</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-4 py-3">Provider</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-4 py-3">Joined</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-4 py-3">Last Login</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-4 py-3">Audits</th>
                  <th className="text-right text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/admin/users/${user._id}`)}
                  >
                    {/* Avatar + Name/Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatarImage
                          src={user.profileImage || user.image || (user as any).avatar || (user as any).picture || (user as any).avatar_url}
                          alt={getDisplayName(user)}
                          initials={getInitials(user)}
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{getDisplayName(user)}</p>
                          <p className="text-[10px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Plan Badge */}
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${PLAN_COLORS[(user.plan || "free").toLowerCase()] || PLAN_COLORS.free}`}>
                        {user.plan || "free"}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${user.status === "active" ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900" : "bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900"}`}>
                        {user.status}
                      </span>
                    </td>
                    {/* Provider */}
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${PROVIDER_COLORS[user.provider] || PROVIDER_COLORS.local}`}>
                        {user.provider}
                      </span>
                    </td>
                    {/* Joined Date */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    {/* Last Login */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <Activity className="h-3 w-3" />
                        {formatDate(user.lastLogin)}
                      </div>
                    </td>
                    {/* Audit Count */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3 w-3 text-slate-400" />
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">{user.auditCount}</span>
                      </div>
                    </td>
                    {/* Action */}
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserToDelete(user);
                            setDeleteError("");
                          }}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete User Permanently"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
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
                {getDisplayName(userToDelete)}
              </p>
              <p className="text-slate-500 dark:text-slate-400">{userToDelete.email}</p>
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
                  setUserToDelete(null);
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
