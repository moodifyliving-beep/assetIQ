// components/payment/stripe-payment.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe-client'
import { toast } from 'sonner'
import { Loader2, CreditCard } from 'lucide-react'

interface StripePaymentProps {
  clientSecret: string
  amount: number
  onSuccess: (paymentIntentId?: string) => void
  onCancel: () => void
}

function CheckoutForm({ amount, onSuccess, onCancel }: Omit<StripePaymentProps, 'clientSecret'>) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!')
        onSuccess(paymentIntent.id)
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error('Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount.toLocaleString()}`
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={processing}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export function StripePayment({ clientSecret, amount, onSuccess, onCancel }: StripePaymentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Card Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
      </CardContent>
    </Card>
  )
}