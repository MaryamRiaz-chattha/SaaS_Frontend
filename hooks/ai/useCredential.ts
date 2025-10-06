import { useState, useCallback, useMemo } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from '../common/useToast'

export interface YouTubeTokenResponse {
  message: string
  auth_url: string
  instructions: string
}

export interface YouTubeToken {
  status: string;
  message: string;
  has_access_token: boolean;
  has_refresh_token: boolean;
  expires_at: string;
  token_type: string;
  scope: string;
  access_token_preview: string;
}

export interface YouTubeTokenState {
  isLoading: boolean
  error: string | null
  authUrl: string | null
  message: string | null
  token: YouTubeToken | null
}

const API_BASE_URL = 'https://backend.postsiva.com'

// Create axios instance for YouTube API calls
const youtubeApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for logging
youtubeApi.interceptors.request.use(
  (config) => {
    console.log('🎬 YouTube API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: config.data,
    })
    return config
  },
  (error) => {
    console.error('❌ YouTube API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for logging
youtubeApi.interceptors.response.use(
  (response) => {
    console.log('✅ YouTube API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    })
    return response
  },
  (error) => {
    console.error('❌ YouTube API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    })
    return Promise.reject(error)
  }
)

export default function useCredential() {
  const { getAuthHeaders, user } = useAuth()
  const { toast } = useToast()
  const [tokenState, setTokenState] = useState<YouTubeTokenState>({
    isLoading: false,
    error: null,
    authUrl: null,
    message: null,
    token: null
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

  const createYouTubeToken = useCallback(async (): Promise<YouTubeTokenResponse> => {
    console.log('🎬 Starting YouTube OAuth token creation process...')
    
    setTokenState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      authUrl: null,
      message: null,
    }))
    
    try {
      // Get authentication headers
      const authHeaders = getAuthHeaders()
      console.log('🔑 Using auth headers for YouTube token creation:', { hasToken: !!authHeaders.Authorization })
      
      if (!authHeaders.Authorization) {
        throw new Error('No authentication token found. Please login first.')
      }
      
      console.log('📤 Sending YouTube token creation request...')
      
      const response = await youtubeApi.post('/youtube/create-token', '', {
        headers: {
          ...authHeaders,
        },
      })
      
      console.log('✅ YouTube token creation successful:', {
        message: response.data.message,
        hasAuthUrl: !!response.data.auth_url,
        instructions: response.data.instructions,
      })
      
      // Update state with response data
      setTokenState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        authUrl: response.data.auth_url,
        message: response.data.message,
      }))
      
      console.log('🔗 Auth URL received:', response.data.auth_url)
      console.log('📋 Instructions:', response.data.instructions)
      
      return response.data
      
    } catch (error: any) {
      console.error('❌ YouTube token creation failed:', error)
      
      let errorMessage = 'Failed to create YouTube OAuth token'
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
          console.error('🔒 Unauthorized - user needs to re-authenticate')
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid request'
          console.error('📋 Bad request details:', error.response.data)
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
          console.error('🖥️ Server error:', error.response.data)
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
          console.error('📋 Error response details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
          })
        }
      } else if (error.message) {
        errorMessage = error.message
        console.error('📋 Custom error message:', error.message)
      }
      
      // Update state with error
      setTokenState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        authUrl: null,
        message: null,
      }))
      
      throw new Error(errorMessage)
    }
  }, [getAuthHeaders])

  const openAuthUrl = useCallback((authUrl: string) => {
    console.log('🌐 Opening YouTube OAuth URL in new window...')
    console.log('🔗 Auth URL:', authUrl)
    
    try {
      // Open the OAuth URL in a new window
      const authWindow = window.open(authUrl, 'youtube_oauth', 'width=600,height=700,scrollbars=yes,resizable=yes')
      
      if (authWindow) {
        console.log('✅ OAuth window opened successfully')
        
        // Store the window reference for potential future use
        // You might want to add logic to handle the OAuth callback here
        
        return authWindow
      } else {
        console.error('❌ Failed to open OAuth window - popup blocked?')
        throw new Error('Failed to open OAuth window. Please check if popups are blocked.')
      }
    } catch (error) {
      console.error('❌ Error opening OAuth window:', error)
      throw error
    }
  }, [])

  const resetTokenState = useCallback(() => {
    console.log('🔄 Resetting YouTube token state...')
    
    setTokenState(prev => ({
      ...prev,
      isLoading: false,
      error: null,
      authUrl: null,
      message: null,
      token: null
    }))
    
    console.log('✅ YouTube token state reset complete')
  }, [])

  const getYouTubeToken = useCallback(async (): Promise<YouTubeToken | undefined> => {
    if (!userId) {
      toast({ title: 'Missing user', description: 'No user id found. Please log in.' })
      return
    }

    setTokenState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }))

    try {
      const headers = getAuthHeaders()
      const url = `/youtube/status`
      console.log('[YouTube][GET Token] Request', {
        userId,
        url: `${API_BASE_URL}${url}`,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const res = await youtubeApi.get(url, { headers })
      console.log('[YouTube][GET Token] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        tokenStatus: res.data?.status,
        message: res.data?.message,
        hasAccessToken: res.data?.has_access_token,
        hasRefreshToken: res.data?.has_refresh_token,
        expiresAt: res.data?.expires_at,
        tokenType: res.data?.token_type,
        scope: res.data?.scope,
        accessTokenPreview: res.data?.access_token_preview,
      })

      // Check if token is valid
      const isValidToken = res.data?.status === 'valid' && res.data?.has_access_token
      
      if (!isValidToken) {
        throw new Error(res.data?.message || 'Token is not valid')
      }

      // Update state with token data
      setTokenState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        message: res.data?.message || 'Token retrieved successfully',
        token: res.data
      }))

      toast({ title: 'Fetched YouTube token', description: res.data?.message || 'Access token received successfully.' })
      return res.data
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('[YouTube][GET Token] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })
      } else {
        console.error('[YouTube][GET Token] Error (non-axios)', error)
      }
      const description = error?.response?.data?.detail || error?.message || 'Unexpected error'
      
      setTokenState(prev => ({
        ...prev,
        isLoading: false,
        error: description,
        token: null
      }))
      
      toast({ title: 'Failed to fetch token', description })
      throw error
    }
  }, [API_BASE_URL, getAuthHeaders, maskToken, toast, userId])

  const refreshYouTubeToken = useCallback(async (): Promise<YouTubeToken | undefined> => {
    if (!userId) {
      toast({ title: 'Missing user', description: 'No user id found. Please log in.' })
      return
    }

    setTokenState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }))

    try {
      const headers = getAuthHeaders()
      const url = `/youtube/status`
      console.log('[YouTube][Refresh Token] Request', {
        userId,
        url: `${API_BASE_URL}${url}`,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const res = await youtubeApi.get(url, { headers })
      console.log('[YouTube][Refresh Token] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        tokenStatus: res.data?.status,
        message: res.data?.message,
        hasAccessToken: res.data?.has_access_token,
        hasRefreshToken: res.data?.has_refresh_token,
        expiresAt: res.data?.expires_at,
        tokenType: res.data?.token_type,
        scope: res.data?.scope,
        accessTokenPreview: res.data?.access_token_preview,
      })

      // Check if token is valid
      const isValidToken = res.data?.status === 'valid' && res.data?.has_access_token
      
      if (!isValidToken) {
        throw new Error(res.data?.message || 'Token is not valid')
      }

      // Update state with refreshed token data
      setTokenState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        message: res.data?.message || 'Token refreshed successfully',
        token: res.data
      }))

      toast({ title: 'Token refreshed', description: res.data?.message || 'YouTube access token refreshed.' })
      return res.data
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('[YouTube][Refresh Token] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })
      } else {
        console.error('[YouTube][Refresh Token] Error (non-axios)', error)
      }
      const description = error?.response?.data?.detail || error?.message || 'Unexpected error'
      
      setTokenState(prev => ({
        ...prev,
        isLoading: false,
        error: description,
        token: null
      }))
      
      toast({ title: 'Failed to refresh token', description })
      throw error
    }
  }, [API_BASE_URL, getAuthHeaders, maskToken, toast, userId])

  return {
    // State
    isLoading: tokenState.isLoading,
    error: tokenState.error,
    authUrl: tokenState.authUrl,
    message: tokenState.message,
    token: tokenState.token,
    
    // Actions
    createYouTubeToken,
    openAuthUrl,
    resetTokenState,
    getYouTubeToken,
    refreshYouTubeToken,
  }
}
