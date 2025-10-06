import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from '@/components/ui/use-toast'

const API_BASE_URL = 'https://saas-backend.duckdns.org'

export interface DescriptionGenerateResponse {
  video_id: string
  generated_description: string
  success: boolean
  message: string
}

export interface DescriptionSaveRequest {
  description: string
}

export interface DescriptionSaveResponse {
  id: number
  description: string
  video_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface DescriptionRegenerateWithTemplateRequest {
  custom_template: string
}

export default function useTranscript() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedDescription, setGeneratedDescription] = useState<string>('')

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const generateDescription = useCallback(async (videoId: string): Promise<DescriptionGenerateResponse | undefined> => {
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
      const url = `/description-generator/${videoId}/generate`
      
      console.log('[Description][Generate] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const res = await axiosInstance.post(url, '', { headers })
      
      console.log('[Description][Generate] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        descriptionLength: res.data?.generated_description?.length,
        videoId: res.data?.video_id,
        success: res.data?.success,
        message: res.data?.message,
        fullData: res.data,
      })

      const description = res.data?.generated_description || ''
      setGeneratedDescription(description)

      toast({ 
        title: 'Description Generated', 
        description: 'Description generated successfully.' 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to generate description'
      
      if (axios.isAxiosError(error)) {
        console.error('[Description][Generate] Error', {
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
        console.error('[Description][Generate] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to generate description', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const saveDescription = useCallback(async (videoId: string, description: string): Promise<DescriptionSaveResponse | undefined> => {
    if (!videoId || !description) {
      const errorMsg = 'Video ID and description are required'
      setError(errorMsg)
      toast({ title: 'Missing Data', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/description-generator/${videoId}/save`
      
      console.log('[Description][Save] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        descriptionLength: description.length,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const requestData: DescriptionSaveRequest = {
        description
      }

      const res = await axiosInstance.post(url, requestData, { headers })
      
      console.log('[Description][Save] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        id: res.data?.id,
        descriptionLength: res.data?.description?.length,
        videoId: res.data?.video_id,
        userId: res.data?.user_id,
      })

      toast({ 
        title: 'Description Saved', 
        description: 'Description saved successfully.' 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to save description'
      
      if (axios.isAxiosError(error)) {
        console.error('[Description][Save] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid description or video ID'
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
        console.error('[Description][Save] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to save description', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const regenerateDescription = useCallback(async (videoId: string): Promise<DescriptionGenerateResponse | undefined> => {
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
      const url = `/description-generator/${videoId}/regenerate`
      
      console.log('[Description][Regenerate] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const res = await axiosInstance.post(url, '', { headers })
      
      console.log('[Description][Regenerate] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        descriptionLength: res.data?.generated_description?.length,
        videoId: res.data?.video_id,
        success: res.data?.success,
        message: res.data?.message,
        fullData: res.data,
      })

      const description = res.data?.generated_description || ''
      setGeneratedDescription(description)

      toast({ 
        title: 'Description Regenerated', 
        description: 'New description generated successfully.' 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to regenerate description'
      
      if (axios.isAxiosError(error)) {
        console.error('[Description][Regenerate] Error', {
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
        console.error('[Description][Regenerate] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to regenerate description', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const regenerateDescriptionWithTemplate = useCallback(async (
    videoId: string, 
    customTemplate: string
  ): Promise<DescriptionGenerateResponse | undefined> => {
    if (!videoId || !customTemplate) {
      const errorMsg = 'Video ID and custom template are required'
      setError(errorMsg)
      toast({ title: 'Missing Data', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/description-generator/${videoId}/regenerate-with-template`
      
      console.log('[Description][Regenerate Template] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        templateLength: customTemplate.length,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const requestData: DescriptionRegenerateWithTemplateRequest = {
        custom_template: customTemplate
      }

      const res = await axiosInstance.post(url, requestData, { headers })
      
      console.log('[Description][Regenerate Template] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        descriptionLength: res.data?.generated_description?.length,
        videoId: res.data?.video_id,
        success: res.data?.success,
        message: res.data?.message,
        fullData: res.data,
      })

      const description = res.data?.generated_description || ''
      setGeneratedDescription(description)

      toast({ 
        title: 'Description Regenerated with Template', 
        description: 'New description generated using your custom template.' 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to regenerate description with template'
      
      if (axios.isAxiosError(error)) {
        console.error('[Description][Regenerate Template] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid template or video ID'
        } else if (error.response?.status === 404) {
          errorMessage = 'Video not found. Please upload a video first.'
        } else if (error.response?.status === 422) {
          errorMessage = 'Invalid request data. Please check your template.'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else {
        console.error('[Description][Regenerate Template] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to regenerate with template', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const clearDescription = useCallback(() => {
    setGeneratedDescription('')
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    generatedDescription,
    generateDescription,
    saveDescription,
    regenerateDescription,
    regenerateDescriptionWithTemplate,
    clearDescription,
  }
}
