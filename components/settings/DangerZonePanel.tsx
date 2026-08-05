'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { toast } from 'sonner'

export function DangerZonePanel() {
  const [showModal, setShowModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete account')

      toast.success('Account deleted successfully')
      
      // Sign out and redirect to home
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      toast.error('Failed to delete account. Please try again.')
      setIsDeleting(false)
      setShowModal(false)
    }
  }

  return (
    <>
      <Card className="border-error/20">
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold text-error flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </h3>
          <p className="text-[13px] text-text-secondary mt-1">
            Irreversible actions for your account
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-border">
          <div>
            <p className="text-[14px] font-medium text-text-primary mb-0.5">
              Delete Account
            </p>
            <p className="text-[13px] text-text-secondary max-w-md">
              Permanently delete your account and all of your content. This action cannot be undone.
            </p>
          </div>
          
          <Button
            variant="danger"
            onClick={() => setShowModal(true)}
            className="shrink-0"
          >
            Delete Account
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => !isDeleting && setShowModal(false)}
        size="md"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-error-bg flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-error" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              Delete your account?
            </h3>
            <p className="text-[14px] text-text-secondary mt-2">
              Are you sure you want to delete your account? This action is <strong className="text-text-primary">permanent and cannot be undone</strong>. All your payment history and personal data will be erased.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Yes, delete account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
