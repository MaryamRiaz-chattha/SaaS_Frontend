import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from '../common/useToast'

const API_BASE_URL = 'https://backend.postsiva.com'

export interface GeminiKeyResponse {
  id: number
  api_key: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface GeminiKeyRequest {
  api_key: string
}

export default function useGemini() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const saveGeminiKey = useCallback(async (apiKey: string): Promise<GeminiKeyResponse | undefined> => {
    if (!apiKey || apiKey.trim() === '') {
      const errorMsg = 'API key is required'
      setError(errorMsg)
      toast({ title: 'Invalid API Key', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = '/gemini-keys/'
      
      console.log('[Gemini][Save Key] Request', {
        url: `${API_BASE_URL}${url}`,
        hasAuthHeader: !!(headers as any)?.Authorization,
        apiKeyLength: apiKey.length,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const requestData: GeminiKeyRequest = {
        api_key: apiKey
      }

      const res = await axiosInstance.post(url, requestData, { headers })
      
      console.log('[Gemini][Save Key] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        id: res.data?.id,
        user_id: res.data?.user_id,
        created_at: res.data?.created_at,
      })

      // Also save to localStorage for immediate use
      localStorage.setItem('gemini_api_key', apiKey)
      
      toast({ 
        title: 'API Key Saved', 
        description: 'Gemini API key saved successfully.' 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to save API key'
      
      if (axios.isAxiosError(error)) {
        console.error('[Gemini][Save Key] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid API key format'
        } else if (error.response?.status === 422) {
          errorMessage = 'Invalid request data. Please check your API key.'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else {
        console.error('[Gemini][Save Key] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to save API key', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const getGeminiKey = useCallback(async (): Promise<GeminiKeyResponse | undefined> => {
    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = '/gemini-keys/'
      
      console.log('[Gemini][Get Key] Request', {
        url: `${API_BASE_URL}${url}`,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const res = await axiosInstance.get(url, { headers })
      
      console.log('[Gemini][Get Key] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        id: res.data?.id,
        user_id: res.data?.user_id,
        hasApiKey: !!res.data?.api_key,
      })

      // Also save to localStorage for immediate use
      if (res.data?.api_key) {
        localStorage.setItem('gemini_api_key', res.data.api_key)
      }
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to retrieve API key'
      
      if (axios.isAxiosError(error)) {
        console.error('[Gemini][Get Key] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 404) {
          errorMessage = 'No API key found. Please save one first.'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else {
        console.error('[Gemini][Get Key] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders])

  const updateGeminiKey = useCallback(async (apiKey: string): Promise<GeminiKeyResponse | undefined> => {
    if (!apiKey || apiKey.trim() === '') {
      const errorMsg = 'API key is required'
      setError(errorMsg)
      toast({ title: 'Invalid API Key', description: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = '/gemini-keys/'
      
      console.log('[Gemini][Update Key] Request', {
        url: `${API_BASE_URL}${url}`,
        hasAuthHeader: !!(headers as any)?.Authorization,
        apiKeyLength: apiKey.length,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const requestData: GeminiKeyRequest = {
        api_key: apiKey
      }

      const res = await axiosInstance.put(url, requestData, { headers })
      
      console.log('[Gemini][Update Key] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        id: res.data?.id,
        user_id: res.data?.user_id,
        updated_at: res.data?.updated_at,
      })

      // Also save to localStorage for immediate use
      localStorage.setItem('gemini_api_key', apiKey)
      
      toast({ 
        title: 'API Key Updated', 
        description: 'Gemini API key updated successfully.' 
      })
      
      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to update API key'
      
      if (axios.isAxiosError(error)) {
        console.error('[Gemini][Update Key] Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid API key format'
        } else if (error.response?.status === 404) {
          errorMessage = 'API key not found. Please create one first.'
        } else if (error.response?.status === 422) {
          errorMessage = 'Invalid request data. Please check your API key.'
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${error.response?.status} ${error.response?.statusText}`
        }
      } else {
        console.error('[Gemini][Update Key] Error (non-axios)', error)
        errorMessage = error.message || 'Network error occurred'
      }
      
      setError(errorMessage)
      toast({ 
        title: 'Failed to update API key', 
        description: errorMessage 
      })
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const deleteGeminiKey = useCallback(async (): Promise<{ success: boolean; message: string } | undefined> => {
    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      const url = '/gemini-keys/'

      console.log('[Gemini][Delete Key] Request', {
        url: `${API_BASE_URL}${url}`,
        hasAuthHeader: !!(headers as any)?.Authorization,
      })

      const res = await axiosInstance.delete(url, { headers })

      // Clear localStorage
      localStorage.removeItem('gemini_api_key')

      toast({ title: 'API Key Deleted', description: 'Gemini API key deleted successfully.' })

      return res.data
    } catch (error: any) {
      let errorMessage = 'Failed to delete API key'
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      }
      setError(errorMessage)
      toast({ title: 'Failed to delete API key', description: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  return {
    isLoading,
    error,
    saveGeminiKey,
    getGeminiKey,
    updateGeminiKey,
    deleteGeminiKey,
  }
}
