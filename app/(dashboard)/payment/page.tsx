'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { paymentSchema, type PaymentInput } from '@/lib/validators'
import { PaymentForm } from '@/components/payment/PaymentForm'
import { OrderSummary } from '@/components/payment/OrderSummary'
import { FullPageSpinner } from '@/components/ui/Spinner'

function PaymentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultAmount = parseFloat(searchParams.get('amount') || '0') || undefined
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: defaultAmount,
      description: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      cardholderName: '',
    },
  })

  const amount = form.watch('amount') || 0

  const handleSubmit = form.handleSubmit(async (data) => {
    if (isLoading) return
    setIsLoading(true)

    // Store payment data in sessionStorage for processing page
    sessionStorage.setItem('pendingPayment', JSON.stringify(data))
    router.push('/payment/processing')
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Make a Payment</h1>
        <p className="text-[14px] text-text-secondary mt-1">
          Enter payment details below
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <PaymentForm
              defaultAmount={defaultAmount}
              register={form.register}
              errors={form.formState.errors}
              watch={form.watch}
            />
          </div>
          <div className="md:col-span-5">
            <OrderSummary
              amount={amount}
              isLoading={isLoading}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </form>
    </motion.div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <PaymentPageContent />
    </Suspense>
  )
}
