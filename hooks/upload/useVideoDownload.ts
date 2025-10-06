import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'

interface VideoDownloadResponse {
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

interface VideoDownloadState {
  isDownloading: boolean
  error: string | null
  downloadedVideo: VideoDownloadResponse | null
  progress: number
}

export default function useVideoDownload() {
  const { getAuthHeaders } = useAuth()
  const [state, setState] = useState<VideoDownloadState>({
    isDownloading: false,
    error: null,
    downloadedVideo: null,
    progress: 0,
  })

  const downloadVideo = useCallback(async (videoUrl: string) => {
    try {
      setState(prev => ({ ...prev, isDownloading: true, error: null, progress: 0 }))
      
      const headers = getAuthHeaders()
      if (!headers.Authorization) {
        throw new Error('Authentication required')
      }

      // Validate YouTube URL
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
      if (!youtubeRegex.test(videoUrl)) {
        throw new Error('Please enter a valid YouTube URL')
      }

      console.log(`[Video Download] Downloading video from: ${videoUrl}`)
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 15, 90)
        }))
      }, 1000)

      const formData = new FormData()
      formData.append('video_url', videoUrl)

      const response = await axios.post(
        'https://saas-backend.duckdns.org/videos/download',
        formData,
        { 
          headers: {
            ...headers,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      )

      clearInterval(progressInterval)

      const videoData = response.data
      console.log('[Video Download] Success:', videoData)

      setState(prev => ({
        ...prev,
        isDownloading: false,
        downloadedVideo: videoData,
        progress: 100,
      }))

      return videoData
    } catch (error: any) {
      console.error('[Video Download] Error:', error)
      
      let errorMessage = 'Failed to download video'
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 404) {
          errorMessage = 'Video not found or unavailable'
        } else if (error.response?.status === 403) {
          errorMessage = 'Access denied to download this video'
        } else if (error.response?.status === 400) {
          errorMessage = 'Invalid YouTube URL or video cannot be downloaded'
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
        isDownloading: false,
        progress: 0,
      }))

      throw error
    }
  }, [getAuthHeaders])

  const resetState = useCallback(() => {
    setState({
      isDownloading: false,
      error: null,
      downloadedVideo: null,
      progress: 0,
    })
  }, [])

  return {
    ...state,
    downloadVideo,
    resetState,
  }
}
