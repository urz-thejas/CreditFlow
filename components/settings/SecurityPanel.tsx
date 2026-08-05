'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Save } from 'lucide-react'
import { toast } from 'sonner'
import { changePasswordSchema, type ChangePasswordInput } from '@/lib/validators'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function SecurityPanel() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error || 'Failed to change password')
        return
      }

      toast.success('Password changed successfully')
      reset() // Clear form
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-[15px] font-semibold text-text-primary">Security</h3>
        <p className="text-[13px] text-text-secondary mt-1">
          Update your password to keep your account secure
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.currentPassword?.message}
          required
          {...register('currentPassword')}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.newPassword?.message}
          required
          {...register('newPassword')}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter new password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          required
          {...register('confirmPassword')}
        />

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  )
}
