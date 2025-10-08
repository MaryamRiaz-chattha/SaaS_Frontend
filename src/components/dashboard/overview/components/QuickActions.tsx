import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Video, Play, BarChart3 } from "lucide-react"

export default function QuickActions() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Manage your channel and content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/upload">
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
              <Upload className="w-6 h-6" />
              <span>Upload Video</span>
            </Button>
          </Link>
          <Link href="/dashboard/videos">
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
              <Video className="w-6 h-6" />
              <span>Manage Videos</span>
            </Button>
          </Link>
          <Link href="/dashboard/playlists">
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
              <Play className="w-6 h-6" />
              <span>Playlists</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
