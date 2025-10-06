"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Video, 
  Users, 
  DollarSign, 
  Settings, 
  FileText, 
  Music,
  Shield,
  Palette
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/youtube-studio-dashboard",
    icon: BarChart3,
  },
  {
    title: "Content",
    href: "/youtube-studio-dashboard/content",
    icon: Video,
  },
  {
    title: "Analytics",
    href: "/youtube-studio-dashboard/Analytics",
    icon: BarChart3,
  },
  {
    title: "Community",
    href: "/youtube-studio-dashboard/Community",
    icon: Users,
  },
  {
    title: "Earn",
    href: "/youtube-studio-dashboard/Earn",
    icon: DollarSign,
  },
  {
    title: "Audio Library",
    href: "/youtube-studio-dashboard/Audio-Library",
    icon: Music,
  },
  {
    title: "Subtitles",
    href: "/youtube-studio-dashboard/Subtitles",
    icon: FileText,
  },
  {
    title: "Copyright",
    href: "/youtube-studio-dashboard/Copyright",
    icon: Shield,
  },
  {
    title: "Customization",
    href: "/youtube-studio-dashboard/Customization",
    icon: Palette,
  },
]

export function YouTubeStudioSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-primary bg-secondary crypto-glow">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-6">
          <nav className="space-y-2 px-4">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "crypto" : "cryptoGhost"}
                    className={cn(
                      "w-full justify-start gap-4 h-12 crypto-hover-glow",
                      isActive && "crypto-glow",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}
