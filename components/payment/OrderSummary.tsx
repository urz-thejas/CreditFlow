'use client'

import { ShieldCheck } from 'lucide-react'
import { formatINR } from '@/lib/formatters'
import { Button } from '@/components/ui/Button'

interface OrderSummaryProps {
  amount: number
  isLoading: boolean
  onSubmit: () => void
}

export function OrderSummary({ amount, isLoading, onSubmit }: OrderSummaryProps) {
  const subtotal = amount || 0
  const processingFee = 0
  const total = subtotal + processingFee

  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-xs sticky top-24">
      <h3 className="text-[15px] font-semibold text-text-primary mb-4">Order Summary</h3>

      <div className="space-y-3 pb-4 border-b border-border">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-text-secondary">Subtotal</span>
          <span className="text-text-primary font-mono">{formatINR(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-text-secondary">Processing Fee</span>
          <span className="text-text-primary font-mono">{formatINR(processingFee)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-b border-border">
        <span className="text-[14px] font-semibold text-text-primary">Total</span>
        <span className="text-[18px] font-bold text-text-primary font-mono">
          {formatINR(total)}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <Button
          onClick={onSubmit}
          className="w-full"
          size="lg"
          isLoading={isLoading}
          disabled={total <= 0}
        >
          Pay {total > 0 ? formatINR(total) : ''}
        </Button>

        <div className="flex items-center gap-1.5 justify-center text-[12px] text-text-tertiary">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Test Mode — No real charge</span>
        </div>
      </div>
    </div>
  )
}
