'use client'

import { motion } from 'framer-motion'
import { AppearancePanel } from '@/components/settings/AppearancePanel'
import { NotificationsPanel } from '@/components/settings/NotificationsPanel'
import { SecurityPanel } from '@/components/settings/SecurityPanel'
import { DangerZonePanel } from '@/components/settings/DangerZonePanel'

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-[14px] text-text-secondary mt-1">
          Manage your app preferences and account security
        </p>
      </div>

      <div className="space-y-6">
        <AppearancePanel />
        <NotificationsPanel />
        <SecurityPanel />
        <DangerZonePanel />
      </div>
    </motion.div>
  )
}
