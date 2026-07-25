/**
 * Standard Score Color Utilities
 * Rules:
 * - score < 70: Red
 * - score >= 70 and score < 80: Orange / Amber
 * - score >= 80: Green / Emerald
 */

export function getScoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 70) return "text-amber-500 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 70) return "bg-amber-500";
  return "bg-red-500";
}

export function getScoreBadgeClass(score: number): string {
  if (score >= 80) {
    return "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900";
  }
  if (score >= 70) {
    return "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900";
  }
  return "bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900";
}

export function getScoreHexColor(score: number): string {
  if (score >= 80) return "#10b981"; // Green
  if (score >= 70) return "#f59e0b"; // Orange
  return "#ef4444"; // Red
}

export function getScoreStanding(score: number): { text: string; type: "good" | "warning" | "error" } {
  if (score >= 80) return { text: "Excellent", type: "good" };
  if (score >= 70) return { text: "Good", type: "warning" };
  return { text: "Needs Attention", type: "error" };
}
