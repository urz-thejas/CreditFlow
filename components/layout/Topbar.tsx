'use client'

import { Bell, Search, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/ui'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Topbar() {
  const { user } = useAuth()
  const toggleNotificationPanel = useUIStore((s) => s.toggleNotificationPanel)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const pathname = usePathname()

  // Show search bar only on the Transactions page
  const showSearch = pathname === '/transactions' || pathname.startsWith('/transactions/')

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Mobile menu + Search (transactions only) */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-text-secondary hover:bg-hover transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {showSearch && (
            <div className="hidden sm:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-text-tertiary" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search transactions..."
                className={cn(
                  'w-[240px] h-9 pl-9 pr-3 bg-bg text-text-primary text-[13px]',
                  'border border-border rounded-md',
                  'placeholder:text-text-tertiary',
                  'focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent',
                  'transition-all duration-base'
                )}
                aria-label="Search transactions"
              />
            </div>
          )}
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleNotificationPanel}
            className="relative p-2 rounded-md text-text-secondary hover:bg-hover transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-border ml-1">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                'bg-primary text-white text-[12px] font-semibold'
              )}
            >
              {initials}
            </div>
            <div className="hidden md:block">
              <p className="text-[13px] font-medium text-text-primary leading-none">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-text-tertiary mt-0.5">
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
