"use client"

import { useState, useEffect } from "react"

export interface ChannelPlaylist {
  id: string
  name: string
}

interface PlaylistsApiResponse {
  success: boolean
  message: string
  data?: {
    playlists?: Array<{
      playlist_id: string
      playlist_name: string
    }>
  }
  refreshed?: boolean
}

export function useChannelPlaylists() {
  const [playlists, setPlaylists] = useState<ChannelPlaylist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchChannelPlaylists = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get token from localStorage
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch('https://saas-backend.duckdns.org/playlists/?refresh=false', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PlaylistsApiResponse = await response.json()
      const items: ChannelPlaylist[] = data?.data?.playlists?.map(p => ({
        id: p.playlist_id,
        name: p.playlist_name,
      })) || []

      setPlaylists(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching channel playlists:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchChannelPlaylists()
  }, [])

  return {
    playlists,
    isLoading,
    error,
    fetchChannelPlaylists
  }
}
