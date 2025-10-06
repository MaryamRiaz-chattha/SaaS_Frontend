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
import { Checkbox } from "@/components/ui/checkbox"
import { Play, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"
import useAuth from "@/hooks/auth/useAuth"
import GoogleLoginButton from "@/components/auth/GoogleLoginButton"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    full_name: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { signup } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    if (!acceptTerms) {
      setError("Please accept the terms and conditions")
      return false
    }
    if (!formData.username.trim()) {
      setError("Username is required")
      return false
    }
    if (!formData.full_name.trim()) {
      setError("Full name is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await signup({
        email: formData.email,
        username: formData.username,
        full_name: formData.full_name,
        password: formData.password,
      })

      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg crypto-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto crypto-primary-gradient crypto-glow">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold crypto-text-primary">Account Created!</h2>
              <p className="crypto-text-secondary">
                Your account has been successfully created. Redirecting to login...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            <CardTitle className="text-2xl crypto-text-primary">Create Account</CardTitle>
            <CardDescription className="crypto-text-secondary">Start your YouTube automation journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="crypto-text-primary">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="crypto-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name" className="crypto-text-primary">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="crypto-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="crypto-text-primary">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="crypto-input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 crypto-text-tertiary hover:crypto-text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="crypto-text-primary">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="crypto-input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 crypto-text-tertiary hover:crypto-text-primary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm crypto-text-secondary">
                  I agree to the{" "}
                  <Link href="#" className="crypto-text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="crypto-text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full crypto-button-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
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
                Already have an account?{" "}
                <Link href="/auth/login" className="crypto-text-primary hover:underline font-medium">
                  Sign in
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
