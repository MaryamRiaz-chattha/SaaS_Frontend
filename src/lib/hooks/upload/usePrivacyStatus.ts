import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'

interface PrivacyStatusResponse {
  success: boolean
  message: string
  data: {
    [key: string]: any
  }
}

interface PrivacyStatusState {
  isUpdating: boolean
  error: string | null
  lastResponse: PrivacyStatusResponse | null
}

export default function usePrivacyStatus() {
  const { getAuthHeaders } = useAuth()
  const [state, setState] = useState<PrivacyStatusState>({
    isUpdating: false,
    error: null,
    lastResponse: null,
  })

  const updatePrivacyStatus = useCallback(async (videoId: string, privacyStatus: 'public' | 'private' | 'unlisted') => {
    try {
      setState(prev => ({ ...prev, isUpdating: true, error: null }))
      
      const headers = getAuthHeaders()
      if (!headers.Authorization) {
        throw new Error('Authentication required')
      }

      console.log(`[Privacy Status] Updating video ${videoId} to ${privacyStatus}`)
      
      const response = await axios.post(
        `https://backend.postsiva.com/privacy-status/${videoId}/privacy-status`,
        { privacy_status: privacyStatus },
        { headers }
      )

      const responseData = response.data
      console.log('[Privacy Status] Success:', responseData)

      setState(prev => ({
        ...prev,
        isUpdating: false,
        lastResponse: responseData,
      }))

      return responseData
    } catch (error: any) {
      console.error('[Privacy Status] Error:', error)
      
      let errorMessage = 'Failed to update privacy status'
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 404) {
          errorMessage = 'Video not found'
        } else if (error.response?.status === 403) {
          errorMessage = 'Access denied to update privacy status'
        } else if (error.response?.status === 400) {
          errorMessage = 'Invalid privacy status or video data'
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
        isUpdating: false,
      }))

      throw error
    }
  }, [getAuthHeaders])

  const resetState = useCallback(() => {
    setState({
      isUpdating: false,
      error: null,
      lastResponse: null,
    })
  }, [])

  return {
    ...state,
    updatePrivacyStatus,
    resetState,
  }
}
