"use client"

import { Upload, Link } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { UploadState, UploadHandlers } from "@/types/upload"

interface UploadSectionProps {
  state: UploadState
  updateState: (updates: Partial<UploadState>) => void
  handlers: UploadHandlers
  videoDownloading: boolean
  downloadProgress: number
  downloadError: string | null
}

export const UploadSection = ({ 
  state, 
  updateState, 
  handlers, 
  videoDownloading, 
  downloadProgress, 
  downloadError 
}: UploadSectionProps) => {
  return (
    <Card className="crypto-card crypto-hover-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg lg:text-xl crypto-text-primary">
          <Upload className="h-5 w-5 crypto-profit" />
          Upload Your Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gemini API Key moved to Settings - removed */}

        {/* Upload Method Toggle simplified to File only */}
        <div className="space-y-4">
          <Label className="crypto-text-primary">Upload Method</Label>
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Button variant="crypto" size="sm" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          </div>
        </div>

        {/* File Upload Section */}
        {state.uploadMethod === "file" && (
          <div className="space-y-4">
            <Label htmlFor="video-upload" className="crypto-text-primary">Upload Video File</Label>
            <div className="border-2 border-dashed border-primary/25 rounded-lg p-6 lg:p-8 text-center crypto-glow">
              <Upload className="mx-auto h-8 w-8 lg:h-12 lg:w-12 crypto-text-tertiary mb-4" />
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handlers.handleFileUpload}
                className="hidden"
                disabled={state.isUploading || videoDownloading}
              />
              <Label htmlFor="video-upload" className="cursor-pointer">
                <div className="text-base lg:text-lg font-medium mb-2 crypto-text-primary">
                  Drop your video here or click to browse
                </div>
                <div className="text-sm crypto-text-secondary">Supports MP4, MOV, AVI, WMV (Max: 10GB)</div>
              </Label>
            </div>
          </div>
        )}

        {/* YouTube URL Section */}
        {/* URL download removed */}

        {/* Progress Indicators */}
        {state.isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="truncate mr-2 crypto-text-primary">Uploading {state.uploadedFile?.name}</span>
              <span className="flex-shrink-0 crypto-text-secondary">{Math.round(state.uploadProgress)}%</span>
            </div>
            <Progress value={state.uploadProgress} className="crypto-progress" />
          </div>
        )}

        {videoDownloading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="truncate mr-2 crypto-text-primary">Downloading video from YouTube...</span>
              <span className="flex-shrink-0 crypto-text-secondary">{Math.round(downloadProgress)}%</span>
            </div>
            <Progress value={downloadProgress} className="crypto-progress" />
          </div>
        )}

        {/* All-in-One CTA moved to Title section */}
      </CardContent>
    </Card>
  )
}
