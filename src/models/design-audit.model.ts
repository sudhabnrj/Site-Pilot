import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDesignAuditReport extends Document {
  userId: string;
  websiteUrl: string;
  figmaUrl?: string;
  figmaUser?: {
    id?: string;
    handle: string;
    email?: string;
    imgUrl?: string;
  };
  uploadedScreenshot?: string;
  websiteScreenshots: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
  diffScreenshot: string;
  heatmapScreenshot: string;
  overallScore: number;
  categoryScores: {
    typography: number;
    layout: number;
    spacing: number;
    color: number;
    component: number;
    responsive: number;
    accessibility: number;
  };
  pixelSimilarity: number;
  issues: Array<{
    id: string;
    category: string;
    title: string;
    element?: string;
    expectedValue: string;
    actualValue: string;
    difference: string;
    severity: "critical" | "warning" | "info";
    suggestedCssFix: string;
    boundingRect?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    category: string;
    cssCode?: string;
  }>;
  responsiveAudit: {
    desktop: {
      score: number;
      overflow: boolean;
      wrappingIssues: number;
      clippingCount: number;
      hiddenElements: number;
    };
    tablet: {
      score: number;
      overflow: boolean;
      wrappingIssues: number;
      clippingCount: number;
      hiddenElements: number;
    };
    mobile: {
      score: number;
      overflow: boolean;
      wrappingIssues: number;
      clippingCount: number;
      hiddenElements: number;
    };
  };
  figmaTokensExtracted?: {
    framesCount: number;
    componentsCount: number;
    colorsCount: number;
    typographyCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DesignAuditReportSchema = new Schema<IDesignAuditReport>(
  {
    userId: { type: String, required: true, index: true },
    websiteUrl: { type: String, required: true },
    figmaUrl: { type: String, default: "" },
    figmaUser: {
      id: { type: String, default: "" },
      handle: { type: String, default: "" },
      email: { type: String, default: "" },
      imgUrl: { type: String, default: "" },
    },
    uploadedScreenshot: { type: String, default: "" },
    websiteScreenshots: {
      desktop: { type: String, default: "" },
      tablet: { type: String, default: "" },
      mobile: { type: String, default: "" },
    },
    diffScreenshot: { type: String, default: "" },
    heatmapScreenshot: { type: String, default: "" },
    overallScore: { type: Number, required: true, default: 0 },
    categoryScores: {
      typography: { type: Number, default: 0 },
      layout: { type: Number, default: 0 },
      spacing: { type: Number, default: 0 },
      color: { type: Number, default: 0 },
      component: { type: Number, default: 0 },
      responsive: { type: Number, default: 0 },
      accessibility: { type: Number, default: 0 },
    },
    pixelSimilarity: { type: Number, default: 0 },
    issues: [
      {
        id: { type: String, required: true },
        category: { type: String, required: true },
        title: { type: String, required: true },
        element: { type: String, default: "" },
        expectedValue: { type: String, required: true },
        actualValue: { type: String, required: true },
        difference: { type: String, required: true },
        severity: { type: String, enum: ["critical", "warning", "info"], default: "info" },
        suggestedCssFix: { type: String, default: "" },
        boundingRect: {
          x: Number,
          y: Number,
          width: Number,
          height: Number,
        },
      },
    ],
    recommendations: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        impact: { type: String, enum: ["high", "medium", "low"], default: "medium" },
        category: { type: String, default: "General" },
        cssCode: { type: String, default: "" },
      },
    ],
    responsiveAudit: {
      desktop: {
        score: { type: Number, default: 100 },
        overflow: { type: Boolean, default: false },
        wrappingIssues: { type: Number, default: 0 },
        clippingCount: { type: Number, default: 0 },
        hiddenElements: { type: Number, default: 0 },
      },
      tablet: {
        score: { type: Number, default: 90 },
        overflow: { type: Boolean, default: false },
        wrappingIssues: { type: Number, default: 0 },
        clippingCount: { type: Number, default: 0 },
        hiddenElements: { type: Number, default: 0 },
      },
      mobile: {
        score: { type: Number, default: 85 },
        overflow: { type: Boolean, default: false },
        wrappingIssues: { type: Number, default: 0 },
        clippingCount: { type: Number, default: 0 },
        hiddenElements: { type: Number, default: 0 },
      },
    },
    figmaTokensExtracted: {
      framesCount: { type: Number, default: 0 },
      componentsCount: { type: Number, default: 0 },
      colorsCount: { type: Number, default: 0 },
      typographyCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    collection: "design_audit_reports",
  }
);

export const DesignAuditReport: Model<IDesignAuditReport> =
  mongoose.models.DesignAuditReport ||
  mongoose.model<IDesignAuditReport>("DesignAuditReport", DesignAuditReportSchema);
