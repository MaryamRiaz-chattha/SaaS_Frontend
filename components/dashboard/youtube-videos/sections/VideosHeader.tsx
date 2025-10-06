import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import RefreshButton from "@/components/ui/refresh-button"

interface VideosHeaderProps {
  onRefresh?: () => void | Promise<void>
}

export default function VideosHeader({ onRefresh }: VideosHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Title Section */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          YouTube Videos
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 sm:mt-3 max-w-2xl mx-auto sm:mx-0">
          Manage your uploaded and processed videos with comprehensive analytics and insights
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 sm:justify-end">
        {onRefresh && (
          <RefreshButton 
            onRefresh={onRefresh}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            <span className="hidden sm:inline">Refresh for live data</span>
            <span className="sm:hidden">Refresh Data</span>
          </RefreshButton>
        )}
        <Button asChild className="w-full sm:w-auto order-1 sm:order-2 crypto-button-primary">
          <Link href="/dashboard/upload" className="flex items-center justify-center">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="hidden sm:inline">Upload New Video</span>
            <span className="sm:hidden">Upload Video</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
