// config/wagmi.ts
import { cookieStorage, createStorage, http } from 'wagmi'
import { mainnet, arbitrum, polygon, base } from 'wagmi/chains'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set')
}

export const config = {
  chains: [mainnet, arbitrum, polygon, base] as const,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
  connectors: [
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Your Dashboard',
        description: 'Connect your Unstoppable Wallet',
        url: 'https://yourapp.com',
        icons: ['https://yourapp.com/icon.png']
      },
      showQrModal: false, // We'll use Reown's modal
    }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: 'Your Dashboard',
      appLogoUrl: 'https://yourapp.com/icon.png'
    })
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
}