'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useUIStore } from '@/store/ui'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/formatters'
import type { Notification } from '@/types'

const typeIcons: Record<string, React.ElementType> = {
  PAYMENT_SUCCESS: CheckCircle2,
  PAYMENT_FAILED: AlertCircle,
  INFO: Info,
  WARNING: AlertTriangle,
}

const typeColors: Record<string, string> = {
  PAYMENT_SUCCESS: 'text-success',
  PAYMENT_FAILED: 'text-error',
  INFO: 'text-info',
  WARNING: 'text-warning',
}

export function NotificationPanel() {
  const isOpen = useUIStore((s) => s.notificationPanelOpen)
  const close = useUIStore((s) => s.closeNotificationPanel)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    setLoading(true)
    // For now, use static notifications — in production, fetch from API
    setNotifications([
      {
        id: '1',
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Successful',
        body: 'Your payment of ₹5,200.00 to Campus Bookstore was successful.',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'PAYMENT_FAILED',
        title: 'Payment Failed',
        body: 'Your payment of ₹3,500.00 to Lab Equipment was declined.',
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '3',
        type: 'INFO',
        title: 'Welcome to CreditFlow!',
        body: 'Your account has been set up. Start making payments today.',
        read: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ])
    setLoading(false)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={close}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[380px] bg-surface border-l border-border shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-text-primary" />
                <h2 className="text-[15px] font-semibold text-text-primary">Notifications</h2>
                <span className="px-1.5 py-0.5 bg-primary-light text-primary text-[11px] font-medium rounded-full">
                  {notifications.filter((n) => !n.read).length}
                </span>
              </div>
              <button
                onClick={close}
                className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors"
                aria-label="Close notifications"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto h-[calc(100%-65px)]">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton-shimmer h-20 rounded-md bg-hover" />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-tertiary">
                  <Bell className="h-10 w-10 mb-2 opacity-40" />
                  <p className="text-[14px]">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => {
                    const Icon = typeIcons[notification.type] || Info
                    const color = typeColors[notification.type] || 'text-info'

                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-4 hover:bg-hover transition-colors cursor-pointer',
                          !notification.read && 'bg-primary-light/30'
                        )}
                      >
                        <div className="flex gap-3">
                          <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', color)} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-text-primary">
                              {notification.title}
                            </p>
                            <p className="text-[12px] text-text-secondary mt-0.5 line-clamp-2">
                              {notification.body}
                            </p>
                            <p className="text-[11px] text-text-tertiary mt-1">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
