"use client"

import { useUploadPage } from "@/lib/hooks/upload/useUploadPage"
import { useUploadHandlers } from "@/lib/hooks/upload/useUploadHandlers"
import useUpdateVideo from "@/lib/hooks/upload/useUpdateVideo"
import { UploadStepsIndicator } from "@/components/upload/UploadStepsIndicator"
import { CelebrationModal } from "@/components/upload/ui/CelebrationModal"
import { UploadSection } from "@/components/upload/sections/UploadSection"
import { TitleSection } from "@/components/upload/sections/TitleSection"
import { DescriptionSection } from "@/components/upload/sections/DescriptionSection"
import { TimestampsSection } from "@/components/upload/sections/TimestampsSection"
import { ThumbnailSection } from "@/components/upload/sections/ThumbnailSection"
import { PreviewSection } from "@/components/upload/sections/PreviewSection"

export default function UploadPage() {
  const uploadPageData = useUploadPage()
  const { updateVideo, isUpdating: isUpdatingVideo, error: updateError } = useUpdateVideo()
  
  const {
    state,
    updateState,
    steps,
    credentialChecking,
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
    saveThumbnail,
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
    getVideoPreview,
    updatePrivacyStatus,
    resetPrivacyState,
    fetchPlaylists,
    uploadToYouTube,
    resetYouTubeUploadState,
    downloadVideo,
    processAllInOne,
  } = uploadPageData

  const handlers = useUploadHandlers({
    state,
    updateState,
    toast,
    uploadVideo,
    resetUploadState,
    downloadVideo,
    processAllInOne,
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
    previewData,
    uploadedVideoData: state.uploadedVideoData,
    privacyError,
    uploadError,
  })

  const handleUpdateVideo = async (updates: any) => {
    const videoId = state.uploadedVideoData?.id || getCurrentVideoId()
    if (!videoId) {
      toast({
        title: "Error",
        description: "No video ID found. Please try uploading again.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateVideo(videoId, updates)
    } catch (error) {
      console.error('Failed to update video:', error)
      // Error handling is done in the useUpdateVideo hook
    }
  }

  // Wrapper functions to handle saving states
  const handleSaveTitle = async (videoId: string, title: string) => {
    updateState({ isSavingTitle: true })
    try {
      const result = await saveTitle(videoId, title)
      return result
    } finally {
      updateState({ isSavingTitle: false })
    }
  }

  const handleSaveDescription = async (videoId: string, description: string) => {
    updateState({ isSavingDescription: true })
    try {
      const result = await saveDescription(videoId, description)
      return result
    } finally {
      updateState({ isSavingDescription: false })
    }
  }

  const handleSaveTimestamps = async (videoId: string, timestamps: string) => {
    updateState({ isSavingTimestamps: true })
    try {
      const result = await saveTimestamps(videoId, timestamps)
      return result
    } finally {
      updateState({ isSavingTimestamps: false })
    }
  }

  // Show loading screen while checking YouTube credentials
  if (credentialChecking || !shouldAllowAccess) {
    return (
      <div className="min-h-screen crypto-gradient-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
          <p className="crypto-text-secondary">
            {credentialChecking ? 'Checking YouTube credentials...' : 'Redirecting to YouTube connection...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen crypto-gradient-bg">
      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={state.showCelebration}
        onClose={() => updateState({ showCelebration: false })}
        onContinue={() => {
          updateState({ showCelebration: false, currentStep: "title" })
        }}
        title="🎉 Upload Successful!"
        description="Your video has been uploaded successfully! Now let's optimize it with AI-generated content."
        continueText="Continue to Title Generation"
      />

      <div className="container mx-auto px-4 py-6 space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold crypto-text-primary">Upload Video</h1>
          <p className="crypto-text-secondary mt-2">Create and optimize your YouTube content with AI assistance.</p>
        </div>

        {/* Steps Indicator */}
        <UploadStepsIndicator steps={steps} currentStep={state.currentStep} />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
          
          {/* Upload Section */}
          {state.currentStep === "upload" && (
            <UploadSection
              state={state}
              updateState={updateState}
              handlers={handlers}
              videoDownloading={videoDownloading}
              downloadProgress={downloadProgress}
              downloadError={downloadError}
            />
          )}

          {/* Title Section */}
          {state.currentStep === "title" && (
            <TitleSection
              state={state}
              updateState={updateState}
              handlers={handlers}
              generatedTitles={generatedTitles}
              titleLoading={titleLoading}
              uploadedVideoData={state.uploadedVideoData}
              saveTitle={handleSaveTitle}
              isSavingTitle={state.isSavingTitle}
            />
          )}

          {/* Description Section */}
          {state.currentStep === "description" && (
            <DescriptionSection
              state={state}
              updateState={updateState}
              handlers={handlers}
              generatedDescription={generatedDescription}
              descriptionLoading={descriptionLoading}
              uploadedVideoData={state.uploadedVideoData}
              saveDescription={handleSaveDescription}
              regenerateDescriptionWithTemplate={regenerateDescriptionWithTemplate}
              isSavingDescription={state.isSavingDescription}
            />
          )}

          {/* Timestamps Section */}
          {state.currentStep === "timestamps" && (
            <TimestampsSection
              state={state}
              updateState={updateState}
              handlers={handlers}
              generatedTimestamps={generatedTimestamps}
              timestampsLoading={timestampsLoading}
              uploadedVideoData={state.uploadedVideoData}
              saveTimestamps={handleSaveTimestamps}
              isSavingTimestamps={state.isSavingTimestamps}
            />
          )}

          {/* Thumbnail Section */}
          {state.currentStep === "thumbnail" && (
            <ThumbnailSection
              state={state}
              updateState={updateState}
              handlers={handlers}
              generatedThumbnails={generatedThumbnails}
              thumbnailLoadingStates={thumbnailLoadingStates}
              thumbnailsLoading={thumbnailsLoading}
              saveThumbnail={saveThumbnail}
              getCurrentVideoId={getCurrentVideoId}
            />
          )}

          {/* Preview Section */}
          {state.currentStep === "preview" && (
            <PreviewSection
              state={state}
              updateState={updateState}
              handlers={handlers}
              previewData={previewData}
              previewLoading={previewLoading}
              previewError={previewError}
              uploadedVideoData={state.uploadedVideoData}
              getCurrentVideoId={getCurrentVideoId}
              getVideoPreview={getVideoPreview}
              onUpdateVideo={handleUpdateVideo}
              isUpdatingVideo={isUpdatingVideo}
            />
          )}

        </div>
      </div>
    </div>
  )
}
