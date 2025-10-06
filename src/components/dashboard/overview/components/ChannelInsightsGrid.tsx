import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ChannelInsightsGridProps {
  performanceMetrics: {
    avg_views_per_video: number
    avg_likes_per_video: number
    avg_comments_per_video: number
    avg_duration_per_video: number
    channel_age_months: number
    videos_per_month: number
  }
  channelStatus: {
    engagement_level: string
    content_quality: string
    upload_consistency: string
  }
  competitiveAnalysis: {
    growth_potential: string
    channel_health_score: number
  }
  summaryStats: {
    total_watch_time_hours: number
  }
}

export default function ChannelInsightsGrid({ 
  performanceMetrics, 
  channelStatus, 
  competitiveAnalysis, 
  summaryStats 
}: ChannelInsightsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg Views/Video</span>
            <span className="font-medium">{performanceMetrics.avg_views_per_video.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg Likes/Video</span>
            <span className="font-medium">{performanceMetrics.avg_likes_per_video.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg Comments/Video</span>
            <span className="font-medium">{performanceMetrics.avg_comments_per_video.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg Duration</span>
            <span className="font-medium">{(performanceMetrics.avg_duration_per_video / 60).toFixed(1)} min</span>
          </div>
        </CardContent>
      </Card>

      {/* Channel Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Channel Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Engagement Level</span>
            <Badge variant={channelStatus.engagement_level === 'High' ? 'default' : 'secondary'}>
              {channelStatus.engagement_level}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Content Quality</span>
            <Badge variant={channelStatus.content_quality === 'High' ? 'default' : 'secondary'}>
              {channelStatus.content_quality}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Upload Consistency</span>
            <Badge variant={channelStatus.upload_consistency === 'High' ? 'default' : 'secondary'}>
              {channelStatus.upload_consistency}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Growth Potential</span>
            <Badge variant={competitiveAnalysis.growth_potential === 'High' ? 'default' : 'secondary'}>
              {competitiveAnalysis.growth_potential}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Growth Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Growth Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Channel Age</span>
            <span className="font-medium">{performanceMetrics.channel_age_months.toFixed(1)} months</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Upload Frequency</span>
            <span className="font-medium">{performanceMetrics.videos_per_month.toFixed(1)}/month</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Watch Time</span>
            <span className="font-medium">{summaryStats.total_watch_time_hours.toFixed(1)} hours</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Health Score</span>
            <span className="font-medium">{competitiveAnalysis.channel_health_score.toFixed(1)}/100</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
