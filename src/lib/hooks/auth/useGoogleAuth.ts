"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  generateSessionId, 
  setSessionId, 
  setActiveUserId,
  removeSessionId,
  removeActiveUserId
} from '@/lib/auth';

interface GoogleAuthStatus {
  google_oauth_configured: boolean;
  redirect_uri: string;
  login_url: string;
}

interface GoogleAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<GoogleAuthStatus | null>(null);
  const router = useRouter();

  // Check Google OAuth configuration status
  const checkGoogleAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('https://backend.postsiva.com/auth/google/status', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check Google auth status');
      }

      const status: GoogleAuthStatus = await response.json();
      setAuthStatus(status);
      return status;
    } catch (err: any) {
      console.error('Error checking Google auth status:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // Initiate Google OAuth login
  const initiateGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First check if Google OAuth is configured
      const status = await checkGoogleAuthStatus();
      
      if (!status?.google_oauth_configured) {
        throw new Error('Google OAuth is not configured');
      }

      // Redirect to Google OAuth login URL
      const loginUrl = `https://backend.postsiva.com${status.login_url}`;
      
      // Store the current URL to redirect back after login
      const currentUrl = window.location.href;
      localStorage.setItem('google_auth_redirect', currentUrl);
      
      console.log('Redirecting to Google OAuth:', loginUrl);
      
      // Redirect to Google OAuth
      window.location.href = loginUrl;
      
    } catch (err: any) {
      console.error('Error initiating Google login:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, [checkGoogleAuthStatus]);

  // Handle Google OAuth callback
  const handleGoogleCallback = useCallback(async (code: string, state?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        code,
        ...(state && { state }),
      });

      const response = await fetch(`https://backend.postsiva.com/auth/google/callback?${params}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to authenticate with Google');
      }

      const authData: GoogleAuthResponse = await response.json();
      
      if (authData.success && authData.token) {
        // Check if there's already an active session with a different user
        const existingToken = localStorage.getItem('auth_token')
        const existingUser = localStorage.getItem('user_data')
        
        if (existingToken && existingUser && authData.user) {
          try {
            const existingUserData = JSON.parse(existingUser)
            if (existingUserData.email !== authData.user.email) {
              console.warn('⚠️ Google login with different account detected')
              console.warn(`⚠️ Current user: ${existingUserData.email}, New user: ${authData.user.email}`)
              
              // Force logout of existing session
              console.log('🔒 Forcing logout of existing session before Google login')
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
        
        // Generate new session ID
        const newSessionId = generateSessionId()
        console.log('🆔 Generated new session ID for Google login:', newSessionId)
        
        // Store the authentication token
        localStorage.setItem('auth_token', authData.token);
        
        // Store user info if available
        if (authData.user) {
          localStorage.setItem('user_data', JSON.stringify(authData.user));
          localStorage.setItem('user_info', JSON.stringify(authData.user));
          
          // Save session data
          setSessionId(newSessionId)
          setActiveUserId(authData.user.id)
        }
        
        console.log('✅ Google authentication successful with session tracking')

        // Get the redirect URL from localStorage
        const redirectUrl = localStorage.getItem('google_auth_redirect');
        localStorage.removeItem('google_auth_redirect');

        // Redirect to the original URL or dashboard
        const targetUrl = redirectUrl && redirectUrl !== window.location.href 
          ? redirectUrl 
          : '/dashboard';
        
        // Quietly fetch and cache Gemini API key (non-blocking, ignore errors)
        try {
          const res = await fetch('https://backend.postsiva.com/gemini-keys/', {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authData.token}`
            },
          })
          if (res.ok) {
            const data = await res.json()
            if (data) {
              if (data.api_key_preview) {
                localStorage.setItem('gemini_api_key_preview', String(data.api_key_preview))
              }
              localStorage.setItem('has_gemini_key', String(!!(data.api_key_preview || data.is_active)))
              console.log('🔑 Cached Gemini key presence from server (Google auth)')
            } else {
              localStorage.setItem('has_gemini_key', 'false')
              localStorage.removeItem('gemini_api_key_preview')
              console.log('ℹ️ No Gemini key found (null) [Google auth]')
            }
          }
        } catch (e) {
          console.warn('⚠️ Gemini key fetch failed after Google login (ignored)')
        }

        router.push(targetUrl);
        
        return authData;
      } else {
        throw new Error(authData.message || 'Authentication failed');
      }
    } catch (err: any) {
      console.error('Error handling Google callback:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Check for Google OAuth callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');

    if (error) {
      setError(`Google OAuth error: ${error}`);
      return;
    }

    if (code) {
      // Redirect to callback page to handle the authentication
      const callbackUrl = `/auth/google/callback?${window.location.search}`;
      window.location.href = callbackUrl;
    }
  }, []);

  // Check Google auth status on mount
  useEffect(() => {
    checkGoogleAuthStatus();
  }, [checkGoogleAuthStatus]);

  return {
    isLoading,
    error,
    authStatus,
    initiateGoogleLogin,
    handleGoogleCallback,
    checkGoogleAuthStatus,
  };
};

export default useGoogleAuth;
