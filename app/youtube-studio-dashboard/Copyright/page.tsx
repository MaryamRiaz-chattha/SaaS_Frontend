"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CopyrightPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold crypto-text-primary">Channel copyright</h1>
        <Button className="crypto-button-primary text-white border-0">
          New removal request
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-primary">
        <nav className="flex space-x-8">
          <button className="px-1 py-4 crypto-text-primary border-b-2 border-brand-600 font-medium">
            Removal requests
          </button>
        </nav>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        {/* Illustration */}
        <div className="relative">
          <div className="w-48 h-48 bg-brand-400 rounded-full flex items-center justify-center relative">
            <div className="w-32 h-32 bg-brand-300 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-brand-200 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
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
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold crypto-text-primary">Nothing to see yet</p>
          <div className="space-y-2 crypto-text-primary">
            <p>You haven't submitted any copyright takedown requests.</p>
            <p>
              Looking for a copyright claim somebody made on your video?{" "}
              <a href="#" className="crypto-text-secondary hover:underline">Check the video list</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
