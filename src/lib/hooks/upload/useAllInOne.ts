import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from '@/components/ui/use-toast'

const API_BASE_URL = 'https://backend.postsiva.com'

export interface AllInOneTimestamp {
  time: string
  title: string
}

export interface AllInOneThumbnail {
  thumbnail_id: number
  image_url: string
  success: boolean
}

export interface AllInOneProcessResponse {
  success: boolean
  message: string
  video_id: string
  total_tasks: number
  completed_tasks: number
  failed_tasks: number
  results: {
    titles: {
      success: boolean
      message: string
      generated_titles: string[]
      error: string | null
    }
    description: {
      success: boolean
      message: string
      generated_description: string
      error: string | null
    }
    timestamps: {
      success: boolean
      message: string
      generated_timestamps: AllInOneTimestamp[]
      error: string | null
    }
    thumbnails: {
      success: boolean
      message: string
      generated_thumbnails: AllInOneThumbnail[]
      error: string | null
    }
  }
  processing_time_seconds: number
  errors: string[]
}

export interface AllInOneSaveRequest {
  selected_title: string
  selected_thumbnail_url: string
  description: string
  timestamps: AllInOneTimestamp[]
  privacy_status?: string
  playlist_name?: string
  schedule_datetime?: string
}

export interface AllInOneSaveResponse {
  success: boolean
  message: string
  video_id: string
  saved_at: string
}

export default function useAllInOne() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processedData, setProcessedData] = useState<AllInOneProcessResponse | null>(null)

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      accept: 'application/json',
    },
  })

  const processAllInOne = useCallback(async (videoId: string): Promise<AllInOneProcessResponse | undefined> => {
    if (!videoId) {
      const errorMsg = 'Video ID is required'
      setError(errorMsg)
      toast({ title: 'Missing Video ID', description: errorMsg, variant: 'destructive' })
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/all-in-one/${videoId}/process`
      
      console.log('[AllInOne][Process] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        hasAuthHeader: !!(headers as any)?.Authorization,
      })

      const res = await axiosInstance.post(url, '', { headers })
      
      console.log('[AllInOne][Process] Response', {
        status: res.status,
        success: res.data?.success,
        message: res.data?.message,
        totalTasks: res.data?.total_tasks,
        completedTasks: res.data?.completed_tasks,
        failedTasks: res.data?.failed_tasks,
        processingTime: res.data?.processing_time_seconds,
      })

      setProcessedData(res.data)

      toast({ 
        title: 'Processing Complete', 
        description: res.data?.message || 'All content generated successfully!'
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to process video with AI'
      
      if (axios.isAxiosError(error)) {
        console.error('[AllInOne][Process] Error', {
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
        console.error('[AllInOne][Process] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to process video', 
        description: errorMessage,
        variant: 'destructive'
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }, [getAuthHeaders, toast])

  const saveAllInOne = useCallback(async (videoId: string, data: AllInOneSaveRequest): Promise<AllInOneSaveResponse | undefined> => {
    if (!videoId) {
      const errorMsg = 'Video ID is required'
      setError(errorMsg)
      toast({ title: 'Missing Video ID', description: errorMsg, variant: 'destructive' })
      return
    }

    if (!data.selected_title || !data.selected_thumbnail_url || !data.description) {
      const errorMsg = 'Please select a title, thumbnail, and ensure description is present'
      setError(errorMsg)
      toast({ title: 'Missing Required Fields', description: errorMsg, variant: 'destructive' })
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/all-in-one/${videoId}/save-content`
      
      console.log('[AllInOne][Save] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        hasAuthHeader: !!(headers as any)?.Authorization,
        data: {
          ...data,
          selected_title: data.selected_title.substring(0, 50) + '...',
          selected_thumbnail_url: data.selected_thumbnail_url.substring(0, 50) + '...',
          description: data.description.substring(0, 100) + '...',
        }
      })

      const res = await axiosInstance.post(url, data, { 
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        }
      })
      
      console.log('[AllInOne][Save] Response', {
        status: res.status,
        success: res.data?.success,
        message: res.data?.message,
        videoId: res.data?.video_id,
        savedAt: res.data?.saved_at,
      })

      toast({ 
        title: 'Content Saved', 
        description: res.data?.message || 'All content saved successfully!'
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to save content'
      
      if (axios.isAxiosError(error)) {
        console.error('[AllInOne][Save] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid data provided'
        } else if (error.response?.status === 404) {
          errorMessage = 'Video not found.'
        } else if (error.response?.status === 422) {
          errorMessage = 'Invalid request data. Please check your selections.'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else {
        console.error('[AllInOne][Save] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to save content', 
        description: errorMessage,
        variant: 'destructive'
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }, [getAuthHeaders, toast])

  const clearData = useCallback(() => {
    setProcessedData(null)
    setError(null)
  }, [])

  return {
    isProcessing,
    isSaving,
    error,
    processedData,
    processAllInOne,
    saveAllInOne,
    clearData,
  }
}
