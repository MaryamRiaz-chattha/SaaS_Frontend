import { useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from '../common/useToast'

interface CreateCredentialsData {
  client_id: string
  client_secret: string
}

interface CreateCredentialsResponse {
  message: string
  credentials_id?: number
}

export default function useCreateYouTubeCredentials() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCredentials = useCallback(async (data: CreateCredentialsData) => {
    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()
      
      console.log('🔑 Creating YouTube credentials:', {
        client_id: data.client_id,
        client_secret: data.client_secret ? '***' : 'missing'
      })

      const response = await axios.post<CreateCredentialsResponse>(
        'https://saas-backend.duckdns.org/youtube-credentials/',
        data,
        { headers }
      )

      console.log('✅ YouTube credentials created successfully:', response.data)
      
      toast({
        title: 'Credentials Created',
        description: 'YouTube credentials have been saved successfully.',
        variant: 'default'
      })

      return response.data
    } catch (err: any) {
      console.error('❌ Failed to create YouTube credentials:', err)
      
      let errorMessage = 'Failed to create YouTube credentials'
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          errorMessage = 'Invalid client ID or client secret'
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        } else if (err.response?.status === 409) {
          errorMessage = 'Credentials already exist for this user'
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Request failed: ${err.response?.status} ${err.response?.statusText}`
        }
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
      
      toast({
        title: 'Creation Failed',
        description: errorMessage,
        variant: 'destructive'
      })

      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, toast])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    createCredentials,
    isLoading,
    error,
    clearError
  }
}
