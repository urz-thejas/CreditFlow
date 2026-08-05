'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  trend?: number
  trendLabel?: string
  icon: ReactNode
  iconBg: string
  index?: number
}

export function StatCard({ title, value, trend, trendLabel, icon, iconBg, index = 0 }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3, ease: 'easeOut' }}
      className="bg-surface rounded-lg border border-border p-5 shadow-xs hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-medium text-text-secondary">{title}</span>
        <div className={cn('w-9 h-9 rounded-md flex items-center justify-center', iconBg)}>
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold text-text-primary font-tabular">{value}</p>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={cn(
              'text-[12px] font-medium',
              isPositive ? 'text-success' : 'text-error'
            )}
          >
            {isPositive ? '↑' : '↓'}
            {Math.abs(trend)}
            {typeof trend === 'number' && !trendLabel?.includes('this') ? '%' : ''}
          </span>
          {trendLabel && (
            <span className="text-[12px] text-text-tertiary">{trendLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}
