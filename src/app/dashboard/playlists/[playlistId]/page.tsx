"use client"

import { useParams } from "next/navigation"
import usePlaylistAnalytics from "@/lib/hooks/dashboard/playlists/usePlaylistAnalytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, MessageCircle, ThumbsUp, Calendar, Clock, ExternalLink, Search, Filter, SortAsc, SortDesc, Video } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import RefreshButton from "@/components/ui/refresh-button"
import usePlaylistVideos from "@/lib/hooks/dashboard/playlists/usePlaylistVideos"
import { mapApiErrorToMessage } from "@/lib/utils"

// Helper functions
const formatDuration = (duration: string) => {
  if (!duration || duration === "PT0S") return "0:00"
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return duration
  
  const hours = parseInt(match[1] || "0")
  const minutes = parseInt(match[2] || "0")
  const seconds = parseInt(match[3] || "0")
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getPerformanceColor = (score: number) => {
  if (score >= 100) return "crypto-profit"
  if (score >= 50) return "crypto-text-secondary"
  if (score >= 20) return "text-orange-600"
  return "text-red-600"
}

const getEngagementColor = (rate: number) => {
  if (rate >= 5) return "crypto-profit"
  if (rate >= 2) return "crypto-text-secondary"
  if (rate >= 1) return "text-orange-600"
  return "text-red-600"
}

const getHealthColor = (level?: string) => {
  if (!level) return "text-gray-600 bg-gray-100"
  switch (level.toLowerCase()) {
    case "excellent": return "crypto-profit bg-profit/10"
    case "good": return "text-blue-600 bg-blue-100"
    case "average": return "crypto-text-secondary bg-brand-10"
    case "poor": return "text-red-600 bg-red-100"
    default: return "text-gray-600 bg-gray-100"
  }
}

export default function PlaylistVideosPage() {
  const params = useParams()
  const playlistId = params.playlistId as string
  
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("performance_score")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterBy, setFilterBy] = useState("all")
  const [showAll, setShowAll] = useState(false)

  const handleRefresh = async () => {
    await Promise.all([refetchAnalytics(), refetchVideos()])
  }

  const { playlistData, isLoading, error, refetch: refetchAnalytics } = usePlaylistAnalytics(playlistId)
  const { playlistData: playlistVideos, isLoading: isVideosLoading, error: videosError, refetch: refetchVideos } = usePlaylistVideos(playlistId)

  // Create video list from top performing videos (always run this hook)
  const videos = useMemo(() => {
    const analytics = playlistData?.data?.analytics
    if (!analytics?.top_performing_videos) return [];

    return [
      analytics.top_performing_videos.top_by_views,
      analytics.top_performing_videos.top_by_engagement,
      analytics.top_performing_videos.top_by_performance_score
    ].filter((video, index, self) =>
      index === self.findIndex(v => v.video_id === video.video_id)
    );
  }, [playlistData?.data?.analytics?.top_performing_videos]);

  // Filter and sort videos (always run this hook)
  const filteredAndSortedVideos = useMemo(() => {
    let filtered = videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesFilter = true
      if (filterBy === "published") {
        matchesFilter = video.days_since_published <= 7
      } else if (filterBy === "performing") {
        matchesFilter = video.performance_score >= 50
      } else if (filterBy === "engagement") {
        matchesFilter = video.engagement_rate >= 2
      }
      
      return matchesSearch && matchesFilter
    })

    // Sort videos
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case "views":
          aValue = a.views
          bValue = b.views
          break
        case "likes":
          aValue = a.likes
          bValue = b.likes
          break
        case "performance_score":
          aValue = a.performance_score
          bValue = b.performance_score
          break
        case "engagement":
          aValue = a.engagement_rate
          bValue = b.engagement_rate
          break
        case "published":
          aValue = new Date(a.published_at)
          bValue = new Date(b.published_at)
          break
        default:
          aValue = a.performance_score
          bValue = b.performance_score
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [videos, searchTerm, sortBy, sortOrder, filterBy])

  // Early returns after all hooks are called
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-600">Error Loading Playlist</h2>
          <p className="text-muted-foreground mb-4">{mapApiErrorToMessage(error)}</p>
          <Button asChild>
            <Link href="/dashboard/playlists">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Playlists
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!playlistData || !playlistData.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Playlist Not Found</h2>
          <p className="text-muted-foreground mb-4">The playlist you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/dashboard/playlists">Back to Playlists</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { data } = playlistData;
  const analytics = data.analytics

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/playlists">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Playlists
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Playlist Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive analytics and insights</p>
          </div>
        </div>
        <div className="flex justify-end">
          <RefreshButton 
            onRefresh={handleRefresh}
            variant="outline"
            size="sm"
          />
        </div>
      </div>
      {/* Playlist Overview */}
      <Card className="border-2 border-primary/20 crypto-card">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div>
              <h2 className="text-xl font-bold crypto-profit mb-4">Playlist Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-white">
                      <Eye className="w-4 h-4 text-white" />
                      Total Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{analytics.total_views.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-white">
                      <ThumbsUp className="w-4 h-4 text-white" />
                      Total Likes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{analytics.total_likes.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-white">
                      <MessageCircle className="w-4 h-4 text-white" />
                      Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{analytics.total_comments.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-white">
                      <Video className="w-4 h-4 text-white" />
                      Videos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{analytics.total_videos}</div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-white">
                      <Clock className="w-4 h-4 text-white" />
                      Watch time (hrs)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{analytics.total_watch_time_hours.toFixed(2)}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Health and Growth Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Playlist Health */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">Playlist Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">Health Score</span>
                      <span className="text-2xl font-bold text-white">{analytics.playlist_health.health_score}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">Health Level</span>
                      <Badge className={getHealthColor(analytics.playlist_health.health_level)}>
                        {analytics.playlist_health.health_level}
                      </Badge>
                    </div>
                    <div className="text-xs text-white/80">
                      <div className="font-medium mb-1 text-white">Health Factors:</div>
                      {analytics.playlist_health.health_factors.map((factor: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-white rounded-full mt-2"></div>
                          <span className="text-white/90">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Growth Metrics */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white">Growth Trend</span>
                      <Badge variant={analytics.growth_metrics.growth_trend === "increasing" ? "default" : "secondary"}>
                        {analytics.growth_metrics.growth_trend}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Views Growth</span>
                      <span className={analytics.growth_metrics.avg_views_growth >= 0 ? "text-white" : "text-white"}>
                        {analytics.growth_metrics.avg_views_growth.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Engagement Growth</span>
                      <span className={analytics.growth_metrics.avg_engagement_growth >= 0 ? "text-white" : "text-white"}>
                        {analytics.growth_metrics.avg_engagement_growth.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Consistency Score</span>
                      <span className="text-white">{analytics.growth_metrics.consistency_score.toFixed(1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search top performing videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Videos</SelectItem>
                  <SelectItem value="published">Recently Published</SelectItem>
                  <SelectItem value="performing">High Performing</SelectItem>
                  <SelectItem value="engagement">High Engagement</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance_score">Performance</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="likes">Likes</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="published">Published Date</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Videos Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4">Top Performing Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedVideos.map((video) => (
            <Card key={video.video_id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={video.thumbnail_url || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                    {formatDuration(video.duration)}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button size="sm" asChild variant="secondary" className="bg-black/80 hover:bg-black/60">
                      <Link href={video.youtube_url} target="_blank">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">{video.title}</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium">{video.views.toLocaleString()}</div>
                      <div className="text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{video.likes}</div>
                      <div className="text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{video.comments}</div>
                      <div className="text-muted-foreground">Comments</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{formatDate(video.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPerformanceColor(video.performance_score)}`}
                      >
                        {video.performance_score.toFixed(1)}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getEngagementColor(video.engagement_rate)}`}
                      >
                        {video.engagement_rate.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1 crypto-button-primary">
                      <Link href={`/dashboard/videos/${video.video_id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={video.youtube_url || '#'} target="_blank" rel="noreferrer">Watch</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom: Show All Videos Button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Hide all videos" : "Show all videos"}
        </Button>
      </div>

      {/* All Videos Grid (toggle) */}
      {showAll && (
        <Card className="mt-4">
          <CardContent className="p-4">
            {isVideosLoading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">Loading playlist videos...</div>
            ) : videosError ? (
            <div className="flex items-center justify-center py-10 text-red-600">{mapApiErrorToMessage(videosError)}</div>
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
                          {formatDuration(v.duration)}
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <h4 className="font-semibold text-sm line-clamp-2">{v.title}</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium">{v.view_count.toLocaleString()}</div>
                            <div className="text-muted-foreground">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{v.like_count}</div>
                            <div className="text-muted-foreground">Likes</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{v.comment_count}</div>
                            <div className="text-muted-foreground">Comments</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1 crypto-button-primary">
                            <Link href={`/dashboard/videos/${v.video_id}`}>View Details</Link>
                          </Button>
                          <Button asChild size="sm" variant="outline">
                            <a href={v.youtube_url || v.url || '#'} target="_blank" rel="noreferrer">Watch</a>
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
      )}

      {/* No Results */}
      {filteredAndSortedVideos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">No videos found</p>
              <p className="text-sm">Try adjusting your search terms or filters</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredAndSortedVideos.length} top performing videos
      </div>
    </div>
  )
}
