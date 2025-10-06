import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'

export interface VideoData {
  id: string
  user_id: string
  video_path: string
  youtube_video_id?: string
  transcript?: string
  title?: string
  timestamps?: string
  description?: string
  thumbnail_path?: string
  thumbnail_url?: string
  privacy_status?: string
  schedule_datetime?: string
  video_status?: string
  playlist_name?: string
  created_at: string
}

interface VideoPreviewState {
  data: VideoData | null
  isLoading: boolean
  error: string | null
}

export default function useVideoPreview() {
  const { getAuthHeaders } = useAuth()
  const [state, setState] = useState<VideoPreviewState>({
    data: null,
    isLoading: false,
    error: null,
  })

  const getVideoPreview = useCallback(async (videoId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const headers = getAuthHeaders()
      if (!headers.Authorization) {
        throw new Error('Authentication required')
      }

      console.log(`[Video Preview] Fetching video data for: ${videoId}`)
      
      const response = await axios.get(
        `https://backend.postsiva.com/videos/${videoId}`,
        { headers }
      )

      const videoData = response.data
      console.log('[Video Preview] Success:', videoData)

      setState(prev => ({
        ...prev,
        data: videoData,
        isLoading: false,
      }))

      return videoData
    } catch (error: any) {
      console.error('[Video Preview] Error:', error)
      
      let errorMessage = 'Failed to fetch video data'
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 404) {
          errorMessage = 'Video not found'
        } else if (error.response?.status === 403) {
          errorMessage = 'Access denied to video data'
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

  return {
    ...state,
    getVideoPreview,
  }
}
