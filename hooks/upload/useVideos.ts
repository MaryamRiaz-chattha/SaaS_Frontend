import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from '@/components/ui/use-toast'

const API_BASE_URL = 'https://backend.postsiva.com'

export interface VideoUploadResponse {
  id: string  // UUID string, not number
  user_id: string
  video_path: string
  youtube_video_id: string | null
  transcript: string | null
  title: string | null
  timestamps: string | null
  description: string | null
  thumbnail_path: string | null
  thumbnail_url: string | null
  created_at: string
}

export interface UploadProgress {
  progress: number
  isUploading: boolean
  isComplete: boolean
}

export default function useVideos() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    isUploading: false,
    isComplete: false
  })
  const [error, setError] = useState<string | null>(null)

  const uploadVideo = useCallback(async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<VideoUploadResponse | undefined> => {
    if (!file) {
      const errorMsg = 'No file provided'
      setError(errorMsg)
      toast({ title: 'Upload Error', description: errorMsg })
      return
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      const errorMsg = 'Please select a valid video file'
      setError(errorMsg)
      toast({ title: 'Invalid File', description: errorMsg })
      return
    }

    setUploadProgress({
      progress: 0,
      isUploading: true,
      isComplete: false
    })
    setError(null)

    // Create progress animation that goes to 90% over time
    let currentProgress = 0
    const maxProgressBeforeResponse = 90
    const progressInterval = setInterval(() => {
      if (currentProgress < maxProgressBeforeResponse) {
        currentProgress += Math.random() * 3 + 1 // Random increment between 1-4%
        if (currentProgress > maxProgressBeforeResponse) {
          currentProgress = maxProgressBeforeResponse
        }
        
        setUploadProgress(prev => ({
          ...prev,
          progress: currentProgress
        }))
        
        // Call external progress callback if provided
        if (onProgress) {
          onProgress(currentProgress)
        }
      }
    }, 200) // Update every 200ms

    try {
      const headers = getAuthHeaders()
      const url = '/videos/upload'
      
      console.log('[Video][Upload] Request', {
        url: `${API_BASE_URL}${url}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      // Create FormData for multipart upload
      const formData = new FormData()
      formData.append('file', file, file.name) // Explicitly include filename

      // Create axios instance for this upload
      const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 300000, // 5 minutes timeout for large files
      })

      // Prepare headers without Content-Type (let axios set it for multipart)
      const uploadHeaders = {
        ...headers,
        'accept': 'application/json',
        // Remove Content-Type to let axios set the boundary
      }
      delete (uploadHeaders as any)['Content-Type']

      const response = await axiosInstance.post(url, formData, { 
        headers: uploadHeaders,
        onUploadProgress: (progressEvent) => {
          // This is for actual upload progress if the server supports it
          if (progressEvent.total) {
            const serverProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log('Server upload progress:', serverProgress)
          }
        }
      })
      
      const apiPayload = response.data
      const uploadedVideo: any = apiPayload?.data?.video || apiPayload

      console.log('[Video][Upload] Response', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        keys: Object.keys(apiPayload || {}),
        topLevelKeys: Object.keys(apiPayload?.data || {}),
        videoId: uploadedVideo?.id,
        videoPath: uploadedVideo?.video_path,
      })

      // Print the complete response in a formatted way
      console.log('=== COMPLETE VIDEO UPLOAD RESPONSE ===')
      console.log('Status:', response.status)
      console.log('Video ID (UUID):', uploadedVideo?.id)
      console.log('User ID:', uploadedVideo?.user_id)
      console.log('Video Path:', uploadedVideo?.video_path)
      console.log('Data:', JSON.stringify(uploadedVideo, null, 2))
      console.log('===========================================')

      // Clear the progress interval
      clearInterval(progressInterval)

      // Complete the progress to 100%
      setUploadProgress({
        progress: 100,
        isUploading: false,
        isComplete: true
      })

      // Call external progress callback with 100%
      if (onProgress) {
        onProgress(100)
      }

      // Save video data to localStorage for persistence across page refreshes
      if (uploadedVideo) {
        console.log('📝 Video ID from upload response:', uploadedVideo.id)
        console.log('📝 Video object:', uploadedVideo)
        
        localStorage.setItem('current_video_data', JSON.stringify(uploadedVideo))
        localStorage.setItem('current_video_id', uploadedVideo.id)
        
        console.log('💾 Video data saved to localStorage:', {
          video_id: uploadedVideo.id,
          localStorage_key: 'current_video_data',
          localStorage_video_id_key: 'current_video_id'
        })
        
        // Verify the data was stored correctly
        const storedId = localStorage.getItem('current_video_id')
        const storedData = localStorage.getItem('current_video_data')
        console.log('✅ Verification - Stored in localStorage:', {
          stored_video_id: storedId,
          stored_video_data: storedData ? JSON.parse(storedData) : null
        })
      }

      toast({ 
        title: 'Upload Successful', 
        description: `Video "${file.name}" uploaded successfully.` 
      })
      
      // Return the normalized video object matching VideoUploadResponse
      return uploadedVideo as VideoUploadResponse
    } catch (error: any) {
      // Clear the progress interval on error
      clearInterval(progressInterval)
      
      let errorMessage = 'Failed to upload video'
      
      if (axios.isAxiosError(error)) {
        console.error('[Video][Upload] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid file or request'
        } else if (error.response?.status === 413) {
          errorMessage = 'File too large. Please select a smaller video file.'
        } else if (error.response?.status === 415) {
          errorMessage = 'Unsupported file type. Please select a valid video file.'
        } else if (error.response?.status === 422) {
          errorMessage = 'Invalid file format. Please check your video file.'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Upload timeout. Please try again with a smaller file.'
        } else {
          errorMessage = `Upload failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else {
        console.error('[Video][Upload] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      setUploadProgress({
        progress: 0,
        isUploading: false,
        isComplete: false
      })
      
      toast({ 
        title: 'Upload Failed', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    }
  }, [getAuthHeaders, toast])

  const resetUploadState = useCallback(() => {
    setUploadProgress({
      progress: 0,
      isUploading: false,
      isComplete: false
    })
    setError(null)
  }, [])

  const getCurrentVideoData = useCallback((): VideoUploadResponse | null => {
    try {
      console.log('🔍 getCurrentVideoData called - checking localStorage...')
      
      const videoData = localStorage.getItem('current_video_data')
      console.log('🔍 Raw video data from localStorage:', videoData)
      
      if (videoData) {
        const parsed = JSON.parse(videoData)
        console.log('✅ Parsed video data from localStorage:', {
          id: parsed.id,
          user_id: parsed.user_id,
          video_path: parsed.video_path,
          created_at: parsed.created_at
        })
        return parsed
      }
      
      console.log('⚠️ No video data found in localStorage')
    } catch (error) {
      console.error('❌ Error retrieving video data from localStorage:', error)
    }
    return null
  }, [])

  const getCurrentVideoId = useCallback((): string | null => {
    try {
      console.log('🔍 getCurrentVideoId called - checking localStorage...')
      
      const videoId = localStorage.getItem('current_video_id')
      console.log('🔍 Retrieved video ID from localStorage:', videoId)
      
      if (videoId) {
        console.log('✅ Found video ID in localStorage:', videoId)
        return videoId
      }
      
      console.log('⚠️ No video ID in localStorage, falling back to video data...')
      
      // Fallback to getting from video data
      const videoData = getCurrentVideoData()
      const fallbackId = videoData?.id || null
      
      console.log('🔍 Fallback video ID from video data:', fallbackId)
      
      return fallbackId
    } catch (error) {
      console.error('❌ Error retrieving video ID from localStorage:', error)
    }
    return null
  }, [getCurrentVideoData])

  const clearVideoData = useCallback(() => {
    try {
      localStorage.removeItem('current_video_data')
      localStorage.removeItem('current_video_id')
      console.log('🗑️ Cleared video data from localStorage')
    } catch (error) {
      console.error('Error clearing video data from localStorage:', error)
    }
  }, [])

  return {
    uploadProgress,
    error,
    uploadVideo,
    resetUploadState,
    getCurrentVideoData,
    getCurrentVideoId,
    clearVideoData,
    isUploading: uploadProgress.isUploading,
    isComplete: uploadProgress.isComplete,
    progress: uploadProgress.progress,
  }
}
