export interface VideoData {
  video_id: string
  title: string
  description: string
  thumbnail_url: string
  published_at: string
  channel_title: string
  tags: string[]
  view_count: number
  like_count: number
  comment_count: number
  duration: string
  duration_seconds: number
  privacy_status: string
  analytics: {
    view_count: number
    like_count: number
    comment_count: number
    duration: string
    duration_seconds: number
    privacy_status: string
    published_at: string
    title: string
    description: string
    tags: string[]
    category_id: string
    default_language: string | null
    default_audio_language: string | null
  }
  engagement_rate: number
  performance_score: number
  days_since_published: number
}

export interface VideoStats {
  totalVideos: number
  totalViews: number
  totalLikes: number
  totalComments: number
  avgPerformance: number
  avgEngagement: number
}

export interface VideoFilters {
  searchQuery: string
  statusFilter: string
  sortBy: string
  viewMode: "grid" | "list"
}

export interface PerformanceDistribution {
  high: number // 80+
  medium: number // 40-79
  low: number // 0-39
  highEngagement: number // 10%+
  mediumEngagement: number // 2-9%
  lowEngagement: number // 0-1%
}
