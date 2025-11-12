'use client'

import { useState } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Wallet, X } from "lucide-react"

export function WalletConnect() {
  const { open } = useAppKit()
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })

  const [showWallet, setShowWallet] = useState(false)

  // If not connected — show connect button
  if (!isConnected) {
    return (
      <Button
        onClick={() => open({ view: "Connect" })}
        className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
      >
        <Wallet size={18} />
        <span className="hidden sm:inline">Connect Wallet</span>
      </Button>
    )
  }

  // If connected — show wallet dropdown
  if (isConnected && address) {
    return (
      <div className="relative">
        {/* Wallet trigger button */}
        <button
          onClick={() => setShowWallet((prev) => !prev)}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition font-medium"
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>

        {/* Wallet dropdown */}
        {showWallet && (
          <div className="absolute right-0 top-12 w-72 z-50">
            <div className="relative p-5 border border-gray-200 rounded-xl bg-white shadow-2xl">
              {/* Close button */}
              {/* <button
                onClick={() => setShowWallet(false)}
                className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 transition"
              >
                <X size={18} />
              </button> */}

              <div className="flex justify-between items-center mb-5 mt-1">
                <h2 className="text-lg font-semibold text-gray-800">Wallet Connected</h2>
                <button
                  onClick={() => open({ view: 'Account' })}
                  className="px-3 py-1 text-sm bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition"
                >
                  Manage
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="font-mono text-sm font-medium text-gray-900 truncate">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Network</p>
                  <p className="font-medium text-gray-900">{chain?.name || 'Unknown'}</p>
                </div>

                {balance && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Balance</p>
                    <p className="font-medium text-gray-900">
                      {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    disconnect()
                    setShowWallet(false)
                  }}
                  className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-red-green-700 transition-all font-medium"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default fallback
  return null
}
