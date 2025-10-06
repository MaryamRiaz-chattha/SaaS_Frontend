"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

interface TopVideosChartProps {
  topVideos: {
    top_video_by_views: {
      video_id: string;
      title: string;
      views: number;
      likes: number;
      comments: number;
      published_at: string;
      engagement_rate: number;
    };
    top_video_by_likes: {
      video_id: string;
      title: string;
      views: number;
      likes: number;
      comments: number;
      published_at: string;
      engagement_rate: number;
    };
  };
}

export default function TopVideosChart({ topVideos }: TopVideosChartProps) {
  const chartData = [
    {
      title: topVideos.top_video_by_views.title.length > 15 
        ? topVideos.top_video_by_views.title.substring(0, 15) + "..." 
        : topVideos.top_video_by_views.title,
      views: topVideos.top_video_by_views.views,
      likes: topVideos.top_video_by_views.likes,
      comments: topVideos.top_video_by_views.comments,
      engagement: topVideos.top_video_by_views.engagement_rate,
    },
    {
      title: topVideos.top_video_by_likes.title.length > 15 
        ? topVideos.top_video_by_likes.title.substring(0, 15) + "..." 
        : topVideos.top_video_by_likes.title,
      views: topVideos.top_video_by_likes.views,
      likes: topVideos.top_video_by_likes.likes,
      comments: topVideos.top_video_by_likes.comments,
      engagement: topVideos.top_video_by_likes.engagement_rate,
    }
  ]

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
        <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Top Performing Videos</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Best performing content by views and engagement</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="w-full overflow-hidden">
          <ChartContainer
            config={{
              views: {
                label: "Views",
                color: "#FD1D1D",
              },
              likes: {
                label: "Likes",
                color: "#FF6B35",
              },
              comments: {
                label: "Comments",
                color: "#F7931E",
              },
              engagement: {
                label: "Engagement %",
                color: "#FFA500",
              },
            }}
            className="h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                layout="horizontal"
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number" 
                  stroke="#9CA3AF" 
                  fontSize={8}
                  tickMargin={3}
                />
                <YAxis 
                  dataKey="title" 
                  type="category" 
                  width={60}
                  stroke="#9CA3AF" 
                  fontSize={7}
                  tickMargin={3}
                  interval={0}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />} 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="views" fill="#FD1D1D" name="Views" radius={[0, 2, 2, 0]} />
                <Bar dataKey="likes" fill="#FF6B35" name="Likes" radius={[0, 2, 2, 0]} />
                <Bar dataKey="comments" fill="#F7931E" name="Comments" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
