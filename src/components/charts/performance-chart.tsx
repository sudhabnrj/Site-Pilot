"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import type { PerformanceDataPoint } from "@/types/charts";
import type { ChartConfig } from "@/types/charts";
import { cn } from "@/lib/utils";

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
  config: ChartConfig;
  className?: string;
}

const TIME_PERIODS = ["Last 7 Days", "Last 30 Days"] as const;

export function PerformanceChart({ data, config, className }: PerformanceChartProps) {
  return (
    <GlassCard className={cn("p-6", className)}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Performance Core Vitals</h3>
          <p className="text-sm text-muted-foreground">
            Real-user monitoring and simulated audit data.
          </p>
        </div>
        <select
          className="rounded-lg border border-border/50 bg-background px-4 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Select time period"
        >
          {TIME_PERIODS.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={config.xAxisKey}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            />
            {config.series.map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                stroke={series.color}
                strokeWidth={2.5}
                strokeOpacity={series.opacity ?? 1}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap gap-6">
        {config.series.map((series) => (
          <div key={series.key} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: series.color, opacity: series.opacity ?? 1 }}
            />
            <span className="text-xs font-medium">{series.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
