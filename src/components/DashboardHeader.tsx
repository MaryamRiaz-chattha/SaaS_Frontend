"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Play, Bell, Settings, LogOut, User, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import useAuth from "@/lib/hooks/auth/useAuth"

export function DashboardHeader() {
  const [notifications] = useState(3) // Mock notification count
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  const handleLogout = () => {
    logout()
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.full_name) return "U"
    return user.full_name
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="w-full crypto-navbar">
      <div className="flex h-16 items-center px-3 sm:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2 mr-4 sm:mr-8 min-w-0">
          <div className="w-8 h-8 crypto-primary-gradient rounded-lg flex items-center justify-center flex-shrink-0 crypto-glow">
            <Play className="h-4 w-4 text-white fill-current" />
          </div>
          <span className="text-lg sm:text-xl font-bold crypto-text-primary hidden sm:block">YouTube Automator</span>
          <span className="text-lg font-bold crypto-text-primary sm:hidden">YT Auto</span>
        </Link>

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* Right side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative flex-shrink-0">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full flex-shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/hello.jpeg" alt="User" />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.full_name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme(isDark ? 'light' : 'dark')}>
                {isDark ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                <span>{isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/user-settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
