"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, Clock } from "lucide-react"

interface ScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSchedule: (date: string) => void
}

export function ScheduleModal({ open, onOpenChange, onSchedule }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      const scheduledDateTime = `${selectedDate}T${selectedTime}`
      onSchedule(scheduledDateTime)
      setSelectedDate("")
      setSelectedTime("")
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  // Get current time for minimum time if today is selected
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Video
          </DialogTitle>
          <DialogDescription>Choose when you want your video to be published to YouTube.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              min={selectedDate === today ? currentTime : undefined}
            />
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={!selectedDate || !selectedTime}>
            Schedule Video
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
