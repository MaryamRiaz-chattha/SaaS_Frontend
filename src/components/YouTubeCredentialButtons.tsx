"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useCredential from "@/lib/hooks/ai/useCredential"
import { Loader2 } from 'lucide-react';

export default function YouTubeCredentialButtons() {
  const { 
    getYouTubeToken, 
    refreshYouTubeToken, 
    createYouTubeToken, 
    isLoading, 
    token, 
    error, 
    authUrl, 
    message, 
    openAuthUrl 
  } = useCredential();
  
  const [showToken, setShowToken] = useState(false);

  const handleOpenAuthUrl = () => {
    if (authUrl) {
      openAuthUrl(authUrl);
    }
  };

  const formatDateTime = (dateTimeStr?: string) => {
    if (!dateTimeStr) return 'N/A';
    try {
      return new Date(dateTimeStr).toLocaleString();
    } catch (e) {
      return dateTimeStr;
    }
  };

  const maskToken = (token?: string) => {
    if (!token) return 'N/A';
    return showToken ? token : `${token.slice(0, 8)}...${token.slice(-6)}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>YouTube API Credentials</CardTitle>
        <CardDescription>
          Manage your YouTube API tokens and authorization
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 justify-start">
          <Button 
            variant="outline" 
            onClick={getYouTubeToken} 
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : 'Get YouTube Token'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={refreshYouTubeToken} 
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : 'Refresh YouTube Token'}
          </Button>
          
          <Button 
            variant="default" 
            onClick={createYouTubeToken} 
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : 'Create New YouTube Token'}
          </Button>
          
          {authUrl && (
            <Button 
              variant="secondary" 
              onClick={handleOpenAuthUrl}
              className="ml-auto"
            >
              Open Authorization URL
            </Button>
          )}
        </div>
        
        {message && (
          <div className="p-4 bg-profit/10 rounded-md crypto-profit crypto-glow">
            {message}
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md text-red-700 dark:text-red-300">
            Error: {error}
          </div>
        )}
        
        {token && (
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Token Details</h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowToken(!showToken)}
                size="sm"
              >
                {showToken ? 'Hide Tokens' : 'Show Tokens'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/40 rounded-md">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Access Token</p>
                <p className="break-all">{maskToken(token.access_token)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Refresh Token</p>
                <p className="break-all">{maskToken(token.refresh_token)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Token Type</p>
                <p>{token.token_type}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expires In</p>
                <p>{token.expires_in} seconds</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expires At</p>
                <p>{formatDateTime(token.expires_at)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p>{formatDateTime(token.created_at)}</p>
              </div>
              
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Scope</p>
                <p className="text-xs break-all">{token.scope}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <p className="text-xs text-muted-foreground">
          Token ID: {token?.id || 'N/A'} | User ID: {token?.user_id || 'N/A'}
        </p>
      </CardFooter>
    </Card>
  );
}
