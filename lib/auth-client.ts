// lib/auth-client.ts
"use client"

import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  basePath: "/api/auth",
})

export const { signIn, signUp, signOut, useSession } = authClient

// SIWE (Sign-In With Ethereum) helper
export async function signInWithWallet(address: string, signMessage: (message: string) => Promise<string>) {
  try {
    // Get SIWE message from server
    const response = await fetch(`/api/auth/siwe?address=${encodeURIComponent(address)}`)
    if (!response.ok) throw new Error('Failed to get SIWE message')
    
    const { message, nonce } = await response.json()
    
    // Sign the message with wallet
    const signature = await signMessage(message)
    
    // Verify and create session
    const verifyResponse = await fetch('/api/auth/siwe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature, address }),
    })
    
    if (!verifyResponse.ok) {
      const error = await verifyResponse.json()
      throw new Error(error.error || 'Failed to verify signature')
    }
    
    const data = await verifyResponse.json()
    
    // Refresh the session
    await authClient.getSession()
    
    return data
  } catch (error: any) {
    console.error('SIWE error:', error)
    throw error
  }
}

// Magic link sign in
export async function signInWithMagicLink(email: string) {
  return authClient.magicLink.send({
    email,
    type: "sign-in",
  })
}

// Passkey sign in
export async function signInWithPasskey() {
  return authClient.passkey.signIn()
}

// Passkey sign up
export async function signUpWithPasskey(email: string, name?: string) {
  return authClient.passkey.signUp({
    email,
    name,
  })
}
