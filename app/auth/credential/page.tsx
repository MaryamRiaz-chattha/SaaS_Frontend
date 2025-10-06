"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Key, Eye, EyeOff, CheckCircle, LogOut } from 'lucide-react'
import { useCreateYouTubeCredentials } from '@/hooks/youtube'
import { useYouTubeCredentials } from '@/hooks/youtube'
import { useAuth } from '@/hooks/auth'

export default function CredentialPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const { createCredentials, isLoading, error, clearError } = useCreateYouTubeCredentials()
  const { 
    checkYouTubeCredentials, 
    hasCredentials, 
    isChecking, 
    error: credentialsError 
  } = useYouTubeCredentials()
  
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{
    clientId?: string
    clientSecret?: string
  }>({})

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, authLoading, router])

  // Check for existing credentials when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      checkYouTubeCredentials(false)
    }
  }, [isAuthenticated, checkYouTubeCredentials])

  // Auto-redirect to YouTube connect if credentials already exist
  useEffect(() => {
    if (hasCredentials && !isChecking) {
      router.push('/dashboard')
    }
  }, [hasCredentials, isChecking, router])

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [clientId, clientSecret, error, clearError])

  const validateForm = () => {
    const errors: { clientId?: string; clientSecret?: string } = {}
    
    if (!clientId.trim()) {
      errors.clientId = 'Client ID is required'
    } else if (clientId.trim().length < 10) {
      errors.clientId = 'Client ID must be at least 10 characters'
    }
    
    if (!clientSecret.trim()) {
      errors.clientSecret = 'Client Secret is required'
    } else if (clientSecret.trim().length < 10) {
      errors.clientSecret = 'Client Secret must be at least 10 characters'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await createCredentials({
        client_id: clientId.trim(),
        client_secret: clientSecret.trim()
      })
      
      // Redirect to YouTube connect page after successful creation
      router.push('/auth/youtube-connect')
    } catch (err) {
      // Error is already handled by the hook
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center crypto-gradient-bg p-3 sm:p-4">
        {/* Logout Button - Top Right */}
        <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 crypto-text-primary text-xs sm:text-sm"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Login</span>
          </Button>
        </div>
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin crypto-profit text-[#fd1d1d]" />
      </div>
    )
  }

  // Show loading while checking credentials
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#fd1d1d]" />
      </div>
    )
  }

  // If credentials exist, show only a loader (no success message)
  if (hasCredentials) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#fd1d1d]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-3 sm:p-4 lg:p-6">
      {/* Logout Button - Top Right */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 crypto-text-primary text-xs sm:text-sm"
        >
          <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Out</span>
        </Button>
      </div>

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm crypto-card-enhanced">
          <CardHeader className="text-center space-y-2 sm:space-y-3 pb-4 sm:pb-6 px-4 sm:px-6">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 crypto-primary-gradient rounded-xl flex items-center justify-center crypto-glow-pulse">
              <Key className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold crypto-text-primary">
                YouTube Credentials
              </CardTitle>
              <CardDescription className="text-sm sm:text-base crypto-text-secondary">
                Enter your YouTube API credentials to continue
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Client ID Field */}
              <div className="space-y-2">
                <Label htmlFor="clientId" className="text-xs sm:text-sm font-semibold crypto-text-primary">
                  Client ID
                </Label>
                <Input
                  id="clientId"
                  type="text"
                  placeholder="Enter your YouTube Client ID"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className={`crypto-input-enhanced text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 ${validationErrors.clientId ? 'border-loss focus:border-loss focus:ring-loss' : ''}`}
                  disabled={isLoading}
                />
                {validationErrors.clientId && (
                  <p className="text-xs crypto-loss">{validationErrors.clientId}</p>
                )}
              </div>

              {/* Client Secret Field */}
              <div className="space-y-2">
                <Label htmlFor="clientSecret" className="text-xs sm:text-sm font-semibold crypto-text-primary">
                  Client Secret
                </Label>
                <div className="relative">
                  <Input
                    id="clientSecret"
                    type={showSecret ? 'text' : 'password'}
                    placeholder="Enter your YouTube Client Secret"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    className={`pr-8 sm:pr-10 crypto-input-enhanced text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 ${validationErrors.clientSecret ? 'border-loss focus:border-loss focus:ring-loss' : ''}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-brand-10 crypto-text-tertiary hover:crypto-text-primary"
                    onClick={() => setShowSecret(!showSecret)}
                    disabled={isLoading}
                  >
                    {showSecret ? (
                      <EyeOff className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    ) : (
                      <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    )}
                  </Button>
                </div>
                {validationErrors.clientSecret && (
                  <p className="text-xs crypto-loss">{validationErrors.clientSecret}</p>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-loss/20 bg-loss/10 crypto-card">
                  <AlertDescription className="crypto-loss">{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full crypto-button-enhanced text-sm sm:text-base py-2.5 sm:py-3 font-semibold"
                disabled={isLoading || !clientId.trim() || !clientSecret.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin crypto-spinner" />
                    <span className="text-xs sm:text-sm">Creating Credentials...</span>
                  </>
                ) : (
                  <span className="text-sm sm:text-base">Create Credentials</span>
                )}
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm crypto-text-secondary">
                Don't have credentials?{' '}
                <a
                  href="https://developers.google.com/youtube/v3/getting-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="crypto-text-primary hover:crypto-text-secondary underline font-semibold transition-colors"
                >
                  Learn how to get them
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
