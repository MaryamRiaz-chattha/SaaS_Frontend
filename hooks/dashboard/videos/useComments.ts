"use client";

import { useState, useEffect, useCallback } from "react";

export interface Comment {
  comment_id: string;
  parent_comment_id: string | null;
  author_display_name: string;
  author_channel_id: string;
  author_profile_image_url: string;
  text_display: string;
  text_original: string;
  like_count: number;
  published_at: string;
  updated_at: string;
  is_reply: boolean;
  reply_count: number;
}

export interface CommentsResponse {
  success: boolean;
  message: string;
  data: {
    video_id: string;
    total_comments: number;
    comments: Comment[];
    limit: number;
    refresh: boolean;
    comments_source: string;
  };
}

interface UseCommentsParams {
  videoId: string;
  limit?: number;
  refresh?: boolean;
  includeReplies?: boolean;
}

interface ReplyCommentParams {
  parent_comment_id: string;
  reply_text: string;
}

const useComments = ({ 
  videoId, 
  limit = 20, 
  refresh = true, 
  includeReplies = true 
}: UseCommentsParams) => {
  const [data, setData] = useState<CommentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async (refreshData: boolean = refresh) => {
    console.log("🔄 Starting fetchComments with params:", {
      videoId,
      limit,
      refresh: refreshData,
      includeReplies,
    });

    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      console.log("🔑 Auth token found:", token ? "Yes" : "No");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://saas-backend.duckdns.org";
      const params = new URLSearchParams({
        limit: limit.toString(),
        refresh: refreshData.toString(),
        include_replies: includeReplies.toString(),
      });

      const url = `${API_BASE_URL}/comments/${videoId}?${params}`;
      console.log("🌐 Making API request to:", url);
      console.log("📋 Request headers:", {
        "accept": "application/json",
        "Authorization": `Bearer ${token.substring(0, 20)}...`,
      });

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("📡 Response status:", response.status, response.statusText);
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP Error Response:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result: CommentsResponse = await response.json();
      console.log("✅ API Response received:", {
        success: result.success,
        message: result.message,
        dataStructure: {
          video_id: result.data?.video_id,
          total_comments: result.data?.total_comments,
          comments_count: result.data?.comments?.length,
          limit: result.data?.limit,
          refresh: result.data?.refresh,
          comments_source: result.data?.comments_source,
        },
        comments: result.data?.comments?.map(c => ({
          id: c.comment_id,
          author: c.author_display_name,
          text: c.text_display.substring(0, 50) + "...",
          is_reply: c.is_reply,
          reply_count: c.reply_count,
        })),
      });

      if (result.success) {
        console.log("✅ Setting data successfully");
        setData(result);
      } else {
        console.error("❌ API returned success: false", result.message);
        throw new Error(result.message || "Failed to fetch comments");
      }
    } catch (err) {
      console.error("💥 Error in fetchComments:", {
        error: err,
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      console.log("🏁 fetchComments completed, setting loading to false");
      setIsLoading(false);
    }
  }, [videoId, limit, refresh, includeReplies]);

  useEffect(() => {
    console.log("🎯 useEffect triggered with:", { videoId, limit, refresh, includeReplies });
    if (videoId) {
      console.log("🚀 Calling fetchComments from useEffect");
      fetchComments(refresh);
    } else {
      console.log("⚠️ No videoId provided, skipping fetch");
    }
  }, [videoId, limit, refresh, includeReplies, fetchComments]);

  const deleteComment = useCallback(async (commentId: string) => {
    console.log("🗑️ Starting deleteComment for:", commentId);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://saas-backend.duckdns.org";
      const url = `${API_BASE_URL}/comments/${commentId}`;
      
      console.log("🌐 Making DELETE request to:", url);
      
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("📡 Delete response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Delete Error Response:", errorText);
        
        // Check for specific error types
        if (response.status === 403 && errorText.includes('quota')) {
          throw new Error("YouTube API quota exceeded. Please try again later or contact support.");
        }
        
        throw new Error(`Failed to delete comment: ${response.status} - ${errorText}`);
      }

      console.log("✅ Comment deleted successfully");
      // Refresh comments after deletion
      await fetchComments(true);
      
      return true;
    } catch (err) {
      console.error("💥 Error in deleteComment:", err);
      throw err;
    }
  }, [fetchComments]);

  const replyToComment = useCallback(async ({ parent_comment_id, reply_text }: ReplyCommentParams) => {
    console.log("💬 Starting replyToComment:", { parent_comment_id, reply_text });
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://saas-backend.duckdns.org";
      const url = `${API_BASE_URL}/comments/reply`;
      
      console.log("🌐 Making POST request to:", url);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_comment_id,
          reply_text,
        }),
      });

      console.log("📡 Reply response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Reply Error Response:", errorText);
        
        // Check for specific error types
        if (response.status === 403 && errorText.includes('quota')) {
          throw new Error("YouTube API quota exceeded. Please try again later or contact support.");
        }
        
        throw new Error(`Failed to reply to comment: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ Reply posted successfully:", result);
      
      // Refresh comments after posting reply
      await fetchComments(true);
      
      return result;
    } catch (err) {
      console.error("💥 Error in replyToComment:", err);
      throw err;
    }
  }, [fetchComments]);

  const returnData = {
    data: data?.data || null,
    comments: data?.data?.comments || [],
    totalComments: data?.data?.total_comments || 0,
    isLoading,
    error,
    refetch: () => {
      console.log("🔄 Manual refetch called");
      fetchComments(true);
    },
    refreshComments: () => {
      console.log("🔄 Manual refreshComments called");
      fetchComments(true);
    },
    deleteComment,
    replyToComment,
  };

  console.log("📊 useComments returning:", {
    isLoading: returnData.isLoading,
    error: returnData.error,
    commentsCount: returnData.comments.length,
    totalComments: returnData.totalComments,
    hasData: !!returnData.data,
  });

  return returnData;
};

export default useComments;
