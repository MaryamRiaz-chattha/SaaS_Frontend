"use client"

import { X, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  title: string
  description: string
  continueText: string
}

export const CelebrationModal = ({ 
  isOpen, 
  onClose, 
  onContinue, 
  title, 
  description, 
  continueText 
}: CelebrationModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-8 max-w-md w-full mx-4 text-center relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="w-8 h-8 text-primary animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Button
          onClick={onContinue}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {continueText}
        </Button>
      </div>
    </div>
  )
}
