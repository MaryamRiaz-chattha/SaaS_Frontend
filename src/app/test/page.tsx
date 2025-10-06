"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useYouTubeCredentials } from '@/lib/hooks/youtube'
import useCredential from '@/lib/hooks/ai/useCredential'
import { useAuth } from '@/lib/hooks/auth'

export default function TestPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { 
    checkYouTubeCredentials, 
    hasCredentials, 
    isChecking, 
    error: credentialsError,
    credentials 
  } = useYouTubeCredentials()
  
  const { 
    getYouTubeToken, 
    isLoading: tokenLoading, 
    error: tokenError,
    token 
  } = useCredential()
  
  const [testResults, setTestResults] = useState<{
    credentialsTest?: 'success' | 'error' | 'loading'
    tokenTest?: 'success' | 'error' | 'loading'
  }>({})

  const testCredentials = async () => {
    setTestResults(prev => ({ ...prev, credentialsTest: 'loading' }))
    try {
      const result = await checkYouTubeCredentials(true)
      setTestResults(prev => ({ ...prev, credentialsTest: 'success' }))
      console.log('✅ Credentials test result:', result)
    } catch (error) {
      setTestResults(prev => ({ ...prev, credentialsTest: 'error' }))
      console.error('❌ Credentials test error:', error)
    }
  }

  const testToken = async () => {
    setTestResults(prev => ({ ...prev, tokenTest: 'loading' }))
    try {
      const result = await getYouTubeToken()
      setTestResults(prev => ({ ...prev, tokenTest: 'success' }))
      console.log('✅ Token test result:', result)
    } catch (error) {
      setTestResults(prev => ({ ...prev, tokenTest: 'error' }))
      console.error('❌ Token test error:', error)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please login to test the API integrations</CardDescription>
          </CardHeader>
        </Card>
    </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">API Integration Test</h1>
          <p className="text-muted-foreground mt-2">
            Test the YouTube credentials and token status APIs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Credentials Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                YouTube Credentials Test
              </CardTitle>
              <CardDescription>
                Test the /youtube-credentials/status endpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testCredentials} 
                disabled={isChecking || testResults.credentialsTest === 'loading'}
                className="w-full"
              >
                {isChecking || testResults.credentialsTest === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Credentials API'
                )}
              </Button>

              {testResults.credentialsTest === 'success' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Credentials API test successful!
                  </AlertDescription>
                </Alert>
              )}

              {testResults.credentialsTest === 'error' && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    ❌ Credentials API test failed
                  </AlertDescription>
                </Alert>
              )}

              {credentialsError && (
                <Alert variant="destructive">
                  <AlertDescription>{credentialsError}</AlertDescription>
                </Alert>
              )}

              {credentials && (
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Credentials Response:</h4>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(credentials, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                YouTube Token Test
              </CardTitle>
              <CardDescription>
                Test the /youtube/status endpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testToken} 
                disabled={tokenLoading || testResults.tokenTest === 'loading'}
                className="w-full"
              >
                {tokenLoading || testResults.tokenTest === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Token API'
                )}
              </Button>

              {testResults.tokenTest === 'success' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Token API test successful!
                  </AlertDescription>
                </Alert>
              )}

              {testResults.tokenTest === 'error' && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    ❌ Token API test failed
                  </AlertDescription>
                </Alert>
              )}

              {tokenError && (
                <Alert variant="destructive">
                  <AlertDescription>{tokenError}</AlertDescription>
                </Alert>
              )}

              {token && (
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Token Response:</h4>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(token, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Current State */}
        <Card>
          <CardHeader>
            <CardTitle>Current State</CardTitle>
            <CardDescription>
              Real-time status of credentials and token checks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Credentials Status:</h4>
                <p className="text-sm">
                  Has Credentials: {hasCredentials ? '✅ Yes' : '❌ No'}
                </p>
                <p className="text-sm">
                  Is Checking: {isChecking ? '⏳ Yes' : '✅ No'}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Token Status:</h4>
                <p className="text-sm">
                  Token Loading: {tokenLoading ? '⏳ Yes' : '✅ No'}
                </p>
                <p className="text-sm">
                  Has Token: {token ? '✅ Yes' : '❌ No'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}