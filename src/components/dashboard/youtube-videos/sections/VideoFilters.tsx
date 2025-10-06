import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid3X3, List, X } from "lucide-react"
import { VideoFilters } from "@/types/dashboard/youtube-videos"

interface VideoFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  totalVideos: number
}

export default function VideoFiltersSection({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  totalVideos
}: VideoFiltersProps) {
  const hasActiveFilters = searchQuery || selectedStatus !== "all"

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedStatus("all")
    setSortBy("published_at")
    setSortOrder("desc")
  }

  return (
    <div className="space-y-4">
      {/* Results Count and Clear Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {totalVideos} video{totalVideos !== 1 ? 's' : ''} found
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="w-full sm:w-auto text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all filters
          </Button>
        )}
      </div>

      {/* Mobile: Stack all filters vertically */}
      <div className="flex flex-col sm:hidden gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        
        {/* Filters Row */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-10">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published_at">Published Date</SelectItem>
              <SelectItem value="view_count">View Count</SelectItem>
              <SelectItem value="like_count">Like Count</SelectItem>
              <SelectItem value="engagement_rate">Engagement Rate</SelectItem>
              <SelectItem value="performance_score">Performance Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Sort Order and View Mode */}
        <div className="flex gap-3">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-10 flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none h-10 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none h-10 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden sm:flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        
        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40 h-10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="unlisted">Unlisted</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Sort By */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-44 h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published_at">Published Date</SelectItem>
            <SelectItem value="view_count">View Count</SelectItem>
            <SelectItem value="like_count">Like Count</SelectItem>
            <SelectItem value="engagement_rate">Engagement Rate</SelectItem>
            <SelectItem value="performance_score">Performance Score</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Sort Order */}
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-32 h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
        
        {/* View Mode Toggle */}
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none h-10 px-3"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-l-none h-10 px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
