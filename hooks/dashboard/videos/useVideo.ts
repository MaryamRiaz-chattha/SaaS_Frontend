"use client";

import { useState, useEffect, useCallback } from 'react';
import { SingleVideoResponse } from '@/types/dashboard/videos';

const useVideo = (videoId: string) => {
  const [data, setData] = useState<SingleVideoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (refresh: boolean = false) => {
    console.log('🚀 Starting fetchData function', { refresh });
    
    if (!videoId) {
      console.log('❌ No videoId provided');
      setIsLoading(false);
      return;
    }

    console.log('📡 Setting loading to true and starting fetch');
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      console.log('🎫 Token retrieved:', token ? 'exists' : 'missing');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('📞 Making API call to:', `https://backend.postsiva.com/single-video/${videoId}`);
      console.log('🆔 Video ID being used:', videoId);
      console.log('🔍 Video ID format check:', {
        isYouTubeId: /^[a-zA-Z0-9_-]{11}$/.test(videoId),
        isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(videoId),
        length: videoId.length,
        startsWithV: videoId.startsWith('v')
      });
      
      const params = new URLSearchParams({
        refresh: refresh.toString(),
      });
      
      const response = await fetch(`https://backend.postsiva.com/single-video/${videoId}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
        },
      });
      
      console.log('📋 API Response:', response);
      console.log('✅ Response status:', response.status);
      console.log('📊 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ API Error Response:', errorData);
        
        // Handle specific error cases
        if (response.status === 422) {
          console.error('🚨 422 Error - Validation Failed:', errorData);
          throw new Error(`API validation error: ${errorData.message || 'Invalid request parameters'}`);
        }
        
        throw new Error(errorData.message || `Failed to fetch video details (Status: ${response.status})`);
      }

      const raw = await response.json();
      console.log('📊 Raw API Response:', raw);
      
      // Map to SingleVideoResponse shape from backend response
      // The new API has data.video_details structure
      const videoDetails = raw?.data?.video_details || raw?.data?.video || {};
      
      const mapped: SingleVideoResponse = {
        success: !!raw?.success,
        message: raw?.message || '',
        data: {
          video_id: videoDetails?.video_id || '',
          title: videoDetails?.title || '',
          description: videoDetails?.description || '',
          published_at: videoDetails?.published_at || new Date().toISOString(),
          youtube_url: videoDetails?.youtube_video_url || '',
          thumbnail_url: videoDetails?.thumbnail_link || '',
          privacy_status: videoDetails?.privacy_status || 'private',
          view_count: videoDetails?.view_count ?? 0,
          like_count: videoDetails?.like_count ?? 0,
          comment_count: videoDetails?.comment_count ?? 0,
          duration: videoDetails?.duration || 'PT0S',
          duration_seconds: videoDetails?.duration_seconds ?? 0,
          duration_minutes: videoDetails?.duration_minutes ?? 0,
          engagement_rate: videoDetails?.engagement_rate ?? 0,
          performance_score: videoDetails?.performance_score ?? 0,
          days_since_published: videoDetails?.days_since_published ?? 0,
          likes_per_view_percentage: 0,
          comments_per_view_percentage: 0,
          views_per_day: videoDetails?.views_per_day ?? 0,
          watch_time_hours: videoDetails?.watch_time_minutes ? videoDetails.watch_time_minutes / 60 : 0,
          performance_level: '',
          engagement_level: '',
          content_type: '',
          content_category: videoDetails?.playlist_name || videoDetails?.playlist || '',
          growth_potential: '',
          tags: [],
          category_id: '',
          default_language: '',
          default_audio_language: '',
          analytics_summary: {
            total_engagement: 0,
            engagement_breakdown: {
              likes_percentage: 0,
              comments_percentage: 0,
            },
            performance_indicators: {
              is_high_performing: false,
              is_viral_potential: false,
              is_high_engagement: false,
            },
          },
          recommendations: [],
        }
      };
      console.log('🎬 Mapped Video Result:', mapped);
      setData(mapped);
    } catch (err: any) {
      console.log('💥 Error caught:', err);
      setError(err.message);
    } finally {
      console.log('🏁 Setting loading to false');
      setIsLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    console.log('🎯 useVideo useEffect triggered with videoId:', videoId);
    console.log('🔄 Calling fetchData function');
    fetchData(false); // Initial load with refresh=false
  }, [videoId, fetchData]);

  return { 
    data, 
    video: data?.data || null, 
    isLoading, 
    error,
    refetch: () => fetchData(true) // Refresh with refresh=true
  };
};

export default useVideo;
