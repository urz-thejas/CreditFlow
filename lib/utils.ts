import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDynamicServerError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false
  const err = error as { digest?: string; name?: string }
  return err.digest === 'DYNAMIC_SERVER_USAGE' || err.name === 'DynamicServerError'
}

