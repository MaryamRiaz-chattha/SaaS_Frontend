import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useYouTubeCredentials from './useYouTubeCredentials'
import useAuth from '../auth/useAuth'

export interface YouTubeCredentialGuardOptions {
  redirectTo?: string
  showToast?: boolean
  allowBypass?: boolean
}

export default function useYouTubeCredentialGuard(options: YouTubeCredentialGuardOptions = {}) {
  const {
    redirectTo = '/auth/youtube-connect',
    showToast = true,
    allowBypass = false
  } = options

  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const {
    isChecking,
    hasCredentials,
    credentials,
    error: credentialsError,
    checkYouTubeCredentials
  } = useYouTubeCredentials()

  // Check if the guard should allow access
  const shouldAllowAccess = () => {
    // Always allow if bypassing is enabled
    if (allowBypass) return true
    
    // Allow if user is not authenticated (will be handled by auth guard)
    if (!isAuthenticated) return true
    
    // Allow if we're still checking credentials
    if (isChecking) return true
    
    // Allow if user has valid YouTube credentials
    if (hasCredentials && credentials) return true
    
    // Block access if no credentials found (excluding 404 errors which are expected)
    return false
  }

  const shouldRedirect = () => {
    // Don't redirect if we're already on the YouTube connect page
    if (typeof window !== 'undefined' && window.location.pathname === redirectTo) {
      return false
    }
    
    // Don't redirect if user is not authenticated
    if (!isAuthenticated) return false
    
    // Don't redirect if we're still checking
    if (isChecking) return false
    
    // Don't redirect if bypassing is allowed
    if (allowBypass) return false
    
    // Redirect whenever credentials are not confirmed, regardless of error type
    // Any error or negative check means we require the user to connect YouTube
    return !hasCredentials
  }

  // Auto-check credentials when the guard is used
  useEffect(() => {
    if (isAuthenticated && !hasCredentials && !isChecking && !credentialsError) {
      console.log('🔒 YouTube Credential Guard: Auto-checking credentials...')
      checkYouTubeCredentials(false)
    }
  }, [isAuthenticated, hasCredentials, isChecking, credentialsError, checkYouTubeCredentials])

  // Handle redirection
  useEffect(() => {
    if (shouldRedirect()) {
      console.log('🔒 YouTube Credential Guard: Redirecting to YouTube connect page...')
      console.log('Guard State:', {
        isAuthenticated,
        hasCredentials,
        isChecking,
        credentials,
        credentialsError,
        redirectTo
      })
      
      // Store the current page for potential redirect back after OAuth
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search
        localStorage.setItem('youtube_redirect_after_auth', currentPath)
      }
      
      router.push(redirectTo)
    }
  }, [
    router,
    redirectTo,
    isAuthenticated,
    hasCredentials,
    isChecking,
    credentialsError,
    shouldRedirect
  ])

  return {
    // State
    isChecking,
    hasCredentials,
    credentials,
    credentialsError,
    shouldAllowAccess: shouldAllowAccess(),
    
    // Actions
    checkYouTubeCredentials,
    
    // Helper methods
    redirectToYouTubeConnect: () => router.push(redirectTo),
  }
}
