import { useState, useCallback, useMemo } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'

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
      
      // Adjusted to nested structure: response.data.data.auth_url
      const top = response.data || {}
      const nested = top.data || {}
      const message = typeof top.message === 'string' ? top.message : (typeof nested.message === 'string' ? nested.message : '')
      const auth_url = typeof nested.auth_url === 'string' ? nested.auth_url : ''
      const instructions = typeof nested.instructions === 'string' ? nested.instructions : ''

      console.log('✅ YouTube token creation successful:', {
        message,
        hasAuthUrl: !!auth_url,
        instructions,
      })

      if (!auth_url) {
        const missingUrlMessage = 'Authorization URL was not provided by the server.'
        setTokenState(prev => ({
          ...prev,
          isLoading: false,
          error: missingUrlMessage,
          authUrl: null,
          message: message || null,
        }))
        return { message: message || missingUrlMessage, auth_url: '', instructions: instructions || '' }
      }
      
      setTokenState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        authUrl: auth_url,
        message: message || null,
      }))
      
      console.log('🔗 Auth URL received:', auth_url)
      console.log('📋 Instructions:', instructions)
      
      return { message: message || '', auth_url, instructions: instructions || '' }
      
    } catch (error: any) {
      console.error('❌ YouTube token creation failed:', error)
      
      let errorMessage = 'Failed to create YouTube OAuth token'
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid request'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
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
    
    if (!authUrl || typeof authUrl !== 'string') {
      console.error('❌ Cannot open OAuth window - invalid or missing URL')
      throw new Error('Authorization URL is missing. Please try again.')
    }

    try {
      const authWindow = window.open(authUrl, 'youtube_oauth', 'width=600,height=700,scrollbars=yes,resizable=yes')
      
      if (authWindow) {
        console.log('✅ OAuth window opened successfully')
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
      return
    }

    setTokenState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }))

    try {
      const headers = getAuthHeaders()
      const url = `/youtube/get-token`
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
        success: res.data?.success,
        message: res.data?.message,
        hasAccessToken: !!res.data?.data?.access_token,
        expiresAt: res.data?.data?.expires_at,
        tokenType: res.data?.data?.token_type,
        scope: res.data?.data?.scope,
      })

      const success = res.data?.success === true
      const data = res.data?.data || {}
      const hasAccessToken = !!data.access_token

      if (!success || !hasAccessToken) {
        // Do not throw; return undefined so caller can start OAuth flow silently
        setTokenState(prev => ({ ...prev, isLoading: false, error: 'No YouTube tokens found. Please connect your YouTube account first.', token: null }))
        return undefined
      }

      const mapped: YouTubeToken = {
        status: 'valid',
        message: res.data?.message || 'Token retrieved successfully',
        has_access_token: true,
        has_refresh_token: !!data.refresh_token,
        expires_at: data.expires_at || '',
        token_type: data.token_type || 'Bearer',
        scope: data.scope || '',
        access_token_preview: typeof data.access_token === 'string' ? `${data.access_token.slice(0, 8)}...${data.access_token.slice(-6)}` : '',
      }

      setTokenState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        message: mapped.message,
        token: mapped,
      }))

      return mapped
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
      
      // Also do not throw on network error; allow caller to proceed to OAuth
      return undefined
    }
  }, [API_BASE_URL, getAuthHeaders, maskToken, userId])

  const refreshYouTubeToken = useCallback(async (): Promise<YouTubeToken | undefined> => {
    if (!userId) {
      return
    }

    setTokenState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }))

    try {
      const headers = getAuthHeaders()
      const url = `/youtube/get-token`
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
        success: res.data?.success,
        message: res.data?.message,
        hasAccessToken: !!res.data?.data?.access_token,
        expiresAt: res.data?.data?.expires_at,
        tokenType: res.data?.data?.token_type,
        scope: res.data?.data?.scope,
      })

      const success = res.data?.success === true
      const data = res.data?.data || {}
      const hasAccessToken = !!data.access_token

      if (!success || !hasAccessToken) {
        setTokenState(prev => ({ ...prev, isLoading: false, error: 'No YouTube tokens found. Please connect your YouTube account first.', token: null }))
        return undefined
      }

      const mapped: YouTubeToken = {
        status: 'valid',
        message: res.data?.message || 'Token refreshed successfully',
        has_access_token: true,
        has_refresh_token: !!data.refresh_token,
        expires_at: data.expires_at || '',
        token_type: data.token_type || 'Bearer',
        scope: data.scope || '',
        access_token_preview: typeof data.access_token === 'string' ? `${data.access_token.slice(0, 8)}...${data.access_token.slice(-6)}` : '',
      }

      setTokenState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        message: mapped.message,
        token: mapped,
      }))

      return mapped
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
      
      return undefined
    }
  }, [API_BASE_URL, getAuthHeaders, maskToken, userId])

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
