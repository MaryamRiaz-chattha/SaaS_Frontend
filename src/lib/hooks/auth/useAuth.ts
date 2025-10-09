import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { 
  generateSessionId, 
  setSessionId, 
  removeSessionId,
  setActiveUserId,
  removeActiveUserId,
  hasSessionConflict,
  validateSession,
  getSessionId,
  getActiveUserId
} from '@/lib/auth'

export interface User {
  id: string
  email: string
  username: string
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface SignupData {
  email: string
  username: string
  full_name: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface SignupResponse {
  email: string
  username: string
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
  id: string
}

const API_BASE_URL = 'https://backend.postsiva.com'
const DEBUG_LOGS = false

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add request interceptor (quiet)
api.interceptors.request.use(
  (config) => {
    if (DEBUG_LOGS) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
        data: config.data,
      })
    }
    return config
  },
  (error) => {
    if (DEBUG_LOGS) console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor (quiet)
api.interceptors.response.use(
  (response) => {
    if (DEBUG_LOGS) {
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      })
    }
    return response
  },
  (error) => {
    if (DEBUG_LOGS) {
      console.error('❌ API Response Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
      })
    }
    return Promise.reject(error)
  }
)

export default function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Initialize auth state from localStorage with session validation
  useEffect(() => {
    if (DEBUG_LOGS) console.log('🔄 Initializing auth state from localStorage...')
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('user_data')
    
    if (DEBUG_LOGS) console.log('📦 localStorage data:', { 
      token: token ? 'exists' : 'not found', 
      user: user ? 'exists' : 'not found',
      sessionId: getSessionId() ? 'exists' : 'not found',
      activeUserId: getActiveUserId() ? 'exists' : 'not found'
    })
    
    if (token && user) {
      try {
        const userData = JSON.parse(user)
        if (DEBUG_LOGS) console.log('👤 Parsed user data:', userData)
        
        // Validate session
        const sessionValidation = validateSession()
        
        if (!sessionValidation.valid) {
          console.warn('⚠️ Session validation failed:', sessionValidation.reason)
          console.warn('🔒 Forcing logout due to invalid session')
          logout()
          return
        }
        
        if (DEBUG_LOGS) console.log('✅ Session validation successful')
        
        setAuthState({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
        if (DEBUG_LOGS) console.log('✅ Auth state initialized successfully')
      } catch (error) {
        if (DEBUG_LOGS) console.error('❌ Error parsing user data:', error)
        logout()
      }
    } else {
      if (DEBUG_LOGS) console.log('ℹ️ No auth data found, setting as unauthenticated')
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const signup = useCallback(async (data: SignupData): Promise<SignupResponse> => {
    if (DEBUG_LOGS) console.log('📝 Starting signup process with data:', { ...data, password: '[REDACTED]' })
    
    try {
      const requestData = {
        ...data,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      if (DEBUG_LOGS) console.log('📤 Sending signup request with data:', { ...requestData, password: '[REDACTED]' })
      
      const response = await api.post('/auth/signup', requestData)
      
      if (DEBUG_LOGS) console.log('✅ Signup successful:', response.data)
      
      // Save user ID to localStorage
      localStorage.setItem('user_id', response.data.id)
      console.log('💾 Saved user ID to localStorage:', response.data.id)
      
      return response.data
    } catch (error: any) {
      if (DEBUG_LOGS) console.error('❌ Signup failed:', error)
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || `Signup failed: ${error.response?.status}`
        if (DEBUG_LOGS) console.error('📋 Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        })
        throw new Error(errorMessage)
      } else {
        throw new Error('Signup failed due to network error')
      }
    }
  }, [])

  const login = useCallback(async (data: LoginData): Promise<AuthResponse> => {
    if (DEBUG_LOGS) console.log('🔐 Starting login process with email:', data.email)
    
    // Check if there's already an active session
    const existingToken = localStorage.getItem('auth_token')
    const existingUser = localStorage.getItem('user_data')
    
    if (existingToken && existingUser) {
      try {
        const existingUserData = JSON.parse(existingUser)
        
        // Check if trying to login with a different account
        if (existingUserData.email !== data.email) {
          console.warn('⚠️ Attempting to login with different account while already logged in')
          console.warn(`⚠️ Current user: ${existingUserData.email}, New login: ${data.email}`)
          
          // Force logout of existing session
          console.log('🔒 Forcing logout of existing session before new login')
          removeSessionId()
          removeActiveUserId()
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_data')
          localStorage.removeItem('user_id')
        }
      } catch (error) {
        console.error('❌ Error checking existing session:', error)
      }
    }
    
    try {
      if (DEBUG_LOGS) console.log('📤 Sending login request...')
      
      const response = await api.post('/auth/login', data)
      
      if (DEBUG_LOGS) console.log('✅ Login successful:', {
        token: response.data.access_token ? 'exists' : 'not found',
        user: response.data.user,
      })
      
      // Generate new session ID
      const newSessionId = generateSessionId()
      console.log('🆔 Generated new session ID:', newSessionId)
      
      // Save auth data to localStorage
      localStorage.setItem('auth_token', response.data.access_token)
      localStorage.setItem('user_data', JSON.stringify(response.data.user))
      
      // Save session data
      setSessionId(newSessionId)
      setActiveUserId(response.data.user.id)
      
      if (DEBUG_LOGS) console.log('💾 Saved auth data and session to localStorage')
      
      // Update auth state
      setAuthState({
        user: response.data.user,
        token: response.data.access_token,
        isAuthenticated: true,
        isLoading: false,
      })
      if (DEBUG_LOGS) console.log('🔄 Updated auth state to authenticated')

      // Quietly fetch and cache Gemini API key (non-blocking, ignore errors)
      ;(async () => {
        try {
          const headers = getAuthHeaders()
          const res = await api.get('/gemini-keys/', { headers })
          const data = res?.data as any
          if (data) {
            if (data.api_key_preview) {
              localStorage.setItem('gemini_api_key_preview', String(data.api_key_preview))
            }
            localStorage.setItem('has_gemini_key', String(!!(data.api_key_preview || data.is_active)))
            if (DEBUG_LOGS) console.log('🔑 Cached Gemini key presence from server')
          } else {
            // Explicitly clear presence when API returns null
            localStorage.setItem('has_gemini_key', 'false')
            localStorage.removeItem('gemini_api_key_preview')
            if (DEBUG_LOGS) console.log('ℹ️ No Gemini key found (null)')
          }
        } catch (e) {
          if (DEBUG_LOGS) console.warn('⚠️ Gemini key fetch failed (ignored)')
        }
      })()
      
      return response.data
    } catch (error: any) {
      if (DEBUG_LOGS) console.error('❌ Login failed:', error)
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        let errorMessage = 'Login failed. Please try again.'
        if (status === 401) errorMessage = 'Invalid email or password.'
        else if (status === 429) errorMessage = 'Too many attempts. Please wait and try again.'
        else if (status === 500) errorMessage = 'Server error during login. Please try again later.'
        else if (error.response?.data?.detail) errorMessage = String(error.response.data.detail)
        if (DEBUG_LOGS) console.error('📋 Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        })
        throw new Error(errorMessage)
      } else {
        throw new Error('Network error. Please check your connection and try again.')
      }
    }
  }, [])

  const logout = useCallback(() => {
    console.log('🔓 Logging out user...')
    
    // Clear session data first
    removeSessionId()
    removeActiveUserId()
    
    // Clear all localStorage items related to the application
    const itemsToRemove = [
      'auth_token',
      'user_data', 
      'user_id',
      'session_id',
      'active_user_id',
      'gemini_api_key',
      'current_video_data',
      'current_video_id',
      'youtube_redirect_after_auth'
    ]
    
    itemsToRemove.forEach(item => {
      localStorage.removeItem(item)
    })
    
    // Also clear any other localStorage items that might be app-related
    // This is a more thorough cleanup
    const allKeys = Object.keys(localStorage)
    allKeys.forEach(key => {
      // Remove any keys that might be related to our app
      if (key.includes('auth') || 
          key.includes('user') || 
          key.includes('token') || 
          key.includes('video') || 
          key.includes('youtube') || 
          key.includes('gemini') ||
          key.includes('credential') ||
          key.includes('session')) {
        localStorage.removeItem(key)
      }
    })
    
    console.log('✅ Cleared all session and auth data')
    
    // Reset auth state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  }, [])

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('auth_token')
    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
        }
    
    if (DEBUG_LOGS) console.log('🔑 Generated auth headers:', { hasToken: !!token, headers })
    return headers
  }, [])

  const fetchWithAuth = useCallback(async (url: string, options: any = {}) => {
    if (DEBUG_LOGS) console.log('🌐 Making authenticated request to:', url)
    
    const authHeaders = getAuthHeaders()
    
    try {
      const response = await axios({
        url,
        method: options.method || 'GET',
        data: options.body || options.data,
        headers: {
          ...authHeaders,
          ...options.headers,
        },
      })
      
      if (DEBUG_LOGS) console.log('✅ Authenticated request successful:', {
        status: response.status,
        url,
      })
      
      return response
    } catch (error: any) {
      if (DEBUG_LOGS) console.error('❌ Authenticated request failed:', error)
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        if (DEBUG_LOGS) console.log('🔒 Unauthorized response, logging out...')
        logout()
      }
      
      throw error
    }
  }, [getAuthHeaders, logout])

  // Log current auth state when it changes
  useEffect(() => {
    if (DEBUG_LOGS) {
      console.log('🔄 Auth state updated:', {
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        hasUser: !!authState.user,
        hasToken: !!authState.token,
        user: authState.user ? { id: authState.user.id, email: authState.user.email, username: authState.user.username } : null,
      })
    }
  }, [authState])

  return {
    ...authState,
    signup,
    login,
    logout,
    getAuthHeaders,
    fetchWithAuth,
  }
}
