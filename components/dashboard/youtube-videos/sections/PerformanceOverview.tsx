import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Activity } from "lucide-react"
import { PerformanceDistribution } from "@/types/dashboard/youtube-videos"

interface PerformanceOverviewProps {
  performanceDistribution: PerformanceDistribution
  isLoading?: boolean
}

export default function PerformanceOverview({ 
  performanceDistribution, 
  isLoading 
}: PerformanceOverviewProps) {
  const totalVideos = performanceDistribution.high + performanceDistribution.medium + performanceDistribution.low

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-5 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                  <div className="h-2 bg-muted rounded"></div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
      {/* Performance Distribution */}
      <Card className="hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-full">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            Performance Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-3 sm:space-y-4">
            {/* High Performance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium">High Performance (80+)</span>
                <Badge variant="outline" className="crypto-profit bg-profit/10 border-profit/20 text-xs">
                  {performanceDistribution.high} videos
                </Badge>
              </div>
              <Progress 
                value={totalVideos > 0 ? (performanceDistribution.high / totalVideos) * 100 : 0} 
                className="h-2 sm:h-3" 
              />
            </div>
            
            {/* Medium Performance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium">Medium Performance (40-79)</span>
                <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200 text-xs">
                  {performanceDistribution.medium} videos
                </Badge>
              </div>
              <Progress 
                value={totalVideos > 0 ? (performanceDistribution.medium / totalVideos) * 100 : 0} 
                className="h-2 sm:h-3" 
              />
            </div>
            
            {/* Low Performance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium">Low Performance (0-39)</span>
                <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200 text-xs">
                  {performanceDistribution.low} videos
                </Badge>
              </div>
              <Progress 
                value={totalVideos > 0 ? (performanceDistribution.low / totalVideos) * 100 : 0} 
                className="h-2 sm:h-3" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Overview */}
      <Card className="hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <div className="p-1.5 sm:p-2 bg-brand-10 rounded-full crypto-glow">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 crypto-profit" />
            </div>
            Engagement Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-3 sm:space-y-4">
            {/* High Engagement */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium">High Engagement (10%+)</span>
                <Badge variant="outline" className="crypto-profit bg-profit/10 border-profit/20 text-xs">
                  {performanceDistribution.highEngagement} videos
                </Badge>
              </div>
              <Progress 
                value={totalVideos > 0 ? (performanceDistribution.highEngagement / totalVideos) * 100 : 0} 
                className="h-2 sm:h-3" 
              />
            </div>
            
            {/* Medium Engagement */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium">Medium Engagement (2-9%)</span>
                <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200 text-xs">
                  {performanceDistribution.mediumEngagement} videos
                </Badge>
              </div>
              <Progress 
                value={totalVideos > 0 ? (performanceDistribution.mediumEngagement / totalVideos) * 100 : 0} 
                className="h-2 sm:h-3" 
              />
            </div>
            
            {/* Low Engagement */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium">Low Engagement (0-1%)</span>
                <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200 text-xs">
                  {performanceDistribution.lowEngagement} videos
                </Badge>
              </div>
              <Progress 
                value={totalVideos > 0 ? (performanceDistribution.lowEngagement / totalVideos) * 100 : 0} 
                className="h-2 sm:h-3" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
