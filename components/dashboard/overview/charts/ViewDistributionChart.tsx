import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

interface ViewDistributionChartProps {
  viewDistribution: Record<string, number>
}

export default function ViewDistributionChart({ viewDistribution }: ViewDistributionChartProps) {
  const viewDistributionData = Object.entries(viewDistribution).map(([range, count]) => ({
    range,
    count,
    color: range === '0-100' ? '#FD1D1D' : range === '101-500' ? '#FF6B35' : range === '501-1000' ? '#F7931E' : '#FFA500'
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">View Distribution</CardTitle>
        <CardDescription>How your videos perform across view ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={viewDistributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="range" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#f9fafb'
              }}
            />
            <Bar dataKey="count" fill="#FD1D1D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
