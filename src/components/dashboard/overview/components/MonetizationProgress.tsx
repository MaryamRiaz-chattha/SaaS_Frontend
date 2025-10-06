import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap } from "lucide-react"

interface MonetizationProgressProps {
  channelInfo: {
    subscriber_count: number
  }
  summaryStats: {
    total_watch_time_hours: number
  }
}

export default function MonetizationProgress({ 
  channelInfo, 
  summaryStats 
}: MonetizationProgressProps) {
  // Calculate monetization progress (using placeholder values since not in API)
  const monetizationRequirements = {
    subscriber_count_required: 1000,
    watch_time_required: 4000,
    current_subscribers: channelInfo.subscriber_count,
    current_watch_time: summaryStats.total_watch_time_hours,
    subscriber_progress: (channelInfo.subscriber_count / 1000) * 100,
    watch_time_progress: (summaryStats.total_watch_time_hours / 4000) * 100
  }

  return (
    <Card className="border-profit/20 bg-profit/10 crypto-glow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 crypto-profit" />
          Monetization Progress
        </CardTitle>
        <CardDescription>
          Track your progress towards YouTube Partner Program eligibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Subscribers</span>
              <span>{monetizationRequirements.current_subscribers}/{monetizationRequirements.subscriber_count_required}</span>
            </div>
            <Progress 
              value={Math.min(monetizationRequirements.subscriber_progress, 100)} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.max(monetizationRequirements.subscriber_count_required - monetizationRequirements.current_subscribers, 0)} more needed
            </p>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Watch Time (hours)</span>
              <span>{monetizationRequirements.current_watch_time.toFixed(1)}/{monetizationRequirements.watch_time_required}</span>
            </div>
            <Progress 
              value={Math.min(monetizationRequirements.watch_time_progress, 100)} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.max(monetizationRequirements.watch_time_required - monetizationRequirements.current_watch_time, 0).toFixed(1)} more hours needed
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
