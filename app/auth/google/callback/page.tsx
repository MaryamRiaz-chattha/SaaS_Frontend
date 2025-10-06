"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import useGoogleAuth from '@/hooks/auth/useGoogleAuth';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback, isLoading, error } = useGoogleAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        setStatus('error');
        setMessage(`Google OAuth error: ${error}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received from Google');
        return;
      }

      try {
        setStatus('loading');
        setMessage('Authenticating with Google...');
        
        await handleGoogleCallback(code, state || undefined);
        
        setStatus('success');
        setMessage('Successfully authenticated! Redirecting...');
        
        // Redirect will be handled by the hook
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Authentication failed');
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen crypto-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg crypto-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl crypto-text-primary">Google Authentication</CardTitle>
            <CardDescription className="crypto-text-secondary">
              Processing your Google login...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>
            
            <p className={`font-medium ${getStatusColor()}`}>
              {message}
            </p>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
