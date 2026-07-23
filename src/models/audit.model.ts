import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditIssue {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  issue: string;
  page: string;
  impact: string;
  status: "open" | "in-progress" | "resolved";
}

export interface IAiRecommendation {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  icon: string;
}

export interface IPerformanceDataPoint {
  date: string;
  lcp: number;
  cls: number;
  fcp: number;
  responseTime?: number;
}

export interface IAuditReport {
  userId: string;
  url: string;
  domain: string;
  overallScore: number;
  performanceScore: number;
  seoScore: number;
  accessibilityScore: number;
  securityScore: number;
  bestPracticesScore: number;
  mobileScore: number;
  status: "Excellent" | "Good" | "Needs Improvement" | "Poor";
  scanDuration: string;
  responseTimeMs: number;
  metrics: {
    lcp: number;
    cls: number;
    fcp: number;
    ttfb: number;
    speedIndex: number;
    tbt: number;
    inp: number;
  };
  chartData: IPerformanceDataPoint[];
  issues: IAuditIssue[];
  recommendations: IAiRecommendation[];
  screenshotUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuditReportDocument extends IAuditReport, Document {}

const AuditReportSchema: Schema<IAuditReportDocument> = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
    },
    overallScore: {
      type: Number,
      default: 85,
    },
    performanceScore: {
      type: Number,
      default: 85,
    },
    seoScore: {
      type: Number,
      default: 85,
    },
    accessibilityScore: {
      type: Number,
      default: 85,
    },
    securityScore: {
      type: Number,
      default: 85,
    },
    bestPracticesScore: {
      type: Number,
      default: 85,
    },
    mobileScore: {
      type: Number,
      default: 85,
    },
    status: {
      type: String,
      enum: ["Excellent", "Good", "Needs Improvement", "Poor"],
      default: "Good",
    },
    scanDuration: {
      type: String,
      default: "5s",
    },
    responseTimeMs: {
      type: Number,
      default: 250,
    },
    metrics: {
      lcp: { type: Number, default: 2.1 },
      cls: { type: Number, default: 0.05 },
      fcp: { type: Number, default: 1.2 },
      ttfb: { type: Number, default: 250 },
      speedIndex: { type: Number, default: 1.8 },
      tbt: { type: Number, default: 150 },
      inp: { type: Number, default: 120 },
    },
    chartData: [
      {
        date: { type: String, required: true },
        lcp: { type: Number, default: 2.1 },
        cls: { type: Number, default: 0.05 },
        fcp: { type: Number, default: 1.2 },
        responseTime: { type: Number, default: 250 },
      },
    ],
    issues: [
      {
        id: { type: String, required: true },
        priority: {
          type: String,
          enum: ["critical", "high", "medium", "low"],
          default: "medium",
        },
        category: { type: String, default: "General" },
        issue: { type: String, required: true },
        page: { type: String, default: "/" },
        impact: { type: String, default: "-5 pts" },
        status: {
          type: String,
          enum: ["open", "in-progress", "resolved"],
          default: "open",
        },
      },
    ],
    recommendations: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        severity: {
          type: String,
          enum: ["critical", "high", "medium", "low"],
          default: "medium",
        },
        icon: { type: String, default: "Zap" },
      },
    ],
    screenshotUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const AuditReport: Model<IAuditReportDocument> =
  mongoose.models.AuditReport || mongoose.model<IAuditReportDocument>("AuditReport", AuditReportSchema);
