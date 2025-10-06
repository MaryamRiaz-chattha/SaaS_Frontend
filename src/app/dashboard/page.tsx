"use client"

import DashboardOverview from '@/components/dashboard/overview/DashboardOverview'
import React from 'react'
import useYouTubeCredentialGuard from '@/lib/hooks/youtube/useYouTubeCredentialGuard'

export default function page() {
  // Guard: if user lacks YouTube credentials, redirect to connect page
  const { shouldAllowAccess } = useYouTubeCredentialGuard({ redirectTo: '/auth/youtube-connect', allowBypass: false })

  if (!shouldAllowAccess) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  return (
    <div>
      <DashboardOverview />
    </div>
  )
}
