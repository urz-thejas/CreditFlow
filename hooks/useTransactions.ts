'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Transaction, PaginatedResponse } from '@/types'

interface UseTransactionsParams {
  page?: number
  limit?: number
  status?: string
  search?: string
  sortBy?: string
  sortOrder?: string
  dateFrom?: string
  dateTo?: string
}

export function useTransactions(params: UseTransactionsParams = {}) {
  const [data, setData] = useState<Transaction[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      if (params.page) searchParams.set('page', String(params.page))
      if (params.limit) searchParams.set('limit', String(params.limit))
      if (params.status && params.status !== 'all') searchParams.set('status', params.status)
      if (params.search) searchParams.set('search', params.search)
      if (params.sortBy) searchParams.set('sortBy', params.sortBy)
      if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
      if (params.dateFrom) searchParams.set('dateFrom', params.dateFrom)
      if (params.dateTo) searchParams.set('dateTo', params.dateTo)

      const res = await fetch(`/api/transactions?${searchParams.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch transactions')

      const json: PaginatedResponse<Transaction> = await res.json()
      setData(json.data)
      setTotal(json.total)
      setTotalPages(json.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [params.page, params.limit, params.status, params.search, params.sortBy, params.sortOrder, params.dateFrom, params.dateTo])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return { data, total, totalPages, isLoading, error, refetch: fetchTransactions }
}
