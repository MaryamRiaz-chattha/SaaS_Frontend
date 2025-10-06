import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from '@/components/ui/use-toast'

const API_BASE_URL = 'https://saas-backend.duckdns.org'

export interface ThumbnailGenerateResponse {
  success: boolean
  message: string
  video_id: string
  image_url: string
  width: number
  height: number
}

export interface ThumbnailBatchResponse {
  thumbnails: string[]
  video_id: string
  success: boolean
  message: string
}

export interface ThumbnailSaveRequest {
  thumbnail_url: string
}

export interface ThumbnailSaveResponse {
  success: boolean
  message: string
  video_id: string
  thumbnail_url: string
  saved_at: string
}

export interface ThumbnailUploadResponse {
  success: boolean
  message: string
  video_id: string
  thumbnail_path: string
  original_filename: string
  file_size: number
  content_type: string
  saved_at: string
}

export default function useThumbnail() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([])

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      accept: 'application/json',
    },
  })

  const generateSingleThumbnail = useCallback(async (videoId: string): Promise<ThumbnailGenerateResponse | undefined> => {
    const headers = getAuthHeaders()
    const url = `/thumbnail-generator/${videoId}/generate`
    
    console.log('[Thumbnail][Single Generate] Request', {
      url: `${API_BASE_URL}${url}`,
      videoId,
      hasAuthHeader: !!(headers as any)?.Authorization,
    })

    const res = await axiosInstance.post(url, '', { headers })
    
    console.log('[Thumbnail][Single Generate] Response', {
      status: res.status,
      success: res.data?.success,
      imageUrl: res.data?.image_url,
      videoId: res.data?.video_id,
      width: res.data?.width,
      height: res.data?.height,
      message: res.data?.message,
    })

    return res.data
  }, [getAuthHeaders])

  const generateThumbnails = useCallback(async (videoId: string): Promise<ThumbnailBatchResponse | undefined> => {
    console.log('[Thumbnail][Batch Generate] Entry point - videoId received:', {
      videoId,
      videoIdType: typeof videoId,
      videoIdLength: videoId?.length,
      isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(videoId || '')
    })
    
    if (!videoId) {
      const errorMsg = 'Video ID is required'
      setError(errorMsg)
      toast({ title: 'Missing Video ID', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('[Thumbnail][Batch Generate] Starting generation of 5 thumbnails for video:', videoId)

      // Generate 5 thumbnails by calling the API 5 times
      const promises = Array.from({ length: 5 }, (_, index) => 
        generateSingleThumbnail(videoId).catch(error => {
          console.error(`[Thumbnail][Batch Generate] Failed to generate thumbnail ${index + 1}:`, error)
          return null
        })
      )

      const results = await Promise.allSettled(promises)
      
      // Extract successful thumbnails
      const thumbnails: string[] = []
      const failedCount = results.filter((result, index) => {
        if (result.status === 'fulfilled' && result.value?.image_url) {
          thumbnails.push(result.value.image_url)
          console.log(`[Thumbnail][Batch Generate] Thumbnail ${index + 1} generated:`, result.value.image_url)
          return false
        } else {
          console.error(`[Thumbnail][Batch Generate] Thumbnail ${index + 1} failed:`, result)
          return true
        }
      }).length

      console.log('[Thumbnail][Batch Generate] Results', {
        totalRequested: 5,
        successful: thumbnails.length,
        failed: failedCount,
        thumbnails: thumbnails.map((url, i) => `Thumbnail ${i + 1}: ${url.substring(0, 100)}...`)
      })

      if (thumbnails.length === 0) {
        throw new Error('Failed to generate any thumbnails')
      }

      setGeneratedThumbnails(thumbnails)

      const successMessage = thumbnails.length === 5 
        ? 'All 5 thumbnails generated successfully!' 
        : `${thumbnails.length} out of 5 thumbnails generated successfully.`

      toast({ 
        title: 'Thumbnails Generated', 
        description: successMessage
      })

      const response: ThumbnailBatchResponse = {
        thumbnails,
        video_id: videoId,
        success: true,
        message: successMessage
      }
      
      return response
    } catch (error: any) {
      let errorMessage = 'Failed to generate thumbnails'
      
      if (axios.isAxiosError(error)) {
        console.error('[Thumbnail][Batch Generate] Error', {
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
        console.error('[Thumbnail][Batch Generate] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to generate thumbnails', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast, generateSingleThumbnail])

  const regenerateThumbnails = useCallback(async (videoId: string): Promise<ThumbnailBatchResponse | undefined> => {
    // Use the same logic as generateThumbnails for regeneration
    return generateThumbnails(videoId)
  }, [generateThumbnails])

  const saveThumbnail = useCallback(async (videoId: string, thumbnailUrl: string): Promise<ThumbnailSaveResponse | undefined> => {
    if (!videoId || !thumbnailUrl) {
      const errorMsg = 'Video ID and thumbnail URL are required'
      setError(errorMsg)
      toast({ title: 'Missing Data', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/thumbnail-generator/${videoId}/save`
      
      console.log('[Thumbnail][Save] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        thumbnailUrl: thumbnailUrl.substring(0, 100) + '...',
        hasAuthHeader: !!(headers as any)?.Authorization,
      })

      const requestData: ThumbnailSaveRequest = {
        thumbnail_url: thumbnailUrl
      }

      const res = await axiosInstance.post(url, requestData, { 
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        }
      })
      
      console.log('[Thumbnail][Save] Response', {
        status: res.status,
        success: res.data?.success,
        message: res.data?.message,
        videoId: res.data?.video_id,
        thumbnailUrl: res.data?.thumbnail_url,
        savedAt: res.data?.saved_at,
      })

      toast({ 
        title: 'Thumbnail Saved', 
        description: 'Thumbnail saved successfully.' 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to save thumbnail'
      
      if (axios.isAxiosError(error)) {
        console.error('[Thumbnail][Save] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid thumbnail URL or video ID'
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
        console.error('[Thumbnail][Save] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to save thumbnail', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const uploadCustomThumbnail = useCallback(async (videoId: string, file: File): Promise<ThumbnailUploadResponse | undefined> => {
    if (!videoId || !file) {
      const errorMsg = 'Video ID and file are required'
      setError(errorMsg)
      toast({ title: 'Missing Data', description: errorMsg })
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select a valid image file'
      setError(errorMsg)
      toast({ title: 'Invalid File', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = `/thumbnail-generator/${videoId}/upload`
      
      console.log('[Thumbnail][Upload] Request', {
        url: `${API_BASE_URL}${url}`,
        videoId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        hasAuthHeader: !!(headers as any)?.Authorization,
      })

      // Create FormData for multipart upload
      const formData = new FormData()
      formData.append('file', file, file.name)

      // Prepare headers without Content-Type (let axios set it for multipart)
      const uploadHeaders = {
        ...headers,
        'accept': 'application/json',
        // Remove Content-Type to let axios set the boundary for multipart
      }
      delete (uploadHeaders as any)['Content-Type']

      const res = await axiosInstance.post(url, formData, { 
        headers: uploadHeaders,
      })
      
      console.log('[Thumbnail][Upload] Response', {
        status: res.status,
        success: res.data?.success,
        message: res.data?.message,
        videoId: res.data?.video_id,
        thumbnailPath: res.data?.thumbnail_path,
        originalFilename: res.data?.original_filename,
        fileSize: res.data?.file_size,
        contentType: res.data?.content_type,
        savedAt: res.data?.saved_at,
      })

      // Add the uploaded thumbnail to the generated thumbnails list
      if (res.data?.thumbnail_path) {
        // Construct the full URL for the uploaded thumbnail
        const thumbnailUrl = `${API_BASE_URL}/${res.data.thumbnail_path}`
        setGeneratedThumbnails(prev => [...prev, thumbnailUrl])
      }

      toast({ 
        title: 'Custom Thumbnail Uploaded', 
        description: `Thumbnail "${file.name}" uploaded successfully.` 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to upload custom thumbnail'
      
      if (axios.isAxiosError(error)) {
        console.error('[Thumbnail][Upload] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid file or video ID'
        } else if (error.response?.status === 413) {
          errorMessage = 'File too large. Please select a smaller image.'
        } else if (error.response?.status === 415) {
          errorMessage = 'Unsupported file type. Please select a valid image file.'
        } else if (error.response?.status === 422) {
          errorMessage = 'Invalid file format. Please check your image file.'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Upload failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else {
        console.error('[Thumbnail][Upload] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to upload thumbnail', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const clearThumbnails = useCallback(() => {
    setGeneratedThumbnails([])
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    generatedThumbnails,
    generateThumbnails,
    regenerateThumbnails,
    saveThumbnail,
    uploadCustomThumbnail,
    clearThumbnails,
  }
}
