import { useState, useMemo, useCallback } from "react"
import useVideos from "@/hooks/dashboard/videos/useVideos"
import VideosHeader from "./sections/VideosHeader"
import StatsOverview from "./sections/StatsOverview"
import PerformanceOverview from "./sections/PerformanceOverview"
import VideoFilters from "./sections/VideoFilters"
import VideosList from "./components/VideosList"
import EmptyState from "./components/EmptyState"

export default function YouTubeVideos() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("published_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const {
    videos: allVideos,
    videoStats,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMoreVideos,
    refetch
  } = useVideos()

  const handleRefresh = useCallback(async () => {
    if (refetch) {
      await refetch()
    }
  }, [refetch])

  // Filter and sort videos based on current filters
  const videos = useMemo(() => {
    let filteredVideos = [...allVideos]

    // Apply search filter
    if (searchQuery.trim()) {
      filteredVideos = filteredVideos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filteredVideos = filteredVideos.filter(video => video.privacy_status === selectedStatus)
    }

    // Apply sorting
    filteredVideos.sort((a, b) => {
      let valueA: any, valueB: any

      switch (sortBy) {
        case "published_at":
          valueA = new Date(a.published_at).getTime()
          valueB = new Date(b.published_at).getTime()
          break
        case "view_count":
          valueA = a.view_count
          valueB = b.view_count
          break
        case "like_count":
          valueA = a.like_count
          valueB = b.like_count
          break
        case "engagement_rate":
          valueA = a.engagement_rate
          valueB = b.engagement_rate
          break
        case "performance_score":
          valueA = a.performance_score
          valueB = b.performance_score
          break
        default:
          valueA = a.title.toLowerCase()
          valueB = b.title.toLowerCase()
      }

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    return filteredVideos
  }, [allVideos, searchQuery, selectedStatus, sortBy, sortOrder])

  // Calculate performance distribution
  const performanceDistribution = useMemo(() => {
    if (allVideos.length === 0) {
      return {
        high: 0,
        medium: 0,
        low: 0,
        highEngagement: 0,
        mediumEngagement: 0,
        lowEngagement: 0
      }
    }

    const high = allVideos.filter(video => video.performance_score >= 80).length
    const medium = allVideos.filter(video => video.performance_score >= 40 && video.performance_score < 80).length
    const low = allVideos.filter(video => video.performance_score < 40).length

    const highEngagement = allVideos.filter(video => video.engagement_rate >= 10).length
    const mediumEngagement = allVideos.filter(video => video.engagement_rate >= 2 && video.engagement_rate < 10).length
    const lowEngagement = allVideos.filter(video => video.engagement_rate < 2).length

    return {
      high,
      medium,
      low,
      highEngagement,
      mediumEngagement,
      lowEngagement
    }
  }, [allVideos])

  const stats = {
    totalVideos: videoStats.totalVideos,
    totalViews: videoStats.totalViews,
    totalLikes: videoStats.totalLikes,
    totalComments: videoStats.totalComments,
    avgEngagement: videoStats.avgEngagement,
    avgPerformance: videoStats.avgPerformanceScore
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedStatus("all")
    setSortBy("published_at")
    setSortOrder("desc")
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center text-red-500 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Error loading videos</h3>
          <p className="text-sm">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Header Section */}
      <VideosHeader onRefresh={handleRefresh} />
      
      {/* Stats and Performance Overview */}
      <div className="space-y-6 sm:space-y-8">
        <StatsOverview stats={stats} isLoading={isLoading} />
        <PerformanceOverview 
          performanceDistribution={performanceDistribution} 
          isLoading={isLoading} 
        />
      </div>
      
      {/* Video Filters */}
      <VideoFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalVideos={videos.length}
      />
      
      {/* Videos Content */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            selectedStatus={selectedStatus}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <VideosList 
            videos={videos} 
            viewMode={viewMode} 
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMoreVideos}
          />
        )}
      </div>
    </div>
  )
}
