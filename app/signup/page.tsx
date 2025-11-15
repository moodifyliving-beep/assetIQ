"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Loader2, Mail, Lock, User, Wallet, Fingerprint, Sparkles, Settings } from "lucide-react"
import { signUp, useSession } from "@/lib/auth-client"
import { useAccount } from "wagmi"
import { WalletSignIn } from "@/components/auth/wallet-signin"
import { PasskeySignIn } from "@/components/auth/passkey-signin"

export default function SignupPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { address, isConnected } = useAccount()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (session?.user) {
      router.push("/")
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setLoading(true)

    try {
      const result = await signUp.email({
        email,
        password,
        name,
      })

      if (result.error) {
        throw new Error(result.error.message || "Failed to sign up")
      }

      toast.success("Account created successfully! Please sign in.")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  // If wallet is connected but not logged in, show profile completion option
  if (isConnected && address && !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
            <CardDescription className="text-center">
              Your wallet is connected. Complete your profile to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">Connected Wallet:</p>
              <p className="font-mono text-sm">{address.slice(0, 6)}...{address.slice(-4)}</p>
            </div>
            <Button 
              onClick={() => router.push("/profile")} 
              className="w-full"
              size="lg"
            >
              <Settings className="mr-2 h-4 w-4" />
              Go to Profile
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Or{" "}
              <Link href="/login" className="text-primary hover:underline">
                sign in to existing account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Sign up to start investing in tokenized assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email" className="text-xs">
                <Mail className="h-3 w-3 mr-1" />
                Email
              </TabsTrigger>
              <TabsTrigger value="wallet" className="text-xs">
                <Wallet className="h-3 w-3 mr-1" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="passkey" className="text-xs">
                <Fingerprint className="h-3 w-3 mr-1" />
                Passkey
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
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
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="wallet" className="mt-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to create an account. Your wallet address will be used as your account identifier.
                </p>
                <WalletSignIn />
              </div>
            </TabsContent>

            <TabsContent value="passkey" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passkey-email">Email</Label>
                  <Input
                    id="passkey-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passkey-name">Name (Optional)</Label>
                  <Input
                    id="passkey-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <PasskeySignIn mode="signup" email={email} name={name} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
