import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  count?: number
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'skeleton-shimmer rounded-md bg-hover',
            className
          )}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-surface rounded-lg border border-border p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-border">
      <td className="p-3"><Skeleton className="h-4 w-20" /></td>
      <td className="p-3"><Skeleton className="h-4 w-40" /></td>
      <td className="p-3"><Skeleton className="h-4 w-28" /></td>
      <td className="p-3"><Skeleton className="h-4 w-20" /></td>
      <td className="p-3"><Skeleton className="h-5 w-20 rounded-2xl" /></td>
    </tr>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-surface rounded-lg border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-10 rounded-md" count={5} />
        </div>
      </div>
      <Skeleton className="h-[240px] w-full rounded-md" />
    </div>
  )
}
