export type UploadStep = "upload" | "title" | "description" | "timestamps" | "thumbnail" | "preview"

export interface GeneratedContent {
  titles: string[]
  selectedTitle: string
  description: string
  timestamps: string
  thumbnails: string[]
  selectedThumbnail: string
}

export interface UploadState {
  currentStep: UploadStep
  previewStage: 1 | 2 | 3
  selectedPrivacy: 'public' | 'private' | 'unlisted'
  showFinalPreview: boolean
  geminiApiKey: string
  uploadProgress: number
  isUploading: boolean
  isProcessing: boolean
  uploadedFile: File | null
  content: GeneratedContent
  customTitle: string
  customDescription: string
  customDescriptionTemplate: string
  customTimestamps: string
  showPlaylistSelector: boolean
  selectedPlaylist: any
  publishType: string
  youtubeUrl: string
  uploadMethod: "file" | "url"
  showCelebration: boolean
  saveButtonText: string
  isSaving: boolean
  uploadedVideoData: any
  isSavingTitle: boolean
  isSavingDescription: boolean
  isSavingTimestamps: boolean
  allInOneResult?: any
}

export interface UploadHandlers {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleYouTubeUrlDownload: () => Promise<void>
  generateTitlesHandler: () => Promise<void>
  generateDescription: () => Promise<void>
  generateTimestamps: () => Promise<void>
  generateThumbnails: () => Promise<void>
  handlePublish: (type: "public" | "private" | "unlisted" | "schedule") => Promise<void>
  handlePlaylistSelection: (playlistId: string) => void
  handleSaveApiKey: () => Promise<void>
  handleAllInOne?: () => Promise<void>
}

export interface StepConfig {
  id: UploadStep
  title: string
  completed: boolean
}

export interface PrivacyOption {
  value: 'public' | 'private' | 'unlisted'
  label: string
  description: string
}
