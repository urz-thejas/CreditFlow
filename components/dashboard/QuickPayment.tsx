'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function QuickPayment() {
  const router = useRouter()
  const [amount, setAmount] = useState('')

  const handlePay = () => {
    const numAmount = parseFloat(amount.replace(/,/g, ''))
    if (numAmount > 0) {
      router.push(`/payment?amount=${numAmount}`)
    }
  }

  const formatAmount = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '')
    const parts = cleaned.split('.')
    if (parts[0]) {
      parts[0] = parseInt(parts[0]).toLocaleString('en-IN')
    }
    return parts.join('.')
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-xs">
      <h3 className="text-[15px] font-semibold text-text-primary mb-4">Quick Payment</h3>

      <div className="space-y-4">
        <div>
          <label className="text-[13px] font-medium text-text-secondary block mb-1.5">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary font-mono text-[15px]">
              ₹
            </span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(formatAmount(e.target.value))}
              placeholder="0.00"
              className="w-full h-12 pl-8 pr-3 bg-bg border border-border rounded-md text-[20px] font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
            />
          </div>
        </div>

        <Button
          onClick={handlePay}
          className="w-full"
          size="lg"
          disabled={!amount || parseFloat(amount.replace(/,/g, '')) <= 0}
        >
          Pay Now →
        </Button>

        <div className="flex items-center gap-1.5 justify-center text-[12px] text-text-tertiary">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Test mode — no real charges</span>
        </div>
      </div>
    </div>
  )
}
