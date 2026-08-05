'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatINR } from '@/lib/formatters'
import { Card } from '@/components/ui/Card'

export default function FailurePage() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)
  const [referenceCode, setReferenceCode] = useState<string>('')

  useEffect(() => {
    const data = sessionStorage.getItem('paymentResult')
    if (data) {
      const parsed = JSON.parse(data)
      setResult(parsed)
      // Use stored reference code or generate client-side only to avoid hydration mismatch
      setReferenceCode(
        parsed.referenceCode ||
          `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      )
    } else {
      setReferenceCode(`REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`)
    }
  }, [])


  return (
    <div className="max-w-[560px] mx-auto pt-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        {/* Animated Error Icon */}
        <div className="flex justify-center mb-6">
          <svg className="w-20 h-20 text-error" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              className="error-x-circle"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
            />
            <path
              className="error-x-line"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              d="M35 35l30 30"
            />
            <path
              className="error-x-line"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              d="M65 35l-30 30"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-text-primary">Payment Failed</h1>
        <p className="text-[15px] text-text-secondary mt-2">
          We couldn&apos;t process your payment. No amount was charged.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Card className="mb-6 bg-error-bg/50 border-error/20">
          <div className="space-y-4">
            <div className="flex justify-between text-[13px]">
              <span className="text-text-secondary">Attempted Amount</span>
              <span className="text-text-primary font-mono font-medium">
                {formatINR(result?.amount || 0)}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-text-secondary">Reason</span>
              <span className="text-text-primary font-medium">
                Card declined by issuing bank
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-text-secondary">Reference Code</span>
              <span className="text-text-primary font-mono">
                {referenceCode || '—'}
              </span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Button onClick={() => router.push('/payment')} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard')} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Dashboard
          </Button>
        </div>

        <p className="text-[13px] text-text-secondary text-center">
          If this keeps happening, try the test card ending in <code className="font-mono bg-hover px-1 py-0.5 rounded text-text-primary">4242</code>
        </p>
      </motion.div>
    </div>
  )
}
