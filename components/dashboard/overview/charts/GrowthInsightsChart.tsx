"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts"

interface GrowthInsightsChartProps {
  growthInsights: {
    channel_age_months: number;
    upload_frequency: number;
    total_watch_time_hours: number;
    health_score: number;
  };
}

export default function GrowthInsightsChart({ growthInsights }: GrowthInsightsChartProps) {
  const chartData = [
    {
      name: "Health Score",
      value: growthInsights.health_score,
      fill: "#FD1D1D"
    },
    {
      name: "Upload Frequency",
      value: Math.min(growthInsights.upload_frequency * 10, 100), // Scale to 0-100
      fill: "#FF6B35"
    },
    {
      name: "Channel Age",
      value: Math.min((growthInsights.channel_age_months / 24) * 100, 100), // Scale to 0-100
      fill: "#F7931E"
    },
    {
      name: "Watch Time",
      value: Math.min((growthInsights.total_watch_time_hours / 100) * 100, 100), // Scale to 0-100
      fill: "#FFA500"
    }
  ]

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
        <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Growth Insights</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Channel health and growth metrics</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="w-full overflow-hidden">
          <ChartContainer
            config={{
              value: {
                label: "Score",
                color: "#FD1D1D",
              },
            }}
            className="h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="15%" 
                outerRadius="70%" 
                data={chartData}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={5}
                  fill="#FD1D1D"
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />} 
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
