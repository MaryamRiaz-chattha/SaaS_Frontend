"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, Video, BarChart3, Menu, X, List, ChevronDown, ChevronRight, Sparkles } from "lucide-react"
import { useChannelPlaylists } from "@/lib/hooks/dashboard/playlists/useChannelPlaylists"

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "YouTube Videos",
    href: "/dashboard/videos",
    icon: Video,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPlaylistsOpen, setIsPlaylistsOpen] = useState(false)
  const [isGenerateVideoOpen, setIsGenerateVideoOpen] = useState(false)
  
  const { playlists, isLoading: playlistsLoading } = useChannelPlaylists()
  const playlistsRef = useRef<HTMLDivElement>(null)
  const generateVideoRef = useRef<HTMLDivElement>(null)

  // Close playlists dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playlistsRef.current && !playlistsRef.current.contains(event.target as Node)) {
        setIsPlaylistsOpen(false)
      }
      if (generateVideoRef.current && !generateVideoRef.current.contains(event.target as Node)) {
        setIsGenerateVideoOpen(false)
      }
    }

    if (isPlaylistsOpen || isGenerateVideoOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPlaylistsOpen, isGenerateVideoOpen])

  // Auto-select first playlist when on playlists page without specific playlist
  useEffect(() => {
    if (pathname === '/dashboard/playlists' && playlists.length > 0) {
      const urlParams = new URLSearchParams(window.location.search)
      const playlistId = urlParams.get('id')
      
      if (!playlistId) {
        // If no playlist is selected, automatically select the first one
        const firstPlaylist = playlists[0]
        if (firstPlaylist) {
          // Use router.push instead of window.history.replaceState for proper browser history
          router.push(`/dashboard/playlists?id=${firstPlaylist.id}`)
        }
      }
    }
  }, [pathname, playlists, router])

  return (
    <>
      {/* Mobile menu button - Enhanced for better mobile UX */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-20 left-4 z-50 lg:hidden bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background/90"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar - Enhanced mobile responsiveness */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 sm:w-64 border-r border-[var(--border-primary)] bg-secondary/95 backdrop-blur-md transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-auto py-4 sm:py-6 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
            <nav className="space-y-1 sm:space-y-2 px-3 sm:px-4">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 sm:gap-4 h-11 sm:h-12 rounded-lg text-foreground transition-all duration-200 text-sm sm:text-base",
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "bg-transparent hover:bg-accent hover:text-accent-foreground",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Button>
                  </Link>
                )
              })}

              {/* Upload & Create Dropdown */}
              <div className="space-y-1 sm:space-y-2" ref={generateVideoRef}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between h-11 sm:h-12 px-3 cursor-pointer gap-2 sm:gap-3 rounded-lg text-foreground transition-all duration-200 text-sm sm:text-base",
                    (pathname === '/dashboard/upload' || pathname === '/dashboard/all-in-one')
                      ? "bg-accent text-accent-foreground font-medium"
                      : "bg-transparent hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setIsGenerateVideoOpen(!isGenerateVideoOpen)}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="truncate">Upload & Create</span>
                  </div>
                  {isGenerateVideoOpen ? (
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  )}
                </Button>
                
                {isGenerateVideoOpen && (
                  <div className="ml-4 sm:ml-6 space-y-1 sm:space-y-2">
                    <Link href="/dashboard/upload">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start h-9 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm cursor-pointer rounded-md text-foreground transition-all duration-200 gap-2",
                          pathname === '/dashboard/upload'
                            ? "bg-accent text-accent-foreground font-medium"
                            : "bg-transparent hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Upload className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">Manual Upload</span>
                      </Button>
                    </Link>
                    <Link href="/dashboard/all-in-one">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start h-9 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm cursor-pointer rounded-md text-foreground transition-all duration-200 gap-2",
                          pathname === '/dashboard/all-in-one'
                            ? "bg-accent text-accent-foreground font-medium"
                            : "bg-transparent hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">AI Generator</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* YouTube Playlists Dropdown */}
              <div className="space-y-1 sm:space-y-2" ref={playlistsRef}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between h-11 sm:h-12 px-3 cursor-pointer gap-2 sm:gap-3 mb-1 sm:mb-2 rounded-lg text-foreground transition-all duration-200 text-sm sm:text-base",
                    pathname === '/dashboard/playlists'
                      ? "bg-accent text-accent-foreground font-medium"
                      : "bg-transparent hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setIsPlaylistsOpen(!isPlaylistsOpen)}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <List className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="truncate">YouTube Playlists</span>
                  </div>
                  {isPlaylistsOpen ? (
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  )}
                </Button>
                
                {isPlaylistsOpen && (
                  <div className="ml-4 sm:ml-6 space-y-1 sm:space-y-2">
                    {playlistsLoading ? (
                      <div className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-foreground">
                        Loading playlists...
                      </div>
                    ) : playlists.length > 0 ? (
                      playlists.map((playlist) => (
                        <Link key={playlist.id} href={`/dashboard/playlists?id=${playlist.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start h-9 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm cursor-pointer mb-1 sm:mb-2 rounded-md text-foreground transition-all duration-200",
                              pathname === `/dashboard/playlists?id=${playlist.id}`
                                ? "bg-accent text-accent-foreground font-medium"
                                : "bg-transparent hover:bg-accent hover:text-accent-foreground"
                            )}
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              // Don't close the playlists dropdown when clicking on a playlist
                              // This allows users to browse and select playlists
                            }}
                          >
                            <span className="truncate max-w-[200px] sm:max-w-[180px]" title={playlist.name}>
                              {playlist.name}
                            </span>
                          </Button>
                        </Link>
                      ))
                    ) : (
                      <div className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-foreground">
                        No playlists found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </div>

          
        </div>
      </aside>

      {/* Mobile overlay - Enhanced backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/90 backdrop-blur-md lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu overlay"
        />
      )}
    </>
  )
}
