"use client";

import { SecurityScoreCard } from "@/components/security/security-score-card";
import { SecurityHeaderChecklistItem } from "@/components/security/security-header-checklist-item";
import { SecurityVulnerabilityScan } from "@/components/security/security-vulnerability-scan";
import { SecurityActionCard } from "@/components/security/security-action-card";
import { Lock, ShieldCheck, Zap, FileCheck, Maximize, Lightbulb, Activity } from "lucide-react";
import { CheckCircle } from "lucide-react";

const CHECKLIST_ITEMS = [
  {
    icon: Lock,
    title: "HTTPS Enforcement",
    description: "All traffic is encrypted over SSL/TLS.",
    statusText: "ENABLED",
  },
  {
    icon: ShieldCheck,
    title: "SSL Certificate",
    description: "Valid DigiCert SHA2 Secure Server CA.",
    statusText: "VALID",
  },
  {
    icon: Zap,
    title: "Strict-Transport-Security",
    description: "HSTS header correctly implemented.",
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
  const handleViewLogs = () => {
    alert("Displaying full 32-point vulnerability exploit scanner logs...");
  };

  const handleApplyPatch = () => {
    alert("Navigating to patch guide for React v18.2 upgrade logs...");
  };

  const handleTrafficLogs = () => {
    alert("Opening DNS poisoning block alerts and real-time firewall graphs...");
  };

  return (
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
            Comprehensive vulnerability and header analysis for{" "}
            <span className="text-blue-600 font-extrabold">auditai.app</span>
          </p>
        </div>
        <div className="text-left sm:text-right select-none shrink-0">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            Last Scan: 2 minutes ago
          </p>
          <div className="flex items-center gap-1.5 text-emerald-600 font-black text-sm uppercase tracking-wide">
            <CheckCircle className="h-4.5 w-4.5" />
            <span>System Secure</span>
          </div>
        </div>
      </section>

      {/* Grid Layout: Score & Header Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4 flex flex-col justify-between">
          <SecurityScoreCard
            scoreGrade="A+"
            scorePercent={95}
            standing="Excellent"
            details="Your site is in the top 1% of audited domains for header security."
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
          criticalCount={0}
          highCount={0}
          mediumCount={2}
          lowCount={5}
          onViewLog={handleViewLogs}
        />
      </section>

      {/* Bottom Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityActionCard
          icon={Lightbulb}
          title="AI Recommendation"
          description="Your Medium-risk flags are related to outdated JS libraries in the /scripts directory. Updating to React v18.2 would resolve these automatically."
          buttonText="Apply Patch Guide"
          buttonVariant="primary"
          onAction={handleApplyPatch}
        />
        <SecurityActionCard
          icon={Activity}
          title="Real-time Monitoring"
          description="AuditAI is actively monitoring your domain for DNS poisoning and brute force attempts. 12 attempts blocked in the last 24h."
          buttonText="View Traffic Logs"
          buttonVariant="secondary"
          onAction={handleTrafficLogs}
        />
      </div>
    </div>
  );
}
