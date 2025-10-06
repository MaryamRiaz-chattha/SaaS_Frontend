"use client"

import DashboardOverview from '@/components/dashboard/overview/DashboardOverview'
import React from 'react'
import useYouTubeCredentialGuard from '@/lib/hooks/youtube/useYouTubeCredentialGuard'

export default function page() {
  // Guard: if user lacks YouTube credentials, redirect to connect page
  useYouTubeCredentialGuard({ redirectTo: '/auth/youtube-connect', allowBypass: false })
  return (
    <div>
      <DashboardOverview />
    </div>
  )
}
