"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SessionConflictDialogProps {
  open: boolean
  currentUserEmail: string
  newUserEmail: string
  onConfirm: () => void
  onCancel: () => void
}

export function SessionConflictDialog({
  open,
  currentUserEmail,
  newUserEmail,
  onConfirm,
  onCancel,
}: SessionConflictDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>⚠️ Account Switch Detected</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are currently logged in as <strong>{currentUserEmail}</strong>.
            </p>
            <p>
              You are attempting to login as <strong>{newUserEmail}</strong>.
            </p>
            <p className="text-destructive font-medium">
              Logging in with a different account will terminate your current session.
              All unsaved work will be lost.
            </p>
            <p>
              Do you want to continue?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Yes, Switch Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
