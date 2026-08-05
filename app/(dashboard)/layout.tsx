'use client'

import { SessionProvider } from 'next-auth/react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { BottomNav } from '@/components/layout/BottomNav'
import { NotificationPanel } from '@/components/layout/NotificationPanel'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/lib/utils'

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-[250ms]',
          collapsed ? 'lg:ml-[64px]' : 'lg:ml-[240px]'
        )}
      >
        <Topbar />
        <main id="main-content" className="p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
      <NotificationPanel />
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DashboardShell>{children}</DashboardShell>
    </SessionProvider>
  )
}
