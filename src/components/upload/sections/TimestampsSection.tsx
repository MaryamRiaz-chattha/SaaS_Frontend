"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Clock, RefreshCw } from "lucide-react"
import { UploadState, UploadHandlers } from "@/types/upload"

interface TimestampsSectionProps {
  state: UploadState
  updateState: (updates: Partial<UploadState>) => void
  handlers: UploadHandlers
  generatedTimestamps: string
  timestampsLoading: boolean
  uploadedVideoData: any
  saveTimestamps: (videoId: string, timestamps: string) => Promise<any>
  isSavingTimestamps?: boolean
}

export function TimestampsSection({
  state,
  updateState,
  handlers,
  generatedTimestamps,
  timestampsLoading,
  uploadedVideoData,
  saveTimestamps,
  isSavingTimestamps = false
}: TimestampsSectionProps) {
  const [customTimestamps, setCustomTimestamps] = useState("")

  const handleSaveAndNext = async () => {
    // Save the timestamps if they're generated
    if ((state.content.timestamps || generatedTimestamps) && uploadedVideoData?.id) {
      try {
        await saveTimestamps(uploadedVideoData.id, state.content.timestamps || generatedTimestamps)
      } catch (error) {
        console.error('Failed to save timestamps:', error)
      }
    }
    updateState({ currentStep: "thumbnail" })
  }

  return (
    <Card className="crypto-card crypto-hover-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg lg:text-xl crypto-text-primary">
          <Clock className="h-5 w-5 crypto-profit" />
          Generate Timestamps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button 
          onClick={handlers.generateTimestamps} 
          disabled={state.isProcessing || timestampsLoading} 
          className="w-full crypto-button-primary"
        >
          <Clock className="w-4 h-4 mr-2" />
          Generate Timestamps with AI
        </Button>

        {(state.content.timestamps || generatedTimestamps) && (
          <div className="space-y-3">
            <Label className="crypto-text-primary">Generated Timestamps:</Label>
            <div className="p-4 border border-primary rounded-lg bg-card/50 max-h-60 overflow-y-auto crypto-glow">
              <pre className="whitespace-pre-wrap text-sm font-mono crypto-text-primary">{state.content.timestamps || generatedTimestamps}</pre>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handlers.generateTimestamps}
                disabled={state.isProcessing || timestampsLoading}
                className="sm:w-auto w-full crypto-button-secondary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate Timestamps
              </Button>
              {(state.content.timestamps || generatedTimestamps) && uploadedVideoData?.id && (
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await saveTimestamps(uploadedVideoData.id, state.content.timestamps || generatedTimestamps)
                    } catch (error) {
                      console.error('Failed to save timestamps:', error)
                    }
                  }}
                  disabled={isSavingTimestamps}
                  className="sm:w-auto w-full crypto-button-secondary"
                >
                  {isSavingTimestamps ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin crypto-spinner" />
                      Saving...
                    </>
                  ) : (
                    'Save Timestamps'
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        

        {(state.content.timestamps || generatedTimestamps || customTimestamps) && (
          <Button 
            onClick={handleSaveAndNext}
            disabled={isSavingTimestamps}
            className="w-full crypto-button-primary"
          >
            {isSavingTimestamps ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin crypto-spinner" />
                Saving Timestamps...
              </>
            ) : (
              'Save & Next: Generate Thumbnail'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
