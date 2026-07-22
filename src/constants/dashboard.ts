import type { KpiMetric, AuditIssue, AiRecommendation, ChatMessage, WebsiteHealthData } from "@/types/dashboard";
import type { PerformanceDataPoint, ChartConfig } from "@/types/charts";

export const KPI_CARDS: KpiMetric[] = [
  {
    id: "overall-score",
    label: "Overall Score",
    value: 92,
    maxValue: 100,
    trend: { direction: "up", percentage: 2.4, label: "from last week" },
    icon: "BarChart3",
    colorVariant: "primary",
  },
  {
    id: "performance",
    label: "Performance",
    value: 89,
    trend: { direction: "up", percentage: 1.1, label: "from last week" },
    icon: "Gauge",
    colorVariant: "secondary",
  },
  {
    id: "seo",
    label: "SEO",
    value: 84,
    trend: { direction: "down", percentage: 0.5, label: "from last week" },
    icon: "Search",
    colorVariant: "tertiary",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    value: 95,
    trend: { direction: "up", percentage: 4.2, label: "from last week" },
    icon: "Accessibility",
    colorVariant: "neutral",
  },
];

export const WEBSITE_HEALTH: WebsiteHealthData = {
  score: 92,
  maxScore: 100,
  status: "Excellent",
  statusColor: "text-green-600",
  scanDuration: "12s",
};

export const MOCK_ISSUES: AuditIssue[] = [
  {
    id: "issue-1",
    priority: "high",
    category: "Performance",
    issue: "Slow server response time",
    page: "/home",
    impact: "-14 pts",
    status: "in-progress",
  },
  {
    id: "issue-2",
    priority: "medium",
    category: "SEO",
    issue: "Missing meta description",
    page: "/about-us",
    impact: "-8 pts",
    status: "open",
  },
  {
    id: "issue-3",
    priority: "low",
    category: "Accessibility",
    issue: "Low color contrast ratio",
    page: "/contact",
    impact: "-3 pts",
    status: "resolved",
  },
];

export const ISSUES_TABLE_COLUMNS = [
  { key: "priority", label: "Priority" },
  { key: "category", label: "Category" },
  { key: "issue", label: "Issue" },
  { key: "page", label: "Page" },
  { key: "impact", label: "Impact" },
  { key: "status", label: "Status" },
] as const;

export const MOCK_RECOMMENDATIONS: AiRecommendation[] = [
  {
    id: "rec-1",
    title: "Compress hero image",
    description: "Save up to 1.2MB of payload",
    severity: "critical",
    icon: "Image",
  },
  {
    id: "rec-2",
    title: "Reduce unused JavaScript",
    description: "Removes 400kb from main thread",
    severity: "critical",
    icon: "Code",
  },
  {
    id: "rec-3",
    title: "Enable GZIP compression",
    description: "Improves Time to First Byte",
    severity: "medium",
    icon: "Timer",
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: "Hello! I've analyzed example.com. How can I help improve your audit scores today?",
    timestamp: new Date(),
  },
  {
    id: "msg-2",
    role: "user",
    content: "How can I improve my SEO score?",
    timestamp: new Date(),
  },
  {
    id: "msg-3",
    role: "assistant",
    content: "To improve your SEO score from 84 to 90+, focus on: optimizing meta descriptions for 4 pages, fixing 3 broken internal links, and adding alt text to main hero images.",
    timestamp: new Date(),
  },
];

export const MOCK_PERFORMANCE_DATA: PerformanceDataPoint[] = [
  { date: "Mon", lcp: 2.4, cls: 0.12, fcp: 1.8 },
  { date: "Tue", lcp: 2.2, cls: 0.10, fcp: 1.6 },
  { date: "Wed", lcp: 2.6, cls: 0.08, fcp: 1.9 },
  { date: "Thu", lcp: 1.9, cls: 0.11, fcp: 1.5 },
  { date: "Fri", lcp: 2.1, cls: 0.09, fcp: 1.7 },
  { date: "Sat", lcp: 1.8, cls: 0.07, fcp: 1.4 },
  { date: "Sun", lcp: 1.7, cls: 0.06, fcp: 1.3 },
];

export const PERFORMANCE_CHART_CONFIG: ChartConfig = {
  series: [
    { key: "lcp", label: "LCP (Largest Contentful Paint)", color: "#004ac6" },
    { key: "cls", label: "CLS (Cumulative Layout Shift)", color: "#4b41e1", opacity: 0.5 },
    { key: "fcp", label: "FCP (First Contentful Paint)", color: "#bc4800", opacity: 0.3 },
  ],
  xAxisKey: "date",
};
