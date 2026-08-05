'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatINR } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface SpendingChartProps {
  data: { month: string; amount: number }[]
}

const timeRanges = ['1W', '1M', '3M', '6M', '1Y'] as const

export function SpendingChart({ data }: SpendingChartProps) {
  const [activeRange, setActiveRange] = useState<string>('6M')

  // For now, we display all data regardless of range selection
  // In production, this would filter based on the selected range
  const chartData = data

  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-semibold text-text-primary">Spending Overview</h3>
        <div className="flex gap-1 bg-bg rounded-md p-0.5">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={cn(
                'px-2.5 py-1 text-[12px] font-medium rounded-sm transition-all duration-base',
                activeRange === range
                  ? 'bg-surface text-text-primary shadow-xs'
                  : 'text-text-tertiary hover:text-text-secondary'
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F6EF7" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#4F6EF7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface border border-border shadow-md rounded-lg p-3">
                      <p className="text-[12px] text-text-secondary">{label}</p>
                      <p className="text-[14px] font-semibold text-text-primary font-tabular mt-0.5">
                        {formatINR(payload[0].value as number)}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#4F6EF7"
              strokeWidth={2}
              fill="url(#chartGradient)"
              animationBegin={0}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
