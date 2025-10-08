"use client"

import { CheckCircle } from "lucide-react"
import { StepConfig, UploadStep } from "@/types/upload"

interface UploadStepsIndicatorProps {
  steps: StepConfig[]
  currentStep: UploadStep
}

export const UploadStepsIndicator = ({ steps, currentStep }: UploadStepsIndicatorProps) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-2 sm:px-4 min-w-max sm:min-w-0">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0 px-1 sm:px-0">
              <div
                className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-all duration-200 flex-shrink-0 ${
                  currentStep === step.id
                    ? "border-brand-primary bg-brand-primary text-white crypto-glow shadow-lg scale-110"
                    : step.completed && step.id !== "preview"
                      ? "border-profit bg-profit text-white crypto-glow"
                      : "border-primary bg-card"
                }`}
              >
                {step.completed && step.id !== "preview" ? (
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                ) : (
                  <span className="text-[10px] sm:text-xs lg:text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-1 sm:mt-2 text-[10px] sm:text-xs lg:text-sm text-center truncate max-w-full ${
                  currentStep === step.id ? "font-semibold crypto-text-primary" : "font-normal crypto-text-secondary"
                }`}
                title={step.title}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 sm:mx-2 min-w-[12px] sm:min-w-[16px] transition-colors duration-200 ${step.completed ? "bg-profit" : "bg-primary"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
