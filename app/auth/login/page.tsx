"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Eye, EyeOff, Loader2 } from "lucide-react"
import useAuth from "@/hooks/auth/useAuth"
import useYouTubeCredentials from "@/hooks/youtube/useYouTubeCredentials"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()
  const { checkYouTubeCredentials } = useYouTubeCredentials()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login({
        email,
        password,
      })
      // After login, silently check YouTube credentials and route accordingly
      try {
        const result: any = await checkYouTubeCredentials(false)
        const hasValidToken = !!result && result.success === true && !!result.data && !!result.data.access_token
        router.push(hasValidToken ? "/dashboard" : "/auth/credential")
      } catch {
        router.push("/auth/credential")
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="crypto-text-primary">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
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
                    disabled={isLoading}
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

              <Button type="submit" className="w-full crypto-button-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

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
      </div>
    </div>
  )
}
