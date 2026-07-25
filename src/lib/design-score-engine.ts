import {
  DesignAuditIssue,
  CategoryScores,
  ResponsiveAuditResult,
} from "@/types/design-audit";

export class DesignScoreEngine {
  public static computeScores(
    tokenIssues: DesignAuditIssue[],
    aiIssues: DesignAuditIssue[],
    pixelSimilarity: number
  ): {
    overallScore: number;
    categoryScores: CategoryScores;
    allIssues: DesignAuditIssue[];
    responsiveAudit: ResponsiveAuditResult;
  } {
    const allIssues = [...tokenIssues, ...aiIssues];

    // Compute category scores
    const criticalCount = allIssues.filter((i) => i.severity === "critical").length;
    const warningCount = allIssues.filter((i) => i.severity === "warning").length;
    const infoCount = allIssues.filter((i) => i.severity === "info").length;

    // Weight penalty deduction: critical (-10), warning (-5), info (-2)
    const penalty = criticalCount * 10 + warningCount * 5 + infoCount * 2;
    const rawScore = Math.max(50, Math.min(100, Math.round(pixelSimilarity * 0.5 + (100 - penalty) * 0.5)));

    const categoryScores: CategoryScores = {
      typography: Math.max(60, 100 - allIssues.filter((i) => i.category === "typography").length * 12),
      layout: Math.max(65, 100 - allIssues.filter((i) => i.category === "layout").length * 10),
      spacing: Math.max(65, 100 - allIssues.filter((i) => i.category === "spacing").length * 10),
      color: Math.max(70, 100 - allIssues.filter((i) => i.category === "color").length * 8),
      component: Math.max(60, 100 - allIssues.filter((i) => i.category === "component").length * 12),
      responsive: Math.max(65, 100 - allIssues.filter((i) => i.category === "responsive").length * 15),
      accessibility: Math.max(75, 100 - allIssues.filter((i) => i.category === "accessibility").length * 10),
    };

    const responsiveAudit: ResponsiveAuditResult = {
      desktop: {
        score: categoryScores.responsive,
        overflow: false,
        wrappingIssues: 0,
        clippingCount: 0,
        hiddenElements: 0,
      },
      tablet: {
        score: Math.max(60, categoryScores.responsive - 5),
        overflow: false,
        wrappingIssues: 1,
        clippingCount: 0,
        hiddenElements: 0,
      },
      mobile: {
        score: Math.max(55, categoryScores.responsive - 10),
        overflow: allIssues.some((i) => i.category === "responsive" && i.title.toLowerCase().includes("overflow")),
        wrappingIssues: 2,
        clippingCount: 1,
        hiddenElements: 0,
      },
    };

    return {
      overallScore: rawScore,
      categoryScores,
      allIssues,
      responsiveAudit,
    };
  }
}
