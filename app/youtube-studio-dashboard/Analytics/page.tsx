"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Info } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold crypto-text-primary">Channel analytics</h1>
        <Button className="crypto-button-primary">
          Advanced mode
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-primary">
        <nav className="flex space-x-8">
          <button className="px-1 py-4 crypto-text-primary border-b-2 border-brand-primary font-medium">
            Overview
          </button>
          <button className="px-1 py-4 crypto-text-secondary hover:crypto-text-primary transition-colors">
            Content
          </button>
          <button className="px-1 py-4 crypto-text-secondary hover:crypto-text-primary transition-colors">
            Audience
          </button>
          <button className="px-1 py-4 crypto-text-secondary hover:crypto-text-primary transition-colors">
            Trends
          </button>
        </nav>
      </div>

      {/* Date Range and Main Message */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-2xl font-bold crypto-text-primary">Your channel didn't get any views in the last 28 days</p>
        </div>
        <div className="text-right">
          <p className="text-sm crypto-text-secondary">Jul 29 – Aug 25, 2025</p>
          <div className="flex items-center space-x-2">
            <span className="crypto-text-primary font-medium">Last 28 days</span>
            <ChevronDown className="h-4 w-4 crypto-text-secondary" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="crypto-card">
          <CardContent className="p-6 text-center">
            <p className="text-sm crypto-text-secondary mb-2">Views</p>
            <p className="text-3xl font-bold crypto-text-primary">—</p>
          </CardContent>
        </Card>
        
        <Card className="crypto-card">
          <CardContent className="p-6 text-center">
            <p className="text-sm crypto-text-secondary mb-2">Watch time (hours)</p>
            <p className="text-3xl font-bold crypto-text-primary">—</p>
          </CardContent>
        </Card>
        
        <Card className="crypto-card">
          <CardContent className="p-6 text-center">
            <p className="text-sm crypto-text-secondary mb-2">Subscribers</p>
            <p className="text-3xl font-bold crypto-text-primary">—</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Area */}
      <Card className="crypto-card">
        <CardContent className="p-6">
          <div className="h-64 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm crypto-text-secondary">
              <span>3</span>
              <span>2</span>
              <span>1</span>
              <span>0</span>
            </div>
            
            {/* Chart area */}
            <div className="ml-8 h-full relative">
              {/* Horizontal line at 0 */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-brand-400"></div>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm crypto-text-secondary">
                <span>Jul 29, 2025</span>
                <span>Aug 3, 2025</span>
                <span>Aug 7, 2025</span>
                <span>Aug 12, 2025</span>
                <span>Aug 16, 2025</span>
                <span>Aug 21, 2025</span>
                <span>Aug 25,...</span>
              </div>
            </div>
            
            {/* See more button */}
            <Button className="absolute bottom-4 left-0 crypto-button-primary">
              See more
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right Sidebar - Realtime */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Content area for additional charts */}
        </div>
        
        <Card className="crypto-card">
          <CardHeader>
            <CardTitle className="crypto-text-primary">Realtime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
              <span className="text-sm crypto-text-secondary">Updating live</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold crypto-text-primary">—</span>
                <span className="text-sm crypto-text-secondary">Subscribers</span>
              </div>
              <Button className="w-full crypto-button-primary">
                See live count
              </Button>
            </div>
            
            <div className="space-y-2 pt-4 border-t border-primary">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold crypto-text-primary">0</span>
                  <span className="text-sm crypto-text-secondary">Views · Last 48 hours</span>
                </div>
                <span className="text-sm crypto-text-secondary">Now</span>
              </div>
              <Button className="w-full crypto-button-primary">
                See more
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
