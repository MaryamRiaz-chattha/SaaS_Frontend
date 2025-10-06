import { Badge } from "@/components/ui/badge"
import { Activity, Target } from "lucide-react"
import RefreshButton from "@/components/ui/refresh-button"

interface DashboardHeaderProps {
  channelInfo: {
    title: string
    thumbnail_url: string
    custom_url: string
  }
  channelStatus: {
    growth_stage: string
    is_active: boolean
  }
  competitiveAnalysis: {
    channel_health_score: number
  }
  onRefresh?: () => void | Promise<void>
}

export default function DashboardHeader({ 
  channelInfo, 
  channelStatus, 
  competitiveAnalysis,
  onRefresh
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <img 
            src={channelInfo.thumbnail_url} 
            alt="Channel Avatar" 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {channelInfo.title}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {channelInfo.custom_url} • {channelStatus.growth_stage} Channel
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          Track your YouTube channel performance and automation stats
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={channelStatus.is_active ? "default" : "secondary"}>
            <Activity className="w-3 h-3 mr-1" />
            {channelStatus.is_active ? "Active" : "Inactive"}
          </Badge>
          <Badge variant="outline">
            <Target className="w-3 h-3 mr-1" />
            Health: {competitiveAnalysis.channel_health_score.toFixed(1)}/100
          </Badge>
        </div>
        
        {onRefresh && (
          <RefreshButton 
            onRefresh={onRefresh}
            variant="outline"
            size="sm"
            className="ml-2"
          />
        )}
      </div>
    </div>
  )
}
