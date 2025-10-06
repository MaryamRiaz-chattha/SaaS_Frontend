"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

function ThankYouContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = searchParams.get('access_token') || searchParams.get('token')
    const user = searchParams.get('user')
    const email = searchParams.get('email')

    if (token) {
      try {
        localStorage.setItem('auth_token', token)
        if (user || email) {
          const minimalUser = {
            id: user || email || 'user',
            email: email || '',
            username: user || '',
            full_name: user || '',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          localStorage.setItem('user_data', JSON.stringify(minimalUser))
        }
      } catch {}
    }

    // Clean URL then redirect to dashboard
    try {
      const url = new URL(window.location.href)
      url.search = ''
      window.history.replaceState({}, '', url.toString())
    } catch {}

    router.replace('/dashboard')
  }, [router, searchParams])

  return (
    <div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4">
      <div className="flex items-center gap-3 text-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Finalizing sign-in...</span>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <ThankYouContent />
    </Suspense>
  )
}


