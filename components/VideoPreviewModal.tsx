import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Eye, 
  EyeOff, 
  Calendar, 
  PlaySquare, 
  ImageIcon,
  Upload,
  X,
  Loader2
} from 'lucide-react'
import { VideoData } from '@/hooks/useVideoPreview'
import { Playlist } from '@/hooks/usePlaylists'

interface VideoPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  videoData: VideoData | null
  selectedPlaylist: Playlist | null
  isUploading?: boolean
}

export default function VideoPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  videoData,
  selectedPlaylist,
  isUploading = false,
}: VideoPreviewModalProps) {
  const getPrivacyIcon = (privacy: string) => {
    switch (privacy?.toLowerCase()) {
      case 'public':
        return <Eye className="w-4 h-4" />
      case 'private':
        return <EyeOff className="w-4 h-4" />
      case 'unlisted':
        return <EyeOff className="w-4 h-4" />
      default:
        return <Eye className="w-4 h-4" />
    }
  }

  const getPrivacyColor = (privacy: string) => {
    switch (privacy?.toLowerCase()) {
      case 'public':
        return 'bg-profit/10 crypto-profit border-profit/20'
      case 'private':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'unlisted':
        return 'bg-brand-10 crypto-text-primary border-brand-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={isUploading ? undefined : onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Uploading to YouTube...</h3>
                <p className="text-sm text-muted-foreground">
                  Please don't close this window. This may take a few minutes.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlaySquare className="w-5 h-5" />
            Confirm Upload to YouTube
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Playlist Information */}
          {selectedPlaylist && (
            <div className="border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Target Playlist</Label>
                <Badge 
                  variant="outline" 
                  className={getPrivacyColor(selectedPlaylist.privacy)}
                >
                  {getPrivacyIcon(selectedPlaylist.privacy)}
                  <span className="ml-1 capitalize">{selectedPlaylist.privacy}</span>
                </Badge>
              </div>
              <h3 className="font-semibold text-lg">{selectedPlaylist.title}</h3>
              {selectedPlaylist.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedPlaylist.description}
                </p>
              )}
            </div>
          )}

          <Separator />

          {/* Video Information */}
          {videoData && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Video Details</Label>
              
              {/* Thumbnail & Title */}
              <div className="flex gap-4">
                <div className="w-32 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                  {videoData.thumbnail_url ? (
                    <img
                      src={videoData.thumbnail_url}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <Label className="text-sm text-muted-foreground">Title</Label>
                    <h3 className="font-semibold text-base">
                      {videoData.title || 'No title available'}
                    </h3>
                  </div>
                  {videoData.privacy_status && (
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground">Privacy:</Label>
                      <Badge 
                        variant="outline" 
                        className={getPrivacyColor(videoData.privacy_status)}
                      >
                        {getPrivacyIcon(videoData.privacy_status)}
                        <span className="ml-1 capitalize">{videoData.privacy_status}</span>
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {videoData.description && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="border rounded-lg p-3 bg-muted/20 max-h-32 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap">
                      {videoData.description}
                    </pre>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              {videoData.timestamps && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Timestamps</Label>
                  <div className="border rounded-lg p-3 bg-muted/20 max-h-32 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {videoData.timestamps}
                    </pre>
                  </div>
                </div>
              )}

              {/* Video Status & Schedule */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {videoData.video_status && (
                  <div>
                    <Label className="text-muted-foreground">Status:</Label>
                    <p className="font-medium capitalize">{videoData.video_status}</p>
                  </div>
                )}
                {videoData.schedule_datetime && (
                  <div>
                    <Label className="text-muted-foreground">Schedule:</Label>
                    <p className="font-medium">
                      {new Date(videoData.schedule_datetime).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Creation Date */}
              {videoData.created_at && (
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Created: {new Date(videoData.created_at).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isUploading}
          >
            <X className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Cancel'}
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isUploading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload to YouTube
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
