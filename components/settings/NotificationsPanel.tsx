'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Settings {
  emailNotifications: boolean
}

export function NotificationsPanel() {
  const [settings, setSettings] = useState<Settings>({ emailNotifications: true })
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          setSettings({ emailNotifications: data.emailNotifications })
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleToggle = async () => {
    const newValue = !settings.emailNotifications
    
    // Optimistic update
    setSettings({ emailNotifications: newValue })
    setIsUpdating(true)

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailNotifications: newValue }),
      })

      if (!res.ok) throw new Error('Failed to update settings')
      toast.success('Notification settings updated')
    } catch (error) {
      // Revert on failure
      setSettings({ emailNotifications: !newValue })
      toast.error('Failed to update notification settings')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-[15px] font-semibold text-text-primary">Notifications</h3>
        <p className="text-[13px] text-text-secondary mt-1">
          Manage how we contact you regarding payments
        </p>
      </div>

      <div className="flex items-center justify-between py-4 border-b border-border">
        <div>
          <p className="text-[14px] font-medium text-text-primary mb-0.5">
            Email Receipts
          </p>
          <p className="text-[13px] text-text-secondary">
            Receive a receipt via email for every successful payment
          </p>
        </div>
        
        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          disabled={isLoading || isUpdating}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed',
            settings.emailNotifications ? 'bg-primary' : 'bg-border'
          )}
          role="switch"
          aria-checked={settings.emailNotifications}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    </Card>
  )
}
