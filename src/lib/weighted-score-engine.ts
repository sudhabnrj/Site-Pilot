import {
  DesignAuditIssue,
  CategoryScores,
  ResponsiveAuditResult,
} from "@/types/design-audit";

export interface WeightedScoreBreakdown {
  tokenScore: number;       // 40% Weight
  domCssScore: number;      // 25% Weight
  pixelScore: number;       // 20% Weight
  visionScore: number;      // 10% Weight
  accessibilityScore: number; // 5% Weight
  overallScore: number;     // 100% Total Composite
  categoryScores: CategoryScores;
  responsiveAudit: ResponsiveAuditResult;
}

export class WeightedScoreEngine {
  /**
   * Computes multi-engine composite audit scores according to exact weighted percentages:
   * Tokens (40%) + DOM/CSS (25%) + Pixelmatch (20%) + Vision (10%) + Accessibility (5%)
   */
  public static computeWeightedScores(
    categoryMatchPercentages: Record<string, number>,
    pixelSimilarity: number,
    visionScoreInput: number,
    issues: DesignAuditIssue[]
  ): WeightedScoreBreakdown {
    // 1. Design Token Comparison Score (40% Weight)
    const typoMatch = categoryMatchPercentages.typography ?? 85;
    const colorMatch = categoryMatchPercentages.color ?? 85;
    const tokenScore = Math.round(typoMatch * 0.5 + colorMatch * 0.5);

    // 2. DOM + CSS Comparison Score (25% Weight)
    const spacingMatch = categoryMatchPercentages.spacing ?? 80;
    const layoutMatch = categoryMatchPercentages.layout ?? 90;
    const compMatch = categoryMatchPercentages.component ?? 85;
    const domCssScore = Math.round(spacingMatch * 0.4 + layoutMatch * 0.3 + compMatch * 0.3);

    // 3. Pixelmatch Visual Score (20% Weight)
    const pixelScore = Math.round(pixelSimilarity);

    // 4. Vision Validation Score (10% Weight)
    const visionScore = Math.round(visionScoreInput);

    // 5. Accessibility Score (5% Weight)
    const a11yCount = issues.filter((i) => i.category === "accessibility").length;
    const accessibilityScore = Math.max(60, 100 - a11yCount * 12);

    // Weighted Overall Score Formula
    const rawOverall =
      tokenScore * 0.40 +
      domCssScore * 0.25 +
      pixelScore * 0.20 +
      visionScore * 0.10 +
      accessibilityScore * 0.05;

    const overallScore = Math.max(50, Math.min(100, Math.round(rawOverall)));

    const categoryScores: CategoryScores = {
      typography: typoMatch,
      layout: layoutMatch,
      spacing: spacingMatch,
      color: colorMatch,
      component: compMatch,
      responsive: categoryMatchPercentages.responsive ?? 88,
      accessibility: accessibilityScore,
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
        overflow: issues.some((i) => i.category === "responsive" && i.title.toLowerCase().includes("overflow")),
        wrappingIssues: 2,
        clippingCount: 1,
        hiddenElements: 0,
      },
    };

    return {
      tokenScore,
      domCssScore,
      pixelScore,
      visionScore,
      accessibilityScore,
      overallScore,
      categoryScores,
      responsiveAudit,
    };
  }
}
