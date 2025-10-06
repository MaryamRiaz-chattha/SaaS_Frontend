export interface DashboardVideosResponse {
  success: boolean;
  message: string;
  data: Video[];
  count: number;
}

export interface Video {
  video_id: string;
  title: string;
  description: string;
  published_at: string;
  thumbnail_url: string;
  channel_title: string;
  tags: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  duration: string;
  duration_seconds: number;
  privacy_status: string;
  analytics: VideoAnalytics;
  engagement_rate: number;
  performance_score: number;
  days_since_published: number;
}

export interface VideoAnalytics {
  view_count: number;
  like_count: number;
  comment_count: number;
  duration: string;
  duration_seconds: number;
  privacy_status: string;
  published_at: string;
  title: string;
  description: string;
  tags: string[];
  category_id: string;
  default_language?: string;
  default_audio_language?: string;
}

export interface VideoStats {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgEngagement: number;
  avgPerformanceScore: number;
}

export interface SingleVideoResponse {
  success: boolean;
  message: string;
  data: VideoDetails;
}

export interface VideoDetails {
  video_id: string;
  title: string;
  description: string;
  published_at: string;
  youtube_url: string;
  thumbnail_url: string;
  privacy_status: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  duration: string;
  duration_seconds: number;
  duration_minutes: number;
  engagement_rate: number;
  performance_score: number;
  days_since_published: number;
  likes_per_view_percentage: number;
  comments_per_view_percentage: number;
  views_per_day: number;
  watch_time_hours: number;
  performance_level: string;
  engagement_level: string;
  content_type: string;
  content_category: string;
  growth_potential: string;
  tags: string[];
  category_id: string;
  default_language: string;
  default_audio_language: string;
  analytics_summary: AnalyticsSummary;
  recommendations: string[];
}

export interface AnalyticsSummary {
  total_engagement: number;
  engagement_breakdown: {
    likes_percentage: number;
    comments_percentage: number;
  };
  performance_indicators: {
    is_high_performing: boolean;
    is_viral_potential: boolean;
    is_high_engagement: boolean;
  };
}
