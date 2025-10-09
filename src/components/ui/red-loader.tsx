"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface RedLoaderProps {
  size?: number // diameter in px
  strokeWidth?: number // border width in px
  className?: string
}

export function RedLoader({ size = 24, strokeWidth = 3, className }: RedLoaderProps) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderWidth: strokeWidth,
    // Use brand primary (red) for the visible border and transparent for the rest
    borderColor: "var(--brand-primary) transparent transparent transparent",
  }

  return (
    <span
      aria-label="Loading"
      role="status"
      className={cn("inline-block animate-spin rounded-full", className)}
      style={style}
    />
  )
}

interface FullScreenLoaderProps {
  message?: string
}

export function FullScreenLoader({ message }: FullScreenLoaderProps) {
  return (
    <div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <RedLoader size={28} strokeWidth={4} />
        {message ? (
          <p className="text-sm crypto-text-secondary text-center max-w-xs">{message}</p>
        ) : null}
      </div>
    </div>
  )
}
