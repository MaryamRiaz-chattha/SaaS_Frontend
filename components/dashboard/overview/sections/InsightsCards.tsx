import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChannelInsights, ContentBreakdown, GrowthMetrics } from "@/types/dashboard/overview"

interface InsightsCardsProps {
  channelInsights: ChannelInsights
  contentBreakdown: ContentBreakdown
  growthMetrics: GrowthMetrics
}

export default function InsightsCards({ channelInsights, contentBreakdown, growthMetrics }: InsightsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg">Channel Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Avg Views/Video</span>
            <span className="font-medium text-sm sm:text-base">{channelInsights.avgViewsPerVideo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Engagement Rate</span>
            <span className="font-medium text-sm sm:text-base">{channelInsights.engagementRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Upload Frequency</span>
            <span className="font-medium text-sm sm:text-base">{channelInsights.uploadFrequency}/month</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Total Watch Time</span>
            <span className="font-medium text-sm sm:text-base">{channelInsights.totalWatchTime} hours</span>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg">Content Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Shorts</span>
            <span className="font-medium text-sm sm:text-base">{contentBreakdown.shorts} videos</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Tutorials</span>
            <span className="font-medium text-sm sm:text-base">{contentBreakdown.tutorials} videos</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Lectures</span>
            <span className="font-medium text-sm sm:text-base">{contentBreakdown.lectures} videos</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Other</span>
            <span className="font-medium text-sm sm:text-base">{contentBreakdown.other} videos</span>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full md:col-span-2 xl:col-span-1">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg">Growth Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Subscriber Growth</span>
            <span className="font-medium crypto-profit text-sm sm:text-base">+{growthMetrics.subscriberGrowth}/month</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">View Growth</span>
            <span className="font-medium crypto-profit text-sm sm:text-base">+{growthMetrics.viewGrowth}/month</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Channel Age</span>
            <span className="font-medium text-sm sm:text-base">{growthMetrics.channelAge} months</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Health Score</span>
            <span className="font-medium text-sm sm:text-base">{growthMetrics.healthScore}/100</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
