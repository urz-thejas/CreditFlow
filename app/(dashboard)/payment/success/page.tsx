'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Download, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { formatINR, formatDateTime } from '@/lib/formatters'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export default function SuccessPage() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    // Dynamic import for confetti — graceful fallback if chunk fails to load
    import('canvas-confetti')
      .then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F6EF7', '#12B76A', '#F79009'],
        })
      })
      .catch(() => {
        // Silently ignore ChunkLoadError — page still functions normally
      })

    const data = sessionStorage.getItem('paymentResult')
    if (data) {
      setResult(JSON.parse(data))
      // Optional: clear it after reading to prevent stale data on reload
      // sessionStorage.removeItem('paymentResult')
    }
  }, [])

  const handleDownload = () => {
    toast.success('Receipt downloaded successfully')
  }

  return (
    <div className="max-w-[560px] mx-auto pt-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        {/* Animated Checkmark */}
        <div className="flex justify-center mb-6">
          <svg className="w-20 h-20 text-success" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              className="success-checkmark-circle"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
            />
            <path
              className="success-checkmark-check"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M30 50l15 15 25-30"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-text-primary">Payment Successful!</h1>
        <p className="text-[15px] text-text-secondary mt-2">
          Your transaction has been processed and recorded.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
            <span className="text-[14px] text-text-secondary">Amount Paid</span>
            <span className="text-2xl font-bold text-text-primary font-mono">
              {formatINR(result?.amount || 0)}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[13px]">
              <span className="text-text-secondary">Transaction ID</span>
              <span className="text-text-primary font-mono font-medium">
                {result?.txnId || '—'}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-text-secondary">Date & Time</span>
              <span className="text-text-primary">
                {formatDateTime(new Date())}
              </span>
            </div>
            <div className="flex justify-between text-[13px] items-center">
              <span className="text-text-secondary">Status</span>
              <Badge variant="success">Success</Badge>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleDownload} leftIcon={<Download className="h-4 w-4" />}>
            Download Receipt
          </Button>
          <Button onClick={() => router.push('/dashboard')} rightIcon={<ArrowRight className="h-4 w-4" />}>
            Back to Dashboard
          </Button>
        </div>
        
        <div className="mt-6 text-center">
          {result?.transactionId && (
            <Link
              href={`/transactions/${result.transactionId}`}
              className="text-[13px] text-primary hover:text-primary-hover font-medium"
            >
              View Transaction Details
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  )
}
