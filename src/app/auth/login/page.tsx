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
import { useToast } from "@/lib/hooks/common/useToast"
import { cn } from "@/lib/utils"

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const renderFullScreenLoader = (text: string) => (
    <div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4">
      <div className="flex items-center gap-3 text-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>{text}</span>
      </div>
    </div>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

  useEffect(() => {
    router.prefetch('/dashboard')
    router.prefetch('/auth/youtube-connect')
  }, [router])

  // If a token already exists, immediately route to connect with loader
  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('auth_token')
    if (!token) return
    const userData = localStorage.getItem('user_data')
    if (!userData) {
      const minimalUser = {
        id: 'user', email: '', username: '', full_name: '', is_active: true,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }
      try { localStorage.setItem('user_data', JSON.stringify(minimalUser)) } catch {}
    }
    setRedirecting(true)
    router.replace('/auth/youtube-connect')
  }, [router])

  // Handle Google callback variants that pass token directly in URL
  useEffect(() => {
    if (typeof window === 'undefined') return
    const tokenFromUrl = searchParams.get('access_token') || searchParams.get('token')
    const userFromUrl = searchParams.get('user')
    const emailFromUrl = searchParams.get('email')
    if (!tokenFromUrl) return

    try {
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
      }
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

  // If already authenticated, go to connect page which will decide final destination
  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated) return
      setRedirecting(true)
      router.replace("/auth/youtube-connect")
    }
    run()
  }, [isAuthenticated, router])

  if (isSubmitting || hasOauthToken || redirecting) {
    return renderFullScreenLoader('Signing you in...')
  }

  return (
      <div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <>
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
    <Suspense fallback={<div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4"><div className="flex items-center gap-3 text-foreground"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading...</span></div></div>}>
      <LoginContent />
    </Suspense>
  )
}
