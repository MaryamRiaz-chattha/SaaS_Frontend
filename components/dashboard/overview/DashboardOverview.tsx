
"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/auth"
import { useDashboardOverview } from "@/hooks/dashboard/overview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MonthlyAnalyticsChart,
  PerformanceMetricsChart,
  ContentDistributionChart,
  TopVideosChart,
  GrowthInsightsChart,
  TopVideoCard
} from "./charts"

export default function DashboardOverview() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const { overviewData, isLoading: dataLoading, error, refetch } = useDashboardOverview()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }
    
    if (!authLoading && isAuthenticated) {
      setIsLoading(false)
    }
  }, [isAuthenticated, authLoading, router])

  const handleRefresh = useCallback(async () => {
    if (refetch) {
      await refetch()
    }
  }, [refetch])

  if (isLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!overviewData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
          <p className="text-muted-foreground">Unable to load dashboard data</p>
        </div>
      </div>
    )
  }

  const mp = overviewData.monetization_progress
  const cd = overviewData.content_distributions

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6 max-w-full overflow-hidden dashboard-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold truncate">Dashboard Overview</h1>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          Refresh
        </button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-base truncate">Total Videos</CardTitle>
            <CardDescription className="text-xs">All uploaded videos</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-3xl font-bold">{overviewData.total_videos}</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-base truncate">Total Views</CardTitle>
            <CardDescription className="text-xs">Channel lifetime views</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-3xl font-bold">{overviewData.total_views}</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-base truncate">Subscribers</CardTitle>
            <CardDescription className="text-xs">Current subscribers</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-3xl font-bold">{overviewData.subscriber_count}</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-base truncate">Engagement Rate</CardTitle>
            <CardDescription className="text-xs">Overall engagement</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-3xl font-bold">{overviewData.engagement_rate?.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="space-y-4 sm:space-y-6">
        {/* Monthly Analytics Chart */}
        {overviewData.monthly_analytics && (
          <MonthlyAnalyticsChart monthlyData={overviewData.monthly_analytics.monthly_data} />
        )}

        {/* Performance Metrics and Content Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {overviewData.performance_metrics && (
            <PerformanceMetricsChart performanceMetrics={overviewData.performance_metrics} />
          )}
          {overviewData.content_distributions && (
            <ContentDistributionChart contentDistributions={overviewData.content_distributions} />
          )}
        </div>

        {/* Top Videos and Growth Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Top Video by Views */}
          {overviewData.top_performance_content && (
            <TopVideoCard 
              video={overviewData.top_performance_content.top_video_by_views} 
              type="views" 
            />
          )}
          
          {/* Top Video by Likes */}
          {overviewData.top_performance_content && (
            <TopVideoCard 
              video={overviewData.top_performance_content.top_video_by_likes} 
              type="likes" 
            />
          )}
        </div>

        {/* Growth Insights Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
          {overviewData.growth_insights && (
            <GrowthInsightsChart growthInsights={overviewData.growth_insights} />
          )}
        </div>
      </div>

      {/* Monetization Progress */}
      {mp && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-base sm:text-lg truncate">Monetization Progress</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Progress towards program requirements</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-3 sm:space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                <span className="truncate">Subscribers</span>
                <span className="text-xs sm:text-sm">{mp.subscriber_progress_percentage.toFixed(1)}% of {mp.requirements.subscriber_requirement}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                <div className="bg-primary h-2 sm:h-2.5 rounded-full" style={{ width: `${Math.min(mp.subscriber_progress_percentage, 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                <span className="truncate">Watch time</span>
                <span className="text-xs sm:text-sm">{mp.watch_time_progress_percentage.toFixed(1)}% of {mp.requirements.watch_time_requirement} hrs</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                <div className="bg-primary h-2 sm:h-2.5 rounded-full" style={{ width: `${Math.min(mp.watch_time_progress_percentage, 100)}%` }} />
              </div>
            </div>

            <div className="text-xs sm:text-sm">Eligible: {mp.monetization_eligible ? "Yes" : "No"} • Watch time: {mp.watch_time_hours.toFixed(2)} hrs</div>
          </CardContent>
        </Card>
      )}

      {/* Content Distributions */}
      {cd && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-base truncate">View Distribution</CardTitle>
              <CardDescription className="text-xs">Recent viewing activity</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-sm sm:text-xl">Total views: <span className="font-semibold">{cd.view_distribution.total_views}</span></div>
              <div className="text-xs sm:text-sm text-muted-foreground">Avg/day: {cd.view_distribution.avg_views_per_day}</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-base truncate">Duration Distribution</CardTitle>
              <CardDescription className="text-xs">Watch time summary</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-sm sm:text-xl">Avg duration: <span className="font-semibold">{cd.duration_distribution.avg_duration_seconds}s</span></div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total watch time: {cd.duration_distribution.total_watch_time_minutes} min</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}