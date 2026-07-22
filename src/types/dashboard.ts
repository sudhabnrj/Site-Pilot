export type TrendDirection = "up" | "down" | "neutral";
export type SeverityLevel = "critical" | "high" | "medium" | "low";
export type IssueStatus = "open" | "in-progress" | "resolved";
export type ColorVariant = "primary" | "secondary" | "tertiary" | "neutral";

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  maxValue?: number;
  trend: {
    direction: TrendDirection;
    percentage: number;
    label: string;
  };
  icon: string; // Lucide icon name
  colorVariant: ColorVariant;
}

export interface AuditIssue {
  id: string;
  priority: SeverityLevel;
  category: string;
  issue: string;
  page: string;
  impact: string;
  status: IssueStatus;
}

export interface AiRecommendation {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  icon: string;
}

export interface NavItem {
  label: string;
  icon: string; // Lucide icon name
  href: string;
  isActive?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

export interface WebsiteHealthData {
  score: number;
  maxScore: number;
  status: string;
  statusColor: string;
  scanDuration: string;
}
