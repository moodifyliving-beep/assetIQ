// components/payment/crypto-payment.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { toast } from 'sonner'
import { Loader2, Wallet } from 'lucide-react'

interface CryptoPaymentProps {
  amount: number
  recipientAddress: string
  onSuccess: (transactionHash: string) => void
  onCancel: () => void
}

export function CryptoPayment({ amount, recipientAddress, onSuccess, onCancel }: CryptoPaymentProps) {
  const { address } = useAccount()
  const [processing, setProcessing] = useState(false)

  const { data: hash, writeContract } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const handlePayment = async () => {
    if (!address) {
      toast.error('Please connect your wallet')
      return
    }

    setProcessing(true)

    try {
      // Send ETH directly
      await writeContract({
        address: recipientAddress as `0x${string}`,
        abi: [],
        functionName: '',
        value: parseEther(amount.toString()),
      })

      toast.success('Transaction submitted')
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed')
      setProcessing(false)
    }
  }

  // Watch for confirmation
  if (isConfirmed && hash) {
    onSuccess(hash)
    setProcessing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Crypto Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">Payment Details</p>
          <div className="space-y-2">
            <div className="flex justify-between text-blue-800 text-sm">
              <span>Amount (ETH):</span>
              <span className="font-bold">{amount} ETH</span>
            </div>
            <div className="flex justify-between text-blue-800 text-sm">
              <span>Recipient:</span>
              <span className="font-mono text-xs">{recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handlePayment}
            disabled={processing || isConfirming}
            className="flex-1"
          >
            {processing || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Processing...'}
              </>
            ) : (
              'Pay with Crypto'
            )}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={processing || isConfirming}>
            Cancel
          </Button>
        </div>

        {isConfirming && (
          <p className="text-sm text-center text-muted-foreground">
            Waiting for blockchain confirmation...
          </p>
        )}
      </CardContent>
    </Card>
  )
}