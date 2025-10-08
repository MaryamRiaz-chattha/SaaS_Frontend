"use client"

import type { User } from '@/lib/hooks/auth/useAuth'
import axios from 'axios'

export type { User }

// Generate a unique session ID
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// Get the current session ID
export const getSessionId = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("session_id")
}

// Set the session ID
export const setSessionId = (sessionId: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("session_id", sessionId)
}

// Remove the session ID
export const removeSessionId = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("session_id")
}

// Get the active user ID (for session validation)
export const getActiveUserId = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("active_user_id")
}

// Set the active user ID
export const setActiveUserId = (userId: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("active_user_id", userId)
}

// Remove the active user ID
export const removeActiveUserId = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("active_user_id")
}

// Check if there's an active session conflict
export const hasSessionConflict = (currentUserId: string): boolean => {
  const activeUserId = getActiveUserId()
  const sessionId = getSessionId()
  
  // If no active session, no conflict
  if (!activeUserId || !sessionId) return false
  
  // If the current user is different from the active user, there's a conflict
  return activeUserId !== currentUserId
}

// Validate the current session
export const validateSession = (): { valid: boolean; reason?: string } => {
  const token = getAuthToken()
  const userData = getUserData()
  const sessionId = getSessionId()
  const activeUserId = getActiveUserId()
  
  if (!token) {
    return { valid: false, reason: "No authentication token found" }
  }
  
  if (!userData) {
    return { valid: false, reason: "No user data found" }
  }
  
  if (!sessionId) {
    return { valid: false, reason: "No session ID found" }
  }
  
  if (!activeUserId) {
    return { valid: false, reason: "No active user ID found" }
  }
  
  if (activeUserId !== userData.id) {
    return { valid: false, reason: "Session user mismatch - another user may have logged in" }
  }
  
  return { valid: true }
}

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
  const sessionValidation = validateSession()
  return sessionValidation.valid
}

export const logout = (): void => {
  removeAuthToken()
  removeUserData()
  removeSessionId()
  removeActiveUserId()
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
