'use client'

import { motion } from 'framer-motion'
import { Wallet, Calendar, Receipt, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useStats } from '@/hooks/useStats'
import { useTransactions } from '@/hooks/useTransactions'
import { StatCard } from '@/components/dashboard/StatCard'
import { SpendingChart } from '@/components/dashboard/SpendingChart'
import { QuickPayment } from '@/components/dashboard/QuickPayment'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { StatCardSkeleton, ChartSkeleton } from '@/components/ui/Skeleton'
import { formatINR, getGreeting } from '@/lib/formatters'
import type { Metadata } from 'next'

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { stats, isLoading: statsLoading } = useStats()
  const { data: recentTxns, isLoading: txnsLoading } = useTransactions({
    page: 1,
    limit: 5,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const firstName = user?.name?.split(' ')[0] || 'User'

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-[14px] text-text-secondary mt-1">
          Here&apos;s your financial overview
        </p>
      </div>

      {/* Stat Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Paid"
            value={formatINR(stats.totalPaid)}
            trend={stats.trendVsLastMonth.totalPaid}
            trendLabel="vs last month"
            icon={<Wallet className="h-4 w-4 text-primary" />}
            iconBg="bg-primary-light"
            index={0}
          />
          <StatCard
            title="This Month"
            value={formatINR(stats.thisMonth)}
            trend={stats.trendVsLastMonth.thisMonth}
            trendLabel="vs last month"
            icon={<Calendar className="h-4 w-4 text-info" />}
            iconBg="bg-info-bg"
            index={1}
          />
          <StatCard
            title="Total Transactions"
            value={String(stats.totalTransactions)}
            trend={stats.trendVsLastMonth.totalTransactions}
            trendLabel="this month"
            icon={<Receipt className="h-4 w-4 text-warning" />}
            iconBg="bg-warning-bg"
            index={2}
          />
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            trend={stats.trendVsLastMonth.successRate}
            trendLabel="vs last month"
            icon={<TrendingUp className="h-4 w-4 text-success" />}
            iconBg="bg-success-bg"
            index={3}
          />
        </div>
      ) : null}

      {/* Chart + Quick Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          {statsLoading ? (
            <ChartSkeleton />
          ) : stats ? (
            <SpendingChart data={stats.monthlyTrends} />
          ) : null}
        </div>
        <div className="lg:col-span-4">
          <QuickPayment />
        </div>
      </div>

      {/* Recent Transactions */}
      {txnsLoading ? (
        <div className="bg-surface rounded-lg border border-border p-5">
          <div className="skeleton-shimmer h-[300px] rounded-md bg-hover" />
        </div>
      ) : (
        <RecentTransactions transactions={recentTxns} />
      )}
    </motion.div>
  )
}
