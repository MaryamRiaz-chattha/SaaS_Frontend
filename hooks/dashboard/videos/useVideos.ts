"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { DashboardVideosResponse, VideoStats } from '@/types/dashboard/videos';

const useVideos = () => {
  const [data, setData] = useState<DashboardVideosResponse | null>(null);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [displayedVideos, setDisplayedVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const VIDEOS_PER_PAGE = 12; // Videos per page for display

  const mapVideoData = useCallback((v: any) => {
    const publishedAt = v.published_at || v.created_at || new Date().toISOString();
    const youtubeId = v.youtube_video_id || v.video_id || null;
    const daysSince = (() => {
      const then = new Date(publishedAt).getTime();
      const now = Date.now();
      const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
      return Number.isFinite(diffDays) ? diffDays : 0;
    })();

    return {
      video_id: youtubeId || v.id || String(Math.random()),
      title: v.title || "Untitled",
      description: v.description || "",
      published_at: publishedAt,
      thumbnail_url: v.thumbnail_url || "",
      channel_title: "",
      tags: [],
      view_count: v.view_count ?? 0,
      like_count: v.like_count ?? 0,
      comment_count: v.comment_count ?? 0,
      duration: v.duration || "PT0S",
      duration_seconds: v.duration_seconds ?? 0,
      privacy_status: v.privacy_status || v.video_status || "private",
      analytics: {
        view_count: v.view_count ?? 0,
        like_count: v.like_count ?? 0,
        comment_count: v.comment_count ?? 0,
        duration: v.duration || "PT0S",
        duration_seconds: v.duration_seconds ?? 0,
        privacy_status: v.privacy_status || v.video_status || "private",
        published_at: publishedAt,
        title: v.title || "Untitled",
        description: v.description || "",
        tags: [],
        category_id: "",
        default_language: null as any,
        default_audio_language: null as any,
      },
      engagement_rate: v.engagement_rate ?? 0,
      performance_score: v.performance_score ?? 0,
      days_since_published: daysSince,
    };
  }, []);

  const fetchData = async (refresh: boolean = false) => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams({
        refresh: refresh.toString(),
        limit: '50', // Request more videos to work with
        offset: '0',
      });

      const response = await fetch(`https://backend.postsiva.com/dashboard-overview/videos?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard videos');
      }

      const raw = await response.json();
      const videos = Array.isArray(raw?.data?.videos) ? raw.data.videos : [];

      // Map backend videos to dashboard video shape with safe defaults
      const mappedVideos = videos.map(mapVideoData);

      setAllVideos(mappedVideos);
      
      // Show first page of videos
      const initialVideos = mappedVideos.slice(0, VIDEOS_PER_PAGE);
      setDisplayedVideos(initialVideos);
      
      // Check if there are more videos to load
      setHasMore(mappedVideos.length > VIDEOS_PER_PAGE);

      const result: DashboardVideosResponse = {
        success: !!raw?.success,
        message: raw?.message || "",
        data: mappedVideos,
        count: mappedVideos.length,
      };

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreVideos = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const nextPage = currentPage + 1;
      const startIndex = nextPage * VIDEOS_PER_PAGE - VIDEOS_PER_PAGE;
      const endIndex = startIndex + VIDEOS_PER_PAGE - 1;
      
      const moreVideos = allVideos.slice(startIndex, endIndex + 1);
      
      if (moreVideos.length > 0) {
        setDisplayedVideos(prev => [...prev, ...moreVideos]);
        setCurrentPage(nextPage);
        
        // Check if there are more videos to load
        const remainingVideos = allVideos.length - (endIndex + 1);
        setHasMore(remainingVideos > 0);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentPage, allVideos]);

  useEffect(() => {
    fetchData(false); // Initial load with refresh=false
  }, []);

  // Calculate video stats
  const videoStats: VideoStats = useMemo(() => {
    if (!allVideos.length) {
      return {
        totalVideos: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        avgEngagement: 0,
        avgPerformanceScore: 0,
      };
    }

    const videos = allVideos;
    const totalVideos = videos.length;
    const totalViews = videos.reduce((sum, video) => sum + video.view_count, 0);
    const totalLikes = videos.reduce((sum, video) => sum + video.like_count, 0);
    const totalComments = videos.reduce((sum, video) => sum + video.comment_count, 0);
    
    const avgEngagement = totalVideos > 0 
      ? videos.reduce((sum, video) => sum + video.engagement_rate, 0) / totalVideos 
      : 0;
    
    const avgPerformanceScore = totalVideos > 0 
      ? videos.reduce((sum, video) => sum + video.performance_score, 0) / totalVideos 
      : 0;

    return {
      totalVideos,
      totalViews,
      totalLikes,
      totalComments,
      avgEngagement: parseFloat(avgEngagement.toFixed(2)),
      avgPerformanceScore: parseFloat(avgPerformanceScore.toFixed(2)),
    };
  }, [allVideos]);

  return { 
    data, 
    videos: displayedVideos, // Return only displayed videos for pagination
    allVideos: allVideos, // Return all videos for stats calculation
    videoStats, 
    isLoading, 
    isLoadingMore,
    error,
    hasMore,
    loadMoreVideos,
    refetch: () => {
      setCurrentPage(1);
      fetchData(true); // Refresh with refresh=true
    }
  };
};

export default useVideos;
