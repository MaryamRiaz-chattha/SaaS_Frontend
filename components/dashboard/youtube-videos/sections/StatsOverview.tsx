import { Card, CardContent } from "@/components/ui/card"
import { Eye, ThumbsUp, MessageCircle, BarChart3, Video } from "lucide-react"
import { VideoStats } from "@/types/dashboard/youtube-videos"

interface StatsOverviewProps {
  stats: VideoStats
  isLoading?: boolean
}

export default function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
  const statCards = [
    {
      icon: Video,
      value: stats.totalVideos,
      label: "Total Videos",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Eye,
      value: stats.totalViews.toLocaleString(),
      label: "Total Views",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: ThumbsUp,
      value: stats.totalLikes.toLocaleString(),
      label: "Total Likes",
      color: "crypto-profit",
      bgColor: "bg-profit/10"
    },
    {
      icon: MessageCircle,
      value: stats.totalComments.toLocaleString(),
      label: "Total Comments",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: BarChart3,
      value: stats.avgPerformance.toFixed(1),
      label: "Avg Performance",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-all duration-200 hover:scale-105">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
              <div className="space-y-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-tight">
                  {stat.label}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
