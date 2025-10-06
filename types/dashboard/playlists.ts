export interface PlaylistsResponse {
  success: boolean;
  message: string;
  data: Playlist[];
  count: number;
}

export interface Playlist {
  playlist_id: string;
  title: string;
  description: string;
  published_at: string;
  thumbnail_url: string;
  channel_title: string;
  channel_id: string;
  privacy_status: string;
  video_count: number;
  tags: string[];
  default_language: string;
  localized: PlaylistLocalized;
  analytics: PlaylistAnalytics;
}

export interface PlaylistLocalized {
  title: string;
  description: string;
}

export interface PlaylistAnalytics {
  playlist_id: string;
  total_videos: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_duration: number;
  total_watch_time_hours: number;
  avg_views_per_video: number;
  avg_likes_per_video: number;
  avg_comments_per_video: number;
  avg_duration_per_video: number;
  avg_duration_minutes: number;
  overall_engagement_rate: number;
  performance_score: number;
  top_performing_videos: TopPerformingVideos;
  growth_metrics: GrowthMetrics;
  playlist_health: PlaylistHealth;
}

export interface PlaylistStats {
  totalPlaylists: number;
  totalVideos: number;
  totalViews: number;
  totalWatchTime: string;
  avgEngagement: number;
}

// Updated types to match the backend comprehensive playlist analytics response
export interface ComprehensivePlaylistResponse {
  success: boolean;
  message: string;
  data: ComprehensivePlaylistData;
}

export interface ComprehensivePlaylistData {
  playlist_info: PlaylistInfo;
  analytics: ComprehensiveAnalytics;
}

export interface PlaylistInfo {
  playlist_id: string;
  title: string;
  description: string;
  published_at: string;
  thumbnail_url: string;
  channel_title: string;
  channel_id: string;
  privacy_status: string;
  video_count: number;
  tags: string[];
  default_language: string;
  localized: {
    title: string;
    description: string;
  };
}

export interface ComprehensiveAnalytics {
  playlist_id: string;
  total_videos: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_duration: number;
  total_watch_time_hours: number;
  avg_views_per_video: number;
  avg_likes_per_video: number;
  avg_comments_per_video: number;
  avg_duration_per_video: number;
  avg_duration_minutes: number;
  overall_engagement_rate: number;
  performance_score: number;
  top_performing_videos: TopPerformingVideos;
  growth_metrics: GrowthMetrics;
  playlist_health: PlaylistHealth;
  content_analysis?: any;
  performance_insights?: any;
  audience_insights?: any;
  seo_metrics?: any;
  technical_analytics?: any;
  predictive_insights?: any;
  monetization_metrics?: any;
}

export interface TopPerformingVideos {
  top_by_views: ComprehensiveVideo;
  top_by_engagement: ComprehensiveVideo;
  top_by_performance_score: ComprehensiveVideo;
}

export interface ComprehensiveVideo {
  video_id: string;
  title: string;
  published_at: string;
  thumbnail_url: string;
  duration: string;
  duration_seconds: number;
  duration_minutes: number;
  views: number;
  likes: number;
  comments: number;
  engagement_rate: number;
  performance_score: number;
  days_since_published: number;
  privacy_status: string;
  tags: string[];
  category_id: string;
  youtube_url: string;
}

export interface GrowthMetrics {
  growth_trend: string;
  avg_views_growth: number;
  avg_engagement_growth: number;
  consistency_score: number;
}

export interface PlaylistHealth {
  health_score: number;
  health_level: string;
  health_factors: string[];
}
