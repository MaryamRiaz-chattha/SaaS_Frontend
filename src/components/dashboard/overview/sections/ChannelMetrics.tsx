import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts"
import { WeeklyChartData, PerformanceData } from "@/types/dashboard/overview"

interface ChannelMetricsProps {
  chartData: WeeklyChartData[]
  performanceData: PerformanceData[]
}

export default function ChannelMetrics({ chartData, performanceData }: ChannelMetricsProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg">Channel Performance</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Weekly analytics breakdown</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <ChartContainer
            config={{
              views: {
                label: "Views",
                color: "#FD1D1D",
              },
              engagement: {
                label: "Engagement Rate",
                color: "#FF6B35",
              },
            }}
            className="h-[180px] sm:h-[200px] md:h-[250px] lg:h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="week" 
                  stroke="#9CA3AF" 
                  fontSize={8} 
                  tickMargin={5}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={8} 
                  tickMargin={5}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="views" stroke="#FD1D1D" strokeWidth={2} name="Views" />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#FF6B35"
                  strokeWidth={2}
                  name="Engagement %"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg">View Distribution</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Video performance by view ranges</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <ChartContainer
            config={{
              count: {
                label: "Videos",
                color: "#FD1D1D",
              },
            }}
            className="h-[180px] sm:h-[200px] md:h-[250px] lg:h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="category" 
                  stroke="#9CA3AF" 
                  fontSize={8} 
                  tickMargin={5}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={8} 
                  tickMargin={5}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#FD1D1D" name="Videos" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
