import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Upload, Search, Settings, X } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  searchQuery?: string
  selectedStatus?: string
  onClearFilters: () => void
}

export default function EmptyState({ searchQuery, selectedStatus, onClearFilters }: EmptyStateProps) {
  const hasFilters = searchQuery || selectedStatus !== "all"

  if (hasFilters) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <div className="rounded-full bg-blue-50 p-4 mb-4">
            <Search className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">No videos found</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md px-4">
            No videos match your current search criteria. Try adjusting your filters or search terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4">
            <Button 
              onClick={onClearFilters} 
              variant="outline" 
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
            <Button asChild className="w-full sm:w-auto crypto-button-primary">
              <Link href="/dashboard/upload" className="flex items-center justify-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Video
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
        <div className="rounded-full crypto-card p-6 mb-6 crypto-glow">
          <Video className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500" />
        </div>
        
        <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">No videos yet</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-lg px-4 leading-relaxed">
          You haven't uploaded any videos to your YouTube channel yet. Get started by uploading your first video and begin building your audience!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
          <Button asChild className="w-full sm:w-auto crypto-button-primary h-11">
            <Link href="/dashboard/upload" className="flex items-center justify-center">
              <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="hidden sm:inline">Upload Your First Video</span>
              <span className="sm:hidden">Upload First Video</span>
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full sm:w-auto h-11">
            <Link href="/dashboard/upload" className="flex items-center justify-center">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="hidden sm:inline">Setup YouTube Channel</span>
              <span className="sm:hidden">Setup Channel</span>
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 text-xs sm:text-sm text-muted-foreground max-w-md px-4">
          <p className="leading-relaxed">
            Need help getting started? Check out our comprehensive video upload guide and best practices for YouTube success.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
