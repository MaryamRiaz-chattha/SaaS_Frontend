"use client"

import type React from "react"
import { Suspense } from "react"

import { useEffect, useState } from "react"
import type { AxiosError } from "axios"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Eye, EyeOff, Loader2 } from "lucide-react"
import useAuth from "@/lib/hooks/auth/useAuth"
import dynamic from "next/dynamic"
const GoogleLoginButton = dynamic(() => import("@/components/auth/GoogleLoginButton"), { ssr: false })
import { SessionConflictDialog } from "@/components/auth/SessionConflictDialog"
import { useToast } from "@/lib/hooks/common/useToast"
import { cn } from "@/lib/utils"
import { 
  generateSessionId, 
  setSessionId, 
  setActiveUserId,
  removeSessionId,
  removeActiveUserId,
  getUserData
} from "@/lib/auth"

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState("")
  const [showConflictDialog, setShowConflictDialog] = useState(false)
  const [conflictInfo, setConflictInfo] = useState<{ currentEmail: string; newEmail: string } | null>(null)
  const [pendingLoginData, setPendingLoginData] = useState<{ email: string; password: string } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const renderFullScreenLoader = () => (
    <div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if there's already an active session with a different user
    const existingUser = getUserData()
    if (existingUser && existingUser.email && existingUser.email !== email) {
      console.log('⚠️ Detected login attempt with different account')
      setConflictInfo({
        currentEmail: existingUser.email,
        newEmail: email
      })
      setPendingLoginData({ email, password })
      setShowConflictDialog(true)
      return
    }
    
    setIsSubmitting(true)
    setError("")

    try {
      await login({ email, password })
      setRedirecting(true)
      router.replace("/auth/youtube-connect")
    } catch (err: any) {
      let message = "Login failed. Please try again."
      const axiosErr = err as AxiosError<any>
      const status = axiosErr?.response?.status
      const apiDetail = (axiosErr?.response?.data as any)?.detail
      if (status === 401) message = "Invalid email or password."
      else if (status === 429) message = "Too many attempts. Please wait a moment and try again."
      else if (status === 500) message = "Server error during login. Please try again later."
      else if (apiDetail) message = String(apiDetail)
      else if (axiosErr?.message) message = axiosErr.message
      setError(message)
      toast({ title: "Login failed", description: message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmSwitch = async () => {
    setShowConflictDialog(false)
    
    if (!pendingLoginData) return
    
    setIsSubmitting(true)
    setError("")

    try {
      await login(pendingLoginData)
      setRedirecting(true)
      router.replace("/auth/youtube-connect")
    } catch (err: any) {
      let message = "Login failed. Please try again."
      const axiosErr = err as AxiosError<any>
      const status = axiosErr?.response?.status
      const apiDetail = (axiosErr?.response?.data as any)?.detail
      if (status === 401) message = "Invalid email or password."
      else if (status === 429) message = "Too many attempts. Please wait a moment and try again."
      else if (status === 500) message = "Server error during login. Please try again later."
      else if (apiDetail) message = String(apiDetail)
      else if (axiosErr?.message) message = axiosErr.message
      setError(message)
      toast({ title: "Login failed", description: message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
      setPendingLoginData(null)
      setConflictInfo(null)
    }
  }

  const handleCancelSwitch = () => {
    setShowConflictDialog(false)
    setPendingLoginData(null)
    setConflictInfo(null)
    toast({ title: "Login cancelled", description: "You remain logged in with your current account." })
  }

  useEffect(() => {
    router.prefetch('/dashboard')
    router.prefetch('/auth/youtube-connect')
  }, [router])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('auth_token')
    if (!token) return
    const userData = localStorage.getItem('user_data')
    const sessionId = localStorage.getItem('session_id')
    const activeUserId = localStorage.getItem('active_user_id')
    
    // If missing session data, create it
    if (!sessionId || !activeUserId) {
      console.log('🔧 Missing session data, regenerating...')
      const newSessionId = generateSessionId()
      setSessionId(newSessionId)
      
      if (userData) {
        try {
          const user = JSON.parse(userData)
          setActiveUserId(user.id)
        } catch (error) {
          console.error('❌ Error parsing user data:', error)
        }
      }
    }
    
    if (!userData) {
      const minimalUser = {
        id: 'user', email: '', username: '', full_name: '', is_active: true,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }
      try { 
        localStorage.setItem('user_data', JSON.stringify(minimalUser))
        setActiveUserId(minimalUser.id)
      } catch {}
    }
    setRedirecting(true)
    router.replace('/auth/youtube-connect')
  }, [router])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const tokenFromUrl = searchParams.get('access_token') || searchParams.get('token')
    const userFromUrl = searchParams.get('user')
    const emailFromUrl = searchParams.get('email')
    if (!tokenFromUrl) return

    // Check if there's an existing session with a different user
    const existingToken = localStorage.getItem('auth_token')
    const existingUser = localStorage.getItem('user_data')
    
    if (existingToken && existingUser && emailFromUrl) {
      try {
        const existingUserData = JSON.parse(existingUser)
        if (existingUserData.email !== emailFromUrl) {
          console.warn('⚠️ Login from URL with different account detected')
          console.warn(`⚠️ Current user: ${existingUserData.email}, New user: ${emailFromUrl}`)
          
          // Force logout of existing session
          console.log('🔒 Forcing logout of existing session before URL-based login')
          removeSessionId()
          removeActiveUserId()
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_data')
          localStorage.removeItem('user_id')
        }
      } catch (error) {
        console.error('❌ Error checking existing session:', error)
      }
    }

    try {
      // Generate new session ID
      const newSessionId = generateSessionId()
      console.log('🆔 Generated new session ID for URL-based login:', newSessionId)
      
      localStorage.setItem('auth_token', tokenFromUrl)
      if (userFromUrl || emailFromUrl) {
        const minimalUser = {
          id: userFromUrl || emailFromUrl || 'user',
          email: emailFromUrl || '',
          username: userFromUrl || '',
          full_name: userFromUrl || '',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        localStorage.setItem('user_data', JSON.stringify(minimalUser))
        
        // Save session data
        setSessionId(newSessionId)
        setActiveUserId(minimalUser.id)
      }
      
      console.log('✅ URL-based authentication successful with session tracking')
    } catch {}

    try {
      const url = new URL(window.location.href)
      url.searchParams.delete('access_token')
      url.searchParams.delete('token')
      window.history.replaceState({}, '', url.toString())
    } catch {}

    setRedirecting(true)
    router.replace('/auth/youtube-connect')
  }, [searchParams, router])

  const hasOauthToken = !!(typeof window !== 'undefined' && (searchParams.get('access_token') || searchParams.get('token')))

  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated) return
      setRedirecting(true)
      router.replace("/auth/youtube-connect")
    }
    run()
  }, [isAuthenticated, router])

  if (isSubmitting || hasOauthToken || redirecting) {
    return renderFullScreenLoader()
  }

  return (
      <div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <>
        {/* Session Conflict Dialog */}
        {conflictInfo && (
          <SessionConflictDialog
            open={showConflictDialog}
            currentUserEmail={conflictInfo.currentEmail}
            newUserEmail={conflictInfo.newEmail}
            onConfirm={handleConfirmSwitch}
            onCancel={handleCancelSwitch}
          />
        )}
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:opacity-90 transition-opacity crypto-primary-gradient crypto-glow">
              <Play className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-2xl font-bold crypto-text-primary">YouTube Automator</span>
          </Link>
        </div>

        <Card className="shadow-lg crypto-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl crypto-text-primary">Welcome Back</CardTitle>
            <CardDescription className="crypto-text-secondary">Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="email" className="crypto-text-primary">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="crypto-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="crypto-text-primary">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="crypto-input"
                  />
                  <button
                    type="button"
                    className="absolute right-2 sm:right- top-1/2 -translate-y-1/2 crypto-text-tertiary hover:crypto-text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="#" className="text-sm crypto-text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className={cn(
                  "w-full crypto-button-primary",
                  isSubmitting && "bg-[var(--brand-primary-dark)] border-[var(--brand-primary-dark)]"
                )}
                disabled={isSubmitting}
              >
                {"Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 crypto-text-secondary">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <GoogleLoginButton />

            <div className="mt-6 text-center">
              <p className="text-sm crypto-text-secondary">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="crypto-text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm crypto-text-secondary hover:crypto-text-primary">
            ← Back to home
          </Link>
        </div>
        </>
      </div>
      </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
