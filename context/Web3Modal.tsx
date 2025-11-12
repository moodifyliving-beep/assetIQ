// context/Web3Modal.tsx
'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, polygon, base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { ReactNode } from 'react'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set')
}

// 2. Set up Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, arbitrum, polygon, base],
  projectId,
  ssr: true
})

// 3. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, arbitrum, polygon, base],
  projectId,
  metadata: {
    name: 'Your Dashboard',
    description: 'Connect your Unstoppable Wallet',
    url: 'https://yourapp.com',
    icons: ['https://yourapp.com/icon.png']
  },
  features: {
    analytics: true, // Optional - enable analytics
    email: false, // Set to true if you want email login
    socials: [], // Add social logins if needed
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#3b82f6', // Customize colors
  }
})

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}