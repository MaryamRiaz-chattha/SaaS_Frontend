"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScheduleModal } from "@/components/ScheduleModal"
import { RefreshCw, Eye, EyeOff, Calendar, Upload, Edit3, Save, X, Clock } from "lucide-react"
import Link from "next/link"

interface VideoData {
  id: string
  title: string
  description: string
  thumbnail: string
  status: "processing" | "completed" | "error"
  filename: string
  isPublic?: boolean
  scheduledDate?: string
}

interface VideoCardProps {
  video: VideoData
  onRegenerate: () => void
  onVisibilityChange: (isPublic: boolean) => void
  onSchedule: (date: string) => void
  onPublish: () => void
}

export function VideoCard({ video, onRegenerate, onVisibilityChange, onSchedule, onPublish }: VideoCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(video.title)
  const [editedDescription, setEditedDescription] = useState(video.description)
  const [isPublic, setIsPublic] = useState(video.isPublic ?? true)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleSaveEdits = () => {
    // In a real app, this would save to the backend
    setIsEditing(false)
    console.log("Saved edits:", { title: editedTitle, description: editedDescription })
  }

  const handleCancelEdits = () => {
    setEditedTitle(video.title)
    setEditedDescription(video.description)
    setIsEditing(false)
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    await onRegenerate()
    setIsRegenerating(false)
  }

  const handleVisibilityChange = (checked: boolean) => {
    setIsPublic(checked)
    onVisibilityChange(checked)
  }

  const handleSchedule = (date: string) => {
    onSchedule(date)
    setShowScheduleModal(false)
  }

  return (
    <>
      <Card className="overflow-hidden group cursor-pointer crypto-card crypto-hover-glow transition-all duration-200">
        <Link href={`/dashboard/videos/${video.id}`} className="block">
          <div className="aspect-video relative bg-muted">
            <img
              src={video.thumbnail || "/placeholder.svg"}
              alt="Video thumbnail"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute top-2 right-2">
              <Badge variant={video.status === "completed" ? "default" : "secondary"}>
                {video.status === "processing" && <Clock className="h-3 w-3 mr-1" />}
                {video.status}
              </Badge>
            </div>
          </div>
        </Link>

        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Video title"
                  />
                </div>
              ) : (
                <Link href={`/dashboard/videos/${video.id}`} className="block">
                  <CardTitle className="text-lg leading-tight crypto-text-primary hover:crypto-text-secondary transition-colors">{video.title}</CardTitle>
                </Link>
              )}
            </div>
            {video.status === "completed" && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Video description"
                rows={4}
              />
            </div>
          ) : (
            <CardDescription className="text-sm leading-relaxed crypto-text-secondary">{video.description}</CardDescription>
          )}

          {video.status === "completed" && (
            <>
              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg crypto-glow">
                <div className="flex items-center gap-2">
                  {isPublic ? <Eye className="h-4 w-4 crypto-profit" /> : <EyeOff className="h-4 w-4 crypto-text-tertiary" />}
                  <span className="text-sm font-medium crypto-text-primary">{isPublic ? "Public" : "Private"}</span>
                </div>
                <Switch checked={isPublic} onCheckedChange={handleVisibilityChange} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveEdits} size="sm" className="crypto-button-primary">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdits} size="sm" className="crypto-button-secondary">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isRegenerating} className="crypto-button-secondary">
                      {isRegenerating ? (
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-brand-primary border-t-transparent crypto-spinner" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Generate Again
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowScheduleModal(true)} className="crypto-button-secondary">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button size="sm" onClick={onPublish} className="crypto-button-primary">
                      <Upload className="h-4 w-4 mr-2" />
                      Publish Now
                    </Button>
                  </>
                )}
              </div>

              {video.scheduledDate && (
                <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg crypto-glow">
                  <p className="text-sm crypto-text-primary">
                    <Calendar className="h-4 w-4 inline mr-1 crypto-profit" />
                    Scheduled for: {new Date(video.scheduledDate).toLocaleString()}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ScheduleModal open={showScheduleModal} onOpenChange={setShowScheduleModal} onSchedule={handleSchedule} />
    </>
  )
}
