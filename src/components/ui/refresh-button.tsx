"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface RefreshButtonProps {
  onRefresh: () => void | Promise<void>
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
}

export default function RefreshButton({ 
  onRefresh, 
  className = "",
  variant = "outline",
  size = "sm",
  children
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  const buttonText = children || "Refresh for live data"

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`transition-all duration-200 ${className}`}
    >
      <RefreshCw 
        className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
      />
      {buttonText}
    </Button>
  )
}
