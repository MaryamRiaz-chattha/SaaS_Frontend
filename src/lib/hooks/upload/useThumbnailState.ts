import { useState, useCallback, useEffect } from 'react'

interface ThumbnailState {
  thumbnails: string[]
  loadingStates: boolean[]
  selectedThumbnail: string | null
  isGenerating: boolean
  isSaving: boolean
  progress: number
}

export const useThumbnailState = () => {
  const [state, setState] = useState<ThumbnailState>({
    thumbnails: [],
    loadingStates: [false, false, false, false, false],
    selectedThumbnail: null,
    isGenerating: false,
    isSaving: false,
    progress: 0
  })

  const setThumbnail = useCallback((index: number, url: string) => {
    setState(prev => {
      const newThumbnails = [...prev.thumbnails]
      const newLoadingStates = [...prev.loadingStates]
      
      newThumbnails[index] = url
      newLoadingStates[index] = false
      
      // Calculate progress
      const loadedCount = newThumbnails.filter(Boolean).length
      const progress = (loadedCount / 5) * 100
      
      return {
        ...prev,
        thumbnails: newThumbnails,
        loadingStates: newLoadingStates,
        progress
      }
    })
  }, [])

  const setThumbnailLoading = useCallback((index: number, loading: boolean) => {
    setState(prev => {
      const newLoadingStates = [...prev.loadingStates]
      newLoadingStates[index] = loading
      return {
        ...prev,
        loadingStates: newLoadingStates
      }
    })
  }, [])

  const selectThumbnail = useCallback((url: string) => {
    setState(prev => ({
      ...prev,
      selectedThumbnail: url
    }))
  }, [])

  const setGenerating = useCallback((generating: boolean) => {
    setState(prev => ({
      ...prev,
      isGenerating: generating,
      progress: generating ? 0 : prev.progress
    }))
  }, [])

  const setSaving = useCallback((saving: boolean) => {
    setState(prev => ({
      ...prev,
      isSaving: saving
    }))
  }, [])

  const reset = useCallback(() => {
    setState({
      thumbnails: [],
      loadingStates: [false, false, false, false, false],
      selectedThumbnail: null,
      isGenerating: false,
      isSaving: false,
      progress: 0
    })
  }, [])

  const startGeneration = useCallback(() => {
    setState(prev => ({
      ...prev,
      thumbnails: [],
      loadingStates: [true, true, true, true, true],
      isGenerating: true,
      progress: 0
    }))
  }, [])

  return {
    state,
    setThumbnail,
    setThumbnailLoading,
    selectThumbnail,
    setGenerating,
    setSaving,
    reset,
    startGeneration
  }
}