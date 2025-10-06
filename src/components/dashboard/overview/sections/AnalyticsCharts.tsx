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
import { MonthlyAnalyticsData, TopVideoData } from "@/types/dashboard/overview"

interface AnalyticsChartsProps {
  monthlyAnalyticsData: MonthlyAnalyticsData[]
  topVideosData: TopVideoData[]
}

export default function AnalyticsCharts({ monthlyAnalyticsData, topVideosData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg">Monthly Analytics Overview</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Views and subscriber growth over time</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <ChartContainer
            config={{
              views: {
                label: "Views",
                color: "#FD1D1D",
              },
              subscribers: {
                label: "Subscribers",
                color: "#FF6B35",
              },
            }}
            className="h-[180px] sm:h-[200px] md:h-[250px] lg:h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF" 
                  fontSize={8} 
                  tickMargin={5}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={8} 
                  tickMargin={5}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#FD1D1D"
                  strokeWidth={2}
                  dot={{ fill: "#FD1D1D", strokeWidth: 2, r: 2 }}
                  activeDot={{ r: 4, stroke: "#FD1D1D", strokeWidth: 2 }}
                  name="Views"
                />
                <Line
                  type="monotone"
                  dataKey="subscribers"
                  stroke="#FF6B35"
                  strokeWidth={2}
                  dot={{ fill: "#FF6B35", strokeWidth: 2, r: 2 }}
                  activeDot={{ r: 4, stroke: "#FF6B35", strokeWidth: 2 }}
                  name="Subscribers"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg">Top Performing Videos</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Video performance by views and engagement</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <ChartContainer
            config={{
              views: {
                label: "Views",
                color: "#FD1D1D",
              },
            }}
            className="h-[180px] sm:h-[200px] md:h-[250px] lg:h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVideosData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number" 
                  stroke="#9CA3AF" 
                  fontSize={8} 
                  tickMargin={5}
                />
                <YAxis 
                  dataKey="title" 
                  type="category" 
                  width={60} 
                  stroke="#9CA3AF" 
                  fontSize={7} 
                  tickMargin={5}
                  interval={0}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" fill="#FD1D1D" name="Views" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
