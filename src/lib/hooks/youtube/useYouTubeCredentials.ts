import { useState, useCallback, useEffect, useMemo } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from '../common/useToast'

interface YouTubeCredentials {
  has_credentials: boolean
  is_active: boolean
  client_id_preview: string
  client_secret_preview: string
}

export interface YouTubeCredentialsState {
  isLoading: boolean
  isChecking: boolean
  error: string | null
  hasCredentials: boolean
  credentials: YouTubeCredentials | null
  lastChecked: number | null
}

const API_BASE_URL = 'https://backend.postsiva.com'

// Create axios instance for YouTube credentials API calls
const credentialsApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for logging
credentialsApi.interceptors.request.use(
  (config) => {
    console.log('🔑 YouTube Credentials API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
    })
    return config
  },
  (error) => {
    console.error('❌ YouTube Credentials API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for logging
credentialsApi.interceptors.response.use(
  (response) => {
    console.log('✅ YouTube Credentials API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
    })
    return response
  },
  (error) => {
    console.error('❌ YouTube Credentials API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    })
    return Promise.reject(error)
  }
)

export default function useYouTubeCredentials() {
  const { getAuthHeaders, user } = useAuth()
  const { toast } = useToast()
  const [credentialsState, setCredentialsState] = useState<YouTubeCredentialsState>({
    isLoading: false,
    isChecking: false,
    error: null,
    hasCredentials: false,
    credentials: null,
    lastChecked: null,
  })

  const maskToken = useCallback((token?: string) => {
    if (!token || typeof token !== 'string') return 'none'
    if (token.length <= 14) return token
    return `${token.slice(0, 8)}...${token.slice(-6)}`
  }, [])

  const userId = useMemo(() => {
    if (user?.id) return user.id
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_id') || JSON.parse(localStorage.getItem('user_data') || '{}')?.id
    }
    return null
  }, [user])

  const checkYouTubeCredentials = useCallback(async (showSuccessToast = false, suppressToast: boolean = false): Promise<YouTubeCredentials | null> => {
    if (!userId) {
      setCredentialsState(prev => ({
        ...prev,
        hasCredentials: false,
        credentials: null,
        error: 'No user ID found. Please login first.',
      }))
      return null
    }

    setCredentialsState(prev => ({
      ...prev,
      isChecking: true,
      error: null,
    }))

    try {
      const headers = getAuthHeaders()
      const url = `/youtube/get-token`

      const response = await credentialsApi.get(url, { headers })

      // New response shape from /youtube/get-token
      // {
      //   success: boolean,
      //   message: string,
      //   data: { access_token: string, ... }
      // }
      const success = !!response.data && response.data.success === true
      const hasToken = success && !!response.data.data && !!response.data.data.access_token
      const hasValidCredentials = !!hasToken
      
      setCredentialsState(prev => ({
        ...prev,
        isChecking: false,
        isLoading: false,
        error: null,
        hasCredentials: hasValidCredentials,
        // store minimal info; retain previous type
        credentials: hasValidCredentials
          ? { has_credentials: true, is_active: true, client_id_preview: '', client_secret_preview: '' }
          : null,
        lastChecked: Date.now(),
      }))

      // Suppress success toast to keep flow seamless (login -> loading -> dashboard)

      return response.data || null

    } catch (error: any) {
      let errorMessage = 'YouTube credentials not found'
      let hasCredentials = false
      let shouldSetError = false

      if (axios.isAxiosError(error)) {
        // Regardless of status, treat as not connected; keep message generic
        errorMessage = 'YouTube credentials not found'
      } else if (error.message) {
        errorMessage = 'Unable to verify YouTube credentials'
      }

      setCredentialsState(prev => ({
        ...prev,
        isChecking: false,
        isLoading: false,
        error: shouldSetError ? errorMessage : null,
        hasCredentials,
        credentials: null,
        lastChecked: Date.now(),
      }))

      // Optional toast; suppressed by default in guard flows
      if (!suppressToast) {
        toast({ 
          title: 'Failed to check credentials', 
          description: errorMessage,
          variant: 'destructive'
        })
      }

      return null
    }
  }, [userId, getAuthHeaders, maskToken, toast])

  const clearCredentials = useCallback(() => {
    setCredentialsState({
      isLoading: false,
      isChecking: false,
      error: null,
      hasCredentials: false,
      credentials: null,
      lastChecked: null,
    })
  }, [])

  const refreshCredentialsCheck = useCallback(async () => {
    return checkYouTubeCredentials(false)
  }, [checkYouTubeCredentials])

  // Auto-check credentials when userId becomes available
  useEffect(() => {
    if (userId && !credentialsState.lastChecked) {
      checkYouTubeCredentials(false)
    }
  }, [userId, credentialsState.lastChecked, checkYouTubeCredentials])

  return {
    // State
    ...credentialsState,
    
    // Actions
    checkYouTubeCredentials,
    refreshCredentialsCheck,
    clearCredentials,
  }
}
