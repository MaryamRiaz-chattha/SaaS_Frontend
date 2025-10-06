export interface MonthlyAnalyticsData {
  month: string
  views: number
  subscribers: number
}

export interface TopVideoData {
  title: string
  views: number
  engagement: number
}

export interface ContentCategoryData {
  name: string
  value: number
  color: string
}

export interface GrowthTrendData {
  month: string
  totalViews: number
  subscribers: number
  engagement: number
}

export interface WeeklyChartData {
  week: string
  views: number
  engagement: number
}

export interface PerformanceData {
  category: string
  count: number
}

export interface DashboardStats {
  totalVideos: number
  totalComments: number
  totalSubscribers: number
  totalViews: number
  videosChange: string
  commentsChange: string
  subscribersChange: string
  viewsChange: string
}

export interface ChannelInsights {
  avgViewsPerVideo: number
  engagementRate: number
  uploadFrequency: number
  totalWatchTime: number
}

export interface ContentBreakdown {
  shorts: number
  tutorials: number
  lectures: number
  other: number
}

export interface GrowthMetrics {
  subscriberGrowth: number
  viewGrowth: number
  channelAge: number
  healthScore: number
}
