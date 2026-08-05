'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Download, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  status: string
  onStatusChange: (val: string) => void
  dateFrom: string
  onDateFromChange: (val: string) => void
  dateTo: string
  onDateToChange: (val: string) => void
  onExport: () => void
}

export function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onExport,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const activeFiltersCount = (status !== 'all' ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)

  const handleClearAll = () => {
    onStatusChange('all')
    onDateFromChange('')
    onDateToChange('')
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search transactions..."
            className="w-full h-10 pl-9 pr-3 bg-bg border border-border rounded-md text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant={showFilters || activeFiltersCount > 0 ? 'primary' : 'secondary'}
            onClick={() => setShowFilters(!showFilters)}
            className={cn('flex-1 sm:flex-none', activeFiltersCount > 0 && !showFilters ? 'bg-primary-light text-primary hover:bg-primary-light/80' : '')}
            leftIcon={<Filter className="h-4 w-4" />}
          >
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          <Button
            variant="outline"
            onClick={onExport}
            className="flex-1 sm:flex-none"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[12px] font-medium text-text-secondary block mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="w-full h-10 px-3 bg-bg border border-border rounded-md text-[13px] text-text-primary focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="SUCCESS">Successful</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div>
                <label className="text-[12px] font-medium text-text-secondary block mb-1.5">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => onDateFromChange(e.target.value)}
                  className="w-full h-10 px-3 bg-bg border border-border rounded-md text-[13px] text-text-primary focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
                />
              </div>

              <div className="relative">
                <label className="text-[12px] font-medium text-text-secondary block mb-1.5">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => onDateToChange(e.target.value)}
                  className="w-full h-10 px-3 bg-bg border border-border rounded-md text-[13px] text-text-primary focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
                />
                
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="absolute -bottom-6 right-0 text-[12px] text-text-tertiary hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Clear All
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
