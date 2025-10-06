"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { YouTubeStudioSidebar } from "@/components/YouTubeStudioSidebar"
import { YouTubeStudioHeader } from "@/components/YouTubeStudioHeader"
import { isAuthenticated } from "@/lib/auth"

export default function YouTubeStudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  // Update page title based on current route
  useEffect(() => {
    const updatePageTitle = () => {
      const routeTitles: { [key: string]: string } = {
        '/youtube-studio-dashboard': 'YouTube Studio Dashboard',
        '/youtube-studio-dashboard/Analytics': 'Analytics',
        '/youtube-studio-dashboard/Audio-Library': 'Audio Library',
        '/youtube-studio-dashboard/Community': 'Community',
        '/youtube-studio-dashboard/content': 'Content',
        '/youtube-studio-dashboard/Copyright': 'Copyright',
        '/youtube-studio-dashboard/Customization': 'Customization',
        '/youtube-studio-dashboard/Dashboard': 'Dashboard',
        '/youtube-studio-dashboard/Earn': 'Earn',
        '/youtube-studio-dashboard/Subtitles': 'Subtitles',
      }
      
      const baseTitle = routeTitles[pathname] || 'YouTube Studio'
      document.title = `${baseTitle} - YouTube Automator`
    }

    updatePageTitle()
  }, [pathname])

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login")
      return
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen crypto-gradient-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen crypto-gradient-bg">
      <YouTubeStudioHeader />
      <div className="flex">
        <YouTubeStudioSidebar />
        <main className="flex-1 p-6 lg:p-8 ml-64 crypto-gradient-bg">{children}</main>
      </div>
    </div>
  )
}
