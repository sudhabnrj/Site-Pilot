import { FigmaTokenData, DomNodeStyle, DesignAuditIssue } from "@/types/design-audit";
import { MappedElementPair } from "./element-mapper";
import { ColorDeltaE } from "./color-delta-e";

export class DeterministicRuleEngine {
  /**
   * Runs deterministic rule comparison over mapped element pairs
   */
  public static evaluateRules(
    figma: FigmaTokenData,
    domNodes: DomNodeStyle[],
    mappedPairs: MappedElementPair[]
  ): {
    issues: DesignAuditIssue[];
    passCount: number;
    failCount: number;
    totalChecks: number;
    categoryMatchPercentages: Record<string, number>;
  } {
    const issues: DesignAuditIssue[] = [];
    let passCount = 0;
    let failCount = 0;
    let totalChecks = 0;

    const categoryStats: Record<string, { pass: number; total: number }> = {
      typography: { pass: 0, total: 0 },
      spacing: { pass: 0, total: 0 },
      color: { pass: 0, total: 0 },
      component: { pass: 0, total: 0 },
      layout: { pass: 0, total: 0 },
      accessibility: { pass: 0, total: 0 },
    };

    const trackResult = (
      category: string,
      isPass: boolean,
      issueDetails?: Partial<DesignAuditIssue>
    ) => {
      totalChecks++;
      if (!categoryStats[category]) categoryStats[category] = { pass: 0, total: 0 };
      categoryStats[category].total++;

      if (isPass) {
        passCount++;
        categoryStats[category].pass++;
      } else {
        failCount++;
        if (issueDetails && issueDetails.title) {
          issues.push({
            id: issueDetails.id || `rule-issue-${totalChecks}`,
            category: (category as any) || "layout",
            title: issueDetails.title,
            element: issueDetails.element || "DOM Element",
            expectedValue: issueDetails.expectedValue || "",
            actualValue: issueDetails.actualValue || "",
            difference: issueDetails.difference || "",
            severity: issueDetails.severity || "warning",
            suggestedCssFix: issueDetails.suggestedCssFix || "",
            confidenceScore: issueDetails.confidenceScore || 90,
            deltaE: issueDetails.deltaE,
            tolerance: issueDetails.tolerance || "±2px",
            isPass: false,
            boundingRect: issueDetails.boundingRect,
          });
        }
      }
    };

    // Evaluate mapped pairs
    mappedPairs.forEach((pair) => {
      const comp = pair.figmaComponent;
      const node = pair.domNode;
      const confidence = pair.confidenceScore;

      // Format clean selector for display
      const tagLower = node.tagName.toLowerCase();
      const idPart = node.id ? `#${node.id}` : "";
      const classPart = node.className ? `.${node.className.split(" ")[0]}` : "";
      const elementSelector = `${tagLower}${idPart}${classPart}`;
      const readableName = node.text ? `"${node.text.slice(0, 30)}"` : comp.name || node.tagName;

      // 1. TYPOGRAPHY: Font Size (Tolerance: ±1px)
      if (["H1", "H2", "H3", "H4", "H5", "H6", "P", "SPAN"].includes(node.tagName)) {
        // Match expected typography by tag level
        let expectedTypo = figma.typography[0];
        if (node.tagName === "H1") {
          expectedTypo = figma.typography.find((t) => t.fontSize >= 28) || figma.typography[0];
        } else if (node.tagName.startsWith("H")) {
          expectedTypo = figma.typography.find((t) => t.fontSize >= 20 && t.fontSize < 28) || figma.typography[1] || figma.typography[0];
        } else {
          expectedTypo = figma.typography.find((t) => t.fontSize <= 18) || figma.typography[2] || figma.typography[0];
        }

        if (expectedTypo && node.styles.fontSize) {
          const actualPx = parseInt(node.styles.fontSize, 10);
          const expectedPx = expectedTypo.fontSize;
          const diffPx = actualPx - expectedPx;
          const isPassSize = Math.abs(diffPx) <= 1;

          trackResult("typography", isPassSize, {
            id: `rule-typo-size-${node.id || node.tagName}`,
            title: `${readableName} Typography Size Variance`,
            element: elementSelector,
            expectedValue: `${expectedPx}px`,
            actualValue: `${actualPx}px`,
            difference: `${diffPx > 0 ? "+" : ""}${diffPx}px font-size delta (Tolerance ±1px)`,
            severity: Math.abs(diffPx) > 3 ? "critical" : "warning",
            suggestedCssFix: `${elementSelector} {\n  font-size: ${expectedPx}px !important;\n  line-height: ${expectedTypo.lineHeight || "1.2"};\n}`,
            confidenceScore: confidence,
            tolerance: "±1px",
          });
        }
      }

      // 2. BORDER RADIUS (Tolerance: ±1px)
      if (node.styles.borderRadius && comp.borderRadius) {
        const expectedRad = parseInt(comp.borderRadius, 10);
        const actualRad = parseInt(node.styles.borderRadius, 10);
        const diffRad = actualRad - expectedRad;
        const isPassRadius = Math.abs(diffRad) <= 1;

        trackResult("component", isPassRadius, {
          id: `rule-radius-${node.id || node.tagName}`,
          title: `${readableName} Corner Radius Mismatch`,
          element: elementSelector,
          expectedValue: `${expectedRad}px`,
          actualValue: `${actualRad}px`,
          difference: `${diffRad > 0 ? "+" : ""}${diffRad}px radius delta (Tolerance ±1px)`,
          severity: Math.abs(diffRad) > 4 ? "critical" : "warning",
          suggestedCssFix: `${elementSelector} {\n  border-radius: ${expectedRad}px !important;\n}`,
          confidenceScore: confidence,
          tolerance: "±1px",
          boundingRect: node.rect,
        });
      }

      // 3. SPACING: Padding (Tolerance: ±2px)
      if (node.styles.paddingTop) {
        const actualPad = parseInt(node.styles.paddingTop, 10);
        const expectedPad = comp.padding ? parseInt(comp.padding, 10) : 24;
        const diffPad = actualPad - expectedPad;
        const isPassPadding = Math.abs(diffPad) <= 2;

        trackResult("spacing", isPassPadding, {
          id: `rule-pad-${node.id || node.tagName}`,
          title: `${readableName} Padding Variance`,
          element: elementSelector,
          expectedValue: `${expectedPad}px`,
          actualValue: `${actualPad}px`,
          difference: `${diffPad > 0 ? "+" : ""}${diffPad}px padding (Tolerance ±2px)`,
          severity: "warning",
          suggestedCssFix: `${elementSelector} {\n  padding: ${expectedPad}px !important;\n}`,
          confidenceScore: confidence,
          tolerance: "±2px",
          boundingRect: node.rect,
        });
      }

      // 4. DIMENSIONS: Height & Width (Tolerance: ±2px)
      if (comp.height && comp.height > 0) {
        const actualH = node.rect.height;
        const expectedH = comp.height;
        const diffH = actualH - expectedH;
        const isPassHeight = Math.abs(diffH) <= 2;

        trackResult("layout", isPassHeight, {
          id: `rule-height-${node.id || node.tagName}`,
          title: `${readableName} Element Height Delta`,
          element: elementSelector,
          expectedValue: `${expectedH}px`,
          actualValue: `${actualH}px`,
          difference: `${diffH > 0 ? "+" : ""}${diffH}px height delta (Tolerance ±2px)`,
          severity: "info",
          suggestedCssFix: `${elementSelector} {\n  height: ${expectedH}px !important;\n}`,
          confidenceScore: confidence,
          tolerance: "±2px",
          boundingRect: node.rect,
        });
      }

      // 5. COLOR COMPARISON: CIE LAB Delta E (Tolerance: Delta E <= 2.0)
      // Pick matching color token from Figma based on element role (text vs background)
      const isTextRole = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "SPAN", "A"].includes(node.tagName);
      const targetFigmaColor = isTextRole
        ? figma.colors.find((c) => c.hex === "#0F172A" || c.hex === "#2563EB" || c.type === "fill") || figma.colors[0]
        : figma.colors.find((c) => c.type === "background" || c.hex === "#0F172A") || figma.colors[0];

      if (targetFigmaColor?.hex && node.styles.color) {
        const expectedColorHex = targetFigmaColor.hex;
        const actualColorRgb = node.styles.color;

        const colorResult = ColorDeltaE.calculateDeltaE(expectedColorHex, actualColorRgb);

        trackResult("color", colorResult.isPass, {
          id: `rule-color-${node.id || node.tagName}`,
          title: `${readableName} Color Mismatch`,
          element: elementSelector,
          expectedValue: colorResult.expectedHex,
          actualValue: colorResult.actualHex,
          difference: `CIE LAB Delta E = ${colorResult.deltaE} (Threshold <= 2.0)`,
          severity: colorResult.deltaE > 5.0 ? "critical" : "warning",
          suggestedCssFix: `${elementSelector} {\n  color: ${expectedColorHex} !important;\n}`,
          confidenceScore: confidence,
          deltaE: colorResult.deltaE,
          tolerance: "ΔE ≤ 2.0",
          boundingRect: node.rect,
        });
      }
    });

    // Compute category match percentages
    const categoryMatchPercentages: Record<string, number> = {};
    Object.keys(categoryStats).forEach((cat) => {
      const stat = categoryStats[cat];
      categoryMatchPercentages[cat] =
        stat.total > 0 ? Math.round((stat.pass / stat.total) * 100) : 90;
    });

    return {
      issues,
      passCount,
      failCount,
      totalChecks,
      categoryMatchPercentages,
    };
  }
}
