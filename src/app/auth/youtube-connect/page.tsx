"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Youtube, Loader2, CheckCircle, AlertCircle, ExternalLink, RefreshCw, LogOut } from "lucide-react"
import useCredential from "@/lib/hooks/ai/useCredential"
import useYouTubeCredentials from "@/lib/hooks/youtube/useYouTubeCredentials"
import { useAuth } from "@/lib/hooks/auth"

export default function YouTubeConnectPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()
  const { logout } = useAuth()
  
  // Existing credential management
  const { 
    createYouTubeToken, 
    openAuthUrl, 
    resetTokenState,
    isLoading, 
    error, 
    authUrl, 
    message 
  } = useCredential()

  // New credentials check functionality
  const {
    isChecking,
    hasCredentials,
    credentials,
    error: credentialsError,
    checkYouTubeCredentials,
    refreshCredentialsCheck,
    lastChecked
  } = useYouTubeCredentials()

  const handleYouTubeConnect = async () => {
    setIsConnecting(true)
    
    try {
      // Create YouTube OAuth token
      const tokenResponse = await createYouTubeToken()
      
      // Open the OAuth URL in a new window
      const authWindow = openAuthUrl(tokenResponse.auth_url)
      
      if (authWindow) {
        // OAuth window opened successfully
        // Note: In a real implementation, you would:
        // 1. Listen for OAuth completion via webhook or polling
        // 2. Check OAuth status from backend
        // 3. Redirect to dashboard only after confirmed OAuth success
        
        // For now, we'll show success message and provide manual redirect
        // The user will need to complete OAuth in the opened window
        // and then manually proceed to dashboard
      }
      
    } catch (err: any) {
      // Error state is already handled by the hook
    } finally {
      setIsConnecting(false)
    }
  }

  const handleRetry = () => {
    resetTokenState()
  }

  const handleProceedToDashboard = () => {
    // Check if there's a stored redirect URL
    const redirectUrl = localStorage.getItem('youtube_redirect_after_auth')
    if (redirectUrl) {
      localStorage.removeItem('youtube_redirect_after_auth')
      router.push(redirectUrl)
    } else {
      router.push("/dashboard")
    }
  }

  const handleRefreshCheck = async () => {
    await refreshCredentialsCheck()
  }

  const handleReconnect = () => {
    resetTokenState()
    // Clear any existing error states
  }

  // If no client credentials exist, send user to credentials form first
  useEffect(() => {
    // Heuristic: if backend keeps returning 401 for token and we have no authUrl yet,
    // and user has not created client credentials through our form, push to /auth/credential.
    // We keep it simple: when we land here without authUrl, we prefer credential form first.
    if (!authUrl && !isLoadingAny && !hasCredentials) {
      // Route to the credentials page to collect client id/secret
      // This complements the dashboard guard and handles direct visits to this page
      // without configured client credentials.
      // We store intended return path.
      try {
        localStorage.setItem('youtube_redirect_after_auth', '/dashboard')
      } catch {}
      // Redirect to credential entry page
      // Delay one tick to avoid interfering with initial render
      const t = setTimeout(() => router.replace('/auth/credential'), 0)
      return () => clearTimeout(t)
    }
  }, [authUrl, isLoadingAny, hasCredentials, router])

  const handleLogout = () => {
    logout()
  }

  // Check for existing credentials on component mount
  // Soft-check only when user clicks refresh; avoid auto-check to prevent noisy errors
  useEffect(() => {
    // Intentionally no auto-check on mount to keep UI-first and resilient
  }, [])

  // Determine the current state and what UI to show
  const isLoadingAny = isLoading || isConnecting || isChecking
  const hasAnyError = false // Always render the connect UI; never block on backend errors
  const hasCredentialsData = !!credentials
  const showCredentialsFound = hasCredentials && !authUrl
  const showNoCredentials = !hasCredentials && !authUrl && !hasAnyError
  const showOAuthFlow = authUrl && !hasAnyError

  // Auto-initiate OAuth if user doesn't have credentials (after initial check completes)
  // No auto-connect; user explicitly initiates

  // If checking, show only a full-screen loader
  // Never block the route; always show the connect UI

  // If credentials exist, immediately redirect to dashboard with minimal UI
  useEffect(() => {
    if (hasCredentials && !isLoadingAny) {
      router.push('/dashboard')
    }
  }, [hasCredentials, isLoadingAny, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center group-hover:opacity-90 transition-opacity crypto-primary-gradient crypto-glow">
              <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">YouTube Automator</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center px-4 sm:px-6">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Youtube className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">
              {showCredentialsFound ? 'YouTube Already Connected!' : 'Connect Your YouTube Channel'}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {showCredentialsFound ? 'Your YouTube account is connected and ready to use' :
               'Connect your YouTube account to start automating your video content with AI'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">

            {/* Auto-redirect Message */}
            {typeof window !== 'undefined' && localStorage.getItem('youtube_redirect_after_auth') && !isLoadingAny && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>🔗 YouTube connection required to continue.</p>
                    <p className="text-sm text-muted-foreground">
                      You'll be redirected back to your previous page after connecting your YouTube account.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoadingAny && !isChecking && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  {isLoading ? 'Creating OAuth token...' :
                   isConnecting ? 'Connecting to YouTube...' :
                   'Loading...'}
                </AlertDescription>
              </Alert>
            )}

            {/* Credentials Found - Valid: now skipped (auto-redirect) */}
            
            {/* Error Display intentionally suppressed to keep flow UI-first */}

            {/* Success Message */}
            {message && !error && !credentialsError && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>{message}</p>
                    <p className="text-sm text-muted-foreground">
                      Please complete the OAuth process in the opened window, then return here to proceed to the dashboard.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Auth URL Display */}
            {showOAuthFlow && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <p className="text-sm text-muted-foreground">
                  OAuth URL received. If the window didn't open automatically, click below:
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthUrl(authUrl)}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open YouTube OAuth
                </Button>
                
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    After completing OAuth in the opened window, click below to proceed:
                  </p>
                  <Button
                    onClick={handleProceedToDashboard}
                    className="w-full crypto-button-primary"
                  >
                    Proceed to Dashboard
                  </Button>
                </div>
              </div>
            )}

            {/* Features List - Only show when no credentials */}
            {showNoCredentials && !isLoadingAny && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 crypto-profit flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Generate AI-powered titles and descriptions</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 crypto-profit flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Create custom thumbnails automatically</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 crypto-profit flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Schedule and publish videos seamlessly</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {(showNoCredentials || true) && !isLoadingAny && (
              <Button
                onClick={handleYouTubeConnect}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                disabled={isLoadingAny}
                size="lg"
              >
                <Youtube className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Connect with YouTube</span>
              </Button>
            )}

            {/* Retry Button */}
            {(error || credentialsError) && !isLoadingAny && (
              <Button
                onClick={handleRetry}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <span className="text-sm sm:text-base">Try Again</span>
              </Button>
            )}

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                By connecting, you agree to YouTube's Terms of Service and our Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 sm:mt-8 text-center">
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  )
}
