'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { useSidebar } from '@/hooks/useSidebar'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/payment', label: 'Payment', icon: CreditCard },
  { href: '/transactions', label: 'Transactions', icon: Receipt },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { collapsed, toggle } = useSidebar()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/logged-out' })
  }

  return (
    <>
      <motion.aside
        role="navigation"
        aria-label="Main navigation"
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30',
          'bg-sidebar border-r border-sidebar-hover'
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-hover">
          <Link href="/dashboard" className="flex items-center gap-2.5 text-text-inverse">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md shrink-0">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <motion.span
              animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
              transition={{ duration: 0.15 }}
              className="font-bold text-[15px] whitespace-nowrap overflow-hidden"
            >
              CreditFlow
            </motion.span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 h-10 rounded-md text-[14px] font-medium',
                  'transition-all duration-base group relative',
                  isActive
                    ? 'bg-sidebar-hover text-text-inverse'
                    : 'text-text-sidebar hover:bg-sidebar-hover hover:text-text-inverse'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1 bottom-1 w-[2px] bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                <motion.span
                  animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-sidebar-hover">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={cn(
              'flex items-center gap-3 px-3 h-10 w-full rounded-md text-[14px] font-medium',
              'text-text-sidebar hover:bg-sidebar-hover hover:text-text-inverse transition-all duration-base'
            )}
            aria-label="Sign out"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            <motion.span
              animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap overflow-hidden"
            >
              Sign Out
            </motion.span>
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggle}
          className={cn(
            'absolute -right-3 top-20 z-40',
            'w-6 h-6 bg-surface border border-border rounded-full shadow-sm',
            'flex items-center justify-center',
            'text-text-tertiary hover:text-text-primary transition-colors',
            'hover:shadow-md'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </motion.aside>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-warning-bg flex items-center justify-center">
              <LogOut className="h-6 w-6 text-warning" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Sign out of CreditFlow?
            </h3>
            <p className="text-[14px] text-text-secondary mt-1">
              You&apos;ll be redirected to the login page.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
