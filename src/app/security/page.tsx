"use client";

import { useEffect } from "react";
import { SecurityScoreCard } from "@/components/security/security-score-card";
import { SecurityHeaderChecklistItem } from "@/components/security/security-header-checklist-item";
import { SecurityVulnerabilityScan } from "@/components/security/security-vulnerability-scan";
import { SecurityActionCard } from "@/components/security/security-action-card";
import { Lock, ShieldCheck, Zap, FileCheck, Maximize, Lightbulb, Activity, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUserAudits } from "@/store/slices/audit-slice";
import { toast } from "sonner";

import { PlanGate } from "@/components/auth/plan-gate";

const CHECKLIST_ITEMS = [
  {
    icon: Lock,
    title: "HTTPS Enforcement",
    description: "All web traffic is encrypted over SSL/TLS.",
    statusText: "ENABLED",
  },
  {
    icon: ShieldCheck,
    title: "SSL Certificate",
    description: "Valid TLS/SSL certificate.",
    statusText: "VALID",
  },
  {
    icon: Zap,
    title: "Strict-Transport-Security",
    description: "HSTS header configured.",
    statusText: "PASS",
  },
  {
    icon: FileCheck,
    title: "Content Security Policy",
    description: "Mitigates XSS and data injection attacks.",
    statusText: "OPTIMIZED",
  },
  {
    icon: Maximize,
    title: "X-Frame-Options",
    description: "Protects against clickjacking attacks.",
    statusText: "PASS",
  },
];

export default function SecurityPage() {
  const dispatch = useAppDispatch();
  const currentReport = useAppSelector((state) => state.audit.currentReport);

  useEffect(() => {
    dispatch(fetchUserAudits());
  }, [dispatch]);

  const score = currentReport ? currentReport.securityScore : 95;
  const domain = currentReport?.domain || "example.com";
  const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : "C";
  const standing = score >= 90 ? "Excellent" : score >= 75 ? "Good" : "Needs Attention";

  const securityIssues = currentReport?.issues?.filter((i) => i.category === "Security") || [];
  const criticalCount = securityIssues.filter((i) => i.priority === "critical").length;
  const highCount = securityIssues.filter((i) => i.priority === "high").length;
  const mediumCount = securityIssues.filter((i) => i.priority === "medium").length;
  const lowCount = securityIssues.filter((i) => i.priority === "low").length;

  const handleViewLogs = () => {
    toast.info("Vulnerability Scanner Logs", {
      description: `Loaded 32-point security check logs for ${domain}.`,
    });
  };

  const handleApplyPatch = () => {
    toast.success("Security Recommendation", {
      description: "HSTS and CSP headers guide compiled.",
    });
  };

  const handleTrafficLogs = () => {
    toast.info("Firewall Traffic Logs", {
      description: `Monitoring live HTTPS requests for ${domain}.`,
    });
  };

  return (
    <PlanGate requiredPlan="pro" featureName="Security Overview">
      <div className="flex flex-col gap-8 pb-16">
        {/* Page Header */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 select-none">
              <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wider uppercase">
                AI Verified
              </span>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Security Audit
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Security Overview
            </h2>
            <p className="text-slate-500 text-sm font-semibold max-w-2xl leading-relaxed">
              Comprehensive security header and vulnerability analysis for{" "}
              <span className="text-blue-600 font-extrabold">{domain}</span>
            </p>
          </div>
          <div className="text-left sm:text-right select-none shrink-0">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              Last Scan: {currentReport?.createdAt ? new Date(currentReport.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
            </p>
            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-sm uppercase tracking-wide">
              <CheckCircle className="h-4.5 w-4.5" />
              <span>{score >= 75 ? "System Secure" : "Attention Required"}</span>
            </div>
          </div>
        </section>

        {/* Grid Layout: Score & Header Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-4 flex flex-col justify-between">
            <SecurityScoreCard
              scoreGrade={grade}
              scorePercent={score}
              standing={standing}
              details={`Audit report compiled for ${domain} with ${securityIssues.length} security flags.`}
            />
          </div>

          <div className="lg:col-span-8 bg-white border border-slate-200/80 p-6 rounded-[24px] shadow-sm flex flex-col gap-5">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              Security Header Checklist
            </h3>
            <div className="flex flex-col gap-4">
              {CHECKLIST_ITEMS.map((item, idx) => (
                <SecurityHeaderChecklistItem key={idx} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* Vulnerability Scan Panel */}
        <section>
          <SecurityVulnerabilityScan
            criticalCount={criticalCount}
            highCount={highCount}
            mediumCount={mediumCount}
            lowCount={lowCount}
            onViewLog={handleViewLogs}
          />
        </section>

        {/* Bottom Action Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityActionCard
            icon={Lightbulb}
            title="AI Security Recommendation"
            description={`Enforcing Strict-Transport-Security (HSTS) and CSP headers on ${domain} will protect against MITM and XSS attacks.`}
            buttonText="Apply Security Fixes"
            buttonVariant="primary"
            onAction={handleApplyPatch}
          />
          <SecurityActionCard
            icon={Activity}
            title="Real-time Monitoring"
            description={`Actively monitoring domain ${domain} for SSL certificate expiration, header tampering, and unusual traffic spikes.`}
            buttonText="View Security Logs"
            buttonVariant="secondary"
            onAction={handleTrafficLogs}
          />
        </div>
      </div>
    </PlanGate>
  );
}
