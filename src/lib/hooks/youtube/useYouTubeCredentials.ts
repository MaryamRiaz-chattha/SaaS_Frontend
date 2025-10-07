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

  const userId = useMemo(() => {
    if (user?.id) return user.id
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_id') || JSON.parse(localStorage.getItem('user_data') || '{}')?.id
    }
    return null
  }, [user])

  // NOTE: Temporarily disable real credentials check. Assume credentials exist.
  const checkYouTubeCredentials = useCallback(async (_showSuccessToast = false, _suppressToast: boolean = true): Promise<YouTubeCredentials | null> => {
    setCredentialsState(prev => ({
      ...prev,
      isChecking: true,
      error: null,
    }))

    // Short-circuit: mark credentials as present without any network call
    const synthetic: YouTubeCredentials = {
      has_credentials: true,
      is_active: true,
      client_id_preview: '',
      client_secret_preview: '',
    }

    setCredentialsState(prev => ({
      ...prev,
      isChecking: false,
      isLoading: false,
      error: null,
      hasCredentials: true,
      credentials: synthetic,
      lastChecked: Date.now(),
    }))

    return synthetic
  }, [])

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

  // Auto-set credentials present when userId becomes available (no network)
  useEffect(() => {
    if (userId && !credentialsState.lastChecked) {
      checkYouTubeCredentials(false, true)
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
