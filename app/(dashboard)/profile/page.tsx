'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, User, Mail, Building, MapPin, Save } from 'lucide-react'
import { toast } from 'sonner'
import { profileSchema, type ProfileInput } from '@/lib/validators'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { FullPageSpinner } from '@/components/ui/Spinner'

export default function ProfilePage() {
  const { user, updateSession } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          reset({
            name: data.name || '',
            university: data.university || '',
            studentId: data.studentId || '',
          })
        }
      } catch {
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [reset])

  const onSubmit = async (data: ProfileInput) => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to update profile')

      const updatedUser = await res.json()

      // Refresh client session name
      await updateSession({ name: updatedUser.name })

      // Reset form with new values to clear isDirty state
      reset({
        name: updatedUser.name,
        university: updatedUser.university || '',
        studentId: updatedUser.studentId || '',
      })

      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <FullPageSpinner />

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-[14px] text-text-secondary mt-1">
          Manage your personal information and student details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-4">
          <Card className="text-center p-6">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-white shadow-md">
                {initials}
              </div>
              <button
                className="absolute bottom-0 right-0 p-2 bg-surface border border-border rounded-full text-text-secondary hover:text-primary hover:border-primary transition-colors shadow-sm"
                aria-label="Change avatar"
                type="button"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-text-primary mb-1">
              {user?.name || 'User'}
            </h2>
            <p className="text-[13px] text-text-secondary flex items-center justify-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {user?.email}
            </p>

            <div className="mt-6 pt-6 border-t border-border flex justify-center">
              <div className="bg-primary-light text-primary px-3 py-1 rounded-full text-[12px] font-medium">
                Student Account
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-8">
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <h3 className="text-[15px] font-semibold text-text-primary mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  leftIcon={<User className="h-4 w-4" />}
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  leftIcon={<Mail className="h-4 w-4" />}
                  hint="Email cannot be changed"
                />
              </div>

              <div className="pt-4 mt-2 border-t border-border">
                <h3 className="text-[15px] font-semibold text-text-primary mb-4">
                  Academic Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="University/College"
                    placeholder="e.g. Stanford University"
                    leftIcon={<Building className="h-4 w-4" />}
                    error={errors.university?.message}
                    {...register('university')}
                  />
                  <Input
                    label="Student ID"
                    placeholder="e.g. S12345678"
                    leftIcon={<MapPin className="h-4 w-4" />}
                    error={errors.studentId?.message}
                    {...register('studentId')}
                  />
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-border flex justify-end">
                <Button
                  type="submit"
                  disabled={!isDirty || isSaving}
                  isLoading={isSaving}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
