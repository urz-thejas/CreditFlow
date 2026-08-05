'use client'

import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useTransactions } from '@/hooks/useTransactions'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { TransactionCard } from '@/components/transactions/TransactionCard'
import { FilterBar } from '@/components/transactions/FilterBar'
import { Pagination } from '@/components/transactions/Pagination'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import { formatINR, formatDate } from '@/lib/formatters'

export default function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Debounce search with a stable ref-based timeout
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val)
      setPage(1) // Reset to page 1 on search
    }, 500)
  }, [])


  const { data, total, totalPages, isLoading } = useTransactions({
    page,
    limit,
    status,
    search: debouncedSearch,
    sortBy,
    sortOrder,
    dateFrom,
    dateTo,
  })

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc') // Default to desc when changing column
    }
  }

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error('No data to export')
      return
    }

    // CSV Generation
    const headers = ['Transaction ID', 'Date', 'Description', 'Card Number', 'Brand', 'Amount', 'Status']
    const csvContent = [
      headers.join(','),
      ...data.map(t => [
        t.txnId,
        formatDate(t.createdAt),
        `"${t.description || ''}"`,
        t.cardNumber,
        t.cardBrand,
        t.amount,
        t.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Transactions exported to CSV')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            Transactions
            <span className="text-[12px] font-medium bg-primary-light text-primary px-2 py-0.5 rounded-full">
              {total}
            </span>
          </h1>
          <p className="text-[14px] text-text-secondary mt-1">
            View and manage all your payments
          </p>
        </div>
      </div>

      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={(val) => { setStatus(val); setPage(1) }}
        dateFrom={dateFrom}
        onDateFromChange={(val) => { setDateFrom(val); setPage(1) }}
        dateTo={dateTo}
        onDateToChange={(val) => { setDateTo(val); setPage(1) }}
        onExport={handleExport}
      />

      <div className="bg-surface rounded-lg border border-border shadow-xs">
        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {Array.from({ length: limit }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <TransactionTable
              transactions={data}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <TransactionCard transactions={data} />
            
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              itemsPerPage={limit}
              onPageChange={setPage}
              onLimitChange={(l) => { setLimit(l); setPage(1) }}
            />
          </>
        )}
      </div>
    </motion.div>
  )
}
