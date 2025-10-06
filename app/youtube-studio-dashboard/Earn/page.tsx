"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Lock, Info } from "lucide-react"

export default function EarnPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold crypto-text-primary">Earn on YouTube</h1>
      </div>

      {/* Next Milestone Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <p className="crypto-text-secondary">Next milestone</p>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold crypto-text-primary">Start your earning journey</h2>
            <Lock className="h-5 w-5 crypto-text-secondary" />
          </div>
          <p className="crypto-text-primary">
            Earn income by showing ads and connecting with your fans, and gain access to creator tools and support
          </p>
        </div>

        {/* After You Apply Box */}
        <Card className="bg-white border-primary crypto-text-primary shadow-sm">
          <CardHeader>
            <CardTitle className="crypto-text-primary">After you apply</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm crypto-text-primary">
              We'll check if your channel follows YouTube's{" "}
              <a href="#" className="crypto-text-secondary hover:underline">monetization policies</a>. 
              If everything looks good, you're in!
            </p>
            <Button className="w-full crypto-button-primary text-white border-0">
              Learn more
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Earning Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold crypto-text-primary">Earning methods</h3>
        
        {/* Watch Page Ads - Expanded */}
        <Card className="bg-white border-primary crypto-text-primary shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h4 className="text-lg font-semibold crypto-text-primary">Watch Page Ads</h4>
                <ChevronUp className="h-5 w-5 crypto-text-secondary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-lg font-semibold crypto-text-primary">Earn from ads & YouTube Premium on the Watch Page</p>
                <p className="crypto-text-primary">
                  You can earn from ads on or around your videos and from YouTube Premium subscribers watching your videos on the Watch Page
                </p>
              </div>
              <div className="flex justify-center">
                {/* Illustration */}
                <div className="w-32 h-24 bg-brand-400 rounded-lg flex items-center justify-center relative">
                  <div className="w-24 h-16 bg-brand-300 rounded-lg flex items-center justify-center">
                    <div className="w-16 h-8 bg-brand-200 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-4 bg-brand-100 rounded-lg"></div>
                    </div>
                  </div>
                  {/* Wheels */}
                  <div className="absolute -bottom-2 left-4 w-4 h-4 bg-black rounded-full"></div>
                  <div className="absolute -bottom-2 right-4 w-4 h-4 bg-black rounded-full"></div>
                  {/* Smoke */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full opacity-60"></div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-40"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shorts Feed Ads - Collapsed */}
        <Card className="bg-white border-primary crypto-text-primary shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold crypto-text-primary">Shorts Feed Ads</h4>
              <ChevronDown className="h-5 w-5 crypto-text-secondary" />
            </div>
          </CardHeader>
        </Card>

        {/* Memberships - Collapsed */}
        <Card className="bg-white border-primary crypto-text-primary shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold crypto-text-primary">Memberships</h4>
              <ChevronDown className="h-5 w-5 crypto-text-secondary" />
            </div>
          </CardHeader>
        </Card>

        {/* Supers - Collapsed */}
        <Card className="bg-white border-primary crypto-text-primary shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold crypto-text-primary">Supers</h4>
              <ChevronDown className="h-5 w-5 crypto-text-secondary" />
            </div>
          </CardHeader>
        </Card>

        {/* Shopping - Collapsed */}
        <Card className="bg-white border-primary crypto-text-primary shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold crypto-text-primary">Shopping</h4>
              <ChevronDown className="h-5 w-5 crypto-text-secondary" />
            </div>
          </CardHeader>
        </Card>

        <p className="text-sm crypto-text-secondary">
          Some benefits may have additional eligibility criteria.
        </p>
      </div>

      {/* Eligibility Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold crypto-text-primary">Eligibility</h3>
        
        <div className="flex items-center space-x-2 text-sm crypto-text-secondary">
          <span>Showing data as of: Aug 21, 2025</span>
          <Info className="h-4 w-4" />
        </div>

        {/* Subscriber Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="crypto-text-secondary">0 subscribers</span>
            <span className="crypto-text-secondary">1,000</span>
          </div>
          <div className="w-full bg-brand-200 rounded-full h-2">
            <div className="bg-brand-400 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-sm crypto-text-secondary">and one of the following</p>
        </div>
      </div>
    </div>
  )
}
