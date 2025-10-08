"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Upload, Sparkles, CheckCircle, ImageIcon, Save } from "lucide-react"
import useVideos from "@/lib/hooks/upload/useVideos"
import useAllInOne from "@/lib/hooks/upload/useAllInOne"
import usePrivacyStatus from "@/lib/hooks/upload/usePrivacyStatus"
import { useChannelPlaylists } from "@/lib/hooks/dashboard/playlists/useChannelPlaylists"
import { AllInOneTimestamp } from "@/lib/hooks/upload/useAllInOne"
import { useToast } from "@/lib/hooks/common/useToast"

export default function AllInOnePage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const { uploadVideo, isUploading, progress, getCurrentVideoId } = useVideos()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { processAllInOne, saveAllInOne, isProcessing, isSaving, processedData } = useAllInOne()
  const { playlists, fetchChannelPlaylists } = useChannelPlaylists()
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
  
  // Selected content
  const [selectedTitle, setSelectedTitle] = useState<string>("")
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [timestamps, setTimestamps] = useState<AllInOneTimestamp[]>([])
  const [privacyStatus, setPrivacyStatus] = useState<string>("public")
  const [playlistName, setPlaylistName] = useState<string>("")
  
  // UI state
  const [step, setStep] = useState<"upload" | "processing" | "review">("upload")

  useEffect(() => {
    fetchChannelPlaylists()
  }, [fetchChannelPlaylists])

  // Load processed data into form
  useEffect(() => {
    if (processedData?.results) {
      const { titles, description: desc, timestamps: ts, thumbnails } = processedData.results
      
      if (titles.success && titles.generated_titles.length > 0) {
        setSelectedTitle(titles.generated_titles[0])
      }
      
      if (desc.success && desc.generated_description) {
        setDescription(desc.generated_description)
      }
      
      if (ts.success && ts.generated_timestamps) {
        setTimestamps(ts.generated_timestamps)
      }
      
      if (thumbnails.success && thumbnails.generated_thumbnails.length > 0) {
        setSelectedThumbnail(thumbnails.generated_thumbnails[0].image_url)
      }
    }
  }, [processedData])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check for Gemini API key
    const geminiKey = localStorage.getItem('gemini_api_key')
    if (!geminiKey || geminiKey.trim() === '') {
      toast({
        title: "Gemini API Key Required",
        description: "Please go to Settings and enter your Gemini API key before uploading videos.",
        variant: "destructive",
      })
      event.target.value = ''
      return
    }

    setUploadedFile(file)
    setStep("upload")

    try {
      console.log('[AllInOne] Starting video upload...')
      const result = await uploadVideo(file)
      
      if (result?.id) {
        console.log('[AllInOne] Upload successful, video ID:', result.id)
        setCurrentVideoId(result.id)
        
        // Start processing
        setStep("processing")
        await processAllInOne(result.id)
        setStep("review")
      }
    } catch (error) {
      console.error('[AllInOne] Upload or processing failed:', error)
      setStep("upload")
    }
  }

  const handleSave = async () => {
    if (!currentVideoId) {
      toast({
        title: "Error",
        description: "No video ID found. Please try uploading again.",
        variant: "destructive",
      })
      return
    }

    if (!selectedTitle || !selectedThumbnail || !description) {
      toast({
        title: "Missing Fields",
        description: "Please select a title, thumbnail, and ensure description is filled.",
        variant: "destructive",
      })
      return
    }

    try {
      await saveAllInOne(currentVideoId, {
        selected_title: selectedTitle,
        selected_thumbnail_url: selectedThumbnail,
        description,
        timestamps,
        privacy_status: privacyStatus,
        playlist_name: playlistName || undefined,
      })

      toast({
        title: "Success!",
        description: "Your video content has been saved successfully.",
      })

      // Reset and go back to upload
      setTimeout(() => {
        setStep("upload")
        setUploadedFile(null)
        setCurrentVideoId(null)
        setSelectedTitle("")
        setSelectedThumbnail("")
        setDescription("")
        setTimestamps([])
        setPrivacyStatus("public")
        setPlaylistName("")
      }, 2000)
    } catch (error) {
      console.error('[AllInOne] Save failed:', error)
    }
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-brand-primary" />
        <div>
          <h1 className="text-3xl font-bold">All-in-One Video Generator</h1>
          <p className="text-muted-foreground">Upload a video and let AI generate everything</p>
        </div>
      </div>

      {step === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Video</CardTitle>
            <CardDescription>
              Upload a video file and we'll automatically generate titles, descriptions, timestamps, and thumbnails using AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="video-upload"
                  ref={fileInputRef}
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center gap-4">
                  <Button
                    type="button"
                    variant="crypto"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" /> Upload File
                  </Button>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Uploading... {Math.round(progress)}%</p>
                        <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-primary transition-all duration-300"
                            style={{ width: `${Math.round(progress)}%` }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-lg font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm text-muted-foreground">MP4, MOV, AVI, or any video format</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {uploadedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {uploadedFile.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {step === "processing" && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-6">
              <Loader2 className="h-16 w-16 animate-spin text-brand-primary" />
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">AI is Working Its Magic ✨</h3>
                <p className="text-muted-foreground">
                  Generating titles, descriptions, timestamps, and thumbnails...
                </p>
                <p className="text-sm text-muted-foreground">This may take a few moments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "review" && processedData && (
        <div className="space-y-6">
          {/* Titles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-primary" />
                Select a Title
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {processedData.results.titles.generated_titles.map((title, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedTitle(title)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTitle === title
                        ? "border-brand-primary bg-brand-primary/10"
                        : "border-border hover:border-brand-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="flex-1">{title}</p>
                      {selectedTitle === title && (
                        <CheckCircle className="h-5 w-5 text-brand-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Thumbnails */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-brand-primary" />
                Select a Thumbnail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {processedData.results.thumbnails.generated_thumbnails.map((thumbnail, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedThumbnail(thumbnail.image_url)}
                    className={`relative aspect-video border-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                      selectedThumbnail === thumbnail.image_url
                        ? "border-brand-primary ring-2 ring-brand-primary/20"
                        : "border-border hover:border-brand-primary/50"
                    }`}
                  >
                    {/* Image with skeleton placeholder while loading */}
                    <div className="absolute inset-0">
                      <Skeleton className="w-full h-full rounded-lg" />
                    </div>
                    <img
                      src={thumbnail.image_url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg relative z-10"
                      onLoad={(e) => {
                        const el = (e.target as HTMLImageElement).previousElementSibling as HTMLElement
                        if (el) el.style.display = 'none'
                      }}
                    />
                    {selectedThumbnail === thumbnail.image_url && (
                      <div className="absolute top-2 right-2 bg-brand-primary rounded-full p-1">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                placeholder="Edit the generated description..."
              />
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timestamps.map((ts, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <Input
                      value={ts.time}
                      onChange={(e) => {
                        const newTimestamps = [...timestamps]
                        newTimestamps[index].time = e.target.value
                        setTimestamps(newTimestamps)
                      }}
                      className="w-24"
                      placeholder="00:00"
                    />
                    <Input
                      value={ts.title}
                      onChange={(e) => {
                        const newTimestamps = [...timestamps]
                        newTimestamps[index].title = e.target.value
                        setTimestamps(newTimestamps)
                      }}
                      className="flex-1"
                      placeholder="Chapter title"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Playlist */}
          <Card>
            <CardHeader>
              <CardTitle>Video Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Privacy Status</Label>
                  <Select value={privacyStatus} onValueChange={setPrivacyStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Playlist (Optional)</Label>
                  <Select value={playlistName} onValueChange={setPlaylistName}>
                    <SelectTrigger>
                      <SelectValue placeholder="No playlist" />
                    </SelectTrigger>
                    <SelectContent>
                      {playlists.length === 0 ? (
                        <div className="px-2 py-1 text-sm text-muted-foreground">No playlists found</div>
                      ) : (
                        playlists.map((playlist) => (
                          <SelectItem key={playlist.id} value={playlist.name}>
                            {playlist.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setStep("upload")
                setUploadedFile(null)
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !selectedTitle || !selectedThumbnail || !description}
              className="min-w-[150px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Content
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
