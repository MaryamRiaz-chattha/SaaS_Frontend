"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function VideoRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const videoId = params.slug

  useEffect(() => {
    // Redirect to the correct video details page
    if (videoId) {
      router.replace(`/dashboard/videos/${videoId}`)
    } else {
      router.replace('/dashboard/videos')
    }
  }, [videoId, router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to video details...</p>
      </div>
    </div>
  )
}
