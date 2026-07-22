export interface PerformanceDataPoint {
  date: string;
  lcp: number;
  cls: number;
  fcp: number;
}

export interface ChartSeries {
  key: keyof Omit<PerformanceDataPoint, "date">;
  label: string;
  color: string;
  opacity?: number;
}

export interface ChartConfig {
  series: ChartSeries[];
  xAxisKey: string;
  yAxisLabel?: string;
}
