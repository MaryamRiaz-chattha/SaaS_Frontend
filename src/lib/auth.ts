"use client"

import type { User } from '@/lib/hooks/auth/useAuth'
import axios from 'axios'

export type { User }

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("auth_token", token)
}

export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth_token")
}

export const getUserData = (): User | null => {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem("user_data")
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export const setUserData = (user: User): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("user_data", JSON.stringify(user))
}

export const removeUserData = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("user_data")
}

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null && getUserData() !== null
}

export const logout = (): void => {
  removeAuthToken()
  removeUserData()
  localStorage.removeItem("user_id")
  window.location.href = "/auth/login"
}

export const getAuthHeaders = () => {
  const token = getAuthToken()
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      }
}

export const fetchWithAuth = async (url: string, options: any = {}) => {
  const headers = getAuthHeaders()

  try {
    const response = await axios({
      url,
      method: options.method || 'GET',
      data: options.body || options.data,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    return response
  } catch (error: any) {
    // If unauthorized, redirect to login
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      logout()
    }
    throw error
  }
}
