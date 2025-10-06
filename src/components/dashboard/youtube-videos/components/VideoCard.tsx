import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Clock, Eye, ThumbsUp, MessageCircle } from "lucide-react"
import Link from "next/link"
import { VideoData } from "@/types/dashboard/youtube-videos"
import { asNumber, safeFormatDate, safeFormatDuration } from "@/lib/utils"

interface VideoCardProps {
  video: VideoData
}

export default function VideoCard({ video }: VideoCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "public":
        return <CheckCircle className="h-4 w-4 crypto-profit" />
      case "private":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "unlisted":
        return <Clock className="h-4 w-4 crypto-text-secondary" />
      default:
        return null
    }
  }

  // Using utility functions from lib/utils.ts

  const getThumbnailUrl = () => {
    if (video.thumbnail_url && !video.thumbnail_url.includes('i9.ytimg.com')) {
      return video.thumbnail_url
    }
    return `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] h-full flex flex-col group">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Thumbnail Section */}
        <div className="relative">
          <img
            src={getThumbnailUrl()}
            alt={video.title}
            className="w-full h-40 sm:h-44 lg:h-40 xl:h-44 2xl:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement
              // First fallback to HQ default, then to placeholder
              if (!img.dataset.fallback) {
                img.dataset.fallback = 'hq'
                img.src = `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`
              } else {
                img.src = '/placeholder.jpg'
              }
            }}
          />
          
          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-white/90 backdrop-blur-sm">
              {getStatusIcon(video.privacy_status)}
              <span className="hidden sm:inline lg:hidden xl:inline">{video.privacy_status}</span>
            </Badge>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
            {safeFormatDuration(video.duration)}
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-3 sm:p-4 lg:p-3 xl:p-4 space-y-3 flex-1 flex flex-col">
          {/* Title and Description */}
          <div className="flex-1">
            <h3 className="font-semibold text-sm lg:text-xs xl:text-sm line-clamp-2 mb-2 leading-tight group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            <p className="text-xs lg:text-[11px] xl:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs lg:text-[11px] xl:text-xs">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="h-3 w-3 text-blue-500" />
                                      <span className="font-medium truncate">{asNumber(video.view_count).toLocaleString()}</span>
                    </div>
                    <div className="text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ThumbsUp className="h-3 w-3 crypto-profit" />
                      <span className="font-medium">{asNumber(video.like_count)}</span>
                    </div>
                    <div className="text-muted-foreground">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MessageCircle className="h-3 w-3 text-purple-500" />
                      <span className="font-medium">{asNumber(video.comment_count)}</span>
                    </div>
                    <div className="text-muted-foreground">Comments</div>
                  </div>
          </div>
          
          
          {/* Date and Time */}
          <div className="flex items-center justify-between text-xs lg:text-[11px] xl:text-xs text-muted-foreground">
            <span className="truncate">{safeFormatDate(video.published_at)}</span>
            <span className="whitespace-nowrap ml-2">{asNumber(video.days_since_published)}d ago</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 mt-auto pt-2">
            <Button 
              asChild 
              size="sm" 
              className="flex-1 crypto-button-primary text-xs lg:text-[11px] xl:text-xs h-8"
            >
              <Link href={`/dashboard/videos/${video.video_id}`}>
                <span className="hidden sm:inline lg:hidden xl:inline">View Details</span>
                <span className="sm:hidden lg:inline xl:hidden">Details</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="sm:w-auto lg:w-full xl:w-auto text-xs lg:text-[11px] xl:text-xs h-8"
            >
              <Link href={`https://www.youtube.com/watch?v=${video.video_id}`} target="_blank">
                Watch
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
