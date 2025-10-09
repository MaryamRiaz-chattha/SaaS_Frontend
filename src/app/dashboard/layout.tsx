"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { DashboardHeader } from "@/components/DashboardHeader"
import { SessionMonitor } from "@/components/SessionMonitor"
import { useAuth } from "@/lib/hooks/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  // Update page title based on current route
  useEffect(() => {
    const updatePageTitle = () => {
      const routeTitles: { [key: string]: string } = {
        '/dashboard': 'Dashboard Overview',
        '/dashboard/upload': 'Upload Video',
        '/dashboard/videos': 'YouTube Videos',
        '/dashboard/playlists': 'YouTube Playlists',
        '/dashboard/user-settings': 'Settings',
      }
      
      const baseTitle = routeTitles[pathname] || 'Dashboard'
      document.title = `${baseTitle} - YouTube Automator`
    }

    updatePageTitle()
  }, [pathname])

  useEffect(() => {
    console.log('🏠 Dashboard Layout useEffect triggered');
    console.log('🔐 Authentication status:', isAuthenticated);
    console.log('🔄 Auth loading status:', authLoading);
    console.log('🎫 Token exists:', !!localStorage.getItem('auth_token'));
    console.log('👤 User data exists:', !!localStorage.getItem('user_data'));
    
    if (!authLoading && !isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login');
      router.push("/auth/login")
      return
    }
    
    if (!authLoading && isAuthenticated) {
      console.log('✅ Authenticated, setting loading to false');
      setIsLoading(false)
    }
  }, [isAuthenticated, authLoading, router])

  console.log('🏠 Dashboard Layout render - isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="sr-only">Loading dashboard...</span>
        <div className="rounded-full">
          <span className="inline-block animate-spin rounded-full" style={{ width: 24, height: 24, borderWidth: 3, borderColor: "var(--brand-primary) transparent transparent transparent" }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen crypto-gradient-bg">
      {/* Session Monitor - monitors for concurrent logins */}
      <SessionMonitor />
      
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 crypto-navbar">
        <DashboardHeader />
      </div>
      
      {/* Main Content Area */}
      <div className="flex pt-16 h-screen"> {/* Full height container */}
        <Sidebar />
        <main className="flex-1 w-full min-w-0 p-3 sm:p-4 lg:p-6 xl:p-8 lg:ml-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}