"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, BarChart3, Play, Clock, Eye, ThumbsUp, MessageCircle } from "lucide-react"

export default function YouTubeStudioDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold crypto-text-primary">Channel dashboard</h1>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="crypto-text-secondary hover:bg-brand-10">
            <Upload className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="crypto-text-secondary hover:bg-brand-10">
            <div className="w-4 h-4 border-2 border-brand-primary rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
            </div>
          </Button>
          <Button variant="ghost" size="sm" className="crypto-text-secondary hover:bg-brand-10">
            <Clock className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Videos Card */}
        <Card className="crypto-card shadow-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              {/* Illustration */}
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-brand-400 rounded-full flex items-center justify-center relative">
                  <div className="w-20 h-20 bg-brand-300 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-brand-200 rounded-full flex items-center justify-center">
                      <Upload className="h-6 w-6 crypto-text-secondary" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="crypto-text-primary">
                  Want to see metrics on your recent video? Upload and publish a video to get started.
                </p>
                <Button className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white border-0">
                  Upload videos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channel Analytics Card */}
        <Card className="crypto-card shadow-sm">
          <CardHeader>
            <CardTitle className="crypto-text-primary">Channel analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm crypto-text-secondary">Current subscribers</p>
              <p className="text-4xl font-bold crypto-text-primary">0</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm crypto-text-secondary">Summary Last 28 days</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="crypto-text-primary">Views</span>
                  <span className="crypto-text-primary">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="crypto-text-primary">Watch time (hours)</span>
                  <span className="crypto-text-primary">0.0</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm crypto-text-secondary">Top videos Last 48 hours · Views</p>
              <div className="h-px bg-brand-200"></div>
            </div>
            
            <Button className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white border-0">
              Go to channel analytics
            </Button>
          </CardContent>
        </Card>

        {/* Creator Insider Card */}
        <Card className="crypto-card shadow-sm">
          <CardHeader>
            <CardTitle className="crypto-text-primary">Creator Insider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Thumbnail */}
            <div className="relative">
              <div className="w-full h-32 crypto-primary-gradient rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-lg font-bold">THIS WEEK AT YOUTUBE</p>
                  <p className="text-sm opacity-80">CREATOR INSIDER</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold crypto-text-primary">This Week at YouTube</h4>
              <p className="text-sm crypto-text-primary">
                Today's topics: Post image limit increase, YouTube Promote improvements for websites, and the ability to edit videos with auto-dubbed tracks.
              </p>
            </div>
            
            <Button className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white border-0">
              Watch on YouTube
            </Button>
          </CardContent>
        </Card>

        {/* Latest Post Card */}
        <Card className="crypto-card shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="crypto-text-primary">Latest post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div>
                <p className="crypto-text-primary font-medium">For Python</p>
                <p className="text-sm crypto-text-secondary">Jan 13, 2025</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="crypto-text-primary">Tahir bhai Thank you</p>
              <p className="crypto-text-primary">May your days be filled with light,</p>
              <p className="crypto-text-primary">Guided by stars through the darkest night...</p>
            </div>
            
            {/* Embedded Video */}
            <div className="border border-primary rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-20 h-16 bg-brand-100 rounded flex items-center justify-center relative">
                  <Play className="h-6 w-6 crypto-text-secondary" />
                  <span className="absolute bottom-1 right-1 text-xs text-white bg-brand-primary px-1 rounded">1:06:43</span>
                </div>
                <div className="flex-1">
                  <p className="crypto-text-primary font-medium">Next.js with Tailwind CSS: Hero Section Tutorial</p>
                  <p className="text-sm crypto-text-secondary">motivation2code</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm crypto-text-secondary">
              <span>Likes 0</span>
              <span>Comments 0</span>
            </div>
            
            <Button className="bg-brand-primary hover:bg-brand-primary-dark text-white border-0">
              Go to Posts tab
            </Button>
          </CardContent>
        </Card>

        {/* What's New Card */}
        <Card className="crypto-card shadow-sm">
          <CardHeader>
            <CardTitle className="crypto-text-primary">What's new in Studio</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm crypto-text-primary">
              <li>• Increasing Shorts length</li>
              <li>• Expansion of channel permissions</li>
              <li>• Upcoming changes to Community Guidelines warnings</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-primary">
        <div className="flex items-center justify-center space-x-6 text-sm crypto-text-secondary">
          <a href="#" className="hover:crypto-text-primary transition-colors">Terms of use</a>
          <a href="#" className="hover:crypto-text-primary transition-colors">Privacy policy</a>
          <a href="#" className="hover:crypto-text-primary transition-colors">Policies & Safety</a>
        </div>
      </div>
    </div>
  )
}
