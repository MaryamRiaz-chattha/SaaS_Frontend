"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
} from "recharts"

interface ContentDistributionChartProps {
  contentDistributions: {
    view_distribution: {
      total_views: number;
      avg_views_per_day: number;
    };
    duration_distribution: {
      avg_duration_seconds: number;
      total_watch_time_minutes: number;
    };
  };
}

export default function ContentDistributionChart({ contentDistributions }: ContentDistributionChartProps) {
  const chartData = [
    {
      name: "Total Views",
      value: contentDistributions.view_distribution.total_views,
      color: "#FD1D1D"
    },
    {
      name: "Avg Views/Day",
      value: Math.round(contentDistributions.view_distribution.avg_views_per_day * 10) / 10,
      color: "#FF6B35"
    },
    {
      name: "Watch Time (min)",
      value: contentDistributions.duration_distribution.total_watch_time_minutes,
      color: "#F7931E"
    },
    {
      name: "Avg Duration (s)",
      value: contentDistributions.duration_distribution.avg_duration_seconds,
      color: "#FFA500"
    }
  ]

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
        <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Content Distribution</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Breakdown of content metrics</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="w-full overflow-hidden">
          <ChartContainer
            config={{
              value: {
                label: "Value",
                color: "#FD1D1D",
              },
            }}
            className="h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="#FD1D1D"
                  dataKey="value"
                  label={({ name, percent }) => {
                    const shortName = name.split(" ")[0];
                    return `${shortName} ${(percent * 100).toFixed(0)}%`;
                  }}
                  labelLine={false}
                  fontSize={8}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />} 
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
