"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")
    const type = searchParams.get("type") || "magic-link"

    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link")
      return
    }

    const verify = async () => {
      try {
        if (type === "magic-link") {
          // Verify magic link token
          const response = await fetch(`/api/auth/verify-email?token=${token}`, {
            method: "GET",
          })

          if (!response.ok) {
            throw new Error("Verification failed")
          }

          // Refresh session
          await authClient.getSession()
          
          setStatus("success")
          setMessage("Email verified successfully!")
          toast.success("Email verified!")
          
          setTimeout(() => {
            router.push("/")
          }, 2000)
        } else {
          setStatus("error")
          setMessage("Unknown verification type")
        }
      } catch (error: any) {
        setStatus("error")
        setMessage(error.message || "Verification failed")
        toast.error("Verification failed")
      }
    }

    verify()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verifying</CardTitle>
          <CardDescription className="text-center">
            Please wait while we verify your request
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Verifying...</p>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <p className="text-foreground font-medium">{message}</p>
              <p className="text-sm text-muted-foreground mt-2">Redirecting...</p>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-foreground font-medium">{message}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

