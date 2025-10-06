"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

interface PerformanceMetricsChartProps {
  performanceMetrics: {
    avg_views_per_video: number;
    avg_likes_per_video: number;
    avg_comments_per_video: number;
    avg_duration_minutes: number;
  };
}

export default function PerformanceMetricsChart({ performanceMetrics }: PerformanceMetricsChartProps) {
  const chartData = [
    {
      metric: "Views",
      value: performanceMetrics.avg_views_per_video,
      color: "#FD1D1D"
    },
    {
      metric: "Likes",
      value: performanceMetrics.avg_likes_per_video,
      color: "#FF6B35"
    },
    {
      metric: "Comments",
      value: performanceMetrics.avg_comments_per_video,
      color: "#F7931E"
    },
    {
      metric: "Duration (min)",
      value: performanceMetrics.avg_duration_minutes,
      color: "#FFA500"
    }
  ]

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
        <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Performance Metrics</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Average metrics per video</CardDescription>
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
              <BarChart 
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="metric" 
                  stroke="#9CA3AF" 
                  fontSize={8}
                  tickMargin={3}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={8}
                  tickMargin={3}
                  width={30}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />} 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#FD1D1D" 
                  name="Value" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
