// components/property/investment-dialog.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CryptoPayment } from '@/components/payment/crypto-payment'
import { StripePayment } from '@/components/payment/stripe-payment'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import { Loader2, Coins, CreditCard } from 'lucide-react'

interface InvestmentDialogProps {
  property: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function InvestmentDialog({ property, open, onOpenChange, onSuccess }: InvestmentDialogProps) {
  const { address, isConnected } = useAccount()
  const [shares, setShares] = useState(1)
  const [step, setStep] = useState<'shares' | 'payment'>('shares')
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'stripe'>('crypto')
  const [investmentId, setInvestmentId] = useState<string>()
  const [clientSecret, setClientSecret] = useState<string>()
  const [processing, setProcessing] = useState(false)

  const totalAmount = shares * property.pricePerShare

  const handleContinueToPayment = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet')
      return
    }

    if (shares < 1 || shares > property.availableShares) {
      toast.error(`Please enter a valid number of shares (1-${property.availableShares})`)
      return
    }

    setProcessing(true)

    try {
      const response = await fetch('/api/investments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          shares,
          walletAddress: address,
          paymentMethod: paymentMethod === 'crypto' ? 'CRYPTO_ETH' : 'STRIPE_CARD',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create investment')
      }

      const data = await response.json()
      setInvestmentId(data.investmentId)
      
      if (paymentMethod === 'stripe') {
        setClientSecret(data.clientSecret)
      }

      setStep('payment')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to proceed to payment')
    } finally {
      setProcessing(false)
    }
  }

  const handleCryptoSuccess = async (transactionHash: string) => {
    try {
      const response = await fetch(`/api/investments/${investmentId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionHash }),
      })

      if (!response.ok) {
        throw new Error('Failed to complete investment')
      }

      toast.success('Investment successful! Minting your NFT certificate...')
      
      // Simulate NFT minting (in production, this would call your smart contract)
      setTimeout(async () => {
        const tokenId = `${property.id}-${Date.now()}`
        await fetch(`/api/investments/${investmentId}/mint-nft`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tokenId,
            metadataUri: `ipfs://your-metadata-uri/${tokenId}`,
          }),
        })
        
        toast.success('NFT certificate minted! Check your wallet.')
        onSuccess()
        handleClose()
      }, 2000)

    } catch (error: any) {
      console.error('Error:', error)
      toast.error('Failed to complete investment')
    }
  }

  const handleStripeSuccess = async (paymentIntentId?: string) => {
    if (!investmentId) {
      toast.error('Investment ID not found')
      return
    }

    try {
      // First, complete the investment with the payment intent ID as transaction hash
      const completeResponse = await fetch(`/api/investments/${investmentId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transactionHash: paymentIntentId || `stripe_${Date.now()}` 
        }),
      })

      if (!completeResponse.ok) {
        const error = await completeResponse.json()
        throw new Error(error.error || 'Failed to complete investment')
      }

      toast.success('Investment successful! Minting your NFT certificate...')
      
      // Simulate NFT minting (in production, this would call your smart contract)
      setTimeout(async () => {
        try {
          const tokenId = `${property.id}-${Date.now()}`
          const mintResponse = await fetch(`/api/investments/${investmentId}/mint-nft`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tokenId,
              metadataUri: `ipfs://your-metadata-uri/${tokenId}`,
            }),
          })

          if (mintResponse.ok) {
            toast.success('NFT certificate minted! Check your wallet.')
          } else {
            console.error('Failed to mint NFT, but investment is completed')
          }
          
          onSuccess()
          handleClose()
        } catch (error: any) {
          console.error('Error minting NFT:', error)
          // Investment is already completed, so we can still close
          onSuccess()
          handleClose()
        }
      }, 2000)
    } catch (error: any) {
      console.error('Error completing investment:', error)
      toast.error(error.message || 'Failed to complete investment')
    }
  }

  const handleClose = () => {
    setStep('shares')
    setShares(1)
    setInvestmentId(undefined)
    setClientSecret(undefined)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invest in {property.title}</DialogTitle>
          <DialogDescription>
            Purchase shares and receive an NFT certificate as proof of ownership
          </DialogDescription>
        </DialogHeader>

        {step === 'shares' && (
          <div className="space-y-6">
            <div className="p-4 bg-secondary/50 rounded-lg border border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per Share:</span>
                <span className="font-bold text-foreground">${property.pricePerShare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Shares:</span>
                <span className="font-bold text-foreground">{property.availableShares}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shares" className="text-foreground">Number of Shares</Label>
              <Input
                id="shares"
                type="number"
                min="1"
                max={property.availableShares}
                value={shares}
                onChange={(e) => setShares(parseInt(e.target.value) || 1)}
                className="bg-background border-border"
              />
              <p className="text-sm text-muted-foreground">
                Enter the number of shares you want to purchase
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">Total Investment:</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <Tabs value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="crypto">
                  <Coins className="w-4 h-4 mr-2" />
                  Crypto
                </TabsTrigger>
                <TabsTrigger value="stripe">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Card
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              onClick={handleContinueToPayment}
              disabled={processing || !isConnected}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Continue to Payment'
              )}
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div>
            {paymentMethod === 'crypto' ? (
              <CryptoPayment
                amount={totalAmount / 3000} // Convert to ETH (mock rate)
                recipientAddress={property.owner.walletAddress}
                onSuccess={handleCryptoSuccess}
                onCancel={() => setStep('shares')}
              />
            ) : (
              clientSecret && (
                <StripePayment
                  clientSecret={clientSecret}
                  amount={totalAmount}
                  onSuccess={handleStripeSuccess}
                  onCancel={() => setStep('shares')}
                />
              )
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}