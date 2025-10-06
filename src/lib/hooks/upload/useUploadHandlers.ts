"use client"

import { useCallback } from "react"
import { UploadState, UploadHandlers } from "@/types/upload"

interface UseUploadHandlersProps {
  state: UploadState
  updateState: (updates: Partial<UploadState>) => void
  toast: any
  uploadVideo: any
  resetUploadState: any
  downloadVideo: any
  generateTitles: any
  generateDescriptionAPI: any
  regenerateDescriptionWithTemplate: any
  generateTimestampsAPI: any
  generateThumbnailsAPI: any
  updatePrivacyStatus: any
  resetPrivacyState: any
  uploadToYouTube: any
  resetYouTubeUploadState: any
  getCurrentVideoId: any
  getVideoPreview: any
  previewData: any
  uploadedVideoData: any
  privacyError: string | null
  uploadError: string | null
  processAllInOne?: (videoId: string) => Promise<any>
}

export const useUploadHandlers = ({
  state,
  updateState,
  toast,
  uploadVideo,
  resetUploadState,
  downloadVideo,
  generateTitles,
  generateDescriptionAPI,
  regenerateDescriptionWithTemplate,
  generateTimestampsAPI,
  generateThumbnailsAPI,
  updatePrivacyStatus,
  resetPrivacyState,
  uploadToYouTube,
  resetYouTubeUploadState,
  getCurrentVideoId,
  getVideoPreview,
  previewData,
  uploadedVideoData,
  privacyError,
  uploadError,
  processAllInOne,
}: UseUploadHandlersProps): UploadHandlers => {

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    updateState({
      uploadedFile: file,
      isUploading: true,
      uploadProgress: 0
    })
    
    resetUploadState()

    try {
      const result = await uploadVideo(file, (progress: number) => {
        updateState({ uploadProgress: progress })
      })
      
      if (result) {
        updateState({
          uploadedVideoData: result,
          uploadProgress: 100,
          showCelebration: true,
          currentStep: "title"
        })
        
        console.log('=== VIDEO UPLOAD SUCCESS ===')
        console.log('Upload completed successfully!')
        console.log('Video ID (UUID):', result.id)
        console.log('Response Data:', result)
      }
    } catch (error) {
      console.error('Video upload failed:', error)
      updateState({
        isUploading: false,
        uploadProgress: 0
      })
    } finally {
      updateState({ isUploading: false })
    }
  }, [uploadVideo, resetUploadState, updateState])

  const handleYouTubeUrlDownload = useCallback(async () => {
    if (!state.youtubeUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await downloadVideo(state.youtubeUrl)
      
      updateState({
        uploadedVideoData: result,
        showCelebration: true,
        youtubeUrl: ""
      })

      toast({
        title: "Success!",
        description: "Video downloaded successfully from YouTube",
      })

      console.log('=== VIDEO DOWNLOAD SUCCESS ===')
      console.log('Download completed successfully!')
      console.log('Video ID (UUID):', result.id)
      
    } catch (error) {
      console.error('Video download failed:', error)
      toast({
        title: "Download Failed",
        description: "Failed to download video from YouTube",
        variant: "destructive",
      })
    }
  }, [state.youtubeUrl, downloadVideo, updateState, toast])

  const generateTitlesHandler = useCallback(async () => {
    const videoId = uploadedVideoData?.id || getCurrentVideoId()
    if (!videoId) {
      toast({ 
        title: 'Upload Required', 
        description: 'Please upload a video first before generating titles.' 
      })
      return
    }

    updateState({ isProcessing: true })
    try {
      const result = await generateTitles(videoId)
      if (result && result.generated_titles) {
        updateState({
          content: {
            ...state.content,
            titles: result.generated_titles,
          }
        })
      }
    } catch (error) {
      console.error('Failed to generate titles:', error)
    } finally {
      updateState({ isProcessing: false })
    }
  }, [uploadedVideoData, getCurrentVideoId, generateTitles, state.content, updateState, toast])

  const generateDescription = useCallback(async () => {
    const videoId = uploadedVideoData?.id || getCurrentVideoId()
    if (!videoId) {
      toast({ 
        title: 'Upload Required', 
        description: 'Please upload a video first before generating description.' 
      })
      return
    }

    updateState({ isProcessing: true })
    try {
      const result = await generateDescriptionAPI(videoId)
      if (result && result.generated_description) {
        updateState({
          content: {
            ...state.content,
            description: result.generated_description,
          }
        })
      }
    } catch (error) {
      console.error('Failed to generate description:', error)
    } finally {
      updateState({ isProcessing: false })
    }
  }, [uploadedVideoData, getCurrentVideoId, generateDescriptionAPI, state.content, updateState, toast])

  const generateTimestamps = useCallback(async () => {
    const videoId = uploadedVideoData?.id || getCurrentVideoId()
    if (!videoId) {
      toast({ 
        title: 'Upload Required', 
        description: 'Please upload a video first before generating timestamps.' 
      })
      return
    }

    updateState({ isProcessing: true })
    try {
      const result = await generateTimestampsAPI(videoId)
      if (result && result.generated_timestamps) {
        updateState({
          content: {
            ...state.content,
            timestamps: result.generated_timestamps,
          }
        })
      }
    } catch (error) {
      console.error('Failed to generate timestamps:', error)
    } finally {
      updateState({ isProcessing: false })
    }
  }, [uploadedVideoData, getCurrentVideoId, generateTimestampsAPI, state.content, updateState, toast])

  const generateThumbnails = useCallback(async () => {
    const videoId = uploadedVideoData?.id || getCurrentVideoId()
    
    console.log('[UploadHandlers] generateThumbnails called:', {
      videoId,
      uploadedVideoDataId: uploadedVideoData?.id,
      getCurrentVideoIdResult: getCurrentVideoId(),
      hasVideoId: !!videoId
    })
    
    if (!videoId) {
      toast({ 
        title: 'Upload Required', 
        description: 'Please upload a video first before generating thumbnails.' 
      })
      return
    }

    updateState({ isProcessing: true })
    try {
      console.log('[UploadHandlers] Calling generateThumbnailsAPI with videoId:', videoId)
      console.log('[UploadHandlers] Video ID type and value:', {
        videoId,
        videoIdType: typeof videoId,
        videoIdLength: videoId?.length,
        isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(videoId || '')
      })
      
      const result = await generateThumbnailsAPI(videoId)
      
      console.log('[UploadHandlers] generateThumbnailsAPI result:', {
        success: result?.success,
        thumbnailsCount: result?.thumbnails?.length,
        thumbnails: result?.thumbnails?.map((url: string, i: number) => `Thumbnail ${i + 1}: ${url.substring(0, 100)}...`),
        message: result?.message,
        videoId: result?.video_id
      })
      
      if (result && result.thumbnails) {
        console.log('[UploadHandlers] Updating state with thumbnails:', {
          currentThumbnailsCount: state.content.thumbnails.length,
          newThumbnailsCount: result.thumbnails.length
        })
        
        updateState({
          content: {
            ...state.content,
            thumbnails: result.thumbnails,
          }
        })
      } else {
        console.warn('[UploadHandlers] No thumbnails in result or result is falsy:', result)
      }
    } catch (error) {
      console.error('[UploadHandlers] Failed to generate thumbnails:', error)
    } finally {
      updateState({ isProcessing: false })
    }
  }, [uploadedVideoData, getCurrentVideoId, generateThumbnailsAPI, state.content, updateState, toast])

  const handleDirectUpload = useCallback(async () => {
    // Simple confirmation before upload
    const confirmed = window.confirm("Are you sure you want to upload this video to YouTube?")
    if (!confirmed) return

    try {
      const videoId = previewData?.id || uploadedVideoData?.id || getCurrentVideoId()
      if (!videoId) {
        toast({
          title: "Error",
          description: "No video ID found. Please try uploading again.",
          variant: "destructive",
        })
        return
      }

      resetYouTubeUploadState()

      // Set the main upload state to loading
      updateState({ isUploading: true })

      toast({
        title: "Uploading to YouTube...",
        description: "Please wait while we upload your video. This may take a few minutes.",
      })

      await uploadToYouTube(videoId)

      toast({
        title: "Success!",
        description: `Video uploaded to YouTube successfully!`,
      })

      // Reset states
      updateState({
        selectedPlaylist: null,
        isUploading: false
      })
      
    } catch (error) {
      console.error('YouTube upload failed:', error)
      
      // Reset loading state on error
      updateState({ isUploading: false })
      
      toast({
        title: "Upload Failed",
        description: uploadError || "Failed to upload video to YouTube",
        variant: "destructive",
      })
    }
  }, [previewData, uploadedVideoData, getCurrentVideoId, resetYouTubeUploadState, uploadToYouTube, updateState, toast, uploadError])

  const handlePublish = useCallback(async (type: "public" | "private" | "unlisted" | "schedule") => {
    updateState({ publishType: type })
    
    if (type === "schedule") {
      alert("Scheduling feature coming soon!")
      return
    }

    if (type === "public" || type === "private" || type === "unlisted") {
      try {
        const videoId = previewData?.id || uploadedVideoData?.id || getCurrentVideoId()
        if (!videoId) {
          toast({
            title: "Error",
            description: "No video ID found. Please try uploading again.",
            variant: "destructive",
          })
          return
        }

        resetPrivacyState()
        await updatePrivacyStatus(videoId, type)

        toast({
          title: "Success",
          description: `Video privacy set to ${type}`,
        })

        // Direct upload with confirmation instead of showing modal
        handleDirectUpload()
      } catch (error) {
        console.error('Privacy status update failed:', error)
        toast({
          title: "Error",
          description: privacyError || `Failed to set video privacy to ${type}`,
          variant: "destructive",
        })
      }
    }
  }, [previewData, uploadedVideoData, getCurrentVideoId, updatePrivacyStatus, resetPrivacyState, updateState, toast, privacyError, handleDirectUpload])

  const handlePlaylistSelection = useCallback((playlistId: string) => {
    setTimeout(() => {
      updateState({
        showPlaylistSelector: false,
        currentStep: "preview"
      })
    }, 0)
  }, [updateState])

  const handleSaveApiKey = useCallback(async () => {
    if (!state.geminiApiKey.trim()) {
      updateState({ saveButtonText: "Enter API Key" })
      setTimeout(() => updateState({ saveButtonText: "Save Key" }), 2000)
      return
    }

    updateState({
      isSaving: true,
      saveButtonText: "Saving..."
    })

    try {
      // TODO: Implement saveGeminiKey function
      updateState({ saveButtonText: "Saved Successfully!" })
      
      setTimeout(() => {
        updateState({ saveButtonText: "Save Key" })
      }, 2000)
    } catch (error) {
      console.error('Failed to save API key:', error)
      updateState({ saveButtonText: "Save Failed" })
      
      setTimeout(() => {
        updateState({ saveButtonText: "Save Key" })
      }, 2000)
    } finally {
      updateState({ isSaving: false })
    }
  }, [state.geminiApiKey, updateState])

  const handleAllInOne = useCallback(async () => {
    try {
      const idFromStorage = getCurrentVideoId()
      const fallbackId = uploadedVideoData?.id || previewData?.id
      const videoId = idFromStorage || fallbackId
      console.log('[AllInOne][Handlers] IDs', {
        idFromStorage,
        uploadedVideoDataId: uploadedVideoData?.id,
        previewDataId: previewData?.id,
        chosen: videoId,
      })
      if (!videoId) {
        toast({ title: 'Upload Required', description: 'Please upload a video first.' })
        return
      }
      if (processAllInOne) {
        const result = await processAllInOne(videoId)
        console.log('[AllInOne][Handlers] API result', result)
      }
      updateState({ currentStep: 'preview', previewStage: 3, showFinalPreview: true })
      if (getVideoPreview) {
        await getVideoPreview(videoId)
      }
    } catch (e) {
      console.error('All-in-one failed', e)
    }
  }, [uploadedVideoData, getCurrentVideoId, processAllInOne, updateState, getVideoPreview, toast])

  return {
    handleFileUpload,
    handleYouTubeUrlDownload,
    generateTitlesHandler,
    generateDescription,
    generateTimestamps,
    generateThumbnails,
    handlePublish,
    handlePlaylistSelection,
    handleSaveApiKey,
    handleAllInOne,
  }
}
