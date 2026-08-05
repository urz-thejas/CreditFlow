'use client'

import { useRouter } from 'next/navigation'
import { ArrowUp, ArrowDown, Eye } from 'lucide-react'
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge'
import { formatINR, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types'

interface TransactionTableProps {
  transactions: Transaction[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSort: (column: string) => void
}

export function TransactionTable({ transactions, sortBy, sortOrder, onSort }: TransactionTableProps) {
  const router = useRouter()

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null
    return sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 inline ml-1" /> : <ArrowDown className="h-3 w-3 inline ml-1" />
  }

  const handleRowClick = (id: string) => {
    router.push(`/transactions/${id}`)
  }

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-collapse" role="table">
        <caption className="sr-only">Transactions list</caption>
        <thead>
          <tr className="border-b border-border bg-bg/50">
            <th
              scope="col"
              className="p-4 text-[12px] font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors whitespace-nowrap"
              onClick={() => onSort('createdAt')}
            >
              Date <SortIcon column="createdAt" />
            </th>
            <th scope="col" className="p-4 text-[12px] font-medium text-text-secondary uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="p-4 text-[12px] font-medium text-text-secondary uppercase tracking-wider">
              Card Used
            </th>
            <th
              scope="col"
              className="p-4 text-[12px] font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors text-right whitespace-nowrap"
              onClick={() => onSort('amount')}
            >
              Amount <SortIcon column="amount" />
            </th>
            <th scope="col" className="p-4 text-[12px] font-medium text-text-secondary uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="p-4 text-[12px] font-medium text-text-secondary uppercase tracking-wider text-center w-[60px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((txn) => (
            <tr
              key={txn.id}
              onClick={() => handleRowClick(txn.id)}
              className="hover:bg-hover transition-colors duration-fast cursor-pointer group"
            >
              <td className="p-4 text-[13px] text-text-secondary whitespace-nowrap">
                {formatDate(txn.createdAt)}
              </td>
              <td className="p-4 text-[13px] text-text-primary font-medium">
                {txn.description || '—'}
              </td>
              <td className="p-4 text-[13px] text-text-secondary font-mono whitespace-nowrap">
                {txn.cardNumber}
              </td>
              <td className="p-4 text-[13px] text-text-primary font-mono font-medium text-right whitespace-nowrap">
                {formatINR(txn.amount)}
              </td>
              <td className="p-4 whitespace-nowrap">
                <Badge variant={getStatusBadgeVariant(txn.status)}>
                  {txn.status}
                </Badge>
              </td>
              <td className="p-4 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRowClick(txn.id)
                  }}
                  className="p-1.5 rounded-md text-text-tertiary hover:text-primary hover:bg-primary-light transition-colors"
                  aria-label={`View transaction ${txn.txnId}`}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-[13px] text-text-secondary">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
