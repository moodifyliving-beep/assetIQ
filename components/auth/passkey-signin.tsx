"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Fingerprint, Loader2 } from "lucide-react"
import { signInWithPasskey, signUpWithPasskey } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PasskeySignInProps {
  mode?: "signin" | "signup"
  email?: string
  name?: string
}

export function PasskeySignIn({ mode = "signin", email, name }: PasskeySignInProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePasskey = async () => {
    setLoading(true)
    try {
      if (mode === "signup" && email) {
        await signUpWithPasskey(email, name)
        toast.success("Passkey registered successfully!")
      } else {
        await signInWithPasskey()
        toast.success("Signed in with passkey!")
      }
      router.push("/")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to authenticate with passkey")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePasskey}
      disabled={loading}
      variant="outline"
      className="w-full gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Authenticating...
        </>
      ) : (
        <>
          <Fingerprint className="h-4 w-4" />
          {mode === "signup" ? "Register Passkey" : "Sign In with Passkey"}
        </>
      )}
    </Button>
  )
}

