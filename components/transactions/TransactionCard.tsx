'use client'

import { useRouter } from 'next/navigation'
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge'
import { formatINR, formatDate } from '@/lib/formatters'
import type { Transaction } from '@/types'

interface TransactionCardProps {
  transactions: Transaction[]
}

export function TransactionCard({ transactions }: TransactionCardProps) {
  const router = useRouter()

  if (transactions.length === 0) {
    return (
      <div className="md:hidden p-8 text-center text-[13px] text-text-secondary border-t border-border">
        No transactions found.
      </div>
    )
  }

  return (
    <div className="md:hidden divide-y divide-border border-t border-border">
      {transactions.map((txn) => (
        <div
          key={txn.id}
          onClick={() => router.push(`/transactions/${txn.id}`)}
          className="p-4 bg-surface hover:bg-hover transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 pr-4">
              <p className="text-[14px] font-medium text-text-primary truncate">
                {txn.description || '—'}
              </p>
              <p className="text-[12px] text-text-secondary mt-0.5">
                {formatDate(txn.createdAt)}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[14px] font-mono font-bold text-text-primary">
                {formatINR(txn.amount)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-text-tertiary font-mono">
              {txn.cardNumber}
            </p>
            <Badge variant={getStatusBadgeVariant(txn.status)}>
              {txn.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
