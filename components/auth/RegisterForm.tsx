'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, User } from 'lucide-react'
import { toast } from 'sonner'
import { registerSchema, type RegisterInput } from '@/lib/validators'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-error' }
  if (score === 2) return { level: 2, label: 'Fair', color: 'bg-warning' }
  if (score === 3) return { level: 3, label: 'Good', color: 'bg-info' }
  return { level: 4, label: 'Strong', color: 'bg-success' }
}

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')
  const strength = useMemo(() => getPasswordStrength(password), [password])

  const onSubmit = async (data: RegisterInput) => {
    if (!agreed) {
      toast.error('Please agree to the Terms of Service')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error || 'Registration failed')
        return
      }

      toast.success('Account created! Please sign in.')
      router.push('/login')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="Arjun Rao"
        leftIcon={<User className="h-4 w-4" />}
        error={errors.name?.message}
        required
        autoComplete="name"
        {...register('name')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="arjun@creditflow.dev"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        required
        autoComplete="email"
        {...register('email')}
      />

      <div className="space-y-2">
        <Input
          label="Password"
          type="password"
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          required
          autoComplete="new-password"
          {...register('password')}
        />
        {password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    i <= strength.level ? strength.color : 'bg-border'
                  )}
                />
              ))}
            </div>
            <p className="text-[11px] text-text-tertiary">
              Password strength: <span className="font-medium">{strength.label}</span>
            </p>
          </div>
        )}
      </div>

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        leftIcon={<Lock className="h-4 w-4" />}
        error={errors.confirmPassword?.message}
        required
        autoComplete="new-password"
        {...register('confirmPassword')}
      />

      <label className="flex items-start gap-2 text-[13px] text-text-secondary cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          aria-required="true"
        />
        <span>
          I agree to the{' '}
          <span className="text-primary hover:text-primary-hover">Terms of Service</span>
          {' '}and{' '}
          <span className="text-primary hover:text-primary-hover">Privacy Policy</span>
        </span>
      </label>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isLoading}
        disabled={!agreed}
      >
        Create Account
      </Button>

      <p className="text-center text-[13px] text-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
          Sign In
        </Link>
      </p>
    </form>
  )
}
