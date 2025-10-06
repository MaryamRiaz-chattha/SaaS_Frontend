import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

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

const API_BASE_URL = 'https://saas-backend.duckdns.org'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: config.data,
    })
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    })
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    })
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

  // Initialize auth state from localStorage
  useEffect(() => {
    console.log('🔄 Initializing auth state from localStorage...')
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('user_data')
    
    console.log('📦 localStorage data:', { token: token ? 'exists' : 'not found', user: user ? 'exists' : 'not found' })
    
    if (token && user) {
      try {
        const userData = JSON.parse(user)
        console.log('👤 Parsed user data:', userData)
        setAuthState({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
        console.log('✅ Auth state initialized successfully')
      } catch (error) {
        console.error('❌ Error parsing user data:', error)
        logout()
      }
    } else {
      console.log('ℹ️ No auth data found, setting as unauthenticated')
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const signup = useCallback(async (data: SignupData): Promise<SignupResponse> => {
    console.log('📝 Starting signup process with data:', { ...data, password: '[REDACTED]' })
    
    try {
      const requestData = {
        ...data,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      console.log('📤 Sending signup request with data:', { ...requestData, password: '[REDACTED]' })
      
      const response = await api.post('/auth/signup', requestData)
      
      console.log('✅ Signup successful:', response.data)
      
      // Save user ID to localStorage
      localStorage.setItem('user_id', response.data.id)
      console.log('💾 Saved user ID to localStorage:', response.data.id)
      
      return response.data
    } catch (error: any) {
      console.error('❌ Signup failed:', error)
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || `Signup failed: ${error.response?.status}`
        console.error('📋 Error details:', {
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
    console.log('🔐 Starting login process with email:', data.email)
    
    try {
      console.log('📤 Sending login request...')
      
      const response = await api.post('/auth/login', data)
      
      console.log('✅ Login successful:', {
        token: response.data.access_token ? 'exists' : 'not found',
        user: response.data.user,
      })
      
      // Save auth data to localStorage
      localStorage.setItem('auth_token', response.data.access_token)
      localStorage.setItem('user_data', JSON.stringify(response.data.user))
      console.log('💾 Saved auth data to localStorage')
      
      // Update auth state
      setAuthState({
        user: response.data.user,
        token: response.data.access_token,
        isAuthenticated: true,
        isLoading: false,
      })
      console.log('🔄 Updated auth state to authenticated')
      
      return response.data
    } catch (error: any) {
      console.error('❌ Login failed:', error)
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || `Login failed: ${error.response?.status}`
        console.error('📋 Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        })
        throw new Error(errorMessage)
      } else {
        throw new Error('Login failed due to network error')
      }
    }
  }, [])

  const logout = useCallback(() => {
    // Clear all localStorage items related to the application
    const itemsToRemove = [
      'auth_token',
      'user_data', 
      'user_id',
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
          key.includes('credential')) {
        localStorage.removeItem(key)
      }
    })
    
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
    
    console.log('🔑 Generated auth headers:', { hasToken: !!token, headers })
    return headers
  }, [])

  const fetchWithAuth = useCallback(async (url: string, options: any = {}) => {
    console.log('🌐 Making authenticated request to:', url)
    
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
      
      console.log('✅ Authenticated request successful:', {
        status: response.status,
        url,
      })
      
      return response
    } catch (error: any) {
      console.error('❌ Authenticated request failed:', error)
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('🔒 Unauthorized response, logging out...')
        logout()
      }
      
      throw error
    }
  }, [getAuthHeaders, logout])

  // Log current auth state when it changes
  useEffect(() => {
    console.log('🔄 Auth state updated:', {
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      hasUser: !!authState.user,
      hasToken: !!authState.token,
      user: authState.user ? { id: authState.user.id, email: authState.user.email, username: authState.user.username } : null,
    })
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
