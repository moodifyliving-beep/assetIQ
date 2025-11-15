"use client"

import { useState } from "react"
import { useAccount, useSignMessage } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"
import { signInWithWallet } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function WalletSignIn() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleWalletSignIn = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }

    setLoading(true)
    try {
      await signInWithWallet(address, signMessageAsync)
      toast.success("Successfully signed in with wallet!")
      router.push("/")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with wallet")
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Button variant="outline" className="w-full gap-2" disabled>
        <Wallet className="h-4 w-4" />
        Connect Wallet to Sign In
      </Button>
    )
  }

  return (
    <Button
      onClick={handleWalletSignIn}
      disabled={loading}
      className="w-full gap-2"
      variant="outline"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Sign In with Wallet
        </>
      )}
    </Button>
  )
}

