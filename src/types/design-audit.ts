export type AuditInputOption = "figma" | "screenshot" | "url";

export interface FigmaUserProfile {
  id?: string;
  handle: string;
  email?: string;
  imgUrl?: string;
}

export interface FigmaTokenData {
  fileKey?: string;
  fileName?: string;
  frameName?: string;
  figmaUser?: FigmaUserProfile;
  width?: number;
  height?: number;
  typography: Array<{
    fontFamily: string;
    fontSize: number;
    fontWeight: number | string;
    lineHeight?: number | string;
    letterSpacing?: number | string;
    color?: string;
  }>;
  colors: Array<{
    hex: string;
    type: "fill" | "stroke" | "background";
    opacity?: number;
  }>;
  spacing: Array<{
    type: "padding" | "margin" | "gap";
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    value?: number;
  }>;
  borderRadius: Array<{
    value: number;
    element?: string;
  }>;
  components: Array<{
    id?: string;
    name: string;
    type: "button" | "card" | "nav" | "footer" | "form" | "icon" | "image" | "container" | "text";
    width: number;
    height: number;
    padding?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  }>;
  autoLayout?: {
    direction: "horizontal" | "vertical" | "none";
    spacing: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
    alignItems?: string;
    justifyContent?: string;
  };
}

export interface DomNodeStyle {
  tagName: string;
  id?: string;
  className?: string;
  text?: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  styles: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    color: string;
    backgroundColor: string;
    borderColor: string;
    borderRadius: string;
    paddingTop: string;
    paddingRight: string;
    paddingBottom: string;
    paddingLeft: string;
    marginTop: string;
    marginRight: string;
    marginBottom: string;
    marginLeft: string;
    gap: string;
    display: string;
    flexDirection: string;
    justifyContent: string;
    alignItems: string;
    position: string;
    overflow: string;
  };
}

export interface WebsiteAnalysisResult {
  url: string;
  desktopScreenshot: string;
  tabletScreenshot: string;
  mobileScreenshot: string;
  domTree: DomNodeStyle[];
  viewportMetrics: {
    desktop: { width: number; height: number };
    tablet: { width: number; height: number };
    mobile: { width: number; height: number };
  };
}

export type IssueSeverity = "critical" | "warning" | "info";
export type IssueCategory =
  | "typography"
  | "layout"
  | "spacing"
  | "color"
  | "component"
  | "responsive"
  | "accessibility";

export interface DesignAuditIssue {
  id: string;
  category: IssueCategory;
  title: string;
  element?: string;
  expectedValue: string;
  actualValue: string;
  difference: string;
  severity: IssueSeverity;
  suggestedCssFix: string;
  confidenceScore?: number;
  deltaE?: number;
  tolerance?: string;
  isPass?: boolean;
  boundingRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CategoryScores {
  typography: number;
  layout: number;
  spacing: number;
  color: number;
  component: number;
  responsive: number;
  accessibility: number;
}

export interface ResponsiveAuditResult {
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
}

export interface DesignAuditReportItem {
  _id?: string;
  id?: string;
  userId: string;
  websiteUrl: string;
  figmaUrl?: string;
  figmaUser?: FigmaUserProfile;
  uploadedScreenshot?: string;
  websiteScreenshots: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
  diffScreenshot: string;
  heatmapScreenshot: string;
  overallScore: number;
  categoryScores: CategoryScores;
  pixelSimilarity: number;
  issues: DesignAuditIssue[];
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    category: string;
    cssCode?: string;
  }>;
  responsiveAudit: ResponsiveAuditResult;
  figmaTokensExtracted?: {
    framesCount: number;
    componentsCount: number;
    colorsCount: number;
    typographyCount: number;
  };
  createdAt: string | Date;
  updatedAt?: string | Date;
}
