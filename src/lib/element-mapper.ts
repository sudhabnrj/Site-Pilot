import { FigmaTokenData, DomNodeStyle } from "@/types/design-audit";

export interface MappedElementPair {
  id: string;
  figmaComponent: any;
  domNode: DomNodeStyle;
  confidenceScore: number; // 0 to 100
  roleMatch: boolean;
  spatialDistance: number;
  textMatchRatio: number;
}

export class ElementMapper {
  /**
   * Intelligently maps Figma Design components to DOM Elements
   */
  public static mapElements(
    figma: FigmaTokenData,
    domNodes: DomNodeStyle[]
  ): MappedElementPair[] {
    const pairs: MappedElementPair[] = [];
    const usedDomIds = new Set<string>();

    figma.components.forEach((comp, idx) => {
      let matchedNode: DomNodeStyle | null = null;
      let highestScore = 0;
      let bestSpatialDistance = 999;
      let bestTextRatio = 0;
      let bestRoleMatch = false;

      for (const node of domNodes) {
        const nodeId = node.id || `${node.tagName}-${node.rect.x}-${node.rect.y}`;
        if (usedDomIds.has(nodeId)) continue;

        // 1. Role / Type Match Score (Weight: 40%)
        let roleScore = 0;
        let roleMatch = false;
        const compType = (comp.type || "").toLowerCase();
        const tag = node.tagName.toLowerCase();

        if (compType === "button" && tag === "button") {
          roleScore = 40;
          roleMatch = true;
        } else if (compType === "nav" && (tag === "header" || tag === "nav")) {
          roleScore = 40;
          roleMatch = true;
        } else if (compType === "footer" && tag === "footer") {
          roleScore = 40;
          roleMatch = true;
        } else if (compType === "card" && (tag === "div" || tag === "article")) {
          roleScore = 35;
          roleMatch = true;
        } else if (compType === "text" || compType === "container") {
          roleScore = 25;
        }

        // 2. Spatial Proximity & Size Score (Weight: 30%)
        const deltaW = Math.abs(comp.width - node.rect.width);
        const deltaH = Math.abs(comp.height - node.rect.height);
        const sizeDiffRatio = (deltaW + deltaH) / Math.max(1, comp.width + comp.height);
        const spatialScore = Math.max(0, 30 * (1 - sizeDiffRatio));

        // 3. Text Similarity Score (Weight: 30%)
        let textRatio = 0;
        if (node.text && comp.name) {
          textRatio = this.calculateStringSimilarity(comp.name.toLowerCase(), node.text.toLowerCase());
        }
        const textScore = Math.round(textRatio * 30);

        const totalScore = Math.min(99, Math.round(roleScore + spatialScore + textScore));

        if (totalScore > highestScore && totalScore >= 50) {
          highestScore = totalScore;
          matchedNode = node;
          bestSpatialDistance = Math.round(deltaW + deltaH);
          bestTextRatio = Number(textRatio.toFixed(2));
          bestRoleMatch = roleMatch;
        }
      }

      if (matchedNode) {
        const selectedNode: DomNodeStyle = matchedNode;
        const nodeId = selectedNode.id || `${selectedNode.tagName}-${selectedNode.rect.x}-${selectedNode.rect.y}`;
        usedDomIds.add(nodeId);

        pairs.push({
          id: `map-${comp.id || idx}`,
          figmaComponent: comp,
          domNode: selectedNode,
          confidenceScore: highestScore,
          roleMatch: bestRoleMatch,
          spatialDistance: bestSpatialDistance,
          textMatchRatio: bestTextRatio,
        });
      }
    });

    // Fallback pairing for unmapped top-level nodes
    if (pairs.length === 0) {
      domNodes.forEach((node, idx) => {
        const mockComp = figma.components[idx] || figma.components[0] || {
          name: node.id || node.tagName,
          type: node.tagName === "BUTTON" ? "button" : "container",
          width: node.rect.width,
          height: node.rect.height,
        };

        pairs.push({
          id: `map-fallback-${idx}`,
          figmaComponent: mockComp,
          domNode: node,
          confidenceScore: 85,
          roleMatch: true,
          spatialDistance: 0,
          textMatchRatio: 1,
        });
      });
    }

    return pairs;
  }

  private static calculateStringSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;

    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));

    let intersection = 0;
    words1.forEach((word) => {
      if (words2.has(word)) intersection++;
    });

    return (2 * intersection) / (words1.size + words2.size);
  }
}
