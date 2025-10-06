"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TopVideoCardProps {
  video: {
    video_id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    published_at: string;
    engagement_rate: number;
  };
  type: "views" | "likes";
}

export default function TopVideoCard({ video, type }: TopVideoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full overflow-hidden responsive-card">
      <CardHeader className="pb-2 responsive-card-header">
        <CardTitle className="text-sm sm:text-base lg:text-lg truncate">
          Top Video by {type === "views" ? "Views" : "Likes"}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Best performing content by {type === "views" ? "view count" : "likes"}
        </CardDescription>
      </CardHeader>
      <CardContent className="responsive-card-content space-y-3">
        {/* Video Title */}
        <div>
          <h3 className="font-semibold text-sm sm:text-base text-foreground">
            {video.title}
          </h3>
        </div>

        {/* Video Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Views:</span>
            <span className="ml-2 font-semibold">{video.views.toLocaleString()}</span>
          </div>
          
          <div>
            <span className="text-muted-foreground">Likes:</span>
            <span className="ml-2 font-semibold">{video.likes.toLocaleString()}</span>
          </div>
          
          <div>
            <span className="text-muted-foreground">Comments:</span>
            <span className="ml-2 font-semibold">{video.comments.toLocaleString()}</span>
          </div>
          
          <div>
            <span className="text-muted-foreground">Engagement:</span>
            <span className="ml-2 font-semibold">{video.engagement_rate.toFixed(2)}%</span>
          </div>
        </div>

        {/* Published Date */}
        <div className="text-sm">
          <span className="text-muted-foreground">Published:</span>
          <span className="ml-2">{formatDate(video.published_at)}</span>
        </div>

        {/* Video ID */}
        <div className="text-sm">
          <span className="text-muted-foreground">Video ID:</span>
          <span className="ml-2 font-mono">{video.video_id}</span>
        </div>
      </CardContent>
    </Card>
  )
}
