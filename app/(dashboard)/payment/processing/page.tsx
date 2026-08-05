'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ProcessingOverlay } from '@/components/payment/ProcessingOverlay'

export default function ProcessingPage() {
  const router = useRouter()

  useEffect(() => {
    const processPayment = async () => {
      const dataStr = sessionStorage.getItem('pendingPayment')
      if (!dataStr) {
        router.replace('/payment')
        return
      }

      try {
        const data = JSON.parse(dataStr)

        const res = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        const json = await res.json()
        sessionStorage.removeItem('pendingPayment')

        if (!res.ok) {
          toast.error(json.error || 'Payment processing failed')
          router.replace('/payment/failure')
          return
        }

        // Store result for success/failure pages
        sessionStorage.setItem('paymentResult', JSON.stringify(json))
        
        // Artificial delay for animation completion
        setTimeout(() => {
          router.replace(json.redirectTo)
        }, 500)

      } catch (error) {
        sessionStorage.removeItem('pendingPayment')
        toast.error('An unexpected error occurred')
        router.replace('/payment/failure')
      }
    }

    processPayment()
  }, [router])

  return <ProcessingOverlay />
}
