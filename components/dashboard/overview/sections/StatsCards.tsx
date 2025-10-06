import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users, MessageCircle, Eye } from "lucide-react"
import { DashboardStats } from "@/types/dashboard/overview"

interface StatsCardsProps {
  stats: DashboardStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card className="crypto-card crypto-hover-glow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium crypto-text-primary">Total Videos</CardTitle>
          <Video className="h-4 w-4 crypto-text-tertiary flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold crypto-text-primary">{stats.totalVideos}</div>
          <p className="text-xs crypto-text-secondary truncate">{stats.videosChange}</p>
        </CardContent>
      </Card>

      <Card className="crypto-card crypto-hover-glow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium crypto-text-primary">Total Comments</CardTitle>
          <MessageCircle className="h-4 w-4 crypto-text-tertiary flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold crypto-text-primary">{stats.totalComments}</div>
          <p className="text-xs crypto-text-secondary truncate">{stats.commentsChange}</p>
        </CardContent>
      </Card>

      <Card className="crypto-card crypto-hover-glow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium crypto-text-primary">Total Subscribers</CardTitle>
          <Users className="h-4 w-4 crypto-text-tertiary flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold crypto-text-primary">{stats.totalSubscribers}</div>
          <p className="text-xs crypto-text-secondary truncate">{stats.subscribersChange}</p>
        </CardContent>
      </Card>

      <Card className="crypto-card crypto-hover-glow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium crypto-text-primary">Total Views</CardTitle>
          <Eye className="h-4 w-4 crypto-text-tertiary flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold crypto-text-primary">{stats.totalViews.toLocaleString()}</div>
          <p className="text-xs crypto-text-secondary truncate">{stats.viewsChange}</p>
        </CardContent>
      </Card>
    </div>
  )
}
