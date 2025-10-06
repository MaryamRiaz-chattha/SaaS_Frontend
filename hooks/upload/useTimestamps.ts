import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from '@/components/ui/use-toast'

const API_BASE_URL = 'https://backend.postsiva.com'

export interface TimestampsGenerateResponse {
  video_id: string
  generated_timestamps: string
  success: boolean
  message: string
}

export interface TimestampsSaveRequest {
  timestamps: string
}

export interface TimestampsSaveResponse {
  id: number
  timestamps: string
  video_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export default function useTimestamps() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedTimestamps, setGeneratedTimestamps] = useState<string>('')

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const generateTimestamps = useCallback(async (videoId: string): Promise<TimestampsGenerateResponse | undefined> => {
    if (!videoId) {
      const errorMsg = 'Video ID is required'
      setError(errorMsg)
      toast({ title: 'Missing Video ID', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/timestamps-generator/${videoId}/generate`
      
      console.log('[Timestamps][Generate] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const res = await axiosInstance.post(url, '', { headers })
      
      console.log('[Timestamps][Generate] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        timestampsLength: res.data?.generated_timestamps?.length,
        videoId: res.data?.video_id,
        success: res.data?.success,
        message: res.data?.message,
        fullData: res.data,
      })

      const timestamps = res.data?.generated_timestamps || ''
      setGeneratedTimestamps(timestamps)

      toast({ 
        title: 'Timestamps Generated', 
        description: 'Timestamps generated successfully.' 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to generate timestamps'
      
      if (axios.isAxiosError(error)) {
        console.error('[Timestamps][Generate] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid video ID or request'
        } else if (error.response?.status === 404) {
          errorMessage = 'Video not found. Please upload a video first.'
        } else if (error.response?.status === 422) {
          errorMessage = 'Invalid request data. Please check the video ID.'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else {
        console.error('[Timestamps][Generate] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to generate timestamps', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const saveTimestamps = useCallback(async (videoId: string, timestamps: string): Promise<TimestampsSaveResponse | undefined> => {
    if (!videoId || !timestamps) {
      const errorMsg = 'Video ID and timestamps are required'
      setError(errorMsg)
      toast({ title: 'Missing Data', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/timestamps-generator/${videoId}/save`
      
      console.log('[Timestamps][Save] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        timestampsLength: timestamps.length,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const requestData: TimestampsSaveRequest = {
        timestamps
      }

      const res = await axiosInstance.post(url, requestData, { headers })
      
      console.log('[Timestamps][Save] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        id: res.data?.id,
        timestampsLength: res.data?.timestamps?.length,
        videoId: res.data?.video_id,
        userId: res.data?.user_id,
      })

      toast({ 
        title: 'Timestamps Saved', 
        description: 'Timestamps saved successfully.' 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to save timestamps'
      
      if (axios.isAxiosError(error)) {
        console.error('[Timestamps][Save] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid timestamps or video ID'
        } else if (error.response?.status === 404) {
          errorMessage = 'Video not found. Please upload a video first.'
        } else if (error.response?.status === 422) {
          errorMessage = 'Invalid request data. Please check your input.'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else {
        console.error('[Timestamps][Save] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to save timestamps', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const regenerateTimestamps = useCallback(async (videoId: string): Promise<TimestampsGenerateResponse | undefined> => {
    if (!videoId) {
      const errorMsg = 'Video ID is required'
      setError(errorMsg)
      toast({ title: 'Missing Video ID', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/timestamps-generator/${videoId}/regenerate`
      
      console.log('[Timestamps][Regenerate] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const res = await axiosInstance.post(url, '', { headers })
      
      console.log('[Timestamps][Regenerate] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        timestampsLength: res.data?.generated_timestamps?.length,
        videoId: res.data?.video_id,
        success: res.data?.success,
        message: res.data?.message,
        fullData: res.data,
      })

      const timestamps = res.data?.generated_timestamps || ''
      setGeneratedTimestamps(timestamps)

      toast({ 
        title: 'Timestamps Regenerated', 
        description: 'New timestamps generated successfully.' 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to regenerate timestamps'
      
      if (axios.isAxiosError(error)) {
        console.error('[Timestamps][Regenerate] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid video ID or request'
        } else if (error.response?.status === 404) {
          errorMessage = 'Video not found. Please upload a video first.'
        } else if (error.response?.status === 422) {
          errorMessage = 'Invalid request data. Please check the video ID.'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else {
        console.error('[Timestamps][Regenerate] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to regenerate timestamps', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const clearTimestamps = useCallback(() => {
    setGeneratedTimestamps('')
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    generatedTimestamps,
    generateTimestamps,
    saveTimestamps,
    regenerateTimestamps,
    clearTimestamps,
  }
}
