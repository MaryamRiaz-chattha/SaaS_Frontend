"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/lib/hooks/common/useToast"
import useYouTubeCredentialGuard from "@/lib/hooks/youtube/useYouTubeCredentialGuard"
import useVideos from "@/lib/hooks/upload/useVideos"
import useTitle from "@/lib/hooks/upload/useTitle"
import useTranscript from "@/lib/hooks/upload/useTranscript"
import useTimestamps from "@/lib/hooks/upload/useTimestamps"
import useThumbnail from "@/lib/hooks/upload/useThumbnail"
import useVideoPreview from "@/lib/hooks/upload/useVideoPreview"
import usePrivacyStatus from "@/lib/hooks/upload/usePrivacyStatus"
import usePlaylists from "@/lib/hooks/upload/usePlaylists"
import useYouTubeUpload from "@/lib/hooks/youtube/useYouTubeUpload"
import useVideoDownload from "@/lib/hooks/upload/useVideoDownload"
import { UploadState, GeneratedContent, UploadStep } from "@/types/upload"

export const useUploadPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const getInitialStep = (): UploadStep => {
    const step = searchParams.get('step') as UploadStep
    const validSteps: UploadStep[] = ['upload', 'title', 'description', 'timestamps', 'thumbnail', 'preview']
    return validSteps.includes(step) ? step : 'upload'
  }
  
  // YouTube credential guard kept but bypassed for now
  const { shouldAllowAccess } = useYouTubeCredentialGuard({
    redirectTo: '/auth/youtube-connect',
    showToast: false,
    allowBypass: true,
  })

  // All the existing hooks
  const { uploadVideo, isUploading: videoUploading, progress: videoProgress, resetUploadState, getCurrentVideoData, getCurrentVideoId } = useVideos()
  
  useEffect(() => {
    console.log('[UploadPage] Video ID Debug Info:', {
      getCurrentVideoId: getCurrentVideoId(),
      getCurrentVideoData: getCurrentVideoData(),
      hasVideoId: !!getCurrentVideoId(),
      hasVideoData: !!getCurrentVideoData()
    })
  }, [getCurrentVideoId, getCurrentVideoData])
  const { generateTitles, saveTitle, regenerateTitlesWithRequirements, generatedTitles, isLoading: titleLoading } = useTitle()
  const { 
    generateDescription: generateDescriptionAPI, 
    saveDescription, 
    regenerateDescription, 
    regenerateDescriptionWithTemplate,
    generatedDescription,
    isLoading: descriptionLoading 
  } = useTranscript()
  const {
    generateTimestamps: generateTimestampsAPI,
    saveTimestamps,
    regenerateTimestamps,
    generatedTimestamps,
    isLoading: timestampsLoading
  } = useTimestamps()
  const {
    generateThumbnails: generateThumbnailsAPI,
    regenerateThumbnails,
    saveThumbnail,
    generatedThumbnails,
    thumbnailLoadingStates,
    isLoading: thumbnailsLoading
  } = useThumbnail()
  const {
    getVideoPreview,
    data: previewData,
    isLoading: previewLoading,
    error: previewError
  } = useVideoPreview()
  const {
    isUpdating: privacyUpdating,
    error: privacyError,
    updatePrivacyStatus,
    resetState: resetPrivacyState,
  } = usePrivacyStatus()
  const {
    playlists,
    isLoading: playlistsLoading,
    error: playlistsError,
    fetchPlaylists,
  } = usePlaylists()
  const {
    isUploading: youtubeUploading,
    error: uploadError,
    uploadToYouTube,
    resetState: resetYouTubeUploadState,
  } = useYouTubeUpload()
  const {
    isDownloading: videoDownloading,
    error: downloadError,
    downloadedVideo,
    progress: downloadProgress,
    downloadVideo,
    resetState: resetDownloadState,
  } = useVideoDownload()

  const [state, setState] = useState<UploadState>({
    currentStep: getInitialStep(),
    previewStage: 1,
    selectedPrivacy: 'public',
    showFinalPreview: false,
    geminiApiKey: "",
    uploadProgress: 0,
    isUploading: false,
    isProcessing: false,
    uploadedFile: null,
    content: {
      titles: [],
      selectedTitle: "",
      description: "",
      timestamps: "",
      thumbnails: [],
      selectedThumbnail: "",
    },
    customTitle: "",
    customDescription: "",
    customDescriptionTemplate: "",
    customTimestamps: "",
    showPlaylistSelector: false,
    selectedPlaylist: null,
    publishType: "",
    youtubeUrl: "",
    uploadMethod: "file",
    showCelebration: false,
    saveButtonText: "Save Key",
    isSaving: false,
    uploadedVideoData: null,
    isSavingTitle: false,
    isSavingDescription: false,
    isSavingTimestamps: false,
  })

  useEffect(() => {
    const savedVideoData = getCurrentVideoData()
    if (savedVideoData) {
      setState(prev => ({
        ...prev,
        uploadedVideoData: savedVideoData,
        uploadProgress: 100
      }))
      console.log('[UploadPage] Restored video data from localStorage')
    }
  }, [getCurrentVideoData])

  const updateState = (updates: Partial<UploadState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates }
      if (updates.currentStep && updates.currentStep !== prev.currentStep) {
        const url = new URL(window.location.href)
        url.searchParams.set('step', updates.currentStep)
        window.history.pushState({}, '', url.toString())
      }
      return newState
    })
  }

  const steps = [
    { id: "upload" as const, title: "Upload", completed: (state.uploadProgress === 100 && !state.isUploading) || !!state.uploadedVideoData?.id },
    { id: "title" as const, title: "Title", completed: !!(state.content.selectedTitle || state.customTitle) },
    { id: "description" as const, title: "Description", completed: !!(state.content.description || generatedDescription || state.customDescription) },
    { id: "timestamps" as const, title: "Timestamps", completed: !!(state.content.timestamps || generatedTimestamps || state.customTimestamps) },
    { id: "thumbnail" as const, title: "Thumbnail", completed: !!(state.content.selectedThumbnail || (generatedThumbnails.length > 0)) },
    { id: "preview" as const, title: "Preview", completed: false },
  ]

  return {
    state,
    updateState,
    steps,
    // Hide credential checking flags for UI consumers
    credentialChecking: false,
    shouldAllowAccess,
    router,
    toast,
    generatedTitles,
    titleLoading,
    generatedDescription,
    descriptionLoading,
    generatedTimestamps,
    timestampsLoading,
    generatedThumbnails,
    thumbnailLoadingStates,
    thumbnailsLoading,
    previewData,
    previewLoading,
    previewError,
    privacyUpdating,
    privacyError,
    playlists,
    playlistsLoading,
    playlistsError,
    youtubeUploading,
    uploadError,
    videoDownloading,
    downloadError,
    downloadProgress,
    uploadVideo,
    resetUploadState,
    getCurrentVideoData,
    getCurrentVideoId,
    generateTitles,
    saveTitle,
    generateDescriptionAPI,
    saveDescription,
    regenerateDescriptionWithTemplate,
    generateTimestampsAPI,
    saveTimestamps,
    generateThumbnailsAPI,
    saveThumbnail,
    getVideoPreview,
    updatePrivacyStatus,
    resetPrivacyState,
    fetchPlaylists,
    uploadToYouTube,
    resetYouTubeUploadState,
    downloadVideo,
    processAllInOne: async (videoId: string) => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) throw new Error('No authentication token found')
        const url = `https://backend.postsiva.com/all-in-one/${videoId}/process`
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'accept': 'application/json' },
        })
        const data = await res.json()
        setState(prev => ({ ...prev, allInOneResult: data }))
        return data
      } catch (e) {
        console.error('[AllInOne] Error', e)
        return { success: false, message: (e as any)?.message || 'Failed to process' }
      }
    },
  }
}
