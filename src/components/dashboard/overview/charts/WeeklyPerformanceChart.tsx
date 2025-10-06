import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

interface WeeklyPerformanceChartProps {
  weeklyData: Record<string, {
    views: number
    engagement_rate: number
    videos: number
  }>
}

export default function WeeklyPerformanceChart({ weeklyData }: WeeklyPerformanceChartProps) {
  // Transform API data for charts
  const weeklyChartData = Object.entries(weeklyData).map(([week, data]) => ({
    week,
    views: data.views,
    engagement: data.engagement_rate,
    videos: data.videos
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weekly Performance</CardTitle>
        <CardDescription>Views and engagement trends over the last 4 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="week" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#f9fafb'
              }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#FD1D1D"
              strokeWidth={3}
              dot={{ fill: "#FD1D1D", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#FD1D1D", strokeWidth: 2 }}
              name="Views"
            />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#FF6B35"
              strokeWidth={3}
              dot={{ fill: "#FF6B35", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#FF6B35", strokeWidth: 2 }}
              name="Engagement %"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
