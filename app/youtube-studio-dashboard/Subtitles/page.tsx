"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SubtitlesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold crypto-text-primary">Channel subtitles</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-primary">
        <nav className="flex space-x-8">
          <button className="px-1 py-4 crypto-text-primary border-b-2 border-brand-primary font-medium">
            All
          </button>
          <button className="px-1 py-4 crypto-text-secondary hover:crypto-text-primary transition-colors">
            Drafts
          </button>
          <button className="px-1 py-4 crypto-text-secondary hover:crypto-text-primary transition-colors">
            Published
          </button>
        </nav>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-3 gap-4 text-sm crypto-text-secondary border-b border-primary pb-2">
        <div>Video</div>
        <div className="text-center">Languages</div>
        <div className="text-right">Modified on</div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        {/* Illustration */}
        <div className="relative">
          <div className="w-48 h-48 bg-brand-400 rounded-full flex items-center justify-center relative">
            <div className="w-32 h-32 bg-brand-300 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-brand-200 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-brand-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Table and objects */}
          <div className="absolute -bottom-4 -right-4 w-16 h-12 bg-brand-300 rounded-lg border-2 border-brand-500"></div>
          <div className="absolute -bottom-2 -right-8 w-8 h-6 bg-white rounded border-2 border-brand-500"></div>
          <div className="absolute -bottom-6 -right-2 w-4 h-4 bg-white rounded-full border-2 border-brand-500"></div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-xl crypto-text-secondary">No subtitles available</p>
          <p className="text-sm crypto-text-tertiary">Upload videos to get started with subtitles</p>
        </div>

        {/* Call to Action */}
        <Button className="crypto-button-primary border-0 px-8 py-3 text-lg">
          Upload videos
        </Button>
      </div>
    </div>
  )
}
