"use client"

import { CheckCircle } from "lucide-react"
import { StepConfig, UploadStep } from "@/types/upload"

interface UploadStepsIndicatorProps {
  steps: StepConfig[]
  currentStep: UploadStep
}

export const UploadStepsIndicator = ({ steps, currentStep }: UploadStepsIndicatorProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 ${
                  currentStep === step.id
                    ? "border-brand-primary bg-brand-primary text-white crypto-glow"
                    : step.completed && step.id !== "preview"
                      ? "border-profit bg-profit text-white crypto-glow"
                      : "border-primary bg-card"
                }`}
              >
                {step.completed && step.id !== "preview" ? (
                  <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                ) : (
                  <span className="text-xs lg:text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs lg:text-sm text-center ${
                  currentStep === step.id ? "font-medium crypto-text-primary" : "crypto-text-secondary"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 ${step.completed ? "bg-profit" : "bg-primary"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
