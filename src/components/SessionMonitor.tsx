"use client"

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { validateSession, logout } from '@/lib/auth'
import { useToast } from '@/lib/hooks/common/useToast'

export function SessionMonitor() {
  const router = useRouter()
  const { toast } = useToast()
  const lastValidationRef = useRef<number>(Date.now())
  const conflictDetectedRef = useRef<boolean>(false)

  useEffect(() => {
    // Skip on server side
    if (typeof window === 'undefined') return

    console.log('🔍 Session monitor initialized')

    // Check session validity every 5 seconds
    const intervalId = setInterval(() => {
      const now = Date.now()
      
      // Only validate if at least 5 seconds have passed
      if (now - lastValidationRef.current < 5000) {
        return
      }

      lastValidationRef.current = now

      // Validate session
      const sessionValidation = validateSession()

      if (!sessionValidation.valid && !conflictDetectedRef.current) {
        console.error('⚠️ Session validation failed:', sessionValidation.reason)
        
        // Only show toast and logout if we haven't already detected a conflict
        if (!conflictDetectedRef.current) {
          conflictDetectedRef.current = true
          
          toast({
            title: "Session Expired",
            description: sessionValidation.reason || "Your session has expired. Please login again.",
            variant: "destructive",
          })

          console.log('🔒 Logging out due to invalid session')
          
          // Delay logout slightly to ensure toast is shown
          setTimeout(() => {
            logout()
          }, 1000)
        }
      }
    }, 5000) // Check every 5 seconds

    // Listen for storage events (session changes in other tabs)
    const handleStorageChange = (event: StorageEvent) => {
      // Check if auth-related storage changed
      if (
        event.key === 'auth_token' ||
        event.key === 'user_data' ||
        event.key === 'session_id' ||
        event.key === 'active_user_id'
      ) {
        console.log('📢 Storage change detected:', event.key)
        
        // Revalidate session
        const sessionValidation = validateSession()
        
        if (!sessionValidation.valid && !conflictDetectedRef.current) {
          console.warn('⚠️ Session invalidated by storage change:', sessionValidation.reason)
          conflictDetectedRef.current = true
          
          toast({
            title: "Session Conflict Detected",
            description: "Another account has logged in. You will be logged out.",
            variant: "destructive",
          })

          setTimeout(() => {
            logout()
          }, 1500)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      console.log('🔍 Session monitor cleaned up')
      clearInterval(intervalId)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [router, toast])

  // This component doesn't render anything
  return null
}
