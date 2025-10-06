"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // Optionally log to monitoring here
    console.error("YouTube Connect route error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We couldn’t load the YouTube connect flow. Please try again.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => reset()} className="flex-1">Try again</Button>
            <Button variant="outline" className="flex-1" onClick={() => window.location.replace('/auth/youtube-connect')}>
              Reload page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


