"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, FileVideo, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadDropzoneProps {
  onFileUpload: (file: File) => void
  disabled?: boolean
  compact?: boolean
}

export function UploadDropzone({ onFileUpload, disabled = false, compact = false }: UploadDropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".wmv", ".mkv", ".webm"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 * 1024, // 10GB
    disabled,
  })

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile)
      setSelectedFile(null)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (compact) {
    return (
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive ? "Drop video here" : "Click or drag to upload"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? "Drop your video here" : "Drag & drop your video here"}
              </p>
              <p className="text-muted-foreground mt-1">or click to browse files</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Supported formats: MP4, MOV, AVI, WMV, MKV, WebM</p>
              <p>Maximum file size: 10GB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileVideo className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleUpload} disabled={disabled} className="flex-1">
              {disabled ? "Uploading..." : "Upload Video"}
            </Button>
            <Button variant="outline" onClick={handleRemoveFile} disabled={disabled}>
              Choose Different File
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
