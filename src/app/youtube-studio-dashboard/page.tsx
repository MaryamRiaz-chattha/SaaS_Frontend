"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function YouTubeStudioPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/youtube-studio-dashboard/Dashboard")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen crypto-gradient-bg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
        <p className="crypto-text-primary">Redirecting to YouTube Studio Dashboard...</p>
      </div>
    </div>
  )
}
