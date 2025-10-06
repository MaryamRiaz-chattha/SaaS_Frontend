"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

interface MonthlyAnalyticsChartProps {
  monthlyData: {
    [key: string]: {
      views: number;
      engagement: number;
    };
  };
}

export default function MonthlyAnalyticsChart({ monthlyData }: MonthlyAnalyticsChartProps) {
  // Transform the data for the chart
  const chartData = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month: month.split('-')[1] + '/' + month.split('-')[0].slice(-2), // Format as MM/YY
      views: data.views,
      engagement: data.engagement,
    }))
    .sort((a, b) => {
      // Sort by month chronologically
      const [monthA, yearA] = a.month.split('/')
      const [monthB, yearB] = b.month.split('/')
      return parseInt(yearA + monthA) - parseInt(yearB + monthB)
    })

  return (
    <Card className="w-full overflow-hidden responsive-card">
      <CardHeader className="pb-2 sm:pb-4 responsive-card-header">
        <CardTitle className="text-sm sm:text-base lg:text-lg truncate chart-title">Monthly Analytics</CardTitle>
        <CardDescription className="text-xs sm:text-sm chart-description">Views and engagement trends over time</CardDescription>
      </CardHeader>
      <CardContent className="responsive-card-content">
        <div className="w-full overflow-hidden chart-container">
          <ChartContainer
            config={{
              views: {
                label: "Views",
                color: "#FD1D1D",
              },
              engagement: {
                label: "Engagement",
                color: "#FF6B35",
              },
            }}
            className="h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF" 
                  fontSize={8}
                  tickMargin={3}
                  interval="preserveStartEnd"
                  angle={-45}
                  textAnchor="end"
                  height={40}
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
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#FD1D1D"
                  strokeWidth={1.5}
                  dot={{ fill: "#FD1D1D", strokeWidth: 1, r: 2 }}
                  activeDot={{ r: 4, stroke: "#FD1D1D", strokeWidth: 1 }}
                  name="Views"
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#FF6B35"
                  strokeWidth={1.5}
                  dot={{ fill: "#FF6B35", strokeWidth: 1, r: 2 }}
                  activeDot={{ r: 4, stroke: "#FF6B35", strokeWidth: 1 }}
                  name="Engagement"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
