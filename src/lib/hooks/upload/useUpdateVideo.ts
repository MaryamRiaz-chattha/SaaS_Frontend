import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from '@/components/ui/use-toast'

const API_BASE_URL = 'https://backend.postsiva.com'

export interface UpdateVideoRequest {
  title?: string
  timestamps?: string
  description?: string
  thumbnail_path?: string
  thumbnail_url?: string
  privacy_status?: string
  schedule_datetime?: string
  video_status?: string
  playlist_name?: string
}

export interface UpdateVideoResponse {
  id: string
  user_id: string
  video_path: string
  youtube_video_id: string | null
  transcript: string | null
  title: string | null
  timestamps: string | null
  description: string | null
  thumbnail_path: string | null
  thumbnail_url: string | null
  privacy_status: string | null
  schedule_datetime: string | null
  video_status: string | null
  playlist_name: string | null
  created_at: string
}

interface UpdateVideoState {
  isUpdating: boolean
  error: string | null
  lastResponse: UpdateVideoResponse | null
}

export default function useUpdateVideo() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()
  const [state, setState] = useState<UpdateVideoState>({
    isUpdating: false,
    error: null,
    lastResponse: null,
  })

  const updateVideo = useCallback(async (videoId: string, updates: UpdateVideoRequest): Promise<UpdateVideoResponse | undefined> => {
    if (!videoId) {
      const errorMsg = 'Video ID is required'
      setState(prev => ({ ...prev, error: errorMsg }))
      toast({ title: 'Missing Data', description: errorMsg, variant: 'destructive' })
      return
    }

    if (!API_BASE_URL) {
      const errorMsg = 'API configuration error. Please check your environment settings.'
      setState(prev => ({ ...prev, error: errorMsg }))
      toast({ title: 'Configuration Error', description: errorMsg, variant: 'destructive' })
      return
    }

    try {
      setState(prev => ({ ...prev, isUpdating: true, error: null }))
      
      const headers = getAuthHeaders()
      if (!headers.Authorization) {
        throw new Error('Authentication required')
      }

      console.log(`[Video Update] Updating video ${videoId} with:`, updates)
      
      const response = await axios.put(
        `${API_BASE_URL}/videos/${videoId}`,
        updates,
        { 
          headers: {
            ...headers,
            'accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )

      const responseData: UpdateVideoResponse = response.data
      console.log('[Video Update] Success:', responseData)

      setState(prev => ({
        ...prev,
        isUpdating: false,
        lastResponse: responseData,
      }))

      toast({ 
        title: 'Video Updated', 
        description: 'Video details updated successfully.' 
      })
      
      return responseData
    } catch (error: any) {
      console.error('[Video Update] Error:', error)
      
      let errorMessage = 'Failed to update video'
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 404) {
          errorMessage = 'Video not found'
        } else if (error.response?.status === 403) {
          errorMessage = 'Access denied to video'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isUpdating: false,
      }))

      toast({ 
        title: 'Update Failed', 
        description: errorMessage, 
        variant: 'destructive' 
      })

      throw error
    }
  }, [getAuthHeaders, toast])

  const resetState = useCallback(() => {
    setState({
      isUpdating: false,
      error: null,
      lastResponse: null,
    })
  }, [])

  return {
    ...state,
    updateVideo,
    resetState,
  }
}
