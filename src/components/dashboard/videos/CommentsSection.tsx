"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { MessageCircle, ThumbsUp, RefreshCw, User, Reply, Trash2, Send, Sparkles, Loader2 } from "lucide-react"
import useComments, { Comment } from "@/lib/hooks/dashboard/videos/useComments"
import { toast } from "@/lib/hooks/common/useToast"
// Simple date formatting without external dependencies

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onReply: (parentCommentId: string, replyText: string) => Promise<void>;
  onDelete: (commentId: string) => void;
  // AI reply helpers
  onGenerateAi: (commentId: string, commentText: string) => Promise<void>;
  aiReply?: string;
  isGeneratingAi?: boolean;
}

function CommentItem({ comment, isReply = false, onReply, onDelete, onGenerateAi, aiReply, isGeneratingAi }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    
    setIsSubmittingReply(true);
    try {
      await onReply(comment.comment_id, replyText);
      setReplyText("");
      setIsReplying(false);
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleUseGenerated = async () => {
    if (!aiReply) return;
    setIsSubmittingReply(true);
    try {
      await onReply(comment.comment_id, aiReply);
      toast({ title: "Reply posted", description: "AI-generated reply posted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to post AI reply.", variant: "destructive" });
    } finally {
      setIsSubmittingReply(false);
    }
  }

  return (
    <div className={`space-y-3 ${isReply ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author_profile_image_url} alt={comment.author_display_name} />
          <AvatarFallback className="text-xs">
            {getInitials(comment.author_display_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-foreground truncate">
              {comment.author_display_name}
            </span>
            {isReply && (
              <Badge variant="secondary" className="text-xs">
                Reply
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.published_at)}
            </span>
          </div>
          
          <div className="text-sm text-foreground leading-relaxed">
            {comment.text_display}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <ThumbsUp className="h-3 w-3" />
                <span>{comment.like_count}</span>
              </div>
              {comment.reply_count > 0 && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <MessageCircle className="h-3 w-3" />
                  <span>{comment.reply_count} replies</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(!isReplying)}
                  className="h-6 px-2 text-xs"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => onGenerateAi(comment.comment_id, comment.text_original || comment.text_display)}
                  disabled={!!isGeneratingAi}
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Generating
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI
                    </>
                  )}
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this comment? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(comment.comment_id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {/* AI generated suggestion */}
          {aiReply && !isReplying && (
            <div className="mt-3 p-3 bg-muted/40 rounded-lg border border-muted">
              <div className="text-xs uppercase text-muted-foreground mb-1">AI suggestion</div>
              <div className="text-sm mb-2 whitespace-pre-wrap">{aiReply}</div>
              <div className="flex justify-end">
                <Button size="sm" onClick={handleUseGenerated} disabled={isSubmittingReply}>
                  {isSubmittingReply ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* Reply Form */}
          {isReplying && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[60px] mb-2"
                disabled={isSubmittingReply}
              />
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                  }}
                  disabled={isSubmittingReply}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim() || isSubmittingReply}
                >
                  {isSubmittingReply ? (
                    "Posting..."
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      Post Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CommentsSectionProps {
  videoId: string;
}

export default function CommentsSection({ videoId }: CommentsSectionProps) {
  const { 
    comments, 
    totalComments, 
    isLoading, 
    error, 
    refreshComments,
    deleteComment,
    replyToComment
  } = useComments({ videoId });

  // AI state
  const [aiReplies, setAiReplies] = useState<Record<string, string>>({})
  const [generatingFor, setGeneratingFor] = useState<Record<string, boolean>>({})
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)
  const [isSavingBulk, setIsSavingBulk] = useState(false)

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast({
        title: "Comment deleted",
        description: "The comment has been deleted successfully.",
      });
    } catch (error: any) {
      console.error("Delete comment error:", error);
      
      // Check if it's a quota error
      if (error.message?.includes('quota exceeded')) {
        toast({
          title: "Service Temporarily Unavailable",
          description: "YouTube API quota exceeded. Please try again later or contact support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to delete comment. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleReplyToComment = async (parentCommentId: string, replyText: string) => {
    try {
      await replyToComment({ parent_comment_id: parentCommentId, reply_text: replyText });
      // Refresh after posting reply
      await refreshComments();
    } catch (error: any) {
      console.error("Reply to comment error:", error);
      
      // Check if it's a quota error
      if (error.message?.includes('quota exceeded')) {
        throw new Error("YouTube API quota exceeded. Please try again later or contact support.");
      }
      
      throw error; // Re-throw to be handled by CommentItem
    }
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.postsiva.com";

  const generateAiForOne = async (commentId: string, commentText: string) => {
    try {
      setGeneratingFor(prev => ({ ...prev, [commentId]: true }))
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')

      const payload = { comments: [{ comment_id: commentId, comment_text: commentText }] }
      console.log('[AI][Single] Request → /comments/generate-ai-replies', {
        url: `${API_BASE_URL}/comments/generate-ai-replies`,
        payload,
      })

      const res = await fetch(`${API_BASE_URL}/comments/generate-ai-replies`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const rawText = await res.clone().text().catch(() => '')
      console.log('[AI][Single] Response status', res.status, res.statusText)
      console.log('[AI][Single] Raw body', rawText?.slice(0, 2000))

      if (!res.ok) throw new Error(`AI generation failed: ${res.status}`)
      const data = await res.json()
      console.log('[AI][Single] Parsed JSON', data)

      // Extract from documented schema: generated_replies[0].generated_reply
      const replyText: string | undefined = Array.isArray(data?.generated_replies)
        ? data.generated_replies[0]?.generated_reply
        : undefined

      if (!replyText) throw new Error('No AI reply returned')

      console.log('[AI][Single] Extracted reply text (preview)', replyText.slice(0, 200))
      setAiReplies(prev => ({ ...prev, [commentId]: replyText }))
    } catch (e: any) {
      console.error('[AI][Single] Generation error', { message: e?.message, stack: e?.stack })
      toast({ title: 'AI Error', description: e.message || 'Failed to generate reply', variant: 'destructive' })
    } finally {
      setGeneratingFor(prev => ({ ...prev, [commentId]: false }))
    }
  }

  const generateAiForAll = async () => {
    try {
      setIsGeneratingAll(true)
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')

      // Consider only top-level comments for replies
      const parentComments = comments.filter(c => !c.is_reply)
      const payload = parentComments.map(c => ({ comment_id: c.comment_id, comment_text: c.text_original || c.text_display }))

      console.log('[AI][Bulk] Request → /comments/generate-ai-replies', {
        url: `${API_BASE_URL}/comments/generate-ai-replies`,
        count: payload.length,
        sample: payload.slice(0, 3),
      })

      const res = await fetch(`${API_BASE_URL}/comments/generate-ai-replies`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comments: payload })
      })

      const rawText = await res.clone().text().catch(() => '')
      console.log('[AI][Bulk] Response status', res.status, res.statusText)
      console.log('[AI][Bulk] Raw body', rawText?.slice(0, 2000))

      if (!res.ok) throw new Error(`AI generation failed: ${res.status}`)
      const data = await res.json()
      console.log('[AI][Bulk] Parsed JSON', data)

      // Normalize replies from documented schema: generated_replies[{ comment_id, generated_reply }]
      const map: Record<string, string> = {}
      if (Array.isArray(data?.generated_replies)) {
        data.generated_replies.forEach((r: any) => {
          if (r?.comment_id && r?.generated_reply) map[r.comment_id] = r.generated_reply
        })
      }

      console.log('[AI][Bulk] Mapped replies', { count: Object.keys(map).length, keys: Object.keys(map).slice(0, 10) })
      setAiReplies(map)
      toast({ title: 'AI Replies Ready', description: 'Review and save the generated replies.' })
    } catch (e: any) {
      console.error('[AI][Bulk] Generation error', { message: e?.message, stack: e?.stack })
      toast({ title: 'AI Error', description: e.message || 'Failed to generate replies', variant: 'destructive' })
    } finally {
      setIsGeneratingAll(false)
    }
  }

  const saveAllReplies = async () => {
    try {
      setIsSavingBulk(true)
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')

      const replies = Object.entries(aiReplies)
        .filter(([_, text]) => !!text && text.trim() !== '')
        .map(([comment_id, reply_text]) => ({ parent_comment_id: comment_id, reply_text }))

      if (replies.length === 0) {
        toast({ title: 'No replies to save', description: 'Generate AI replies first.' })
        return
      }

      console.log('[AI][SaveAll] Request → /comments/reply-multiple', {
        url: `${API_BASE_URL}/comments/reply-multiple`,
        count: replies.length,
        sample: replies.slice(0, 3),
      })

      const res = await fetch(`${API_BASE_URL}/comments/reply-multiple`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ replies })
      })

      const rawText = await res.clone().text().catch(() => '')
      console.log('[AI][SaveAll] Response status', res.status, res.statusText)
      console.log('[AI][SaveAll] Raw body', rawText?.slice(0, 2000))

      if (!res.ok) throw new Error(`Failed to save replies: ${res.status}`)

      toast({ title: 'Replies Posted', description: 'All AI replies have been posted.' })
      setAiReplies({})
      await refreshComments()
    } catch (e: any) {
      console.error('[AI][SaveAll] Error', { message: e?.message, stack: e?.stack })
      toast({ title: 'Save Error', description: e.message || 'Failed to save replies', variant: 'destructive' })
    } finally {
      setIsSavingBulk(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-red-600 mb-4">Error loading comments: {error}</p>
            <Button onClick={refreshComments} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group comments by parent-child relationship
  const parentComments = comments.filter(comment => !comment.is_reply);
  const replyComments = comments.filter(comment => comment.is_reply);

  const getRepliesForComment = (parentId: string) => {
    return replyComments.filter(reply => reply.parent_comment_id === parentId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments
            <Badge variant="secondary">{totalComments}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={refreshComments} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" onClick={generateAiForAll} disabled={isGeneratingAll}>
              {isGeneratingAll ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Reply with AI
                </>
              )}
            </Button>
            {Object.keys(aiReplies).length > 0 && (
              <Button size="sm" variant="outline" onClick={saveAllReplies} disabled={isSavingBulk}>
                {isSavingBulk ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save all'
                )}
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Comments from YouTube viewers
        </CardDescription>
      </CardHeader>
      <CardContent>
        {parentComments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments available for this video.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {parentComments.map((comment) => (
              <div key={comment.comment_id}>
                <CommentItem 
                  comment={comment} 
                  onReply={handleReplyToComment}
                  onDelete={handleDeleteComment}
                  onGenerateAi={generateAiForOne}
                  aiReply={aiReplies[comment.comment_id]}
                  isGeneratingAi={!!generatingFor[comment.comment_id]}
                />
                {getRepliesForComment(comment.comment_id).map((reply) => (
                  <CommentItem 
                    key={reply.comment_id} 
                    comment={reply} 
                    isReply 
                    onReply={handleReplyToComment}
                    onDelete={handleDeleteComment}
                    onGenerateAi={async () => {}}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
