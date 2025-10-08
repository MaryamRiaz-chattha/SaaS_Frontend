"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageIcon, RefreshCw, CheckCircle } from "lucide-react"
import { UploadState, UploadHandlers } from "@/types/upload"
import { useEffect, useState } from "react"

interface ThumbnailSectionProps {
  state: UploadState
  updateState: (updates: Partial<UploadState>) => void
  handlers: UploadHandlers
  generatedThumbnails: string[]
  thumbnailLoadingStates: boolean[]
  thumbnailsLoading: boolean
  saveThumbnail: (videoId: string, thumbnailUrl: string) => Promise<any>
  getCurrentVideoId: () => string | null
}

export function ThumbnailSection({
  state,
  updateState,
  handlers,
  generatedThumbnails,
  thumbnailLoadingStates,
  thumbnailsLoading,
  saveThumbnail,
  getCurrentVideoId
}: ThumbnailSectionProps) {

  const handleThumbnailSelect = async (thumbnail: string) => {
    console.log('[ThumbnailSection] Thumbnail selected:', {
      thumbnail: thumbnail.substring(0, 100) + '...',
      currentSelected: state.content.selectedThumbnail,
      thumbnailsCount: state.content.thumbnails.length,
      generatedThumbnailsCount: generatedThumbnails.length
    })
    
    updateState({
      content: {
        ...state.content,
        selectedThumbnail: thumbnail
      }
    })

    // Save the selected thumbnail to backend
    const videoId = getCurrentVideoId()
    if (videoId && thumbnail) {
      try {
        console.log('[ThumbnailSection] Saving thumbnail to backend:', {
          videoId,
          thumbnailUrl: thumbnail.substring(0, 100) + '...'
        })
        await saveThumbnail(videoId, thumbnail)
        console.log('[ThumbnailSection] Thumbnail saved successfully')
      } catch (error) {
        console.error('[ThumbnailSection] Failed to save thumbnail:', error)
        // Don't block the UI - user can still proceed
      }
    }
  }

  const handleCustomThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      updateState({
        content: {
          ...state.content,
          selectedThumbnail: url
        }
      })
    }
  }

  const handleSaveAndNext = () => {
    updateState({ currentStep: "preview" })
  }

  // Debug logging
  console.log('[ThumbnailSection] Component state:', {
    stateThumbnailsCount: state.content.thumbnails.length,
    generatedThumbnailsCount: generatedThumbnails.length,
    selectedThumbnail: state.content.selectedThumbnail,
    isProcessing: state.isProcessing,
    thumbnailsLoading,
    thumbnailsToShow: state.content.thumbnails.length > 0 ? state.content.thumbnails : generatedThumbnails,
    stateThumbnails: state.content.thumbnails,
    generatedThumbnailsArray: generatedThumbnails
  })

  const [imgLoading, setImgLoading] = useState<boolean[]>([false, false, false, false, false])

  useEffect(() => {
    if (thumbnailsLoading) {
      setImgLoading([true, true, true, true, true])
    }
  }, [thumbnailsLoading])

  const handleImgLoad = (idx: number) => {
    setImgLoading(prev => {
      const next = [...prev]
      next[idx] = false
      return next
    })
  }

  return (
    <Card className="crypto-card crypto-hover-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg lg:text-xl crypto-text-primary">
          <ImageIcon className="h-5 w-5 crypto-profit" />
          Generate Thumbnail
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button 
          onClick={() => {
            console.log('[ThumbnailSection] Generate button clicked!')
            console.log('[ThumbnailSection] Current state before generation:', {
              stateThumbnails: state.content.thumbnails,
              generatedThumbnails: generatedThumbnails,
              isProcessing: state.isProcessing,
              thumbnailsLoading
            })
            handlers.generateThumbnails()
          }} 
          disabled={state.isProcessing || thumbnailsLoading} 
          className="w-full crypto-button-primary"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Generate 5 Thumbnails with AI
        </Button>

        {(state.content.thumbnails.length > 0 || generatedThumbnails.length > 0 || thumbnailsLoading) && (
          <div className="space-y-3">
            <Label className="crypto-text-primary">
              {thumbnailsLoading ? "Generating thumbnails..." : "Select a thumbnail:"}
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {/* Show 5 slots - either loading skeletons or actual thumbnails */}
              {Array.from({ length: 5 }).map((_, index) => {
                const thumbnails = state.content.thumbnails.length > 0 ? state.content.thumbnails : generatedThumbnails
                const thumbnail = thumbnails[index]
                const isLoading = thumbnailLoadingStates[index]
                const showSkeleton = isLoading || imgLoading[index]

                if (showSkeleton) {
                  // Show skeleton loader for this slot
                  return (
                    <div
                      key={index}
                      className="relative aspect-video border-2 rounded-lg border-primary/30"
                    >
                      <Skeleton className="w-full h-full rounded-lg" />
                    </div>
                  )
                }

                if (!thumbnail) {
                  // Don't show empty slots if not loading
                  return null
                }

                // Show actual thumbnail
                return (
                  <div
                    key={index}
                    className={`relative aspect-video border-2 rounded-lg cursor-pointer transition-all hover:scale-105 crypto-glow ${
                      state.content.selectedThumbnail === thumbnail
                        ? "border-brand-primary ring-2 ring-brand-primary/20"
                        : "border-primary hover:border-brand-primary/50"
                    }`}
                    onClick={() => handleThumbnailSelect(thumbnail)}
                  >
                    <img
                      src={thumbnail}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                      onLoad={() => handleImgLoad(index)}
                    />
                    {state.content.selectedThumbnail === thumbnail && (
                      <div className="absolute top-1 right-1 bg-brand-primary rounded-full p-1 crypto-glow">
                        <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 crypto-profit bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <Button
              variant="outline"
              onClick={handlers.generateThumbnails}
              disabled={state.isProcessing || thumbnailsLoading}
              className="w-full sm:w-auto crypto-button-secondary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate 5 Thumbnails
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="custom-thumbnail" className="crypto-text-primary">Or upload custom thumbnail:</Label>
          <Input
            id="custom-thumbnail"
            type="file"
            accept="image/*"
            onChange={handleCustomThumbnailUpload}
            className="crypto-input"
          />
        </div>

        {state.content.selectedThumbnail && (
          <Button 
            onClick={handleSaveAndNext}
            className="w-full crypto-button-primary"
          >
            Save & Next: Preview
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
