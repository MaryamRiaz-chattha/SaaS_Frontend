"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Search, Filter, Play, Download } from "lucide-react"

export default function AudioLibraryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold crypto-text-primary">Audio library</h1>
        <Button className="crypto-button-primary text-white border-0">
          <Music className="h-4 w-4 mr-2" />
          Add audio
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 crypto-text-tertiary" />
          <input
            type="text"
            placeholder="Search audio library..."
            className="w-full pl-10 pr-4 py-2 bg-brand-50 border border-primary rounded-lg crypto-text-primary placeholder:crypto-text-tertiary focus:border-brand-500 focus:outline-none"
          />
        </div>
        
        <Button variant="outline" className="bg-brand-50 border-primary crypto-text-primary hover:bg-brand-100">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Audio Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Audio */}
        <Card className="bg-white border-primary crypto-text-primary shadow-sm">
          <CardHeader>
            <CardTitle className="crypto-text-primary">Featured Audio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-brand-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-500 rounded flex items-center justify-center">
                    <Music className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="crypto-text-primary font-medium">Epic Background</p>
                    <p className="text-sm crypto-text-secondary">3:45 • Free to use</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" className="crypto-text-primary hover:bg-brand-100">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="crypto-text-primary hover:bg-brand-100">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-brand-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-500 rounded flex items-center justify-center">
                    <Music className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="crypto-text-primary font-medium">Upbeat Intro</p>
                    <p className="text-sm crypto-text-secondary">2:30 • Free to use</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" className="crypto-text-primary hover:bg-brand-100">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="crypto-text-primary hover:bg-brand-100">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Audio */}
        <Card className="bg-white border-primary crypto-text-primary shadow-sm">
          <CardHeader>
            <CardTitle className="crypto-text-primary">Your Audio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <Music className="h-16 w-16 crypto-text-tertiary mx-auto mb-4" />
              <p className="crypto-text-secondary mb-4">No audio uploaded yet</p>
              <Button className="crypto-button-primary text-white border-0">
                Upload audio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recently Used */}
        <Card className="bg-white border-primary crypto-text-primary shadow-sm">
          <CardHeader>
            <CardTitle className="crypto-text-primary">Recently Used</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <p className="crypto-text-secondary">No recently used audio</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-primary crypto-text-primary shadow-sm">
          <CardHeader>
            <CardTitle className="crypto-text-primary">Audio Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="crypto-text-primary mb-4">
              Learn about YouTube's audio policies and best practices for using music in your videos.
            </p>
            <Button className="crypto-button-primary text-white border-0">
              View guidelines
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-primary crypto-text-primary shadow-sm">
          <CardHeader>
            <CardTitle className="crypto-text-primary">Audio Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="crypto-text-primary mb-4">
              Discover free and licensed audio sources for your content creation needs.
            </p>
            <Button className="crypto-button-primary text-white border-0">
              Browse sources
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
