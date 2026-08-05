'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge'
import { formatINR, formatDate } from '@/lib/formatters'
import type { Transaction } from '@/types'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const router = useRouter()

  return (
    <div className="bg-surface rounded-lg border border-border shadow-xs">
      <div className="flex items-center justify-between p-5 pb-0">
        <h3 className="text-[15px] font-semibold text-text-primary">Recent Transactions</h3>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-[13px] text-primary hover:text-primary-hover font-medium transition-colors"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" role="table">
          <caption className="sr-only">Recent transactions</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="text-left px-5 py-3 text-[12px] font-medium text-text-tertiary uppercase tracking-wider">Date</th>
              <th scope="col" className="text-left px-5 py-3 text-[12px] font-medium text-text-tertiary uppercase tracking-wider">Description</th>
              <th scope="col" className="text-left px-5 py-3 text-[12px] font-medium text-text-tertiary uppercase tracking-wider">Card</th>
              <th scope="col" className="text-right px-5 py-3 text-[12px] font-medium text-text-tertiary uppercase tracking-wider">Amount</th>
              <th scope="col" className="text-left px-5 py-3 text-[12px] font-medium text-text-tertiary uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((txn) => (
              <tr
                key={txn.id}
                onClick={() => router.push(`/transactions/${txn.id}`)}
                className="hover:bg-hover transition-colors duration-fast cursor-pointer"
              >
                <td className="px-5 py-3 text-[13px] text-text-secondary whitespace-nowrap">
                  {formatDate(txn.createdAt)}
                </td>
                <td className="px-5 py-3 text-[13px] text-text-primary font-medium">
                  {txn.description || '—'}
                </td>
                <td className="px-5 py-3 text-[13px] text-text-secondary font-mono">
                  {txn.cardNumber}
                </td>
                <td className="px-5 py-3 text-[13px] text-text-primary font-mono font-medium text-right">
                  {formatINR(txn.amount)}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={getStatusBadgeVariant(txn.status)}>
                    {txn.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            onClick={() => router.push(`/transactions/${txn.id}`)}
            className="p-4 hover:bg-hover transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] font-medium text-text-primary">
                {txn.description || '—'}
              </span>
              <span className="text-[13px] font-mono font-medium text-text-primary">
                {formatINR(txn.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-tertiary">
                {formatDate(txn.createdAt)} · {txn.cardNumber}
              </span>
              <Badge variant={getStatusBadgeVariant(txn.status)}>
                {txn.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
