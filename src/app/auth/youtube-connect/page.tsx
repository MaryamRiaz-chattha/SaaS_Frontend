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
  const [isPolling, setIsPolling] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const router = useRouter()
  const { logout } = useAuth()
  
  const { 
    createYouTubeToken, 
    openAuthUrl, 
    resetTokenState,
    isLoading, 
    error, 
    authUrl, 
    message,
    getYouTubeToken,
  } = useCredential()

  const {
    isChecking,
    hasCredentials,
    credentials,
    error: credentialsError,
    checkYouTubeCredentials,
    refreshCredentialsCheck,
    lastChecked
  } = useYouTubeCredentials()

  // Helper: poll token status until valid or timeout
  useEffect(() => {
    let timer: any
    let attempts = 0

    const startPolling = async () => {
      if (isPolling) return
      setIsPolling(true)
      attempts = 0

      const poll = async () => {
        attempts += 1
        try {
          const token = await getYouTubeToken()
          if (token && token.status === 'valid' && token.has_access_token) {
            setIsPolling(false)
            setRedirecting(true)
            router.replace('/dashboard')
            return
          }
        } catch {}

        if (attempts < 30) {
          timer = setTimeout(poll, 2000)
        } else {
          setIsPolling(false)
        }
      }

      poll()
    }

    if (authUrl && !isPolling) {
      startPolling()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [authUrl, getYouTubeToken, isPolling, router])

  const handleYouTubeConnect = async () => {
    setIsConnecting(true)
    try {
      const tokenStatus = await getYouTubeToken().catch(() => undefined)
      if (tokenStatus && tokenStatus.status === 'valid' && tokenStatus.has_access_token) {
        setRedirecting(true)
        router.replace('/dashboard')
        return
      }

      const tokenResponse = await createYouTubeToken()
      openAuthUrl(tokenResponse.auth_url)
      // polling starts via effect when authUrl is set
    } catch (err: any) {
    } finally {
      setIsConnecting(false)
    }
  }

  // On mount: auto-connect flow
  useEffect(() => {
    (async () => {
      try {
        const tokenStatus = await getYouTubeToken()
        if (tokenStatus && tokenStatus.status === 'valid' && tokenStatus.has_access_token) {
          setRedirecting(true)
          router.replace('/dashboard')
          return
        }
      } catch {}

      handleYouTubeConnect()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRetry = () => {
    resetTokenState()
    handleYouTubeConnect()
  }

  const handleLogout = () => {
    logout()
  }

  const isLoadingAny = isLoading || isConnecting || isChecking || isPolling || redirecting

  if (isLoadingAny) {
    return (
      <div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{redirecting ? 'Redirecting...' : isPolling ? 'Waiting for authorization...' : isLoading ? 'Creating OAuth token...' : isConnecting ? 'Connecting to YouTube...' : 'Loading...'}</span>
        </div>
      </div>
    )
  }

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
              Connect Your YouTube Channel
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              We will connect your YouTube account and bring you to the dashboard automatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>🔗 Connecting your YouTube account...</p>
                  <p className="text-sm text-muted-foreground">
                    If the popup is blocked, click the button below to open it.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            {/* Auth URL Controls */}
            {authUrl && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <p className="text-sm text-muted-foreground">
                  OAuth URL ready. If the window didn't open automatically, click below:
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
              </div>
            )}

            {/* Retry Button */}
            {(error || credentialsError) && (
              <Button
                onClick={handleRetry}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
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
