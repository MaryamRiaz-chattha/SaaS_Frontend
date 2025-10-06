import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { ContentCategoryData, GrowthTrendData } from "@/types/dashboard/overview"

interface PerformanceChartsProps {
  contentCategoriesData: ContentCategoryData[]
  growthTrendsData: GrowthTrendData[]
}

export default function PerformanceCharts({ contentCategoriesData, growthTrendsData }: PerformanceChartsProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg">Content Categories Distribution</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Breakdown of content by category</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <ChartContainer
            config={{
              value: {
                label: "Videos",
                color: "#FD1D1D",
              },
            }}
            className="h-[180px] sm:h-[200px] md:h-[250px] lg:h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentCategoriesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="#FD1D1D"
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={8}
                >
                  {contentCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg">Growth Trends Over Time</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Cumulative growth in views and subscribers</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <ChartContainer
            config={{
              totalViews: {
                label: "Total Views",
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
              <AreaChart data={growthTrendsData}>
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
                <Area
                  type="monotone"
                  dataKey="totalViews"
                  stackId="1"
                  stroke="#FD1D1D"
                  fill="#FD1D1D"
                  fillOpacity={0.6}
                  name="Total Views"
                />
                <Area
                  type="monotone"
                  dataKey="subscribers"
                  stackId="2"
                  stroke="#FF6B35"
                  fill="#FF6B35"
                  fillOpacity={0.8}
                  name="Subscribers"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
