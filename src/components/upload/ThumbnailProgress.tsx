"use client"

import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle } from "lucide-react"

interface ThumbnailProgressProps {
  progress: number
  isGenerating: boolean
  generatedCount: number
  totalCount?: number
}

export function ThumbnailProgress({ 
  progress, 
  isGenerating, 
  generatedCount, 
  totalCount = 5 
}: ThumbnailProgressProps) {
  if (!isGenerating && generatedCount === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating thumbnails...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              Generation complete
            </>
          )}
        </span>
        <span className="text-muted-foreground">
          {generatedCount}/{totalCount}
        </span>
      </div>
      
      <Progress 
        value={progress} 
        className="w-full h-2" 
      />
      
      {isGenerating && (
        <p className="text-xs text-muted-foreground">
          This may take a few moments as we generate high-quality thumbnails...
        </p>
      )}
    </div>
  )
}