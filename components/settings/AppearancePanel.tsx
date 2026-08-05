'use client'

import { useUIStore } from '@/store/ui'
import { Card } from '@/components/ui/Card'
import { Moon, Sun, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AppearancePanel() {
  const { theme, setTheme } = useUIStore()

  const options = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ]

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-[15px] font-semibold text-text-primary">Appearance</h3>
        <p className="text-[13px] text-text-secondary mt-1">
          Customize how CreditFlow looks on your device
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              'flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all duration-[150ms]',
              theme === value
                ? 'border-primary bg-primary-light/10 text-primary'
                : 'border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-hover'
            )}
            aria-pressed={theme === value}
            type="button"
          >
            <Icon className="h-6 w-6" />
            <span className="text-[13px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}
