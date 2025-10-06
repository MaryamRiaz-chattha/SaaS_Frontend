"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, User, Settings } from "lucide-react"

export function YouTubeStudioHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 crypto-navbar">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Logo and Search */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 crypto-primary-gradient rounded-lg flex items-center justify-center crypto-glow">
              <span className="text-white font-bold text-sm">YT</span>
            </div>
            <span className="text-xl font-semibold crypto-text-primary">YouTube Studio</span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 crypto-text-tertiary h-4 w-4" />
            <Input
              placeholder="Search in YouTube Studio..."
              className="pl-10 w-80 crypto-input"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          <Button variant="cryptoGhost" size="sm" className="crypto-text-secondary hover:crypto-text-primary">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="cryptoGhost" size="sm" className="crypto-text-secondary hover:crypto-text-primary relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-primary rounded-full crypto-glow"></span>
          </Button>
          
          <Button variant="cryptoGhost" size="sm" className="crypto-text-secondary hover:crypto-text-primary">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
