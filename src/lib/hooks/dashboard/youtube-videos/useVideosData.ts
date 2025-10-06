import { useState, useEffect, useMemo } from "react"
import { VideoData, VideoStats, PerformanceDistribution } from "@/types/dashboard/youtube-videos"

interface UseVideosDataParams {
  searchQuery: string
  selectedStatus: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

export function useVideosData({
  searchQuery,
  selectedStatus,
  sortBy,
  sortOrder
}: UseVideosDataParams) {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data based on the original API response
  useEffect(() => {
    const mockVideos: VideoData[] = [
      {
        video_id: "G6IgUdYmE_U",
        title: "Part NO 20 | Level Your Python | Input Func, String , Indexing  #Python #Coding #Shorts #Programm...",
        description: "Level up your Python game with string stepping! Skip characters while slicing. Perfect for advanced string manipulation! Learn Python programming with practical examples! Perfect for beginners and intermediate developers. Subscribe for more coding tutorials and tips. #Python #Programming #Coding #Shorts #Tutorial #Developer #Tech",
        published_at: "2025-08-24T09:47:26Z",
        thumbnail_url: "https://i.ytimg.com/vi/G6IgUdYmE_U/mqdefault.jpg",
        channel_title: "Learn AI With Uzair",
        tags: [],
        view_count: 33,
        like_count: 1,
        comment_count: 0,
        duration: "PT1M52S",
        duration_seconds: 112,
        privacy_status: "public",
        analytics: {
          view_count: 33,
          like_count: 1,
          comment_count: 0,
          duration: "PT1M52S",
          duration_seconds: 112,
          privacy_status: "public",
          published_at: "2025-08-24T16:00:32Z",
          title: "Part NO 20 | Level Your Python | Input Func, String , Indexing  #Python #Coding #Shorts #Programm...",
          description: "Level up your Python game with string stepping! Skip characters while slicing. Perfect for advanced string manipulation! Learn Python programming with practical examples! Perfect for beginners and intermediate developers. Subscribe for more coding tutorials and tips. #Python #Programming #Coding #Shorts #Tutorial #Developer #Tech",
          tags: ["Coding", "Developer", "Programming", "Python", "Shorts", "Tutorial"],
          category_id: "27",
          default_language: null,
          default_audio_language: null
        },
        engagement_rate: 3.03,
        performance_score: 26.5,
        days_since_published: 1
      },
      {
        video_id: "I9Q0QVLkz-E",
        title: "LECTURE NO 20 | Nested For Loops | Parent Loop | Inner Loop |",
        description: "nested for loops python loops inner loop outer loop loop iteration programming tutorial code execution debugging loops python programming nested structures",
        published_at: "2025-08-24T09:45:29Z",
        thumbnail_url: "https://i.ytimg.com/vi/I9Q0QVLkz-E/mqdefault.jpg",
        channel_title: "Learn AI With Uzair",
        tags: [],
        view_count: 2,
        like_count: 0,
        comment_count: 0,
        duration: "PT9M7S",
        duration_seconds: 547,
        privacy_status: "public",
        analytics: {
          view_count: 2,
          like_count: 0,
          comment_count: 0,
          duration: "PT9M7S",
          duration_seconds: 547,
          privacy_status: "public",
          published_at: "2025-08-24T16:00:26Z",
          title: "LECTURE NO 20 | Nested For Loops | Parent Loop | Inner Loop |",
          description: "nested for loops python loops inner loop outer loop loop iteration programming tutorial code execution debugging loops python programming nested structures",
          tags: ["auto-generated", "transcript-based"],
          category_id: "22",
          default_language: null,
          default_audio_language: null
        },
        engagement_rate: 0,
        performance_score: 1,
        days_since_published: 1
      },
      {
        video_id: "-0Z_1OyJPJ8",
        title: "Part NO 19 | Python Step Explained! | Input Func, String , Indexing  #Python #Coding #Shorts #Pro...",
        description: "Python - Step Explained! Step into the world of coding with this beginner-friendly guide! #slicing #coding #python",
        published_at: "2025-08-22T18:34:47Z",
        thumbnail_url: "https://i.ytimg.com/vi/-0Z_1OyJPJ8/mqdefault.jpg",
        channel_title: "Learn AI With Uzair",
        tags: [],
        view_count: 101,
        like_count: 0,
        comment_count: 0,
        duration: "PT52S",
        duration_seconds: 52,
        privacy_status: "public",
        analytics: {
          view_count: 101,
          like_count: 0,
          comment_count: 0,
          duration: "PT52S",
          duration_seconds: 52,
          privacy_status: "public",
          published_at: "2025-08-22T18:35:26Z",
          title: "Part NO 19 | Python Step Explained! | Input Func, String , Indexing  #Python #Coding #Shorts #Pro...",
          description: "Python - Step Explained! Step into the world of coding with this beginner-friendly guide! #slicing #coding #python",
          tags: ["Coding", "Developer", "Programming", "Python", "Shorts", "Tutorial"],
          category_id: "27",
          default_language: "en",
          default_audio_language: "hi"
        },
        engagement_rate: 0,
        performance_score: 50.5,
        days_since_published: 3
      },
      {
        video_id: "3jZw2raVCoY",
        title: "LECTURE NO 19 | Enumerator Function | Enumerator Function Usage | Index Value | Character Value |",
        description: "Python enumerator function for loop index iterable string manipulation coding programming tutorial UZair index tracking",
        published_at: "2025-08-22T18:28:31Z",
        thumbnail_url: "https://i.ytimg.com/vi/3jZw2raVCoY/mqdefault.jpg",
        channel_title: "Learn AI With Uzair",
        tags: [],
        view_count: 2,
        like_count: 1,
        comment_count: 0,
        duration: "PT12M30S",
        duration_seconds: 750,
        privacy_status: "public",
        analytics: {
          view_count: 2,
          like_count: 1,
          comment_count: 0,
          duration: "PT12M30S",
          duration_seconds: 750,
          privacy_status: "public",
          published_at: "2025-08-22T18:34:38Z",
          title: "LECTURE NO 19 | Enumerator Function | Enumerator Function Usage | Index Value | Character Value |",
          description: "Python enumerator function for loop index iterable string manipulation coding programming tutorial UZair index tracking",
          tags: ["auto-generated", "transcript-based"],
          category_id: "22",
          default_language: "en",
          default_audio_language: "ur"
        },
        engagement_rate: 50,
        performance_score: 11,
        days_since_published: 3
      },
      {
        video_id: "Ts4QC5cc8Og",
        title: "Part NO 18 | Index Always Less! | Input Func, String , Indexing  #Python #Coding #Shorts #Program...",
        description: "End index is always one less! We reveal the secret behind Python's slicing behavior. Avoid common mistakes! #python #slicing #codingtips",
        published_at: "2025-08-21T15:57:30Z",
        thumbnail_url: "https://i.ytimg.com/vi/Ts4QC5cc8Og/mqdefault.jpg",
        channel_title: "Learn AI With Uzair",
        tags: [],
        view_count: 18,
        like_count: 0,
        comment_count: 0,
        duration: "PT1M36S",
        duration_seconds: 96,
        privacy_status: "public",
        analytics: {
          view_count: 18,
          like_count: 0,
          comment_count: 0,
          duration: "PT1M36S",
          duration_seconds: 96,
          privacy_status: "public",
          published_at: "2025-08-21T17:00:41Z",
          title: "Part NO 18 | Index Always Less! | Input Func, String , Indexing  #Python #Coding #Shorts #Program...",
          description: "End index is always one less! We reveal the secret behind Python's slicing behavior. Avoid common mistakes! #python #slicing #codingtips",
          tags: ["Coding", "Developer", "Programming", "Python", "Shorts", "Tutorial"],
          category_id: "27",
          default_language: "en",
          default_audio_language: "hi"
        },
        engagement_rate: 0,
        performance_score: 9,
        days_since_published: 4
      }
    ]

    setTimeout(() => {
      setVideos(mockVideos)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let filtered = videos

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((video) => video.privacy_status === selectedStatus)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.channel_title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let result = 0
      
      switch (sortBy) {
        case "published_at":
          result = new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
          break
        case "oldest":
          result = new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
          break
        case "title":
          result = a.title.localeCompare(b.title)
          break
        case "views":
          result = b.view_count - a.view_count
          break
        case "performance":
          result = b.performance_score - a.performance_score
          break
        case "engagement":
          result = b.engagement_rate - a.engagement_rate
          break
        default:
          result = 0
      }

      return sortOrder === "desc" ? result : -result
    })

    return filtered
  }, [videos, searchQuery, selectedStatus, sortBy, sortOrder])

  // Calculate stats
  const stats = useMemo((): VideoStats => {
    if (videos.length === 0) {
      return {
        totalVideos: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        avgPerformance: 0,
        avgEngagement: 0
      }
    }

    const totalViews = videos.reduce((sum, video) => sum + video.view_count, 0)
    const totalLikes = videos.reduce((sum, video) => sum + video.like_count, 0)
    const totalComments = videos.reduce((sum, video) => sum + video.comment_count, 0)
    const avgPerformance = videos.reduce((sum, video) => sum + video.performance_score, 0) / videos.length
    const avgEngagement = videos.reduce((sum, video) => sum + video.engagement_rate, 0) / videos.length

    return {
      totalVideos: videos.length,
      totalViews,
      totalLikes,
      totalComments,
      avgPerformance,
      avgEngagement
    }
  }, [videos])

  // Calculate performance distribution
  const performanceDistribution = useMemo((): PerformanceDistribution => {
    if (videos.length === 0) {
      return {
        high: 0,
        medium: 0,
        low: 0,
        highEngagement: 0,
        mediumEngagement: 0,
        lowEngagement: 0
      }
    }

    const high = videos.filter(v => v.performance_score >= 80).length
    const medium = videos.filter(v => v.performance_score >= 40 && v.performance_score < 80).length
    const low = videos.filter(v => v.performance_score < 40).length
    
    const highEngagement = videos.filter(v => v.engagement_rate >= 10).length
    const mediumEngagement = videos.filter(v => v.engagement_rate >= 2 && v.engagement_rate < 10).length
    const lowEngagement = videos.filter(v => v.engagement_rate < 2).length

    return {
      high,
      medium,
      low,
      highEngagement,
      mediumEngagement,
      lowEngagement
    }
  }, [videos])

  return {
    videos: filteredVideos,
    stats,
    performanceDistribution,
    isLoading,
    error
  }
}
