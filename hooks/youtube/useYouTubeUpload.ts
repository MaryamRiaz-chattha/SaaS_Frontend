import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'

interface YouTubeUploadResponse {
  success: boolean
  message: string
  data: {
    [key: string]: any
  }
}

interface YouTubeUploadState {
  isUploading: boolean
  error: string | null
  lastResponse: YouTubeUploadResponse | null
}

export default function useYouTubeUpload() {
  const { getAuthHeaders } = useAuth()
  const [state, setState] = useState<YouTubeUploadState>({
    isUploading: false,
    error: null,
    lastResponse: null,
  })

  const uploadToYouTube = useCallback(async (videoId: string) => {
    try {
      setState(prev => ({ ...prev, isUploading: true, error: null }))
      
      const headers = getAuthHeaders()
      if (!headers.Authorization) {
        throw new Error('Authentication required')
      }

      console.log(`[YouTube Upload] Uploading video ${videoId} to YouTube...`)
      
      const response = await axios.post(
        `https://saas-backend.duckdns.org/youtube-upload/${videoId}/upload`,
        {}, // Empty body as per the curl example
        { headers }
      )

      const responseData = response.data
      console.log('[YouTube Upload] Success:', responseData)

      setState(prev => ({
        ...prev,
        isUploading: false,
        lastResponse: responseData,
      }))

      return responseData
    } catch (error: any) {
      console.error('[YouTube Upload] Error:', error)
      
      let errorMessage = 'Failed to upload video to YouTube'
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 404) {
          errorMessage = 'Video not found'
        } else if (error.response?.status === 403) {
          errorMessage = 'Access denied for YouTube upload'
        } else if (error.response?.status === 400) {
          errorMessage = 'Invalid video data for upload'
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
        isUploading: false,
      }))

      throw error
    }
  }, [getAuthHeaders])

  const resetState = useCallback(() => {
    setState({
      isUploading: false,
      error: null,
      lastResponse: null,
    })
  }, [])

  return {
    ...state,
    uploadToYouTube,
    resetState,
  }
}
