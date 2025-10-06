"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Lock, Users, ImageIcon, FileText, Clock, Play, Save, X } from "lucide-react"
import { UploadState } from "@/types/upload"
import { UpdateVideoRequest } from "@/hooks/upload/useUpdateVideo"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  state: UploadState
  onSave: (updates: UpdateVideoRequest) => Promise<void>
  isSaving: boolean
}

const privacyOptions = [
  { value: 'public', label: 'Public', description: 'Anyone can search for and view', icon: Globe },
  { value: 'unlisted', label: 'Unlisted', description: 'Anyone with the link can view', icon: Users },
  { value: 'private', label: 'Private', description: 'Only you can view', icon: Lock },
]

export function EditModal({ isOpen, onClose, state, onSave, isSaving }: EditModalProps) {
  const [formData, setFormData] = useState<UpdateVideoRequest>({
    title: '',
    description: '',
    timestamps: '',
    privacy_status: 'public',
    playlist_name: '',
  })

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: state.content.selectedTitle || state.customTitle || '',
        description: state.content.description || state.customDescription || '',
        timestamps: state.content.timestamps || state.customTimestamps || '',
        privacy_status: state.selectedPrivacy || 'public',
        playlist_name: state.selectedPlaylist?.name || '',
      })
    }
  }, [isOpen, state])

  const handleInputChange = (field: keyof UpdateVideoRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      // Error handling is done in the onSave function
      console.error('Failed to save changes:', error)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      title: state.content.selectedTitle || state.customTitle || '',
      description: state.content.description || state.customDescription || '',
      timestamps: state.content.timestamps || state.customTimestamps || '',
      privacy_status: state.selectedPrivacy || 'public',
      playlist_name: state.selectedPlaylist?.name || '',
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Save className="w-5 h-5 crypto-profit" />
            Edit Video Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title Section */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 crypto-profit" />
              Video Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter video title"
              className="text-lg"
            />
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 crypto-profit" />
              Video Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter video description"
              rows={6}
              className="resize-none"
            />
          </div>

          {/* Timestamps Section */}
          <div className="space-y-3">
            <Label htmlFor="timestamps" className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 crypto-profit" />
              Video Timestamps
            </Label>
            <Textarea
              id="timestamps"
              value={formData.timestamps}
              onChange={(e) => handleInputChange('timestamps', e.target.value)}
              placeholder="Enter video timestamps (e.g., 00:00 - Introduction, 01:30 - Main Content)"
              rows={4}
              className="resize-none font-mono text-sm"
            />
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 crypto-profit" />
              Privacy Setting
            </Label>
            <Select
              value={formData.privacy_status}
              onValueChange={(value) => handleInputChange('privacy_status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select privacy setting" />
              </SelectTrigger>
              <SelectContent>
                {privacyOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            
            {/* Privacy description */}
            {formData.privacy_status && (
              <div className="text-sm text-muted-foreground">
                {privacyOptions.find(opt => opt.value === formData.privacy_status)?.description}
              </div>
            )}
          </div>

          {/* Playlist Section */}
          <div className="space-y-3">
            <Label htmlFor="playlist" className="text-sm font-medium flex items-center gap-2">
                <Play className="w-4 h-4 crypto-profit" />
              Playlist (Optional)
            </Label>
            <Input
              id="playlist"
              value={formData.playlist_name}
              onChange={(e) => handleInputChange('playlist_name', e.target.value)}
              placeholder="Enter playlist name"
            />
          </div>

          {/* Current Thumbnail Preview */}
          {state.content.selectedThumbnail && (
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4 crypto-profit" />
                Current Thumbnail
              </Label>
              <div className="p-4 border rounded-lg bg-muted/20">
                <div className="w-full max-w-sm mx-auto">
                  <img
                    src={state.content.selectedThumbnail}
                    alt="Current thumbnail"
                    className="w-full h-auto rounded-lg border"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Thumbnail cannot be edited here. Use the thumbnail section to change it.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="crypto-button-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
