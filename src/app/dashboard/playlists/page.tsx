"use client"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { List, RefreshCw, Eye, ThumbsUp, MessageCircle, Video, Clock, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import usePlaylistAnalytics from "@/lib/hooks/dashboard/playlists/usePlaylistAnalytics"
import usePlaylistVideos from "@/lib/hooks/dashboard/playlists/usePlaylistVideos"
import RefreshButton from "@/components/ui/refresh-button"
import Link from "next/link"
  
// ===== Helpers =====
const brand = {
  primary: "#FD1D1D",
  primaryDark: "#FF6B35",
  grid: "#374151",
  axis: "#9CA3AF",
}

const asNumber = (v: any, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const healthColor = (level?: string) => {
  switch ((level || "").toLowerCase()) {
    case "excellent":
      return "crypto-profit"
    case "good":
      return "text-blue-600"
    case "fair":
      return "crypto-text-secondary"
    case "poor":
      return "text-red-600"
    default:
      return "text-muted-foreground"
  }
}

const healthBadge = (level?: string) => {
  switch ((level || "").toLowerCase()) {
    case "excellent":
      return "bg-profit/10 text-profit"
    case "good":
      return "bg-blue-100 text-blue-800"
    case "fair":
      return "bg-brand-10 crypto-text-primary"
    case "poor":
      return "bg-red-100 text-red-800"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

const growthIcon = (trend?: string) => {
  switch ((trend || "").toLowerCase()) {
    case "growing":
    case "increasing":
      return <TrendingUp className="w-4 h-4 crypto-profit" />
    case "decreasing":
      return <TrendingDown className="w-4 h-4 text-red-600" />
    default:
      return <BarChart3 className="w-4 h-4 text-blue-600" />
  }
}

export default function PlaylistsPage() {
  const searchParams = useSearchParams()
  const playlistId = searchParams.get('id')
  
  if (!playlistId) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center space-y-6">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <List className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">YouTube Playlists</h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Select a playlist from the sidebar dropdown to view its data and analytics.
          </p>
        </div>
      </div>
    )
  }

  return <PlaylistData playlistId={playlistId} />
}

function PlaylistData({ playlistId }: { playlistId: string }) {
  const { playlistData, isLoading, error, refetch } = usePlaylistAnalytics(playlistId)
  const { 
    playlistData: playlistVideos, 
    isLoading: isVideosLoading, 
    error: videosError 
  } = usePlaylistVideos(playlistId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !playlistData?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Failed to load playlist</h2>
        <p className="text-muted-foreground mb-4">{error || 'No playlist data available'}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  const playlist = playlistData.data.analytics
  const playlistName = (playlistData.data as any).playlist_name || (playlistData.data as any)?.playlist_info?.title || "Playlist"
  const playlistIdForLink = (playlistData.data as any).playlist_id || (playlistData.data as any)?.playlist_info?.playlist_id || playlistId

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{playlistName}</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Playlist Analytics and Performance Overview
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button asChild size="sm">
            <Link href={`/dashboard/playlists/${playlistIdForLink}?view=all`}>
              View all videos
            </Link>
          </Button>
          <RefreshButton 
            onRefresh={refetch}
            variant="outline"
            size="sm"
          />
        </div>
      </div>

      {/* Main Info (use dashboard key stats style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-base truncate text-white">Total Views</CardTitle>
            <CardDescription className="text-xs text-white/80">Playlist lifetime views</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-3xl font-bold text-white">{asNumber(playlist.total_views).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-base truncate text-white">Total Likes</CardTitle>
            <CardDescription className="text-xs text-white/80">All likes on videos</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-3xl font-bold text-white">{asNumber(playlist.total_likes).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-base truncate text-white">Comments</CardTitle>
            <CardDescription className="text-xs text-white/80">Total comments</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-3xl font-bold text-white">{asNumber(playlist.total_comments).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-base truncate text-white">Total Videos</CardTitle>
            <CardDescription className="text-xs text-white/80">Videos in playlist</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-3xl font-bold text-white">{asNumber(playlist.total_videos)}</div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Card>
                <CardContent className="p-3 lg:p-4">
                  <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 lg:h-4 lg:w-4 bg-white rounded-sm" />
                    <div className="text-xs lg:text-sm text-white/80">Health Score</div>
                  </div>
            <div className={`text-lg lg:text-2xl font-bold text-white`}>
              {asNumber(playlist.playlist_health?.health_score)}
                  </div>
                  <div className="text-xs text-white/80 mt-1">
              {playlist.playlist_health?.health_level || "—"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 lg:p-4">
                  <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 lg:h-4 lg:w-4 bg-white rounded-sm" />
                    <div className="text-xs lg:text-sm text-white/80">Performance</div>
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-white">
              {asNumber(playlist.performance_score).toLocaleString()}
                  </div>
                  <div className="text-xs text-white/80 mt-1">Overall Score</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 lg:p-4">
                  <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 lg:h-4 lg:w-4 bg-white rounded-sm" />
                    <div className="text-xs lg:text-sm text-white/80">Avg Duration</div>
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-white">
              {asNumber(playlist.avg_duration_minutes).toFixed(2)}
                  </div>
                  <div className="text-xs text-white/80 mt-1">minutes per video</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 lg:p-4">
                  <div className="flex items-center gap-2 mb-2">
              {growthIcon(playlist.growth_metrics?.growth_trend)}
                    <div className="text-xs lg:text-sm text-white/80">Consistency</div>
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-white">
              {asNumber(playlist.growth_metrics?.consistency_score).toFixed(1)}%
                  </div>
                  <div className="text-xs text-white/80 mt-1 truncate">
              Growth: {playlist.growth_metrics?.growth_trend || "—"}
                  </div>
                </CardContent>
              </Card>
            </div>

      {/* Top Performing Videos */}
      {playlist.top_performing_videos && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base lg:text-lg">Top Performing Videos</CardTitle>
                  <CardDescription className="text-sm">Best by views & engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playlist.top_performing_videos.top_by_views && (
                      <TopVideoCard
                        label="Top by Views"
                  data={playlist.top_performing_videos.top_by_views}
                      />
                    )}
              {playlist.top_performing_videos.top_by_engagement && (
                      <TopVideoCard
                        label="Top by Engagement"
                  data={playlist.top_performing_videos.top_by_engagement}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
      
      {/* Playlist Videos */}
      <Card className="mt-4">
        <CardContent className="p-4">
          {isVideosLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">Loading playlist videos...</div>
          ) : videosError ? (
            <div className="flex items-center justify-center py-10 text-red-600">{videosError}</div>
          ) : !playlistVideos?.data?.length ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">No videos found in this playlist.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlistVideos.data.map((v) => (
                <Card key={v.video_id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img src={v.thumbnail_url || "/placeholder.svg"} alt={v.title} className="w-full h-44 object-cover" />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                        {(function formatDur(d: string){
                          if (!d || d === "PT0S") return "0:00"
                          const m = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
                          if (!m) return d
                          const h = parseInt(m[1] || "0")
                          const mi = parseInt(m[2] || "0")
                          const s = parseInt(m[3] || "0")
                          return h > 0 ? `${h}:${mi.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}` : `${mi}:${s.toString().padStart(2,"0")}`
                        })(v.duration)}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="font-semibold text-sm line-clamp-2">{v.title}</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-white">{v.view_count.toLocaleString()}</div>
                          <div className="text-white">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-white">{v.like_count}</div>
                          <div className="text-white">Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-white">{v.comment_count}</div>
                          <div className="text-white">Comments</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild size="sm" className="flex-1 crypto-button-primary">
                          <Link href={`/dashboard/videos/${v.video_id}`}>View Details</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <a href={(v as any).youtube_video_url || (v as any).youtube_url || (v as any).url || '#'} target="_blank" rel="noreferrer">Watch</a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}

function TopVideoCard({ label, data }: { label: string; data: any }) {
  return (
    <div className="p-3 sm:p-4 border rounded-lg">
      <div className="text-xs mb-2 text-muted-foreground">{label}</div>
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <img
          src={data.thumbnail_url}
          alt={data.title}
          className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm line-clamp-2 mb-2">{data.title}</h4>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div>
              <div className="font-medium">{asNumber(data.views).toLocaleString()}</div>
              <div>Views</div>
            </div>
            <div>
              <div className="font-medium">{asNumber(data.likes).toLocaleString()}</div>
              <div>Likes</div>
            </div>
            <div>
              <div className="font-medium">{asNumber(data.engagement_rate).toFixed(2)}%</div>
              <div>Engagement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}