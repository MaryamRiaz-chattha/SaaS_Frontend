"use client"

import { useState, useEffect, useMemo } from "react"
import { Playlist, PlaylistsResponse, PlaylistStats } from "@/types/dashboard/playlists"

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlaylists = async (refresh: boolean = false) => {
    try {
      setIsLoading(true)
      
      // Get token from localStorage (you might want to adjust this based on your auth implementation)
      const token = localStorage.getItem('auth_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1emFpciIsImV4cCI6MTc1NjgzMDY4M30.aOBeTuTo2AaSQttMBCwvFxm1Zq6fK2FQ3F-fLw2WL_c'
      
      const response = await fetch(`https://saas-backend.duckdns.org/dashboard/playlists?refresh=${refresh}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PlaylistsResponse = await response.json()
      
      if (data.success) {
        setPlaylists(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch playlists')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching playlists:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch playlists data
  useEffect(() => {
    fetchPlaylists(false) // Initial load with refresh=false
  }, [])

  // Calculate playlist statistics
  const playlistStats = useMemo((): PlaylistStats => {
    if (playlists.length === 0) {
      return {
        totalPlaylists: 0,
        totalVideos: 0,
        totalViews: 0,
        totalWatchTime: "0 hours",
        avgEngagement: 0
      }
    }

    const totalVideos = playlists.reduce((sum, playlist) => sum + playlist.analytics.total_videos, 0)
    const totalViews = playlists.reduce((sum, playlist) => sum + playlist.analytics.total_views, 0)
    const totalWatchTimeHours = playlists.reduce((sum, playlist) => sum + playlist.analytics.total_watch_time_hours, 0)
    const avgEngagement = playlists.reduce((sum, playlist) => sum + playlist.analytics.overall_engagement_rate, 0) / playlists.length

    return {
      totalPlaylists: playlists.length,
      totalVideos,
      totalViews,
      totalWatchTime: `${totalWatchTimeHours.toFixed(1)} hours`,
      avgEngagement: parseFloat(avgEngagement.toFixed(2))
    }
  }, [playlists])

  // Get top performing playlists
  const topPlaylistsByViews = useMemo(() => {
    return [...playlists]
      .sort((a, b) => b.analytics.total_views - a.analytics.total_views)
      .slice(0, 5)
  }, [playlists])

  const topPlaylistsByEngagement = useMemo(() => {
    return [...playlists]
      .sort((a, b) => b.analytics.overall_engagement_rate - a.analytics.overall_engagement_rate)
      .slice(0, 5)
  }, [playlists])

  const topPlaylistsByHealth = useMemo(() => {
    return [...playlists]
      .sort((a, b) => b.analytics.playlist_health.health_score - a.analytics.playlist_health.health_score)
      .slice(0, 5)
  }, [playlists])

  // Growth trends data for charts
  const growthTrendsData = useMemo(() => {
    return playlists.map(playlist => ({
      name: playlist.title.length > 20 ? playlist.title.substring(0, 20) + '...' : playlist.title,
      views: playlist.analytics.total_views,
      engagement: playlist.analytics.overall_engagement_rate,
      videos: playlist.analytics.total_videos,
      health_score: playlist.analytics.playlist_health.health_score
    }))
  }, [playlists])

  // Performance distribution
  const performanceDistribution = useMemo(() => {
    const healthLevels = {
      Excellent: 0,
      Good: 0,
      Fair: 0,
      Poor: 0
    }

    playlists.forEach(playlist => {
      const level = playlist.analytics.playlist_health.health_level
      if (level in healthLevels) {
        healthLevels[level as keyof typeof healthLevels]++
      }
    })

    return Object.entries(healthLevels).map(([level, count]) => ({
      level,
      count,
      percentage: playlists.length > 0 ? (count / playlists.length) * 100 : 0
    }))
  }, [playlists])

  const refreshData = async () => {
    setError(null)
    await fetchPlaylists(true) // Refresh with refresh=true
  }

  return {
    playlists,
    playlistStats,
    topPlaylistsByViews,
    topPlaylistsByEngagement,
    topPlaylistsByHealth,
    growthTrendsData,
    performanceDistribution,
    isLoading,
    error,
    refreshData
  }
}
