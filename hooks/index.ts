// Root hooks index file - Re-export all organized hooks

// Auth hooks
export { default as useAuth } from './auth/useAuth'

// Dashboard hooks
export { default as useDashboardVideos } from './dashboard/videos/useVideos'
export { default as useVideo } from './dashboard/videos/useVideo'
export { default as usePlaylists } from './dashboard/playlists/usePlaylists'
export { default as usePlaylistAnalytics } from './dashboard/playlists/usePlaylistAnalytics'
export { useChannelPlaylists } from './dashboard/playlists/useChannelPlaylists'

// YouTube API hooks
export { default as useYouTubeCredentials } from './youtube/useYouTubeCredentials'
export { default as useCreateYouTubeCredentials } from './youtube/useCreateYouTubeCredentials'
export { default as useYouTubeCredentialGuard } from './youtube/useYouTubeCredentialGuard'
export { default as useYouTubeUpload } from './youtube/useYouTubeUpload'

// AI/Gemini hooks
export { default as useGemini } from './ai/useGemini'

// Upload workflow hooks
export { useUploadPage } from './upload/useUploadPage'
export { useUploadHandlers } from './upload/useUploadHandlers'

// Common utility hooks
export { useToast } from './common/useToast'
export { useIsMobile } from './common/useIsMobile'
