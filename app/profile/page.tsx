"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession, authClient } from "@/lib/auth-client"
import { useAccount, useDisconnect, useSignMessage } from "wagmi"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, User, Mail, Wallet, Fingerprint, Save, Link as LinkIcon, Unlink } from "lucide-react"
import { PasskeySignIn } from "@/components/auth/passkey-signin"
import { WalletSignIn } from "@/components/auth/wallet-signin"

export default function ProfilePage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [linkingWallet, setLinkingWallet] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
    }
  }, [session])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast.success("Profile updated successfully!")
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleLinkWallet = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }

    setLinkingWallet(true)
    try {
      // Get SIWE message from server
      const siweResponse = await fetch(`/api/auth/siwe?address=${encodeURIComponent(address)}`)
      if (!siweResponse.ok) {
        throw new Error('Failed to get SIWE message')
      }
      
      const { message } = await siweResponse.json()
      
      // Sign the message with wallet
      const signature = await signMessageAsync({ message })
      
      // Link wallet with SIWE verification
      const response = await fetch("/api/user/link-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          walletAddress: address,
          message,
          signature
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to link wallet")
      }

      toast.success("Wallet linked successfully!")
      // Refresh session to get updated user data
      await authClient.getSession()
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || "Failed to link wallet")
    } finally {
      setLinkingWallet(false)
    }
  }

  const handleUnlinkWallet = async () => {
    setLinkingWallet(true)
    try {
      const response = await fetch("/api/user/link-wallet", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to unlink wallet")
      }

      toast.success("Wallet unlinked successfully!")
      // Refresh session to get updated user data
      await authClient.getSession()
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || "Failed to unlink wallet")
    } finally {
      setLinkingWallet(false)
    }
  }

  if (sessionLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (!session?.user) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Please sign in to view your profile
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and authentication methods</p>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>Manage your authentication methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Wallet Connection */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Wallet</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {session.user.walletAddress 
                      ? `${session.user.walletAddress.slice(0, 6)}...${session.user.walletAddress.slice(-4)}`
                      : isConnected && address
                      ? `${address.slice(0, 6)}...${address.slice(-4)} (Connected but not linked)`
                      : "Not connected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {session.user.walletAddress ? (
                  <Button 
                    onClick={handleUnlinkWallet} 
                    size="sm" 
                    variant="destructive"
                    disabled={linkingWallet}
                  >
                    {linkingWallet ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Unlinking...
                      </>
                    ) : (
                      <>
                        <Unlink className="mr-2 h-4 w-4" />
                        Unlink
                      </>
                    )}
                  </Button>
                ) : isConnected && address ? (
                  <Button 
                    onClick={handleLinkWallet} 
                    size="sm"
                    disabled={linkingWallet}
                  >
                    {linkingWallet ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Linking...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Link Wallet
                      </>
                    )}
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    Connect Wallet First
                  </Button>
                )}
              </div>
            </div>

            {/* Passkey */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Passkey</p>
                  <p className="text-sm text-muted-foreground">
                    Use biometric authentication
                  </p>
                </div>
              </div>
              <PasskeySignIn mode="signup" email={session.user.email || ""} name={session.user.name || ""} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

