import { useCallback, useMemo, useState } from 'react'
import axios from 'axios'
import useAuth from '../auth/useAuth'
import { useToast } from './useToast'

const API_BASE_URL = 'https://saas-backend.duckdns.org'

export interface YouTubeToken {
  refresh_token: string;
  id: number;
  token_type: string;
  scope: string;
  refresh_token_expires_in: number | null;
  updated_at: string | null;
  user_id: string;
  access_token: string;
  expires_in: number;
  expires_at: string;
  created_at: string;
}

export default function useTemp() {
  const { getAuthHeaders, user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

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

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }, [])

  const getYouTubeToken = useCallback(async (): Promise<YouTubeToken | undefined> => {
    if (!userId) {
      toast({ title: 'Missing user', description: 'No user id found. Please log in.' })
      return
    }

    setIsLoading(true)
    try {
      const headers = getAuthHeaders()
      const url = `/youtube/status`
      console.log('[YouTube][GET Token] Request', {
        userId,
        url: `${API_BASE_URL}${url}`,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const res = await axiosInstance.get(url, { headers })
      console.log('[YouTube][GET Token] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        access_token_preview: maskToken(res.data?.access_token),
        refresh_token_preview: maskToken(res.data?.refresh_token),
        expires_in: res.data?.expires_in,
        expires_at: res.data?.expires_at,
      })
      toast({ title: 'Fetched YouTube token', description: 'Access token received successfully.' })
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
      toast({ title: 'Failed to fetch token', description })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [API_BASE_URL, axiosInstance, getAuthHeaders, maskToken, toast, userId])

  const refreshYouTubeToken = useCallback(async (): Promise<YouTubeToken | undefined> => {
    if (!userId) {
      toast({ title: 'Missing user', description: 'No user id found. Please log in.' })
      return
    }

    setIsLoading(true)
    try {
      const headers = getAuthHeaders()
      const url = `/youtube/status`
      console.log('[YouTube][Refresh Token] Request', {
        userId,
        url: `${API_BASE_URL}${url}`,
        hasAuthHeader: !!(headers as any)?.Authorization,
        headers: { ...headers, Authorization: (headers as any)?.Authorization ? 'Bearer ***' : undefined },
      })

      const res = await axiosInstance.get(url, { headers })
      console.log('[YouTube][Refresh Token] Response', {
        status: res.status,
        keys: Object.keys(res.data || {}),
        access_token_preview: maskToken(res.data?.access_token),
        refresh_token_preview: maskToken(res.data?.refresh_token),
        expires_in: res.data?.expires_in,
        expires_at: res.data?.expires_at,
      })
      toast({ title: 'Token refreshed', description: 'YouTube access token refreshed.' })
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
      toast({ title: 'Failed to refresh token', description })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [API_BASE_URL, axiosInstance, getAuthHeaders, maskToken, toast, userId])

  return {
    isLoading,
    getYouTubeToken,
    refreshYouTubeToken,
  }
}

//       const res = await axiosInstance.get(url, { headers })
//       console.log('[YouTube][Refresh Token] Response', {
//         status: res.status,
//         keys: Object.keys(res.data || {}),
//         access_token_preview: maskToken(res.data?.access_token),
//         refresh_token_preview: maskToken(res.data?.refresh_token),
//         expires_in: res.data?.expires_in,
//         expires_at: res.data?.expires_at,
//       })
//       toast({ title: 'Token refreshed', description: 'YouTube access token refreshed.' })
//       return res.data
//     } catch (error: any) {
//       if (axios.isAxiosError(error)) {
//         console.error('[YouTube][Refresh Token] Error', {
//           status: error.response?.status,
//           statusText: error.response?.statusText,
//           url: error.config?.url,
//           data: error.response?.data,
//           message: error.message,
//         })
//       } else {
//         console.error('[YouTube][Refresh Token] Error (non-axios)', error)
//       }
//       const description = error?.response?.data?.detail || error?.message || 'Unexpected error'
//       toast({ title: 'Failed to refresh token', description })
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }, [API_BASE_URL, axiosInstance, getAuthHeaders, maskToken, toast, userId])

//   return {
//     isLoading,
//     getYouTubeToken,
//     refreshYouTubeToken,
//   }
// }
