import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from '@/components/ui/use-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.postsiva.com'

// Validate API base URL
if (!API_BASE_URL) {
  console.error('[Title] Error: API_BASE_URL is not defined')
}

export interface TitleGenerateResponse {
  video_id: string
  generated_titles: string[]
  success: boolean
  message: string
}

export interface TitleSaveRequest {
  title: string
}

export interface TitleSaveResponse {
  id: number
  title: string
  video_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface TitleRegenerateRequest {
  user_requirements: string
}

export default function useTitle() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
  })

  // Add request interceptor for debugging
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log('[Title] Request Interceptor:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        hasAuth: !!(config.headers as any)?.Authorization,
        timeout: config.timeout,
      })
      return config
    },
    (error) => {
      console.error('[Title] Request Interceptor Error:', error)
      return Promise.reject(error)
    }
  )

  // Add response interceptor for debugging
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('[Title] Response Interceptor:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        dataKeys: Object.keys(response.data || {}),
      })
      return response
    },
    (error) => {
      console.error('[Title] Response Interceptor Error:', {
        isAxiosError: axios.isAxiosError(error),
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        url: error?.config?.url,
        data: error?.response?.data,
      })
      return Promise.reject(error)
    }
  )

  const generateTitles = useCallback(async (videoId: string): Promise<TitleGenerateResponse | undefined> => {
    if (!videoId) {
      const errorMsg = 'Video ID is required'
      setError(errorMsg)
      toast({ title: 'Missing Video ID', description: errorMsg })
      return
    }

    if (!API_BASE_URL) {
      const errorMsg = 'API configuration error. Please check your environment settings.'
      setError(errorMsg)
      toast({ title: 'Configuration Error', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/title-generator/${videoId}/generate`
      
      console.log('[Title][Generate] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const res = await axiosInstance.post(url, '', { headers })
      
      console.log('[Title][Generate] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        titlesCount: res.data?.generated_titles?.length,
        videoId: res.data?.video_id,
        success: res.data?.success,
        message: res.data?.message,
        fullData: res.data,
      })

      const titles = res.data?.generated_titles || []
      setGeneratedTitles(titles)

      toast({ 
        title: 'Titles Generated', 
        description: `Generated ${titles.length} titles successfully.` 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to generate titles'
      
      // Log the full error object for debugging
      console.error('[Title][Generate] Full Error Object:', error)
      console.error('[Title][Generate] Error Type:', typeof error)
      console.error('[Title][Generate] Error Constructor:', error?.constructor?.name)
      
      if (axios.isAxiosError(error)) {
        console.error('[Title][Generate] Axios Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
          code: error.code,
          isAxiosError: error.isAxiosError,
          responseHeaders: error.response?.headers,
          requestHeaders: error.request?.headers,
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
        console.error('[Title][Generate] Non-Axios Error Details:', {
          message: error?.message,
          name: error?.name,
          stack: error?.stack,
          cause: error?.cause,
        })
        
        // Handle specific error types
        if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
          errorMessage = 'Network connection failed. Please check your internet connection.'
        } else if (error?.name === 'AbortError') {
          errorMessage = 'Request was cancelled or timed out.'
        } else if (error?.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.'
        } else if (error?.code === 'ERR_NETWORK') {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = error?.message || 'Network error occurred'
        }
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to generate titles', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const saveTitle = useCallback(async (videoId: string, title: string): Promise<TitleSaveResponse | undefined> => {
    if (!videoId || !title) {
      const errorMsg = 'Video ID and title are required'
      setError(errorMsg)
      toast({ title: 'Missing Data', description: errorMsg })
      return
    }

    if (!API_BASE_URL) {
      const errorMsg = 'API configuration error. Please check your environment settings.'
      setError(errorMsg)
      toast({ title: 'Configuration Error', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/title-generator/${videoId}/save`
      
      console.log('[Title][Save] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        titleLength: title.length,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const requestData: TitleSaveRequest = {
        title
      }

      const res = await axiosInstance.post(url, requestData, { headers })
      
      console.log('[Title][Save] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        id: res.data?.id,
        title: res.data?.title,
        videoId: res.data?.video_id,
        userId: res.data?.user_id,
      })

      toast({ 
        title: 'Title Saved', 
        description: 'Title saved successfully.' 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to save title'
      
      // Log the full error object for debugging
      console.error('[Title][Save] Full Error Object:', error)
      console.error('[Title][Save] Error Type:', typeof error)
      console.error('[Title][Save] Error Constructor:', error?.constructor?.name)
      
      if (axios.isAxiosError(error)) {
        console.error('[Title][Save] Axios Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
          code: error.code,
          isAxiosError: error.isAxiosError,
          responseHeaders: error.response?.headers,
          requestHeaders: error.request?.headers,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid title or video ID'
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
        console.error('[Title][Save] Non-Axios Error Details:', {
          message: error?.message,
          name: error?.name,
          stack: error?.stack,
          cause: error?.cause,
        })
        
        // Handle specific error types
        if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
          errorMessage = 'Network connection failed. Please check your internet connection.'
        } else if (error?.name === 'AbortError') {
          errorMessage = 'Request was cancelled or timed out.'
        } else if (error?.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.'
        } else if (error?.code === 'ERR_NETWORK') {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = error?.message || 'Network error occurred'
        }
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to save title', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const regenerateTitlesWithRequirements = useCallback(async (
    videoId: string, 
    userRequirements: string
  ): Promise<TitleGenerateResponse | undefined> => {
    if (!videoId || !userRequirements) {
      const errorMsg = 'Video ID and requirements are required'
      setError(errorMsg)
      toast({ title: 'Missing Data', description: errorMsg })
      return
    }

    if (!API_BASE_URL) {
      const errorMsg = 'API configuration error. Please check your environment settings.'
      setError(errorMsg)
      toast({ title: 'Configuration Error', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/title-generator/${videoId}/regenerate-with-requirements`
      
      console.log('[Title][Regenerate] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        requirementsLength: userRequirements.length,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const requestData: TitleRegenerateRequest = {
        user_requirements: userRequirements
      }

      const res = await axiosInstance.post(url, requestData, { headers })
      
      console.log('[Title][Regenerate] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        titlesCount: res.data?.generated_titles?.length,
        videoId: res.data?.video_id,
        success: res.data?.success,
        message: res.data?.message,
        fullData: res.data,
      })

      const titles = res.data?.generated_titles || []
      setGeneratedTitles(titles)

      toast({ 
        title: 'Titles Regenerated', 
        description: `Generated ${titles.length} new titles based on your requirements.` 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to regenerate titles'
      
      // Log the full error object for debugging
      console.error('[Title][Regenerate] Full Error Object:', error)
      console.error('[Title][Regenerate] Error Type:', typeof error)
      console.error('[Title][Regenerate] Error Constructor:', error?.constructor?.name)
      
      if (axios.isAxiosError(error)) {
        console.error('[Title][Regenerate] Axios Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
          code: error.code,
          isAxiosError: error.isAxiosError,
          responseHeaders: error.response?.headers,
          requestHeaders: error.request?.headers,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid requirements or video ID'
        } else if (error.response?.status === 404) {
          errorMessage = 'Video not found. Please upload a video first.'
        } else if (error.response?.status === 422) {
          errorMessage = 'Invalid request data. Please check your requirements.'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else {
        console.error('[Title][Regenerate] Non-Axios Error Details:', {
          message: error?.message,
          name: error?.name,
          stack: error?.stack,
          cause: error?.cause,
        })
        
        // Handle specific error types
        if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
          errorMessage = 'Network connection failed. Please check your internet connection.'
        } else if (error?.name === 'AbortError') {
          errorMessage = 'Request was cancelled or timed out.'
        } else if (error?.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.'
        } else if (error?.code === 'ERR_NETWORK') {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = error?.message || 'Network error occurred'
        }
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to regenerate titles', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const clearTitles = useCallback(() => {
    setGeneratedTitles([])
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    generatedTitles,
    generateTitles,
    saveTitle,
    regenerateTitlesWithRequirements,
    clearTitles,
  }
}
