"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Loader2, Send } from "lucide-react"
import { signInWithMagicLink } from "@/lib/auth-client"
import { toast } from "sonner"

export function MagicLinkSignIn() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signInWithMagicLink(email)
      setSent(true)
      toast.success("Magic link sent! Check your email.")
    } catch (error: any) {
      toast.error(error.message || "Failed to send magic link")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Check your email</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We sent a magic link to <strong>{email}</strong>
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSent(false)
            setEmail("")
          }}
        >
          Use a different email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="magic-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="magic-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10"
            disabled={loading}
          />
        </div>
      </div>
      <Button type="submit" className="w-full gap-2" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Magic Link
          </>
        )}
      </Button>
    </form>
  )
}

