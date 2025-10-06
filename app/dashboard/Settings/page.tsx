"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/auth"
import useGemini from "@/hooks/ai/useGemini"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { isLoading, error, saveGeminiKey, getGeminiKey, updateGeminiKey, deleteGeminiKey } = useGemini()

  const [apiKey, setApiKey] = useState("")
  const [apiKeyPreview, setApiKeyPreview] = useState("")
  const [hasKey, setHasKey] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const load = async () => {
      try {
        const res: any = await getGeminiKey()
        if (res?.api_key_preview) {
          setHasKey(true)
          setApiKeyPreview(res.api_key_preview)
        }
      } catch {}
    }
    load()
  }, [getGeminiKey])

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Gemini API Key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasKey && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Current key (preview):</div>
              <Input value={apiKeyPreview} disabled className="flex-1" />
            </div>
          )}

          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder={hasKey ? "Enter new Gemini API key" : "Enter Gemini API key"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            {hasKey ? (
              <Button onClick={async () => { await updateGeminiKey(apiKey); setApiKey(""); }} disabled={isLoading || !apiKey.trim()}>
                Update
              </Button>
            ) : (
              <Button onClick={async () => { const r = await saveGeminiKey(apiKey); if (r) { setHasKey(true); setApiKey(""); } }} disabled={isLoading || !apiKey.trim()}>
                Save
              </Button>
            )}
          </div>

          {hasKey && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={async () => { await deleteGeminiKey(); setHasKey(false); setApiKey(""); setApiKeyPreview(""); }} disabled={isLoading}>
                Remove Key
              </Button>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


