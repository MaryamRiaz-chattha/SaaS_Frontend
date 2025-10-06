import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Eye, Users, BarChart3, TrendingUp } from "lucide-react"

interface KeyMetricsCardsProps {
  channelInfo: {
    total_videos: number
    total_views: number
    subscriber_count: number
  }
  performanceMetrics: {
    videos_per_month: number
    views_per_month: number
    subscribers_per_month: number
    overall_engagement_rate: number
  }
}

export default function KeyMetricsCards({ 
  channelInfo, 
  performanceMetrics 
}: KeyMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="crypto-card crypto-hover-glow border-l-4 border-l-brand-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium crypto-text-primary">Total Videos</CardTitle>
          <Video className="h-4 w-4 crypto-profit" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold crypto-text-primary">{channelInfo.total_videos}</div>
          <p className="text-xs crypto-text-secondary flex items-center gap-1">
            <TrendingUp className="w-3 h-3 crypto-profit" />
            +{performanceMetrics.videos_per_month.toFixed(1)}/month
          </p>
        </CardContent>
      </Card>

      <Card className="crypto-card crypto-hover-glow border-l-4 border-l-brand-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium crypto-text-primary">Total Views</CardTitle>
          <Eye className="h-4 w-4 crypto-profit" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold crypto-text-primary">{channelInfo.total_views.toLocaleString()}</div>
          <p className="text-xs crypto-text-secondary flex items-center gap-1">
            <TrendingUp className="w-3 h-3 crypto-profit" />
            +{performanceMetrics.views_per_month.toFixed(1)}/month
          </p>
        </CardContent>
      </Card>

      <Card className="crypto-card crypto-hover-glow border-l-4 border-l-brand-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium crypto-text-primary">Subscribers</CardTitle>
          <Users className="h-4 w-4 crypto-profit" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold crypto-text-primary">{channelInfo.subscriber_count}</div>
          <p className="text-xs crypto-text-secondary flex items-center gap-1">
            <TrendingUp className="w-3 h-3 crypto-profit" />
            +{performanceMetrics.subscribers_per_month.toFixed(2)}/month
          </p>
        </CardContent>
      </Card>

      <Card className="crypto-card crypto-hover-glow border-l-4 border-l-brand-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium crypto-text-primary">Engagement Rate</CardTitle>
          <BarChart3 className="h-4 w-4 crypto-profit" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold crypto-text-primary">{performanceMetrics.overall_engagement_rate.toFixed(2)}%</div>
          <p className="text-xs crypto-text-secondary">
            Avg per video
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
