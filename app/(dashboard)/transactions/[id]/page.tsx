'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Receipt, CreditCard, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { TransactionTimeline } from '@/components/transactions/TransactionTimeline'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { formatINR, formatDateTime } from '@/lib/formatters'
import type { Transaction } from '@/types'

export default function TransactionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTxn = async () => {
      try {
        const res = await fetch(`/api/transactions/${params.id}`)
        if (!res.ok) throw new Error('Transaction not found')
        const data = await res.json()
        setTransaction(data)
      } catch (err) {
        setError('Failed to load transaction details')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchTxn()
    }
  }, [params.id])

  if (isLoading) return <FullPageSpinner />

  if (error || !transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <Receipt className="h-12 w-12 text-text-tertiary" />
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Transaction Not Found</h2>
          <p className="text-[14px] text-text-secondary mt-1">{error}</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/transactions')} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Back to Transactions
        </Button>
      </div>
    )
  }

  const handleDownload = () => {
    toast.success('Receipt downloaded successfully')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/transactions')}
            className="p-2 rounded-md text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors"
            aria-label="Back to transactions"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Transaction Details</h1>
            <p className="text-[13px] text-text-secondary mt-0.5 font-mono">
              ID: {transaction.txnId}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleDownload} leftIcon={<Download className="h-4 w-4" />}>
          Receipt
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-7 space-y-6">
          <Card>
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-border">
              <div>
                <p className="text-[13px] text-text-secondary mb-1">Amount</p>
                <p className="text-3xl font-bold text-text-primary font-mono">
                  {formatINR(transaction.amount)}
                </p>
              </div>
              <Badge variant={getStatusBadgeVariant(transaction.status)}>
                {transaction.status}
              </Badge>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1">
                  Description
                </p>
                <p className="text-[14px] text-text-primary font-medium">
                  {transaction.description || 'No description provided'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1">
                    Date & Time
                  </p>
                  <div className="flex items-center gap-2 text-[14px] text-text-primary">
                    <Calendar className="h-4 w-4 text-text-tertiary" />
                    {formatDateTime(transaction.createdAt)}
                  </div>
                </div>
                
                <div>
                  <p className="text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1">
                    Payment Method
                  </p>
                  <div className="flex items-center gap-2 text-[14px] text-text-primary font-mono">
                    <CreditCard className="h-4 w-4 text-text-tertiary" />
                    {transaction.cardNumber}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-[15px] font-semibold text-text-primary mb-4">Customer Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-[13px]">
                <span className="text-text-secondary">Name</span>
                <span className="text-text-primary font-medium">{transaction.user.name}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-text-secondary">Email</span>
                <span className="text-text-primary">{transaction.user.email}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Timeline */}
        <div className="md:col-span-5">
          <Card className="h-full">
            <TransactionTimeline
              status={transaction.status}
              createdAt={transaction.createdAt}
              updatedAt={transaction.updatedAt}
            />
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
