import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'pending' | 'failed' | 'cancelled' | 'info'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success-dark',
  pending: 'bg-warning-bg text-warning-dark',
  failed: 'bg-error-bg text-error-dark',
  cancelled: 'bg-hover text-text-secondary',
  info: 'bg-info-bg text-info',
}

const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-success',
  pending: 'bg-warning',
  failed: 'bg-error',
  cancelled: 'bg-text-tertiary',
  info: 'bg-info',
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-2xl text-[12px] font-medium',
        variantStyles[variant],
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', dotStyles[variant])} />
      {children}
    </span>
  )
}

export function getStatusBadgeVariant(status: string): BadgeVariant {
  switch (status.toUpperCase()) {
    case 'SUCCESS':
      return 'success'
    case 'PENDING':
      return 'pending'
    case 'FAILED':
      return 'failed'
    case 'CANCELLED':
      return 'cancelled'
    default:
      return 'info'
  }
}
