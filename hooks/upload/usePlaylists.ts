import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'

export interface Playlist {
  id: string
  name: string
}

interface PlaylistsResponse {
  data: Playlist[]
}

interface PlaylistsState {
  playlists: Playlist[]
  isLoading: boolean
  error: string | null
}

export default function usePlaylists() {
  const { getAuthHeaders } = useAuth()
  const [state, setState] = useState<PlaylistsState>({
    playlists: [],
    isLoading: false,
    error: null,
  })

  const fetchPlaylists = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const headers = getAuthHeaders()
      if (!headers.Authorization) {
        throw new Error('Authentication required')
      }

      console.log('[Playlists] Fetching user playlists...')
      
      const response = await axios.get(
        'https://backend.postsiva.com/playlists/channel-playlists',
        { headers }
      )

      const responseData: PlaylistsResponse = response.data
      console.log('[Playlists] Success:', responseData)

      setState(prev => ({
        ...prev,
        playlists: responseData.data || [],
        isLoading: false,
      }))

      return responseData.data
    } catch (error: any) {
      console.error('[Playlists] Error:', error)
      
      let errorMessage = 'Failed to fetch playlists'
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 404) {
          errorMessage = 'No playlists found'
        } else if (error.response?.status === 403) {
          errorMessage = 'Access denied to playlists'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))

      throw error
    }
  }, [getAuthHeaders])

  const resetState = useCallback(() => {
    setState({
      playlists: [],
      isLoading: false,
      error: null,
    })
  }, [])

  // Auto-fetch playlists on mount
  useEffect(() => {
    fetchPlaylists()
  }, [fetchPlaylists])

  return {
    ...state,
    fetchPlaylists,
    resetState,
  }
}
