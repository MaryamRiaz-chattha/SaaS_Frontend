"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/common/useToast"
import useYouTubeCredentialGuard from "@/hooks/youtube/useYouTubeCredentialGuard"
import useVideos from "@/hooks/upload/useVideos"
import useTitle from "@/hooks/upload/useTitle"
import useTranscript from "@/hooks/upload/useTranscript"
import useTimestamps from "@/hooks/upload/useTimestamps"
import useThumbnail from "@/hooks/upload/useThumbnail"
import useVideoPreview from "@/hooks/upload/useVideoPreview"
import usePrivacyStatus from "@/hooks/upload/usePrivacyStatus"
import usePlaylists from "@/hooks/upload/usePlaylists"
import useYouTubeUpload from "@/hooks/youtube/useYouTubeUpload"
import useVideoDownload from "@/hooks/upload/useVideoDownload"
import { UploadState, GeneratedContent, UploadStep } from "@/types/upload"

export const useUploadPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Get initial step from URL
  const getInitialStep = (): UploadStep => {
    const step = searchParams.get('step') as UploadStep
    const validSteps: UploadStep[] = ['upload', 'title', 'description', 'timestamps', 'thumbnail', 'preview']
    return validSteps.includes(step) ? step : 'upload'
  }
  
  // YouTube credential guard
  const { shouldAllowAccess, isChecking: credentialChecking } = useYouTubeCredentialGuard({
    redirectTo: '/auth/youtube-connect',
    showToast: true
  })

  // All the existing hooks
  const { uploadVideo, isUploading: videoUploading, progress: videoProgress, resetUploadState, getCurrentVideoData, getCurrentVideoId } = useVideos()
  
  // Debug logging for video ID tracking
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
    generatedThumbnails,
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

  // Main state
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

  // Load video data from localStorage on component mount
  useEffect(() => {
    const savedVideoData = getCurrentVideoData()
    if (savedVideoData) {
      setState(prev => ({
        ...prev,
        uploadedVideoData: savedVideoData,
        uploadProgress: 100
      }))
      console.log('🔄 Restored video data from localStorage:', {
        videoId: savedVideoData.id,
        videoPath: savedVideoData.video_path,
        createdAt: savedVideoData.created_at
      })
    }
  }, [getCurrentVideoData])

  // Helper function to update state
  // Update URL when step changes
  const updateState = (updates: Partial<UploadState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates }
      
      // Update URL if step changed
      if (updates.currentStep && updates.currentStep !== prev.currentStep) {
        const url = new URL(window.location.href)
        url.searchParams.set('step', updates.currentStep)
        window.history.pushState({}, '', url.toString())
      }
      
      return newState
    })
  }

  // Generate steps configuration
  const steps = [
    { id: "upload" as const, title: "Upload", completed: (state.uploadProgress === 100 && !state.isUploading) || !!state.uploadedVideoData?.id },
    { id: "title" as const, title: "Title", completed: !!(state.content.selectedTitle || state.customTitle) },
    { id: "description" as const, title: "Description", completed: !!(state.content.description || generatedDescription || state.customDescription) },
    { id: "timestamps" as const, title: "Timestamps", completed: !!(state.content.timestamps || generatedTimestamps || state.customTimestamps) },
    { id: "thumbnail" as const, title: "Thumbnail", completed: !!(state.content.selectedThumbnail || (generatedThumbnails.length > 0)) },
    { id: "preview" as const, title: "Preview", completed: false },
  ]

  return {
    // State
    state,
    updateState,
    steps,
    
    // Credential checking
    credentialChecking,
    shouldAllowAccess,
    
    // External hooks data
    router,
    toast,
    generatedTitles,
    titleLoading,
    generatedDescription,
    descriptionLoading,
    generatedTimestamps,
    timestampsLoading,
    generatedThumbnails,
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
    
    // External functions
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
    getVideoPreview,
    updatePrivacyStatus,
    resetPrivacyState,
    fetchPlaylists,
    uploadToYouTube,
    resetYouTubeUploadState,
    downloadVideo,
    // New: all-in-one processing
    processAllInOne: async (videoId: string) => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) throw new Error('No authentication token found')
        const url = `https://backend.postsiva.com/all-in-one/${videoId}/process`
        console.log('[AllInOne] Request', {
          url,
          videoId,
          hasToken: !!token,
          headersPreview: { Authorization: 'Bearer ***', accept: 'application/json' }
        })
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'accept': 'application/json' },
        })
        console.log('[AllInOne] Response meta', { status: res.status, ok: res.ok })
        const data = await res.json()
        console.log('[AllInOne] Response data', {
          success: data?.success,
          message: data?.message,
          video_id: data?.video_id,
          total_tasks: data?.total_tasks,
          completed_tasks: data?.completed_tasks,
          failed_tasks: data?.failed_tasks,
          titlesCount: data?.results?.titles?.generated_titles?.length,
          hasDescription: !!data?.results?.description?.generated_description,
          thumbnailsCount: data?.results?.thumbnails?.generated_thumbnails?.length,
        })
        // Store into state for preview section to use
        setState(prev => ({ ...prev, allInOneResult: data }))
        return data
      } catch (e) {
        console.error('[AllInOne] Error', e)
        return { success: false, message: (e as any)?.message || 'Failed to process' }
      }
    },
  }
}
