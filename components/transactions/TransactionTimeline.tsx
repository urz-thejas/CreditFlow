'use client'

import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { TransactionStatus } from '@/types'

interface TimelineEvent {
  id: string
  title: string
  description?: string
  date: string
  status: 'completed' | 'current' | 'upcoming' | 'error'
}

interface TransactionTimelineProps {
  status: TransactionStatus
  createdAt: string
  updatedAt: string
}

export function TransactionTimeline({ status, createdAt, updatedAt }: TransactionTimelineProps) {
  const isFailed = status === 'FAILED'
  const isPending = status === 'PENDING'

  const events: TimelineEvent[] = [
    {
      id: '1',
      title: 'Payment Initiated',
      description: 'Transaction created and sent for processing',
      date: createdAt,
      status: 'completed',
    },
    {
      id: '2',
      title: 'Bank Processing',
      description: 'Awaiting response from issuing bank',
      date: createdAt,
      status: 'completed',
    },
    {
      id: '3',
      title: isFailed ? 'Payment Failed' : 'Payment Successful',
      description: isFailed
        ? 'Card was declined or processing failed'
        : 'Funds received successfully',
      date: updatedAt,
      status: isFailed ? 'error' : isPending ? 'upcoming' : 'completed',
    },
  ]

  return (
    <div className="py-2">
      <h4 className="text-[14px] font-semibold text-text-primary mb-6">Tracking</h4>
      
      <div className="relative space-y-6">
        {/* Vertical line */}
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />

        {events.map((event, index) => {
          const isLast = index === events.length - 1
          
          let Icon = CheckCircle2
          let iconColor = 'text-text-tertiary'
          let bgColor = 'bg-surface'
          let borderColor = 'border-border'

          if (event.status === 'completed') {
            Icon = CheckCircle2
            iconColor = 'text-success'
            borderColor = 'border-success'
          } else if (event.status === 'error') {
            Icon = AlertCircle
            iconColor = 'text-error'
            borderColor = 'border-error'
          } else if (event.status === 'upcoming') {
            Icon = Clock
            iconColor = 'text-text-tertiary'
          }

          return (
            <div key={event.id} className="relative flex gap-4">
              {/* Timeline node */}
              <div
                className={cn(
                  'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-surface',
                  borderColor
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', iconColor)} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-0.5">
                  <p className={cn(
                    'text-[14px] font-medium',
                    event.status === 'upcoming' ? 'text-text-secondary' : 'text-text-primary'
                  )}>
                    {event.title}
                  </p>
                  {event.date && (
                    <span className="text-[12px] text-text-tertiary whitespace-nowrap">
                      {formatDateTime(event.date)}
                    </span>
                  )}
                </div>
                {event.description && (
                  <p className="text-[13px] text-text-secondary">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
