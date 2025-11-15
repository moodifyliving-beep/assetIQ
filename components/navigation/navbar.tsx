"use client"

import { Wallet, User, LogOut, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { WalletConnect } from "@/components/WalletConnect"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function Navbar() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      router.push("/login")
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  return (
    <nav className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-card border-b border-border flex items-center justify-between px-6 z-30">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <WalletConnect />

        {!isPending && (
          <>
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push("/login")} size="sm">
                  Sign In
                </Button>
                <Button onClick={() => router.push("/signup")} size="sm">
                  Sign Up
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  )
}
