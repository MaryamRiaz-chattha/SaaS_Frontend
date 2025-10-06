import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Award, Eye, ThumbsUp, Clock } from "lucide-react"

interface TopPerformingContentProps {
  topPerformingContent: {
    top_videos_by_views: Array<{
      video_id: string
      title: string
      views: number
      likes: number
      duration: string
    }>
    top_videos_by_engagement: Array<{
      video_id: string
      title: string
      views: number
      likes: number
      engagement_rate: number
    }>
  }
}

export default function TopPerformingContent({ 
  topPerformingContent 
}: TopPerformingContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="w-5 h-5 crypto-profit" />
          Top Performing Content
        </CardTitle>
        <CardDescription>Your best videos by views and engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Top by Views</h4>
            {topPerformingContent.top_videos_by_views.slice(0, 3).map((video, index) => (
              <div key={video.video_id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-2">
                <div className="w-8 h-8 rounded-full bg-profit/10 flex items-center justify-center crypto-profit font-bold text-sm crypto-glow">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{video.title}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {video.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Top by Engagement</h4>
            {topPerformingContent.top_videos_by_engagement.slice(0, 3).map((video, index) => (
              <div key={video.video_id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-2">
                <div className="w-8 h-8 rounded-full bg-profit/10 flex items-center justify-center crypto-profit font-bold text-sm crypto-glow">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{video.title}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {video.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.engagement_rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
